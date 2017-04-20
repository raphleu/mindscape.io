import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { register } from '../actions';

class UserRegistor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      registering: false,
    }

    this.startRegister = this.startRegister.bind(this);
    this.resetRegister = this.resetRegister.bind(this);
    this.finishRegister = this.finishRegister.bind(this);
  }

  startRegister() {
    this.setState({
      registering: true
    });
  }
  resetRegister() {
    this.setState({
      registering: false
    });
  }
  finishRegister() {
    const { getVect, dispatch } = this.props;

    dispatch(register({
      vect: getVect(),
    }));

    this.resetRegister();
  }

  render() {
    const { user } = this.props;
    const { registering } = this.state;
    
    return (
      <div id='user-registor'>
        {
          registering
            ? (
              <div className='registration item'>
                <div className='register-message item'>
                  {
                    user
                      ? `
                        Register as an anonymous author!
                        You will be logged out if you continue...
                        (Only one user can be logged in at a time rn)
                      `
                      : `
                        Register as an anonymous author!
                        You may modify the author name and password once you've registered.
                      `
                  }
                </div>
                <div className='register-cancel button' onClick={this.resetRegister}>
                  <div className='content'>
                    cancel
                  </div>
                </div>
                <div className='register-finish button' onClick={this.finishRegister}>
                  <div className='content'>
                    register!
                  </div>
                </div>
              </div>
            ) 
            : (
              <div className='register-start button' onClick={this.startRegister}>
                <div className='content'>
                  register
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

UserRegistor.propTypes = {
  getVect: PropTypes.func,
  user: PropTypes.object,
};

export const UserRegistor_Out = connect()(UserRegistor);