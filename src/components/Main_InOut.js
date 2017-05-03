import React, { PropTypes } from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { connect } from 'react-redux';
import {  authChange, authInit, register, resume } from '../actions';

import { flow, now } from 'lodash';

import * as firebase from 'firebase/app';
import 'firebase/auth';

//import { ReadDragLayer } from './ReadDragLayer';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      auth_init: true,
      auth_unsub: () => {},
      timer_id: null,
      spacer_id: null,
      vect: [
        now(),
        0,
        0,
        0,
      ], // position vector (t, x, y, z)
      spin: false,
    };

    this.handleAuthChange = this.handleAuthChange.bind(this);

    this.setVectTime = this.setVectTime.bind(this);
    this.setVectSpace = this.setVectSpace.bind(this);

    // we pass this function to child-components as props, instead of dispatching vect to redux-state, to eliminate unnecessary rendering
    this.getVect = this.getVect.bind(this);
  }

  handleAuthChange(auth_user) {
    const { dispatch } = this.props;
    const { auth_init, vect } = this.state;

    dispatch(authChange({
      auth_init,
      auth_user,
      vect,
    }));

    this.setState({
      auth_init: false,
    });
  }

  setVectTime() {
    const { vect, spin } = this.state;

    this.setState({
      vect: [
        now(), 
        ...vect.slice(1),
      ],
      spin: !spin,
    });
  }

  setVectSpace(position) {
    const { vect } = this.state;

    this.setState({
      vect: [
        vect[0],
        position.coords.longitude || 0,
        position.coords.latitude || 0,
        position.coords.altitude || 0,
      ],
    });
  }

  getVect() {
    const { vect } = this.state;

    return vect;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { vect } = this.state;

    this.setState({
      auth_state_unsubscribe: firebase.auth().onAuthStateChanged(this.handleAuthChange),
      timer_id: setInterval(this.setVectTime, 200),
      spacer_id: navigator.geolocation
        ? navigator.geolocation.watchPosition(this.setVectSpace)
        : null,
    });

    dispatch(authInit({
      vect
    }))
  }

  componentWillUnmount() {
    const { auth_state_unsubscribe, timer_id, spacer_id } = this.state;

    auth_state_unsubscribe();

    clearInterval(timer_id);

    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(spacer_id)
    }
  }

  render() {
    const { fetching } = this.props;
    const { spin } = this.state;

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
            (fetching && spin) 
              ? (
                <div id='flag' style={{
                  zIndex: 11,
                  position: 'absolute',
                  left: -24,
                  bottom: 0,
                  border: '1px solid lavender',
                  borderTopRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  width: 21,
                  height: 12,
                }}/>
              )
              : null
          }
          <div id='logo' style={{
            position: 'absolute',
            left: -19,
            bottom: 0,
            border: '1px solid lavender',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
          }}>
            <div id='logo-content' className='content' style={{
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4,
              width: 10,
              height: 15,
            }}/>
          </div>
          <div id='nav' style={{
            border: '1px solid steelblue',
            borderTopLeftRadius: 4,
            borderBottomRightRadius: 4,
          }}>
            <div id='nav-content' className='content' style={{
              borderTopLeftRadius: 4,
              borderBottomRightRadius: 4,
              padding: '6px 8px',
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
          }}/>
        </div>
        <div className='header-filler' style={{
          height: 32,
        }}/>
        {
          React.cloneElement(this.props.children, {getVect: this.getVect})
        }
      </div>
    );
  }
}

Main.propTypes = {
  fetching: PropTypes.bool,
};

export const Main_InOut = flow(
  connect(state => {
    const { fetching } = state;

    return {
      fetching,
    };
  }),
  DragDropContext(HTML5Backend),
)(Main);
