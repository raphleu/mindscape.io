import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { edit } from '../actions';

import * as firebase from 'firebase/app';
import 'firebase/auth';

class UserSignor extends React.Component {
  constructor(props) {
    super(props);

    const { user } = props;

    this.state = {
      email: '',
      pass: '',
    };

    this.reset = this.reset.bind(this);
    this.signWithEmailAndPassword = this.signWithEmailAndPassword.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }

  reset() {
    this.setState({
      email: '',
      pass: '',
    });
  }

  signWithEmailAndPassword() {
    const { getVect, user, dispatch } = this.props;
    const { email, pass } = this.state;

    const credential = firebase.auth.EmailAuthProvider.credential(email, pass);

    auth.currentUser.link(credential).then(user => {
      console.log("Anonymous account successfully upgraded", user);
    }).catch(error => {
      console.log("Error upgrading anonymous account", error);
    });

    this.reset();
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

  render() {
    const { email, pass } = this.state;

    return (
      <div id='userSignor' style={{}}>
        <div>
          <input className='email item' 
            type='text'
            value={email}
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
        <div className='cancel button' onClick={this.reset}>
          <div className='content'>
            cancel
          </div>
        </div>
        <div className='dispatch button' onClick={this.signWithEmailAndPassword}>
          <div className='content'>
            sign!
          </div>
        </div>
      </div>
    );
  }
}

UserSignor.propTypes = {
  getVect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
};

export const UserSignor_Out = connect()(UserSignor);