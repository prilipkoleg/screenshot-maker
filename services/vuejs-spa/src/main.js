// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';

import Vue from 'vue';
import VueMaterial from 'vue-material';
import VeeValidate, { ValidationProvider, ValidationObserver } from 'vee-validate';

import App from './App';
import router from './router';
import store from './store';

import Default from './layouts/Default';
import Dashboard from './layouts/Dashboard';
import DashboardNoSidebar from './layouts/DashboardNoSidebar';

Vue.config.productionTip = false;

Vue.component('layout.default', Default);
Vue.component('layout.dashboard', Dashboard);
Vue.component('layout.dashboardNoSidebar', DashboardNoSidebar);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

Vue.use(VeeValidate);
Vue.use(VueMaterial);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
