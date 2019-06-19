import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import isAuthenticatedHOC from '../hoc/IsAuthenticated';
import SignInPage from '../pages/SignIn';
import DashboardPage from '../pages/Dashboard';
import ScreenshotCreatePage from '../pages/screenshot/Create';
import ScreenshotListPage from '../pages/screenshot/List';
import NotFoundPage from '../pages/404';


function AppRoutes() {
  return (
    <Router>
      <Switch>
        <Route exact path='/login' component={SignInPage} />
        <PrivateRoute exact path='/' component={DashboardPage} />
        <PrivateRoute exact path='/screenshot/create' component={ScreenshotCreatePage} />
        <PrivateRoute exact path='/screenshot/list' component={ScreenshotListPage} />
        <Route component={NotFoundPage} status={404}/>
      </Switch>
    </Router>
  );
}

function PrivateRoute({ component: Component, ...rest }) {

  const IsAuthenticatedThenRenderOrRedirect = isAuthenticatedHOC(Component);

  return (
    <Route { ...rest} render={ props => <IsAuthenticatedThenRenderOrRedirect {...props} /> } />
  );
}


export default AppRoutes;
