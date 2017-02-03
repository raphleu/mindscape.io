import React, { PropTypes } from 'react';


export class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      password1: '',
      password2: '',
      email: '',
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePassword1Change = this.handlePassword1Change.bind(this);
    this.handlePassword2Change = this.handlePassword2Change.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.signUp = this.signUp.bind(this);
  }
  handleNameChange(event) {
    this.setState({name: event.target.value});
  }
  handlePassword1Change(event) {
    this.setState({password1: event.target.value});
  }
  handlePassword2Change(event) {
    this.setState({password2: event.target.value});
  }
  handleEmailChange(event) {
    this.setState({email: event.target.value});
  }
  signUp() {
    this.props.signUp(this.state.name, this.state.password1, this.state.email);
  }
  render() {
    var passwordMismatch = (this.state.password2 && this.state.password1 != this.state.password2);
    var registerStyle = {
      display: 'inline-block',
      padding: 5,
      border: '1px solid lavender',
      margin: 1,
    };
    var rowStyle = {
      padding: 2,
    };
    return (
      <div className='register' style={registerStyle}>
        <div style={rowStyle}>
          <input
            type="text"
            value={this.state.name}
            onChange={this.handleNameChange}
            placeholder="username"
          />
        </div>
        <div style={rowStyle}>
          <input
            type="password"
            value={this.state.password1}
            onChange={this.handlePassword1Change}
            placeholder="password"
          /> 
        </div>
        <div style={rowStyle}>
          <input
            type="password"
            value={this.state.password2}
            onChange={this.handlePassword2Change}
            placeholder="password (again)"
          />
          {passwordMismatch ? "passwords don't match" : ""}
        </div>
        <div style={rowStyle}>
          <input
            type="text"
            value={this.state.email}
            onChange={this.handleEmailChange}
            placeholder="email (optional)"
          />
        </div>
        <div style={rowStyle}>
          <button onClick={this.signUp} disabled={passwordMismatch}>
            sign up!
          </button>
        </div>
      </div>
    );
  }
}