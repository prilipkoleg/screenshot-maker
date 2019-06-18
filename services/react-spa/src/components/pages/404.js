import React from 'react';

// class NotFound extends React.Component {
//
//   render() {
//     const { router } = this.context;
//     // Tell server we should send a 404 not found
//     if (router.staticContext) {
//       router.staticContext.statusCode = 404;
//     }
//     return <h1>Not Found</h1>
//   }
// }
//
// function NotFound() {
//   return (
//     <h1>NOT FOUND 404</h1>
//   )
// }

// export default NotFound;

export default ({ staticContext = {} }) => {
  staticContext.status = 404;
  return <h1>Oops, nothing here! 404</h1>;
};


