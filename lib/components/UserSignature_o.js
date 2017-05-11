var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { sign1, sign2 } from '../actions';

import * as firebase from 'firebase/app';
import 'firebase/auth';

var UserSignature = function (_React$Component) {
  _inherits(UserSignature, _React$Component);

  function UserSignature(props) {
    _classCallCheck(this, UserSignature);

    var _this = _possibleConstructorReturn(this, (UserSignature.__proto__ || Object.getPrototypeOf(UserSignature)).call(this, props));

    var auth_user = props.auth_user;


    _this.state = {
      show: false,
      disabled: false,
      email: auth_user.email || '',
      pass: ''
    };

    _this.toggle = _this.toggle.bind(_this);
    _this.disable = _this.disable.bind(_this);
    _this.enable = _this.enable.bind(_this);

    _this.handleEmailChange = _this.handleEmailChange.bind(_this);
    _this.handlePassChange = _this.handlePassChange.bind(_this);

    _this.signWithEmailAndPass = _this.signWithEmailAndPass.bind(_this);

    _this.getSignWithProvider = _this.getSignWithProvider.bind(_this);
    return _this;
  }

  _createClass(UserSignature, [{
    key: 'toggle',
    value: function toggle() {
      this.setState({
        show: !this.state.show
      });
    }
  }, {
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
    key: 'getSignWithProvider',
    value: function getSignWithProvider(_ref) {
      var _this2 = this;

      var google = _ref.google,
          facebook = _ref.facebook;
      var _props = this.props,
          auth_user = _props.auth_user,
          user = _props.user,
          dispatch = _props.dispatch;


      var provider = google ? new firebase.auth.GoogleAuthProvider() : facebook ? new firebase.auth.FacebookAuthProvider() : null;

      return function () {
        _this2.disable();

        dispatch(sign1({
          google: google,
          facebook: facebook
        }));

        auth_user.linkWithPopup(provider).then(function (result) {
          dispatch(sign2({
            auth_user: result.user,
            user: user,
            google: google,
            facebook: facebook
          }));

          _this2.enable();
        }).catch(function (error) {
          alert([error.code, error.message]);

          _this2.enable();
        });
      };
    }
  }, {
    key: 'signWithEmailAndPass',
    value: function signWithEmailAndPass() {
      var _this3 = this;

      var _props2 = this.props,
          auth_user = _props2.auth_user,
          dispatch = _props2.dispatch;
      var _state = this.state,
          email = _state.email,
          pass = _state.pass;


      this.disable();

      var credential = firebase.auth().EmailAuthProvider.credential(email, pass);

      dispatch(sign1({
        pass: true
      }));

      auth_user.link(credential).then(function (auth_user) {
        dispatch(sign2({
          auth_user: auth_user,
          user: user,
          pass: pass
        }));

        _this3.enable();
      }).catch(function (error) {
        alert([error.code, error.message]);

        _this3.enable();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          auth_user = _props3.auth_user,
          user = _props3.user;
      var _state2 = this.state,
          show = _state2.show,
          disabled = _state2.disabled,
          email = _state2.email,
          pass = _state2.pass;


      return React.createElement(
        'div',
        { className: 'UserSignature' },
        React.createElement(
          'div',
          null,
          auth_user.isAnonymous ? 'anonymous' : auth_user.email
        ),
        React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            { className: 'button', onClick: this.toggle },
            React.createElement(
              'div',
              null,
              show ? 'Hide Signature' : 'Show Signature'
            )
          )
        ),
        show ? React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            { className: 'item' },
            user.properties.google ? React.createElement(
              'button',
              { className: 'button', disabled: true },
              React.createElement(
                'div',
                null,
                'TODO Remove Google'
              )
            ) : React.createElement(
              'button',
              { className: 'button', disabled: disabled, onClick: this.getSignWithProvider({ google: true }) },
              React.createElement(
                'div',
                null,
                'Sign with Google'
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'item' },
            user.properties.facebook ? React.createElement(
              'button',
              { className: 'button', disabled: true },
              React.createElement(
                'div',
                null,
                'TODO Remove Facebook'
              )
            ) : React.createElement(
              'button',
              { className: 'button', disabled: disabled, onClick: this.getSignWithProvider({ facebook: true }) },
              React.createElement(
                'div',
                null,
                'Sign with Facebook'
              )
            )
          ),
          user.properties.pass ? // TODO determine via auth_user if password exists
          React.createElement(
            'div',
            null,
            'TODO Reset password... email? Can\'t reset email if Google/Facebook linked?'
          ) : React.createElement(
            'div',
            { className: 'item' },
            React.createElement(
              'div',
              null,
              React.createElement('input', { className: 'item',
                type: 'text',
                value: email,
                disabled: auth_user.email != null,
                onChange: this.handleEmailChange,
                placeholder: 'email'
              }),
              React.createElement('input', { className: 'pass item',
                type: 'password',
                value: pass,
                onChange: this.handlePassChange,
                placeholder: 'pass'
              })
            ),
            React.createElement(
              'button',
              { className: 'button', disabled: disabled, onClick: this.signWithEmailAndPass },
              React.createElement(
                'div',
                null,
                'Sign with password'
              )
            )
          )
        ) : null
      );
    }
  }]);

  return UserSignature;
}(React.Component);

UserSignature.propTypes = {
  auth_user: PropTypes.object.isRequired,
  user: PropTypes.object,
  dispatch: PropTypes.func
};

export var UserSignature_o = connect()(UserSignature);