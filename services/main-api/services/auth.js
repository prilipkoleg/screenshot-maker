const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');

const config = require('../config');
const User = require('../models/User');
const UserSession = require('../models/UserSession');
const HttpErr = require('../errors').HttpError;

const getExpiredAt = {
  // token: () => new Date(+new Date() + 0.5 * 60 * 1000),
  token: () => 10 * 60, // in seconds
  refresh: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
};

const service =  {

  _getToken(user = {}, refreshToken) {
    return jwt.sign(
      {id: user.id, email: user.email, ssid: refreshToken,},
      config.auth.jwt.secret,
      {expiresIn: getExpiredAt.token()},
    );
  },

  async issueTokenPair(req, user = {}) {
    const userId = user.id;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const expiredAt = getExpiredAt.refresh();
    let refreshToken = uuid();

    const availableSession = await UserSession.findOne({
      userId,
      userAgent,
      expiredAt: { $gte: new Date()}
    }).lean();

    if (availableSession) {
      // TODO: Remove it or NOT?
      refreshToken = availableSession.refreshToken;
      //await UserSession.updateOne({refreshToken}, {expiredAt});
    } else {
      const userSession = new UserSession({
        _id: refreshToken,
        userId,
        ip,
        userAgent,
        expiredAt,
        refreshToken,
      });

      await userSession.save();
    }

    return {
      token: service._getToken(user, refreshToken),
      refreshToken,
    };
  },

  async refreshToken(req) {
    const token = req.body.token;
    const refreshToken = req.body.refreshToken;

    let jwtEncoded;

    try {
      jwtEncoded = jwt.verify(
        token,
        config.auth.jwt.secret,
        { ignoreExpiration: true, complete: true, }
      );
    } catch(e) {
      throw HttpErr.adapter.jwt(e);
    }

    if (jwtEncoded.payload.ssid !== refreshToken) {
      throw new HttpErr.HttpError({statusCode: HttpErr.codes.UNAUTHORIZED});
    }

    const session = await UserSession.findOne({refreshToken});

    if (!session) {
      throw new HttpErr.HttpError({statusCode: HttpErr.codes.NOT_FOUND})
    }

    // console.log(Date.now() > session.expiredAt, Date.now(), new Date(session.expiredAt).getTime());
    if (Date.now() > new Date(session.expiredAt).getTime()) {
      await session.delete();
      throw new HttpErr.HttpError({statusCode: HttpErr.codes.FORBIDDEN, message: 'Session Expired'});
    }
    await UserSession.updateOne({refreshToken}, {expiredAt: getExpiredAt.refresh()});
    const user = await User.findOne({_id: session.userId});

    return {
      token: service._getToken(user, refreshToken),
      refreshToken: session.refreshToken,
    };
    // return service.issueTokenPair(req, user);
  },

  async removeSession(req) {
    const userData = req.user;
    const session = await UserSession.findOne({refreshToken: userData.ssid});

    if (!session) {
      throw new HttpErr.HttpError({statusCode: HttpErr.codes.NOT_FOUND});
    }

    await session.delete();
  }

};

module.exports = service;