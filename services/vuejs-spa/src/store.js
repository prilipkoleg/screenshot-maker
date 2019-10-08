import Vue from 'vue';
import Vuex from 'vuex';

import { getLogger } from './common';
import { mainApi } from './services';

const logger = getLogger('STORE');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    auth: {
      status: false,
    },
    screenshots: {
      isLoading: false,
      data: [],
    },
  },
  mutations: {
    SCREENSHOTS_SET_LOADING_STATUS(state, status) {
      state.screenshots.isLoading = status;
    },
    SCREENSHOTS_SET_DATA(state, data) {
      state.screenshots.data = data;
    },
  },
  actions: {
    async screenshotFetchItems(context) {
      try {
        context.commit('SCREENSHOTS_SET_LOADING_STATUS', true);
        const screenshotsList = await mainApi.screenshotsList() || [];
        context.commit('SCREENSHOTS_SET_DATA', screenshotsList);
      } catch (e) {
        logger.error(e);
      }
      context.commit('SCREENSHOTS_SET_LOADING_STATUS', false);
    },
  },

  strict: true,
});
