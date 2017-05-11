var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';
import { Node_i } from './Node_i';
import { Pres } from './Pres';
import { NodeInit_o } from './NodeInit_o';

import { connect } from 'react-redux';

import { LinkTypes } from '../types';
import { sortByOutIndex } from '../utils';

//import * as force from 'd3-force';

var Joint = function (_React$Component) {
  _inherits(Joint, _React$Component);

  //JointPress
  function Joint(props) {
    _classCallCheck(this, Joint);

    return _possibleConstructorReturn(this, (Joint.__proto__ || Object.getPrototypeOf(Joint)).call(this, props));
    // this.force = d3.force
    // draw axes
  }

  _createClass(Joint, [{
    key: 'render',
    value: function render() {
      var _ref;

      var _props = this.props,
          user = _props.user,
          select_press = _props.select_press,
          path_press = _props.path_press,
          out_defs = _props.out_defs,
          out_press = _props.out_press;


      var pres = path_press[path_press.length - 1];

      var child_press = [];
      var child_press2 = [];
      out_press.forEach(function (out_pres) {
        if (out_pres.properties.user_id === user.properties.id && (out_pres.properties.hide_v == null || out_pres.properties.hide_v.length === 0)) {
          if (pres.properties.list || out_pres.properties.enlist) {
            child_press.push(out_pres);
          } else {
            child_press2.push(out_pres); // render absolutely positioned child notes on top, higher index on top
          }
        }
      });
      child_press.sort(sortByOutIndex).reverse(); // stack that
      child_press2.sort(sortByOutIndex); // stack these too (greater out_index on top z-index (not really) wise)
      child_press.push.apply(child_press2);

      return React.createElement(
        'div',
        { className: 'Joint', style: (_ref = {
            width: path_press.length === 1 ? '100%' : 'auto', // TODO maximize
            position: 'relative',
            border: '1px solid azure',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            padding: 2,
            paddingLeft: 6
          }, _defineProperty(_ref, 'width', pres.properties.list ? 'auto' : pres.properties.radius || 2400), _defineProperty(_ref, 'height', pres.properties.list ? 'auto' : pres.properties.radius || 2400), _defineProperty(_ref, 'resize', 'both'), _ref) },
        React.createElement(
          'div',
          { style: { marginLeft: -6, marginTop: -2 } },
          this.props.children
        ),
        React.createElement(NodeInit_o, {
          parent_path_press: path_press,
          parent_out_defs: out_defs,
          parent_out_press: out_press
        }),
        child_press.map(function (child_pres) {
          var child_path_press = [].concat(_toConsumableArray(path_press), [child_pres]);
          return React.createElement(Pres, {
            key: 'Pres-' + child_pres.properties.id,
            path_press: child_path_press,
            peer_press: child_press,
            select_press: select_press
          });
        }),
        React.createElement('div', { style: { clear: 'both' } })
      );
    }
  }]);

  return Joint;
}(React.Component);

Joint.propTypes = {
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  // state
  user: PropTypes.object,
  out_defs: PropTypes.arrayOf(PropTypes.object), // set new pre out_index, when create new child
  in_press: PropTypes.arrayOf(PropTypes.object),
  in_defs: PropTypes.arrayOf(PropTypes.object), // set new def in_index, when create new child 
  out_press: PropTypes.arrayOf(PropTypes.object),
  //
  dispatch: PropTypes.func.isRequired
};

export var Joint_i = connect(function (state, ownProps) {
  var auth_user = state.auth_user,
      node_by_id = state.node_by_id,
      link_by_id = state.link_by_id,
      link_by_id_by_start_id = state.link_by_id_by_start_id,
      link_by_id_by_end_id = state.link_by_id_by_end_id;
  var path_press = ownProps.path_press;


  var pres = path_press[path_press.length - 1];

  var in_defs = [];
  var in_press = [];
  Object.keys(link_by_id_by_end_id[pres.properties.end_id] || {}).forEach(function (link_id) {
    var link = link_by_id[link_id];
    if (link.type === LinkTypes.DEFINE) {
      in_defs.push(link);
    } else if (link.type === LinkTypes.PRESENT) {
      in_press.push(link);
    }
  });

  var out_defs = [];
  var out_press = [];
  Object.keys(link_by_id_by_start_id[pres.properties.end_id] || {}).forEach(function (link_id) {
    var link = link_by_id[link_id];
    if (link.type === LinkTypes.DEFINE) {
      out_defs.push(link);
    } else if (link.type === LinkTypes.PRESENT) {
      out_press.push(link);
    }
  });

  return {
    user: node_by_id[auth_user.uid],
    out_defs: out_defs,
    in_press: in_press,
    in_defs: in_defs,
    out_press: out_press
  };
})(Joint);