const authService = require('../services/auth');
const User = require('../models/User');

module.exports = {

  getById: (req, res, next) => {
    const userId = req.params.userId;

    return User.findOne({_id: userId})
    // .lean()
      .then(user => {
        if (!user) return next();

        res.send({
          user: user.getPublicFields(),
          req: req.headers,
        });
      })
      .catch(next);
  },

  postCreate: (req, res, next) => {
    const userData = req.body;
    const withAuth = Boolean(req.query.auth);

    try {
      const user = new User(userData);

      user.save()
        .then(savedUser =>
          Promise.all([
            savedUser,
            withAuth ? authService.issueTokenPair(req, savedUser) : Promise.resolve({}),
          ])
        )
        .then( ([user, tokensPair = {}]) => res.send({ user: user.getPublicFields(), ...tokensPair }) )
        .catch(next);
    } catch (e) {
      next(e);
    }
  },

};
