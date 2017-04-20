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

    this.startLogout = this.startLogout.bind(this);
    this.resetLogout = this.resetLogout.bind(this);
    this.dispatchLogout = this.dispatchLogout.bind(this);
  }

  startLogout() { //propose
    this.setState({
      logging_out: true
    });
  }

  resetLogout() {
    this.setState({
      logging_out: false
    });
  }

  dispatchLogout() { //dispatch
    const { getVect, dispatch } = this.props;

    dispatch(logout({
      vect: getVect(),
    }));

    this.resetLogout();
  }

  render() {
    const { user } = this.props;
    const { logging_out } = this.state;

    return user 
      ? (
        <div id='user-logoutor'>
          {
            logging_out
              ? (
                <div className='logoutment'>
                  <div>
                    Are you sure you want to logging_out?
                  </div>
                  <div className='logout-cancel button' onClick={this.resetLogout}>
                    <div className='content'>
                      cancel
                    </div>
                  </div>
                  <div className='logout-dispatch button' onClick={this.dispatchLogout}>
                    <div className='content'>
                      logout!
                    </div>
                  </div>
                </div>
              )
              : (
                <div className='logout-start button' onClick={this.startLogout}>
                  <div className='content'>
                    logout
                  </div>
                </div>
              )
          }
        </div>
      )
      : null;
  }
}

UserLogoutor.propTypes = {  
  getVect: PropTypes.func,
  user: PropTypes.object.isRequired,
}

export const UserLogoutor_Out = connect()(UserLogoutor)