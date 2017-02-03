import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { initialize } from '../actions';

import { DashboardContainer } from './DashboardContainer';
import { ReadContainer } from './ReadContainer';

export class Notation extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { user_ids } = this.props;

    this.props.initialize(user_ids);
  }

  render() {
    const { user_ids, node_by_id } = this.props;

    const frame_reads = user_ids.map(user_id => {
      const user = node_by_id[user_id];
      if (user) {
        return (
          <ReadContainer 
            key={'read-'+user.frame_read_id}
            read_id={user.frame_read_id}
          />
        );        
      }
    });

    const style = {
      notation: {
        display: 'block',
        whiteSpace: 'nowrap',
      },
    };

    return (
      <div className='notation' style={ style.notation }>
        <DashboardContainer />
        { frame_reads }
      </div>
    );
  }
}

Notation.propTypes = {
  node_by_id: PropTypes.object,
  user_ids: PropTypes.arrayOf(PropTypes.number),
};

function getStateProps(state) {
  return {
    node_by_id: state.node_by_id,
    user_ids: state.user_ids,
  };
}

function getDispatchProps(dispatch) {
  return {
    initialize: (user_ids) => {
      dispatch(initialize(user_ids));
    },
  }
}

export const NotationContainer = connect(getStateProps, getDispatchProps)(Notation);
