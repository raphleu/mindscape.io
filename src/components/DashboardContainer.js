import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { getSuperReads } from '../util';

import { AuthContainer } from './AuthContainer';


export class Dashboard extends React.Component {
  // TODO put in user radius manager,
  // TODO combine with user? as user nucleus?
  // TODO bring fequent topics in a toolbar
  // on dashboard per rootNote?
  // pin notes to form custom dashboards?/ framing, position:fixed
  constructor(props) {
    super(props);
  }

  render() {
    const { fetching } = this.props;

    const style = {
      dashboard: {
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'top',
        margin: 2,
        border: '1px solid steelblue',
        padding: 5,
        width: 200,
      },
    };
    const indicators = (
      <div>
        {fetching ? '@ @ @' : '. . .'}
      </div>
    );

    return (
      <div className='dashboard' style={style.dashboard}>
        {indicators}
        <AuthContainer />
      </div>
    );
  }
}

Dashboard.propTypes = {
  fetching: PropTypes.bool,
};

function getStateProps(state, ownProps) {
  return {
    fetching: state.fetching_state,
  };
}

export const DashboardContainer = connect(getStateProps)(Dashboard);
