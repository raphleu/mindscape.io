import React from 'react';
import { PropTypes } from 'prop-types';
import { Vector } from './Vector';

import { connect } from 'react-redux';

import { now } from 'lodash';

class UserVector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      timer_id: null,
    };

    this.updateTime = this.updateTime.bind(this);
  }

  updateTime() {
    this.setState({
      time: now(),
    });
  }

  componentDidMount() {
    this.setState({
      time: now(),
      timer_id: setInterval(this.updateTime, 1000),
    });
  }

  componentWillUnmount() {
    clearInterval(timer_id);
  }

  render() {
    const { geo_vect } = this.props;
    const { time } = this.state;

    const vect = [
      time, // overwrite geolocation time with current time
      ...geo_vect.slice(1),
    ];

    return (
      <div className='UserVector item'>
        <Vector vect={vect} />
      </div>
    );
  }
 
}

UserVector.propTypes = {
  geo_vect: PropTypes.arrayOf(PropTypes.number),
};

export const UserVector_i = connect(state => {
  return {
    geo_vect: state.geo_vect,
  };
})(UserVector)

