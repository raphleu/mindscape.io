import React, { PropTypes } from 'react';

export class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: '',
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.signIn = this.signIn.bind(this);
  }
  handleNameChange(event) {
    this.setState({name: event.target.value});
  }
  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }
  signIn() {
    // TODO transfrom password using nonce
    this.props.signIn(this.state.name, this.state.password);
  }
  render() {
    var loginStyle = {
      display: 'inline-block',
      padding: 5,
      border: '1px solid lavender',
      margin: 1,
    }
    var rowStyle = {
      padding: 2
    };
    return (
      <div className='login' style={loginStyle}>
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
            value={this.state.password}
            onChange={this.handlePasswordChange}
            placeholder="password"
          /> 
        </div>
        <div style={rowStyle}>
          <button onClick={this.signIn}>
            sign in!
          </button>
        </div>
      </div>
    );
  }
}