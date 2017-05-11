import React from 'react';
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux'; 
import { nodeInit } from '../actions';

class NodeInit extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    const { parent_path_press, parent_out_defs, parent_out_press, dispatch } = this.props;

    dispatch(nodeInit({
      parent_path_press,
      parent_out_defs,
      parent_out_press,
    }));
  }

  render() {
    return (
      <div className='NodeInit'>
        <button onClick={this.handleClick}>
          <div>
            Init child
          </div>
        </button>
      </div>
    );
  }
}

NodeInit.propTypes = {
  parent_path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  parent_out_defs: PropTypes.arrayOf(PropTypes.object).isRequired,
  parent_out_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func,
};

export const NodeInit_o = connect()(NodeInit);