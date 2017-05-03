import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { authLogin, login } from '../actions';

import * as firebase from 'firebase/app';
import 'firebase/auth';

class UserLoginor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logging_in: false,
      email: '',
      pass: '',
    };

    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);

    this.loginWithEmailAndPass = this.loginWithEmailAndPass.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);

    this.getLoginWithProvider = this.getLoginWithProvider.bind(this);
    this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    this.facebookAuthProvider = new firebase.auth.FacebookAuthProvider(); 
  }

  start() {
    this.setState({
      logging_in: true
    });
  }

  reset() {
    this.setState({
      logging_in: false,
      email: '',
      pass: '',
    });
  }

  loginWithEmailAndPass() {
    const { getVect, dispatch } = this.props;
    const { email, pass } = this.state;

    const vect = getVect();

    dispatch(authLogin({
      vect,
      email,
      pass,
    }));

    firebase.auth().signInWithEmailAndPassword(email, pass).then(auth_user => {
      dispatch(login({
        vect,
        auth_user,
      }));

      this.reset();
    }).catch(error => {
      console.error(error.code, error.message);
    });
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    });
  }

  handlePassChange(event) {
    this.setState({
      pass: event.target.value
    });
  }

  getLoginWithProvider(provider) {
    return () => {
      const { getVect, dispatch } = this.props;

      const vect = getVect();

      dispatch(authLogin({
        vect,
        provider,
      }));

      firebase.auth().signInWithPopup(provider).then(result => {
        const auth_user = result.user;

        dispatch(login({
          vect,
          auth_user,
        }));

        this.reset();
      }).catch(error => {
        console.error(error.code, error.message);
      });
    };
  }

  render() {
    const { auth_user, user } = this.props;
    const { logging_in, email, pass } = this.state;

    return (
      <div className='UserLoginor' style={{
        border: '1px solid lavender',
        padding: 2,
      }}>
        {
          logging_in 
            ? (
              <div className='login'>
                LOGIN
                <div style={{
                  margin: 2,
                  border: '1px solid lavender',
                }}>
                  GOOGLE
                  <div className='dispatch button' onClick={this.getLoginWithProvider(this.googleAuthProvider)} style={{
                    margin: 2,
                    border: '1px solid lavender',
                  }}>
                    <div className='content'>
                      Login!
                    </div>
                  </div>
                </div>
                <div style={{
                  margin: 2,
                  border: '1px solid lavender',
                  padding: 2,
                }}>
                  FACEBOOK
                  <div className='dispatch button' onClick={this.getLoginWithProvider(this.facebookAuthProvider)} style={{
                    margin: 2,
                    border: '1px solid lavender',
                  }}>
                    <div className='content'>
                      Login!
                    </div>
                  </div>
                </div>
                <div className='login-with-email-and-pass'>
                  EMAIL/PASS
                  <div>
                    <input className='login-email item' 
                      type='text'
                      value={email}
                      onChange={this.handleEmailChange}
                      placeholder={'email'}
                    />
                    <input className='login-pass item'
                      type='password'
                      value={pass}
                      onChange={this.handlePassChange}
                      placeholder={'pass'}
                    />
                  </div>
                  <div className='dispatch button' onClick={this.loginWithEmailAndPass}>
                    <div className='content'>
                      Login!
                    </div>
                  </div>
                </div>
                <div className='login-cancel button' onClick={this.reset} style={{
                  margin: 2,
                  border: '1px solid lavender',
                }}>
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
                  Login
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

UserLoginor.propTypes = {
  getVect: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
};

export const UserLoginor_Out = connect()(UserLoginor);