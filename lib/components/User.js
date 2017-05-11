var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';
import { UserLogin_o } from './UserLogin_o';
import { UserSignature_o } from './UserSignature_o';
import { UserLogout_o } from './UserLogout_o';
import { Pres } from './Pres';

export var User = function (_React$Component) {
  _inherits(User, _React$Component);

  function User(props) {
    _classCallCheck(this, User);

    return _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).call(this, props));
  }

  _createClass(User, [{
    key: 'render',
    value: function render() {
      console.log('User', this.props);
      var _props = this.props,
          fetching = _props.fetching,
          auth_user = _props.auth_user,
          user = _props.user,
          select_press = _props.select_press;


      var root_pres = select_press[0];

      return auth_user && user && root_pres ? React.createElement(
        'div',
        { id: 'user-' + user.properties.id, className: 'User', style: {
            display: 'inline-block',
            margin: 2,
            border: '1px solid darkorchid',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4
          } },
        React.createElement(
          'div',
          { className: 'content', style: {
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4
            } },
          React.createElement(UserSignature_o, { auth_user: auth_user, user: user }),
          React.createElement(UserLogout_o, { auth_user: auth_user }),
          React.createElement(Pres, {
            key: 'note-' + root_pres.properties.end_id,
            path_press: [root_pres],
            peer_press: [root_pres],
            select_press: select_press
          })
        )
      ) : React.createElement(
        'div',
        { className: 'about', style: {
            display: 'inline-block',
            margin: 2,
            border: '1px solid steelblue',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4
          } },
        React.createElement(
          'div',
          { className: 'content', style: {
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4,
              padding: '6px 8px'
            } },
          fetching ? React.createElement(
            'div',
            null,
            'Loading...'
          ) : React.createElement(
            'div',
            null,
            'Read and write a web of posts where you can nest posts within one another.',
            React.createElement('br', null),
            'Check out the code @',
            React.createElement(
              'a',
              { href: 'https://github.com/geometerJones/mindscape.io' },
              'https://github.com/geometerJones/mindscape.io'
            ),
            React.createElement(UserLogin_o, null)
          )
        )
      );
    }
  }]);

  return User;
}(React.Component);

User.propTypes = {
  fetching: PropTypes.bool,
  auth_user: PropTypes.object,
  user: PropTypes.object,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired
};