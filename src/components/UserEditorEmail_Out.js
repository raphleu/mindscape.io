import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { userEdit } from '../actions';

class UserSignor extends React.Component {
  constructor(props) {
    super(props);

    const { user } = props;

    this.state = {
      email: user.properties.email || '',
    }

    this.edit = this.edit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  edit() {
    const { getVect, user, dispatch, reset } = this.props;
    const { email } = this.state;

    dispatch(userEdit({
      vect: getVect(),
      user,
      email,
    }));

    reset();
  }

  handleChange(event) {
    this.setState({
      email: event.target.value
    });
  }

  render() {
    const { user, reset } = this.props;
    const { email } = this.state;

    return (
      <div id='userSignor' style={{}}>
        <div>
          <input className='name item' 
            type='text'
            value={email}
            onChange={this.handleChange}
            placeholder={'name'}
          />
        </div>
        <div className='cancel button' onClick={reset}>
          <div className='content'>
            cancel
          </div>
        </div>
        <div className='dispatch button' onClick={this.edit}>
          <div className='content'>
            edit!
          </div>
        </div>
      </div>
    );
  }
}

UserSignor.propTypes = {
  getVect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  reset: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
};

export const UserSignor_Out = connect()(UserSignor);