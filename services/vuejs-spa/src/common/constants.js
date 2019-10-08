const layout = {
  name: {
    DEFAULT: 'default',
    DASHBOARD: 'dashboard',
    DASHBOARD_NO_SIDEBAR: 'dashboardNoSidebar',
  },
};

const router = {
  name: {
    // main
    NOT_FOUND: 404,
    LOGIN: 'login',
    // dashboard
    DASHBOARD: 'dashboard',
    SCREENSHOT_CREATE: 'screenshot.create',
    SCREENSHOT_LIST: 'screenshot.list',
  },
};

export default {
  layout,
  router,
};
