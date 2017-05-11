import React from 'react';
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { login1, login2 } from '../actions';

import * as firebase from 'firebase/app';
import 'firebase/auth';

class UserLogin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      email: '',
      pass: '',
    };

    this.disable = this.disable.bind(this);
    this.enable = this.enable.bind(this);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);

    this.getLoginWithProvider = this.getLoginWithProvider.bind(this);

    this.loginWithEmailAndPass = this.loginWithEmailAndPass.bind(this);
    this.signupWithEmailAndPass = this.signupWithEmailAndPass.bind(this);

    this.loginAnonymously = this.loginAnonymously.bind(this);
  }

  disable() {
    this.setState({
      disabled: true
    });
  }

  enable() {
    this.setState({
      disabled: false,
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

  getLoginWithProvider({ google, facebook }) {
    const { dispatch } = this.props;

    const provider = google
      ? new firebase.auth.GoogleAuthProvider()
      : facebook 
        ? new firebase.auth.FacebookAuthProvider()
        : null;

    return () => {
      this.disable();

      dispatch(login1({
        google,
        facebook,
      }));

      firebase.auth().signInWithPopup(provider).then(result => {
        dispatch(login2(result.user)); //TODO determine if first login (i.e. signup)

        this.enable();
      }).catch(error => {
        alert([error.code, error.message]);

        this.enable();
      });
    };
  }

  loginWithEmailAndPass() {
    const { dispatch } = this.props;
    const { email, pass } = this.state;

    this.disable();

    dispatch(login1({
      email,
      pass,
    }));

    firebase.auth().signInWithEmailAndPassword(email, pass).then(auth_user => {
      dispatch(login2(auth_user));

      this.enable();
    }).catch(error => {
      alert([error.code, error.message]);

      this.enable();
    });
  }

  signupWithEmailAndPass() {
    const { dispatch } = this.props;
    const { email, pass } = this.state;

    this.disable();

    dispatch(login1({
      email,
      pass,
      new_email: true,
    }));

    firebase.auth().createUserWithEmailAndPassword(email, pass).then(auth_user => {
      dispatch(login2(auth_user));

      this.enable();
    }).catch(error => {
      alert([error.code, error.message]);

      this.enable();
    });
  }

  loginAnonymously() {
    const { dispatch } = this.props;

    this.disable();

    dispatch(login1({
      anonymous: true,
    }));

    firebase.auth().loginAnonymously().then(auth_user => {
      dispatch(login2(auth_user));
      
      this.enable();
    }).catch(error => {
      alert([error.code, error.message]);

      this.enable();
    });
  }

  render() {
    const { auth_user, user } = this.props;
    const { disabled, email, pass } = this.state;

    return (
      <div className='UserLogin item'>
        <div className='item'>
          <button className='button' disabled={disabled} onClick={this.getLoginWithProvider({google: true})}>
            <div>
              Login / Signup with Google
            </div>
          </button>
        </div>

        <div className='item'>
          <button className='button' disabled={disabled} onClick={this.getLoginWithProvider({facebook: true})}>
            <div>
              Login / Signup with Facebook
            </div>
          </button>
        </div>

        <div className='item'>
          <div>
            <input className='item' 
              type='text'
              value={email}
              disabled={disabled}
              onChange={this.handleEmailChange}
              placeholder={'email'}
            />
            <input className='item'
              type='password'
              value={pass}
              disabled={disabled}
              onChange={this.handlePassChange}
              placeholder={'password'}
            />
          </div>
          <button className='button' disabled={disabled} onClick={this.loginWithEmailAndPass}>
            <div>
              Login with password
            </div>
          </button>
          <button className='button' disabled={disabled} onClick={this.signupWithEmailAndPass}>
            <div>
              Signup with password
            </div>
          </button>
        </div>

        <div className='item'>
          <button className='button' disabled={disabled} onClick={this.loginAnonymously}>
            <div>
              Login anonymously (you can Sign via Google, Facebook, or password later to secure access to your work)
            </div>
          </button>
        </div>
      </div>
    );
  }
}

UserLogin.propTypes = {
  dispatch: PropTypes.func,
};

export const UserLogin_o = connect()(UserLogin);