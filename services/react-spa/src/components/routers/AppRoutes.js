import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// import mainHOC from '../hoc/Main';
import isAuthenticatedHOC from '../hoc/IsAuthenticated';
import SignInPage from '../pages/SignIn';
import DashboardPage from '../pages/Dashboard';
import ScreenshotCreate from '../pages/screenshot/Create';
import ScreenshotList from '../pages/screenshot/List';
import NotFoundPage from '../pages/404';


function AppRoutes() {
  return (
    <Router>
      <Switch>
        <Route exact path='/login' component={SignInPage} />
        <PrivateRoute exact path='/' component={DashboardPage} />
        <PrivateRoute exact path='/screenshot/create' component={ScreenshotCreate} />
        <PrivateRoute exact path='/screenshot/list' component={ScreenshotList} />
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
