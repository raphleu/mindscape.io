import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { logout } from '../actions';

class UserLogoutor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logging_out: false,
    };

    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
    this.dispatchLogout = this.dispatchLogout.bind(this);
  }

  start() { //propose
    this.setState({
      logging_out: true
    });
  }

  reset() {
    this.setState({
      logging_out: false
    });
  }

  dispatchLogout() { //dispatch
    const { getVect, auth_user, dispatch } = this.props;

    dispatch(logout({
      auth_user,
      vect: getVect(),
    }));

    this.reset();
  }

  render() {
    const { auth_user } = this.props;
    const { logging_out } = this.state;

    return (
      <div id='user-logoutor' style={{
        border: '1px solid lavender',
        padding: 2,
      }}>
        {
          logging_out
            ? (
              <div className='logout-confirm'>
                LOGOUT
                {
                  auth_user.isAnonymous
                    ? (
                      <div>
                        Are you sure you want to log out?
                        If you don't link this user to an email or other identity provider,
                        you will not be able to regain access!
                      </div>
                    )
                    : (
                      <div>
                        Are you sure you want to log out?
                      </div>
                    )
                }
                <div className='dispatch button' onClick={this.dispatchLogout}>
                  <div className='content'>
                    Logout!
                  </div>
                </div>
                <div className='cancel button' onClick={this.reset}>
                  <div className='content'>
                    Cancel
                  </div>
                </div>
              </div>
            )
            : (
              <div className='start button' onClick={this.start} style={{
                margin: 2,
                border: '1px solid lavender'
              }}>
                <div className='content'>
                  Logout
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

UserLogoutor.propTypes = {  
  getVect: PropTypes.func.isRequired,
  auth_user: PropTypes.object,
}

export const UserLogoutor_Out = connect()(UserLogoutor)