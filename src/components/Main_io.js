import React, { PropTypes } from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { connect } from 'react-redux';
import { setGeoVect, resume } from '../actions';

import { flow, now } from 'lodash';

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      geolocator_id: null,
      spinner_id: null,
      spin: false,
    };

    this.updateVect = this.updateVect.bind(this);
    this.spin = this.spin.bind(this);
  }

  updateVect(position) {
    const { dispatch } = this.props;

    dispatch(setGeoVect([
      position.timestamp || 0,
      position.coords.longitude || 0,
      position.coords.latitude || 0,
      position.coords.altitude || 0,
    ]));
  }

  spin() {
    const { spin } = this.state;

    this.setState({
      spin: !spin,
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;

    this.setState({
      geolocator_id: navigator.geolocation
        ? navigator.geolocation.watchPosition(this.updateVect)
        : null,
      spinner_id: setInterval(this.spin, 500),
    });

    dispatch(resume())
  }

  componentWillUnmount() {
    const { spinner_id, geolocator_id } = this.state;

    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(geolocator_id)
    }

    clearInterval(spinner_id);
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
          <div id='flag' style={{
            display: (fetching && spin) ? 'block' : 'none' ,
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
          this.props.children
        }
      </div>
    );
  }
}

Main.propTypes = {
  fetching: PropTypes.bool,
  dispatch: PropTypes.func,
};

export const Main_io = flow(
  connect(state => {
    return {
      fetching: state.fetching,
    };
  }),
  DragDropContext(HTML5Backend),
)(Main);
