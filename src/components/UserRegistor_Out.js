import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { register } from '../actions';

function UserRegistor(props) {
  function handleClick(event) {
    const { getVect, dispatch } = props;

    dispatch(register({
      vect: getVect(),
    }));
  }

  return (
    <div className='UserRegistor' style={{
      border: '1px solid lavender'
    }}>
      <div className='button' onClick={handleClick} style={{
        margin: 2,
        border: '1px solid lavender',
      }}>
        <div className='content'>
          Register!
        </div>
      </div>
    </div>
  );
}

UserRegistor.propTypes = {
  getVect: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
};

export const UserRegistor_Out = connect()(UserRegistor);