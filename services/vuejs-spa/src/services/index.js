import Auth from './auth';
import MainApi from './mainAPI';

const authService = new Auth();
const mainApi = new MainApi(null, { auth: authService });

export {
  authService,
  mainApi,
};
