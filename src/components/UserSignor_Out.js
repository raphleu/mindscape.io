import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { authSign, sign } from '../actions';

import * as firebase from 'firebase/app';
import 'firebase/auth';

class UserSignor extends React.Component {
  constructor(props) {
    super(props);

    const { user } = props;

    this.state = {
      signing: false,
      email: '',
      pass: '',
    };

    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);

    this.signWithEmailAndPass = this.signWithEmailAndPass.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);

    this.signWithGoogle = this.signWithGoogle.bind(this);

    this.signWithFacebook = this.signWithFacebook.bind(this);
  }

  start() {
    this.setState({
      signing: true,
    });
  }

  reset() {
    this.setState({
      signing: false,
      email: '',
      pass: '',
    });
  }

  signWithEmailAndPass() {
    const { getVect, auth_user, dispatch } = this.props;
    const { email, pass } = this.state;

    const vect = getVect();
    const credential = firebase.auth.EmailAuthProvider.credential((auth_user.email || email), pass);

    dispatch(authSign({
      vect,
      auth_user,
      credential,
    }));  

    auth_user.link(credential).then(auth_user => {
      dispatch(sign({
        vect,
        auth_user,
        email: auth_user.email,
        pass: true,
      }));

      this.reset();
    }).catch(error => {
      console.error(error.code, error.message);
    });

  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value,
    });
  }

  handlePassChange(event) {
    this.setState({
      pass: event.target.value,
    });
  }

  signWithGoogle() {
    const { getVect, auth_user, dispatch } = this.props;

    const vect = getVect();
    const provider = new firebase.auth.GoogleAuthProvider();

    dispatch(authSign({
      vect,
      auth_user,
      provider,
    }));  

    auth_user.linkWithPopup(provider).then(result => {
      const credential = result.credential;
      const auth_user = result.user;

      console.log(credential, auth_user);

      dispatch(sign({
        vect,
        auth_user,
        google: true,
      }));

      this.reset();
    }).catch(error => {
      console.error(error.code, error.message);
    });
  }

  signWithFacebook() {
    const { getVect, auth_user, dispatch } = this.props;

    const vect = getVect();
    const provider = new firebase.auth.FacebookAuthProvider();

    dispatch(authSign({
      vect,
      auth_user,
      provider,
    }));  

    auth_user.linkWithPopup(provider).then(result => {
      const credential = result.credential;
      const auth_user = result.user;

      console.log(credential, auth_user);

      dispatch(sign({
        vect,
        auth_user,
        facebook: true,
      }));

      this.reset();
    }).catch(error => {
      console.error(error.code, error.message);
    });
  }

  render() {
    const { auth_user, user } = this.props;
    const { signing, email, pass } = this.state;

    return (
      <div id='userSignor' style={{
        border: '1px solid lavender',
        padding: 2,
      }}>
        {
          signing || auth_user.isAnonymous
            ? (
              <div className='sign'>
                SIGN
                <div>
                  {auth_user.email}
                </div>
                <div style={{
                  margin: 2,
                  border: (user && user.properties && user.properties.google)
                    ? '1px solid darkorchid'
                    : '1px solid lavender',
                  padding: 2,
                }}>
                  GOOGLE
                  {
                    (user && user.properties && user.properties.google)
                      ? null
                      : (
                        <div className='dispatch button' onClick={this.signWithGoogle} style={{
                          margin: 2,
                          border: '1px solid lavender',
                        }}>
                          <div className='content'>
                            Sign!
                          </div>
                        </div>
                      )
                  }
                </div>
                <div style={{
                  margin: 2,
                  border: (user && user.properties && user.properties.facebook)
                    ? '1px solid darkorchid'
                    : '1px solid lavender',
                  padding: 2,
                }}>
                  FACEBOOK
                  {
                    (user && user.properties && user.properties.facebook)
                      ? null
                      : (
                        <div className='dispatch button' onClick={this.signWithFacebook} style={{
                          margin: 2,
                          border: '1px solid lavender',
                        }}>
                          <div className='content'>
                            Sign!
                          </div>
                        </div>
                      )
                  }
                </div>
                <div style={{
                  margin: 2,
                  border: (auth_user.email && user && user.properties.pass)
                    ? '1px solid darkorchid'
                    : '1px solid lavender',
                  padding: 2,
                }}>
                  EMAIL+PASS
                  { 
                    (auth_user.email && user && user.properties.pass)
                      ? null
                      : (
                        <div>
                          <div>
                            {
                              auth_user.email
                                ? (
                                  <div>
                                    { auth_user.email }
                                  </div>
                                )
                                : (
                                  <input className='email item' 
                                    type='text'
                                    value={email}
                                    onChange={this.handleEmailChange}
                                    placeholder={'email'}
                                  />
                                )
                            }
                            <input className='pass item' 
                              type='password'
                              value={pass}
                              onChange={this.handlePassChange}
                              placeholder={'pass'}
                            />
                          </div>
                          <div className='dispatch button' onClick={this.signWithEmailAndPass}  style={{
                            margin: 2,
                            border: '1px solid lavender',
                          }}>
                            <div className='content'>
                              Sign!
                            </div>
                          </div>
                        </div>
                      )
                  }
                </div>
                {
                  auth_user.isAnonymous
                    ? null
                    : (
                      <div className='cancel button' onClick={this.reset} style={{
                        margin: 2,
                        border: '1px solid lavender',
                      }}>
                        <div className='content'>
                          Cancel
                        </div>
                      </div>
                    )
                }
              </div>
            )
            : (
              <div className='sign-start button' onClick={this.start} style={{
                margin: 2,
                border: '1px solid lavender',
              }}>
                <div className='content'>
                  Sign
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

UserSignor.propTypes = {
  getVect: PropTypes.func.isRequired,
  auth_user: PropTypes.object.isRequired,
  user: PropTypes.object,
  dispatch: PropTypes.func,
};

export const UserSignor_Out = connect()(UserSignor);