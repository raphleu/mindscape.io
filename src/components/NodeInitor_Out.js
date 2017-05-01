import React from 'react';

import { connect } from 'react-redux'; 
import { nodeInit } from '../actions';

import { PropTypes } from 'prop-types';

class NodeInitor extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    const { getVect, user, path_press, in_defs, out_press, dispatch } = this.props;

    dispatch(nodeInit({
      vect: getVect(),
      user,
      parent_path_press: path_press,
      parent_out_press: out_press,
      parent_in_defs: in_defs,
    }));
  }

  render() {
    // TODO if minimized, display text up to first newline

    return (
      <div className='nodeInitor' onClick={this.handleClick} style={{
        display: 'inline-block',
        //verticalAlign: 'middle',
        float: 'left',
        margin: 2,
        border: '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        cursor: 'pointer',
      }}>
        <div className='nodeInitor-content' style={{
          border: '1px solid azure',
          borderTopRightRadius: 4,
          borderBottomLeftRadius: 4,
          height: 12, //this.props.isOver ? 200 : 0,
          width: 80,
          backgroundColor: 'white',
        }}/>
      </div>
    );
  }
}

NodeInitor.propTypes = {
  getVect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  out_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  in_defs: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func,
};

export const NodeInitor_Out = connect()(NodeInitor);

