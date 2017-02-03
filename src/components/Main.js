import React, { PropTypes } from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const style = {
      header: {
        zIndex: 100,
        position: 'fixed',
        top: 0,
        left: 0,
        marginLeft: 2,
        borderBottom: '1px solid steelblue',
        borderBottomLeftRadius: 4,
        width: '100%',
        backgroundColor: 'white',
        color: 'steelblue',
        verticalAlign: 'middle',
      },
      logo: {
        display: 'inline-block',
        marginTop: 2,
        border: '1px solid steelblue',
        borderBottom: 'none',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        padding: 4,
        //height: 20,
        backgroundColor: 'azure',
        color: 'steelblue',
      },
      spacer: {
        height: 30,
      },
    };

    return (
      <div id='main'>
        <div id='header' style={style.header}>
          <div className='logo' style={style.logo}>
            mindscape.io
          </div>
        </div>
        <div className='spacer' style={style.spacer}></div>
        {this.props.children}
      </div>
    );
  }
}

export const Main = DragDropContext(HTML5Backend)(MainComponent);
