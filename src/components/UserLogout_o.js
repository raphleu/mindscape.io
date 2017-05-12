import React from 'react';
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { logout } from '../actions';

class UserLogout extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() { 
    const { auth_user, dispatch } = this.props;

    const confirmed = confirm('Logout?' + (
      auth_user.isAnonymous
        ? ' You will lose access to your work unless you Sign using Google, Facebook, or email.'
        : ''
    ));

    if (confirmed) {
      dispatch(logout({
        auth_user,
      }));
    }
  }

  render() {
    return (
      <div className='UserLogout'>
        <button className='button' onClick={this.logout}>
          <div>
            Logout
          </div>
        </button>
      </div>
    );
  }
}

UserLogout.propTypes = {
  auth_user: PropTypes.object,
}

export const UserLogout_o = connect()(UserLogout)