import axios from 'axios/index';

import config from '@/config';

class MainAPI {
  constructor(client, services = {}) {
    const options = {
      baseURL: config.urls.mainApi,
    };

    this.services = services;
    this.client = client || axios.create(options);

    this.__addRefreshInterceptor();
  }

  // auth ----------

  authRefresh(data = {}) {
    const url = 'auth/refresh';

    return this.client
      .post(url, data)
      .then(this.constructor.__getAxiosRespData);
  }

  authLogin(data = {}) {
    const url = 'auth/login';

    return this.client.post(url, data)
      .then(this.constructor.__getAxiosRespData);
  }

  authLogout() {
    const url = 'auth/logout';
    const reqConfig = { headers: { ...this.__getAuthorizationHeader() } };

    return this.client.post(url, {}, reqConfig)
    ;
  }

  // user --------------

  userCreate(data = {}, withAuth = false) {
    const url = 'api/user/create';
    const reqConfig = withAuth ? { params: { auth: withAuth } } : {};

    return this.client.post(url, data, reqConfig)
      .then(this.constructor.__getAxiosRespData)
    ;
  }

  // screenshots --------------

  screenshotsList() {
    const url = 'api/screenshot';
    const reqConfig = { headers: { ...this.__getAuthorizationHeader() } };

    return this.client.get(url, reqConfig)
      .then(response => response.data);
  }

  screenshotCreate(data = {}) {
    const url = 'api/screenshot';
    const reqConfig = { headers: { ...this.__getAuthorizationHeader() } };

    return this.client.post(url, data, reqConfig)
    // .then()
    // .catch(e =>{
    //   console.log(e);
    //   throw e;
    // })
    ;
  }

  screenshotGet(screenshotId) {
    const url = `api/screenshot/${screenshotId}`;
    const reqConfig = { headers: { ...this.__getAuthorizationHeader() } };

    return this.client.get(url, reqConfig)
      .then(response => response.data);
  }

  screenshotReCreate(screenshotId) {
    const url = `api/screenshot/${screenshotId}`;
    const reqConfig = { headers: { ...this.__getAuthorizationHeader() } };

    return this.client.post(url, null, reqConfig)
      .then(response => response.data);
  }

  screenshotDelete(screenshotId) {
    const url = `api/screenshot/${screenshotId}`;
    const reqConfig = { headers: { ...this.__getAuthorizationHeader() } };

    return this.client.delete(url, reqConfig)
      .then(response => response.data);
  }


  // helpers -----------

  static __getAxiosRespData = response => response.data;

  __addRefreshInterceptor() {
    const { auth } = this.services;

    this.client.interceptors.response.use(null, (error) => {
      const { response = {}, config: sourceConfig } = error;

      // check if request failed cause Unauthorized with message 'jwt expired'
      if (!(response.status === 401 && response.data.message === 'jwt expired')) {
        // if error is not related with Unauthorized we reject promise
        return Promise.reject(error);
      }
      return auth.refresh()
        .then(() => {
          const authHeader = this.__getAuthorizationHeader();
          // update request auth header
          sourceConfig.headers = Object.assign(sourceConfig.headers, authHeader);

          return this.client(sourceConfig);
        });
    });
  }

  __getAuthorizationHeader() {
    const { token } = this.services.auth.constructor.getTokensPair();

    return {
      Authorization: `Bearer ${token}`,
    };
  }
}


export default MainAPI;
