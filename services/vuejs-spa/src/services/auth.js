import Cookies from 'js-cookie';

import { mainApi } from './index';
import { getLogger } from '../common';

const logger = getLogger('Auth Service');

const defaultOpts = {
  refreshDelay: 1 * 60, // min in seconds
  cookieExpiredAtFn: () => new Date(+new Date() + (10 * 24 * 60 * 60 * 1000)),
};

class AuthService {
  constructor(options = defaultOpts) {
    this.refreshDelay = options.refreshDelay;
    this.cookieExpiredAtFn = options.cookieExpiredAtFn;
  }

  signIn(data = {}) {
    return mainApi.authLogin(data)
      .then((d) => {
        this.__setAuthData(d);
      })
      // .catch(() => {})
    ;
  }

  signUp(data = {}) {
    return mainApi.userCreate(data, true)
      .then((d) => {
        const { token, refreshToken } = d;
        this.__setAuthData({ token, refreshToken });
      })
      // .catch(() => {})
    ;
  }

  signOut() {
    return mainApi.authLogout()
      .then(() => {
        this.constructor.__removeTokensPair();
      })
      .catch(() => {})
    ;
  }

  isAuthenticated() {
    return (this.__isTimeToRefresh() ? this.refresh() : Promise.resolve(true))
      .catch(() => false)
    ;
  }

  refresh() {
    const { token, refreshToken } = this.constructor.getTokensPair();

    if (!token || !refreshToken) {
      return Promise.resolve(false);
    }

    return mainApi
      .authRefresh({ token, refreshToken })
      .then((data = {}) => this.__setAuthData(data))
      .then(() => true)
      .catch(() => {
        this.constructor.__removeTokensPair();
        return false;
      });
  }

  __isTimeToRefresh() {
    const { exp } = this.__getDecodedToken() || {};
    const now = Date.now();
    const nowInSeconds = parseInt(String(now / 1000), 10);

    logger.info([
      `now in seconds: ${nowInSeconds} s, '${new Date(now).toLocaleString()}'`,
      `token exp at  : ${exp} s, '${new Date(exp * 1000).toLocaleString()}'`,
      'exp - nowInSeconds:', exp - nowInSeconds,
      'refreshDelay in seconds:', this.refreshDelay,
      'token will be refreshed:', (!exp || (exp - nowInSeconds)) < this.refreshDelay,
    ]);

    return !exp || (exp - nowInSeconds < this.refreshDelay);
  }

  __getDecodedToken() {
    const { token } = this.constructor.getTokensPair();

    if (!token) return {};

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');

    return JSON.parse(atob(base64));
  }

  __setAuthData(data) {
    const { token, refreshToken } = data;

    if (token && refreshToken) {
      Cookies.set('token', token, { expires: this.cookieExpiredAtFn(), path: '/' });
      Cookies.set('refreshToken', refreshToken, { expires: this.cookieExpiredAtFn(), path: '/' });
    }
  }

  static __removeTokensPair() {
    const keys = ['token', 'refreshToken'];
    keys.forEach(k => Cookies.remove(k));
  }

  static getTokensPair() {
    const keys = ['token', 'refreshToken'];
    return keys.reduce((acc, key) => {
      acc[key] = Cookies.get(key);
      return acc;
    }, {});
  }
}

export default AuthService;
