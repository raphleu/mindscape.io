import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { login } from '../actions';

class UserLoginor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logging_in: false,
      name: '',
      pass: '',
    }

    this.startLogin = this.startLogin.bind(this);
    this.resetLogin = this.resetLogin.bind(this);
    this.dispatchLogin = this.dispatchLogin.bind(this);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
  }

  startLogin() {
    this.setState({
      logging_in: true
    });
  }

  resetLogin() {
    this.setState({
      logging_in: false,
      name: '',
      pass: '',
    });
  }

  dispatchLogin() {
    const { getVect, dispatch } = this.props;
    const { name, pass } = this.state;

    dispatch(login({
      vect: getVect(), 
      name,
      pass,
    }));

    this.resetLogin();
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }

  handlePassChange(event) {
    this.setState({
      pass: event.target.value
    });
  }

  render() {
    const { user } = this.props;
    const { logging_in, name, pass } = this.state;

    return (
      <div id='user-loginor' style={{}}>
        {
          logging_in 
            ? (
              <div className='loginment'>
                {
                  user ? 'you will be logged out when you log into a new user!' : 'name and password plz'
                }
                <input className='login-name item' 
                  type='text'
                  value={name}
                  onChange={this.handleNameChange}
                  placeholder={'name'}
                />
                <input className='login-pass item'
                  type='password'
                  value={pass}
                  onChange={this.handlePassChange}
                  placeholder={'pass'}
                />
                <div className='login-cancel button' onClick={this.resetLogin}>
                  <div className='content'>
                    cancel
                  </div>
                </div>
                <div className='login-dispatch button' onClick={this.dispatchLogin}>
                  <div className='content'>
                    login!
                  </div>
                </div>
              </div>
            )
            : (
              <div className='login-start button' onClick={this.startLogin}>
                <div className='content'>
                  login!
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

UserLoginor.propTypes = {
  getVect: PropTypes.func,
  user: PropTypes.object,
};

export const UserLoginor_Out = connect()(UserLoginor);