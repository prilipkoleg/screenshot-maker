import Cookies from 'js-cookie';

import { mainApi } from './';

const defaultOpts = {
  refreshDelay: 1 * 60, // min in seconds
  cookieExpiredAtFn: () => new Date(+new Date() + 10 * 24 * 60 * 60 * 1000)
};

class AuthService {

  constructor(options = defaultOpts) {
    this.refreshDelay = options.refreshDelay;
    this.cookieExpiredAtFn = options.cookieExpiredAtFn
  }

  signIn(data = {}) {
    return mainApi.authLogin(data)
      .then(data => {
        this.__setAuthData(data);
      })
      // .catch(e => {});
  }

  signUp(data = {}) {
    return mainApi.userCreate(data, true)
      .then(data => {
        const { token, refreshToken } = data;

        this.__setAuthData({token, refreshToken});
      })
      .catch(e => {});
  }

  signOut() {
    return mainApi.authLogout()
      .then(() => {
        this.constructor.__removeTokensPair();
      })
      .catch(e => {})
  }

  isAuthenticated() {
    return (
        this.__isTimeToRefresh() ? this.refresh() : Promise.resolve(true)
      )
      .catch(e => false)
  }

  refresh() {
    const {token, refreshToken} = this.constructor.getTokensPair();

    if (!token || !refreshToken) {
      return Promise.resolve(false);
    }

    return mainApi
      .authRefresh({token, refreshToken})
      .then((data = {}) => this.__setAuthData(data))
      .then(() => true)
      .catch(e => false);
  }

  __isTimeToRefresh() {
    const {exp} = this.__getDecodedToken() || {};
    const nowInSeconds = parseInt(Date.now()/1000, 10);

    console.log(
      (!exp || (exp - nowInSeconds)) < this.refreshDelay,
      exp, nowInSeconds, exp - nowInSeconds, this.refreshDelay
    );

    return !exp || (exp - nowInSeconds < this.refreshDelay);
  }

  __getDecodedToken() {
    const {token} = this.constructor.getTokensPair();

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