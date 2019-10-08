import Vue from 'vue';
import Router from 'vue-router';

import PageLogin from '@/pages/Login';
import { authService } from '../services';
import { constants } from '../common';

const routerName = constants.router.name;

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  base: '/',

  routes: [
    {
      path: '/login',
      name: routerName.LOGIN,
      meta: { layout: 'default' },
      component: PageLogin,
    },
    {
      path: '/',
      name: routerName.DASHBOARD,
      meta: { layout: 'dashboard' },
      component: () => import('@/pages/dashboard/Index'),
    },
    {
      path: '/dashboard-no-sidebar',
      name: 'dashboardNoSidebar',
      meta: { layout: 'dashboardNoSidebar' },
      component: () => import('@/pages/dashboard/Index'),
    },
    {
      path: '/screenshot/create',
      name: routerName.SCREENSHOT_CREATE,
      meta: { layout: 'dashboard' },
      component: () => import('@/pages/dashboard/screenshot/Create'),
    },
    {
      path: '/screenshot/list',
      name: routerName.SCREENSHOT_LIST,
      meta: { layout: 'dashboard' },
      component: () => import('@/pages/dashboard/screenshot/List'),
    },
    // {
    //   path: '/story/:id',
    //   name: 'post',
    //   component: () => import('@/pages/Post.vue'),
    // },
    {
      path: '*',
      name: '404',
      // component: PageNotFound.default, // load sync home
      component: () => import('@/pages/404.vue'), // load sync home
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await authService.isAuthenticated().catch() || false;
  const toLoginPage = to.name === routerName.LOGIN;

  if (!isAuthenticated && !toLoginPage) {
    return next({
      name: routerName.LOGIN,
    });
  }

  if (isAuthenticated && toLoginPage) {
    return next({
      name: routerName.DASHBOARD,
    });
  }

  return next();
});

export default router;
