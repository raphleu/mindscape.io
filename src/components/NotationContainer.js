import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { initialize } from '../actions';

import { AuthContainer } from './AuthContainer';
import { CurrentContainer } from './CurrentContainer';
import { ReadContainer } from './ReadContainer';

export class Notation extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.initialize();
  }

  render() {
    const { fetching, frame_reads } = this.props;

    const fetch_indicator = (
      <div style={{
        //display: fetching ? 'block' : 'none',
        position: 'absolute',
        right: 0,
        top: -14,
        border: '1px solid lavender',
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
        height: 12,
        width: 8,
        backgroundColor: 'white',
      }} />
    );

    const reads = frame_reads.map(frame_read => {
      return <ReadContainer key={'read-'+frame_read.id} path={ [frame_read] } />;
    });
    // TODO add current_read info to dashboard
    return (
      <div className='notation' style={{
        display: 'block',
        whiteSpace: 'nowrap',
      }}>
        <div className='dashboard' style={{
          zIndex: 8,
          display: 'inline-block',
          verticalAlign: 'top',
          position: 'fixed',
          margin: 2,
          border: '1px solid steelblue',
          borderTopLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}>
          <div className='dashboard-content' style={{
            position: 'relative',
            border: '1px solid azure',
            borderTopLeftRadius: 4,
            borderBottomRightRadius: 4,
            padding: 4,
            width: 152,
            backgroundColor: 'white',
            whiteSpace: 'normal',
            overflow: 'auto',
            textAlign: 'left',
          }}>
            <AuthContainer />
            <CurrentContainer />
          </div>
        </div>
        <div className='spacer' style={{
          display: 'inline-block',
          width: 165,
        }}/>
        <div className='frames' style={{
          display: 'inline-block',
        }}>
          { reads }
        </div>
      </div>
    );
  }
}

Notation.propTypes = {
  fetching: PropTypes.bool,
  frame_reads: PropTypes.arrayOf(PropTypes.object),
};

function getStateProps(state) {
  const frame_reads = state.user_ids.reduce((frame_reads, user_id) => {
    const user = state.node_by_id[user_id];
    if (user == null) {
      return frame_reads;
    }
    else {
      const frame_read = state.relationship_by_id[user.frame_read_id];
      return [...frame_reads, frame_read];
    }
  }, []);

  return {
    fetching: state.fetching_state,
    frame_reads,
  };
}

function getDispatchProps(dispatch) {
  return {
    initialize: () => {
      dispatch(initialize());
    },
  }
}

export const NotationContainer = connect(getStateProps, getDispatchProps)(Notation);
