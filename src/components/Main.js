import React, { PropTypes } from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

//import { ReadDragLayer } from './ReadDragLayer';

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const style = {
      header: {
        zIndex: 10,
        position: 'fixed',
        verticalAlign: 'bottom',
        top: 2,
        left: 167,
      },
      point: {
        zIndex: 11,
        position: 'absolute',
        left: -5,
        bottom: -5,
        width: 7,
        height: 7,
        backgroundColor:  'lightyellow',
        border: '1px solid gold',
        borderRadius: 2
      },
      logo: {
        position: 'absolute',
        left: -15,
        bottom: 0,
        border: '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
      },
      logo_liner: {
        border: '1px solid azure',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        width: 10,
        height: 15,
        backgroundColor: 'white',
      },
      nav: {
        border: '1px solid steelblue',
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
      },
      nav_liner: {
        border: '1px solid azure',
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
        padding: '6px 8px',
        backgroundColor: 'white',
      },
      spacer: {
        height: 32,
      },
    };

    // TODO add other nav options to header?
    return (
      <div id='main' >
        <div className='header' style={style.header}>
          <div className='point' style={style.point} />
          <div className='logo' style={style.logo}>
            <div style={style.logo_liner} />
          </div>
          <div className='nav' style={style.nav}>
            <div style={style.nav_liner}>
              mindscape.io
            </div>
          </div>
        </div>
        <div className='spacer' style={style.spacer}></div>
        {this.props.children}
      </div>
    );
  }
}

export const Main = DragDropContext(HTML5Backend)(MainComponent);
