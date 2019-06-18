import React from 'react';

function main(Page) {

  class Main extends React.Component {
    render() {
      return (
        <React.Fragment>
          <div className="App-main">
            <div className='Container'>
              <div className="main-wrapper">

                <Page {...this.props} />

              </div>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }

  Main.displayName = `Main(${Page.displayName || Page.name || 'Component'})`;

  return Main;
}


export default main;