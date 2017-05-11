var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { logout as _logout } from '../actions';

var UserLogout = function (_React$Component) {
  _inherits(UserLogout, _React$Component);

  function UserLogout(props) {
    _classCallCheck(this, UserLogout);

    var _this = _possibleConstructorReturn(this, (UserLogout.__proto__ || Object.getPrototypeOf(UserLogout)).call(this, props));

    _this.logout = _this.logout.bind(_this);
    return _this;
  }

  _createClass(UserLogout, [{
    key: 'logout',
    value: function logout() {
      var _props = this.props,
          auth_user = _props.auth_user,
          dispatch = _props.dispatch;


      var confirmed = confirm('Logout?' + (auth_user.isAnonymous ? ' You will lose access to your work unless you Sign using Google, Facebook, or email.' : ''));

      if (confirmed) {
        dispatch(_logout({
          auth_user: auth_user
        }));
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'UserLogout' },
        React.createElement(
          'button',
          { className: 'button', onClick: this.logout },
          React.createElement(
            'div',
            null,
            'Logout'
          )
        )
      );
    }
  }]);

  return UserLogout;
}(React.Component);

UserLogout.propTypes = {
  auth_user: PropTypes.object
};

export var UserLogout_o = connect()(UserLogout);