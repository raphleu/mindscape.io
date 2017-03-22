import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { register, login } from '../actions';

class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      register: false,
      login: false,
      login_name: '',
      login_pass: '',
    }

    this.startRegister = this.startRegister.bind(this);
    this.cancelRegister = this.cancelRegister.bind(this);
    this.finishRegister = this.finishRegister.bind(this);

    this.startLogin = this.startLogin.bind(this);
    this.handleLoginNameChange = this.handleLoginNameChange.bind(this);
    this.handleLoginPassChange = this.handleLoginNameChange.bind(this);
    this.cancelLogin = this.cancelLogin.bind(this);
    this.finishLogin = this.finishLogin.bind(this);
  }

  startRegister() {
    this.setState({register: true});
  }
  cancelRegister() {
    this.setState({register: false});
  }
  finishRegister() {
    const { dispatch } = this.props;
    dispatch(register()); 
  }

  startLogin() {
    this.setState({login: true});
  }
  handleLoginNameChange(event) {
    this.setState({login_name: event.target.value});
  }
  handleLoginPassChange(event) {
    this.setState({login_pass: event.target.value});
  }
  cancelLogin() {
    this.setState({
      login: false,
      login_name: '',
      login_pass: '',
    });
  }
  finishLogin() {
    const { user, dispatch } = this.props;
    const { name, pass } = this.state;
    dispatch(login({user, name, pass}));
  }

  render() {
    const { user } = this.props;
    const { register, login, login_name, login_pass } = this.state;
    
    const style = {
      margin: 2,
      border: '1px solid lavender',
      padding: 2,
    };

    const buttonstyle = {
      margin: 2,
      border: '1px solid lavender',
      padding: 2,
      cursor: 'pointer',
    };

    return (
      <div id='auth' style={style}>
        {
          register
            ? (
              <div id='register' style={style}>
                <div id='register-message' style={style}>
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
                <div id='register-cancel' onClick={this.cancelRegister} style={buttonstyle}>
                  cancel
                </div>
                <div id='register-finish' onClick={this.finishRegister} style={buttonstyle}>
                  register!
                </div>
              </div>
            ) 
            : (
              <div id='register-start' onClick={this.startRegister} style={buttonstyle}>
                register
              </div>
            )
        }
        {
          login 
            ? (
              <div id='login'>
                <input id='login-name' type='text' value={login_name} onChange={this.handleLoginNameChange} style={style}/>
                <input id='login-pass' type='password' value={login_pass} onChange={this.handleLoginPassChange} style={style}/>
                <div id='login-cancel' onClick={this.cancelLogin} style={buttonstyle}>
                  cancel
                </div>
                <div id='login-finish' onClick={this.finishLogin} style={buttonstyle}>
                  login!
                </div>
              </div>
            )
            : (
              <div id='login-start' onClick={this.startLogin} style={buttonstyle}>
                login
              </div>
            )
        }
      </div>
    );
  }
}

Welcome.propTypes = {
  user: PropTypes.object,
};

export const WelcomeContainer = connect()(Welcome);