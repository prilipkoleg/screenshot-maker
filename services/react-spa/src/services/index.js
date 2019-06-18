import Auth from './auth';
import MainApi from './apiMain';

const authService = new Auth();
const mainApi = new MainApi(null, {auth: authService});

// const appService = {
//   Auth: authService,
//   ApiMain: new MainApi(null, {auth: authService}),
// };

export {
  authService,
  mainApi,
};