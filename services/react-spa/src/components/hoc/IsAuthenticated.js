import React from 'react';
import { Redirect } from 'react-router-dom';

import { authService } from '../../services/';


function IsAuthenticatedHOC(Component) {

  class IsAuthenticated extends React.Component {
    state = { status: null, };

    componentDidMount() {
      authService.isAuthenticated()
        .then(status => this.setState({status}))
        .catch(e => this.setState({status: false}))
    }

    render() {
      const { status } = this.state;

      return (typeof status === 'boolean')
        ? status
            ? <Component {...this.props} />
            : <Redirect to={{ pathname: '/login', state: { from: this.props.location } }} />
        : <div>... on Checking</div>;
    }

  }

  IsAuthenticated.displayName = `IsAuthenticatedHOC(${Component.displayName || Component.name || 'Component'})`;

  return IsAuthenticated;
}

export default IsAuthenticatedHOC;