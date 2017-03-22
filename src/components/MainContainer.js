import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { flow } from 'lodash';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

//import { ReadDragLayer } from './ReadDragLayer';

class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { fetching } = this.props;
    // TODO add other nav options to header?
    return (
      <div id='main' >
        <div id='header' style={{
          zIndex: 10,
          position: 'fixed',
          verticalAlign: 'bottom',
          top: 2,
          left: 167,
        }}>
          {
            fetching 
              ? (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  border: '1px solid lavender',
                  borderTopRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  width: 17,
                  height: 12,
                  backgroundColor: 'white',
                }} />
              )
              : null
          }
          <div id='logo' style={{
            position: 'absolute',
            left: -15,
            bottom: 0,
            border: '1px solid lavender',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
          }}>
            <div id='logo-content' style={{
              border: '1px solid azure',
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4,
              width: 10,
              height: 15,
              backgroundColor: 'white',
            }} />
          </div>
          <div id='nav' style={{
            border: '1px solid steelblue',
            borderTopLeftRadius: 4,
            borderBottomRightRadius: 4,
          }}>
            <div id='nav-content' style={{
              border: '1px solid azure',
              borderTopLeftRadius: 4,
              borderBottomRightRadius: 4,
              padding: '6px 8px',
              backgroundColor: 'white',
            }}>
              mindscape.io
            </div>
          </div>
          <div className='point' style={{
            zIndex: 11,
            position: 'absolute',
            left: -5,
            bottom: -5,
            width: 7,
            height: 7,
            backgroundColor:  'lightyellow',
            border: '1px solid gold',
            borderRadius: 2
          }} />
        </div>
        <div className='spacer' style={{
          height: 32,
        }} />
        { this.props.children }
      </div>
    );
  }

}

export const MainContainer = flow(
  DragDropContext(HTML5Backend),
  connect(state => {
    const { fetching } = state;
    return {
      fetching: fetching,
    };
  }),
)(Main);
