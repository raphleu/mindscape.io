var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { login1, login2 } from '../actions';

import * as firebase from 'firebase/app';
import 'firebase/auth';

var UserLogin = function (_React$Component) {
  _inherits(UserLogin, _React$Component);

  function UserLogin(props) {
    _classCallCheck(this, UserLogin);

    var _this = _possibleConstructorReturn(this, (UserLogin.__proto__ || Object.getPrototypeOf(UserLogin)).call(this, props));

    _this.state = {
      disabled: false,
      email: '',
      pass: ''
    };

    _this.disable = _this.disable.bind(_this);
    _this.enable = _this.enable.bind(_this);

    _this.handleEmailChange = _this.handleEmailChange.bind(_this);
    _this.handlePassChange = _this.handlePassChange.bind(_this);

    _this.getLoginWithProvider = _this.getLoginWithProvider.bind(_this);

    _this.loginWithEmailAndPass = _this.loginWithEmailAndPass.bind(_this);
    _this.signupWithEmailAndPass = _this.signupWithEmailAndPass.bind(_this);

    _this.loginAnonymously = _this.loginAnonymously.bind(_this);
    return _this;
  }

  _createClass(UserLogin, [{
    key: 'disable',
    value: function disable() {
      this.setState({
        disabled: true
      });
    }
  }, {
    key: 'enable',
    value: function enable() {
      this.setState({
        disabled: false
      });
    }
  }, {
    key: 'handleEmailChange',
    value: function handleEmailChange(event) {
      this.setState({
        email: event.target.value
      });
    }
  }, {
    key: 'handlePassChange',
    value: function handlePassChange(event) {
      this.setState({
        pass: event.target.value
      });
    }
  }, {
    key: 'getLoginWithProvider',
    value: function getLoginWithProvider(_ref) {
      var _this2 = this;

      var google = _ref.google,
          facebook = _ref.facebook;
      var dispatch = this.props.dispatch;


      var provider = google ? new firebase.auth.GoogleAuthProvider() : facebook ? new firebase.auth.FacebookAuthProvider() : null;

      return function () {
        _this2.disable();

        dispatch(login1({
          google: google,
          facebook: facebook
        }));

        firebase.auth().signInWithPopup(provider).then(function (result) {
          dispatch(login2(result.user)); //TODO determine if first login (i.e. signup)

          _this2.enable();
        }).catch(function (error) {
          alert([error.code, error.message]);

          _this2.enable();
        });
      };
    }
  }, {
    key: 'loginWithEmailAndPass',
    value: function loginWithEmailAndPass() {
      var _this3 = this;

      var dispatch = this.props.dispatch;
      var _state = this.state,
          email = _state.email,
          pass = _state.pass;


      this.disable();

      dispatch(login1({
        email: email,
        pass: pass
      }));

      firebase.auth().signInWithEmailAndPassword(email, pass).then(function (auth_user) {
        dispatch(login2(auth_user));

        _this3.enable();
      }).catch(function (error) {
        alert([error.code, error.message]);

        _this3.enable();
      });
    }
  }, {
    key: 'signupWithEmailAndPass',
    value: function signupWithEmailAndPass() {
      var _this4 = this;

      var dispatch = this.props.dispatch;
      var _state2 = this.state,
          email = _state2.email,
          pass = _state2.pass;


      this.disable();

      dispatch(login1({
        email: email,
        pass: pass,
        new_email: true
      }));

      firebase.auth().createUserWithEmailAndPassword(email, pass).then(function (auth_user) {
        dispatch(login2(auth_user));

        _this4.enable();
      }).catch(function (error) {
        alert([error.code, error.message]);

        _this4.enable();
      });
    }
  }, {
    key: 'loginAnonymously',
    value: function loginAnonymously() {
      var _this5 = this;

      var dispatch = this.props.dispatch;


      this.disable();

      dispatch(login1({
        anonymous: true
      }));

      firebase.auth().loginAnonymously().then(function (auth_user) {
        dispatch(login2(auth_user));

        _this5.enable();
      }).catch(function (error) {
        alert([error.code, error.message]);

        _this5.enable();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          auth_user = _props.auth_user,
          user = _props.user;
      var _state3 = this.state,
          disabled = _state3.disabled,
          email = _state3.email,
          pass = _state3.pass;


      return React.createElement(
        'div',
        { className: 'UserLogin item' },
        React.createElement(
          'div',
          { className: 'item' },
          React.createElement(
            'button',
            { className: 'button', disabled: disabled, onClick: this.getLoginWithProvider({ google: true }) },
            React.createElement(
              'div',
              null,
              'Login / Signup with Google'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'item' },
          React.createElement(
            'button',
            { className: 'button', disabled: disabled, onClick: this.getLoginWithProvider({ facebook: true }) },
            React.createElement(
              'div',
              null,
              'Login / Signup with Facebook'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'item' },
          React.createElement(
            'div',
            null,
            React.createElement('input', { className: 'item',
              type: 'text',
              value: email,
              disabled: disabled,
              onChange: this.handleEmailChange,
              placeholder: 'email'
            }),
            React.createElement('input', { className: 'item',
              type: 'password',
              value: pass,
              disabled: disabled,
              onChange: this.handlePassChange,
              placeholder: 'password'
            })
          ),
          React.createElement(
            'button',
            { className: 'button', disabled: disabled, onClick: this.loginWithEmailAndPass },
            React.createElement(
              'div',
              null,
              'Login with password'
            )
          ),
          React.createElement(
            'button',
            { className: 'button', disabled: disabled, onClick: this.signupWithEmailAndPass },
            React.createElement(
              'div',
              null,
              'Signup with password'
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'item' },
          React.createElement(
            'button',
            { className: 'button', disabled: disabled, onClick: this.loginAnonymously },
            React.createElement(
              'div',
              null,
              'Login anonymously (you can Sign via Google, Facebook, or password later to secure access to your work)'
            )
          )
        )
      );
    }
  }]);

  return UserLogin;
}(React.Component);

UserLogin.propTypes = {
  dispatch: PropTypes.func
};

export var UserLogin_o = connect()(UserLogin);