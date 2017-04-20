import React from 'react';

import { connect } from 'react-redux';
import { nodeSelect } from '../actions';

import { PropTypes } from 'prop-types';

class NodeSelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clicks: 0,
      click_timer_id: null,
    };

    this.handleClick = this.handleClick.bind(this);
    this.dispatchClicks = this.dispatchClicks.bind(this);
  }

  handleClick(event) {
    console.log('click');
    event.stopPropagation();
    const { clicks, click_timer_id } = this.state;

    if (click_timer_id) {
      clearTimeout(click_timer_id);
    }

    this.setState({
      clicks: clicks + 1,
      click_timer_id: setTimeout(this.dispatchClicks, 500),
    });
  }

  dispatchClicks() {
    const { getVect, path_press, dispatch } = this.props;
    const { clicks } = this.state;

    dispatch(nodeSelect({
      vect: getVect(),
      path_press
    }));

    this.setState({
      clicks: 0,
      click_timer_id: null,
    });
  };

  render() {
    return (
      <div className='node-selector' onClick={this.handleClick}>
        {
          this.props.children
        }
      </div>
    );
  }

}

NodeSelector.propTypes = {
  getVect: PropTypes.func.isRequired,
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export const NodeSelector_Out = connect()(NodeSelector);