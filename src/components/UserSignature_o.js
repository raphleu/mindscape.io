import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { sign1, sign2 } from '../actions';

import * as firebase from 'firebase/app';
import 'firebase/auth';

class UserSignature extends React.Component {
  constructor(props) {
    super(props);

    const { auth_user } = props;

    this.state = {
      show: false,
      disabled: false,
      email: auth_user.email || '',
      pass: '',
    };

    this.toggle = this.toggle.bind(this);
    this.disable = this.disable.bind(this);
    this.enable = this.enable.bind(this);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);

    this.signWithEmailAndPass = this.signWithEmailAndPass.bind(this);

    this.getSignWithProvider = this.getSignWithProvider.bind(this);
  }

  toggle() {
    this.setState({
      show: !this.state.show,
    });
  }

  disable() {
    this.setState({
      disabled: true,
    });
  }

  enable() {
    this.setState({
      disabled: false,
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

  getSignWithProvider({ google, facebook }) {
    const { auth_user, user, dispatch } = this.props;

    const provider = google
      ? new firebase.auth.GoogleAuthProvider()
      : facebook
        ? new firebase.auth.FacebookAuthProvider()
        : null;

    return () => {
      this.disable();

      dispatch(sign1({
        google,
        facebook,
      }));

      auth_user.linkWithPopup(provider).then(result => {
        dispatch(sign2({
          auth_user: result.user,
          user,
          google,
          facebook,
        }));

        this.enable();
      }).catch(error => {
        alert([error.code, error.message]);

        this.enable()
      });
    };
  }

  signWithEmailAndPass() {
    const { auth_user, dispatch } = this.props;
    const { email, pass } = this.state;

    this.disable();

    const credential = firebase.auth().EmailAuthProvider.credential(email, pass);

    dispatch(sign1({
      pass: true,
    }));  

    auth_user.link(credential).then(auth_user => {
      dispatch(sign2({
        auth_user,
        user,
        pass,
      }));

      this.enable();
    }).catch(error => {
      alert([error.code, error.message]);

      this.enable();
    });

  }

  render() {
    const { auth_user, user } = this.props;
    const { show, disabled, email, pass } = this.state;

    return (
      <div className='UserSignature'>
        <div>
          { auth_user.isAnonymous ? 'anonymous' : auth_user.email }
        </div>
        <div>
          <button className='button' onClick={this.toggle}> 
            <div>
              {
                show ? 'Hide Signature' : 'Show Signature'
              }
            </div>
          </button>
        </div>
        {
          show
            ? (
              <div>
                <div className='item'>
                  {
                    user.properties.google
                      ? (
                        <button className='button' disabled={true}>
                          <div>
                            TODO Remove Google 
                          </div>
                        </button>
                      )
                      : (
                        <button className='button' disabled={disabled} onClick={this.getSignWithProvider({google: true})}> 
                          <div>
                            Sign with Google
                          </div>
                        </button>
                      )
                  }
                </div>
                <div className='item'>
                  {
                    user.properties.facebook
                      ? (
                        <button className='button' disabled={true}>
                          <div>
                            TODO Remove Facebook
                          </div>
                        </button>
                      )
                      : (
                        <button className='button' disabled={disabled} onClick={this.getSignWithProvider({facebook: true})}>
                          <div>
                            Sign with Facebook
                          </div>
                        </button>
                      )
                  }
                </div>
                { 
                  (user.properties.pass) // TODO determine via auth_user if password exists
                    ? (
                      <div>
                        TODO Reset password... email?
                        Can't reset email if Google/Facebook linked?
                      </div>
                    )
                    : (
                      <div className='item'>
                        <div>
                          <input className='item' 
                            type='text'
                            value={email}
                            disabled={(auth_user.email != null)}
                            onChange={this.handleEmailChange}
                            placeholder={'email'}
                          />
                          <input className='pass item' 
                            type='password'
                            value={pass}
                            onChange={this.handlePassChange}
                            placeholder={'pass'}
                          />
                        </div>
                        <button className='button' disabled={disabled} onClick={this.signWithEmailAndPass}>
                          <div>
                            Sign with password
                          </div>
                        </button>
                      </div>
                    )
                }
              </div>
            )
            : null
        }
      </div>
    );
  }
}

UserSignature.propTypes = {
  auth_user: PropTypes.object.isRequired,
  user: PropTypes.object,
  dispatch: PropTypes.func,
};

export const UserSignature_o = connect()(UserSignature);