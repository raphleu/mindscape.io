var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';
import { Dashboard } from './Dashboard';
import { User } from './User';

import { connect } from 'react-redux';
import { resume } from '../actions';

import { LinkTypes } from '../types';

var Notation = function (_React$Component) {
  _inherits(Notation, _React$Component);

  function Notation(props) {
    _classCallCheck(this, Notation);

    return _possibleConstructorReturn(this, (Notation.__proto__ || Object.getPrototypeOf(Notation)).call(this, props));
  }

  _createClass(Notation, [{
    key: 'render',
    value: function render() {
      console.log('Notation', this.props);
      var _props = this.props,
          fetching = _props.fetching,
          auth_user = _props.auth_user,
          user = _props.user,
          select_press = _props.select_press,
          select_node = _props.select_node;


      return React.createElement(
        'div',
        { id: 'notation', style: {
            display: 'block',
            whiteSpace: 'nowrap'
          } },
        React.createElement(Dashboard, {
          auth_user: auth_user,
          user: user,
          select_press: select_press,
          select_node: select_node
        }),
        React.createElement(User, {
          fetching: fetching,
          auth_user: auth_user,
          user: user,
          select_press: select_press
        })
      );
    }
  }]);

  return Notation;
}(React.Component);

Notation.propTypes = {
  auth_user: PropTypes.object,
  user: PropTypes.object,
  select_press: PropTypes.arrayOf(PropTypes.object),
  select_node: PropTypes.object
};

export var Notation_i = connect(function (state) {
  var fetching = state.fetching,
      auth_user = state.auth_user,
      node_by_id = state.node_by_id,
      link_by_id = state.link_by_id,
      link_by_id_by_start_id = state.link_by_id_by_start_id;


  var user_id = auth_user.uid;
  var user = node_by_id[user_id];

  if (user_id == null || user == null) {
    return {
      fetching: fetching,
      auth_user: auth_user,
      user: user,
      select_press: [],
      select_node: null
    };
  }

  var root_pres = void 0;
  Object.keys(link_by_id_by_start_id[user_id]).some(function (link_id) {
    root_pres = link_by_id[link_id];
    return true;
  }); // assumes user will only have DEFINE from root, PRESENT to root; then link out must be root_pres

  var select_press = [root_pres];
  var select_node = void 0;

  var _loop = function _loop() {
    var pres = select_press[select_press.length - 1];

    var did_push_pres = Object.keys(link_by_id_by_start_id[pres.properties.end_id] || {}).some(function (link_id) {
      var link = link_by_id[link_id];

      if (link.properties.select_v[0] === pres.properties.select_v[0] && // select path press will have identical select_v
      link.type === LinkTypes.PRESENT) {
        select_press.push(link);
        return true;
      }
      return false;
    });

    if (!did_push_pres) {
      select_node = node_by_id[pres.properties.end_id] || {};
    }
  };

  while (select_node == null) {
    _loop();
  }

  return {
    fetching: fetching,
    auth_user: auth_user,
    user: user,
    select_press: select_press,
    select_node: select_node
  };
})(Notation);