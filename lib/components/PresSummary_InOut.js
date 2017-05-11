var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PresSelect_o } from './PresSelect_o';
import { NodeSummary } from './NodeSummary';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { selectNode } from '../actions';

var PresSummary = function (_React$Component) {
  _inherits(PresSummary, _React$Component);

  function PresSummary(props) {
    _classCallCheck(this, PresSummary);

    var _this = _possibleConstructorReturn(this, (PresSummary.__proto__ || Object.getPrototypeOf(PresSummary)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(PresSummary, [{
    key: 'handleClick',
    value: function handleClick(event) {
      console.log('click');
      event.stopPropagation();

      var _props = this.props,
          user = _props.user,
          path_press = _props.path_press,
          node = _props.node,
          dispatch = _props.dispatch;


      dispatch(selectPresSummary({
        user: user,
        path_press: path_press,
        node: node
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          user = _props2.user,
          path_press = _props2.path_press,
          node = _props2.node,
          def = _props2.def,
          partner_path_press = _props2.partner_path_press,
          partner_node = _props2.partner_node;


      var selected = false;

      var partner = React.createElement(
        PresSelect_o,
        { path_press: partner_path_press },
        React.createElement(NodeSummary, { user: user, node: partner_node })
      );

      return React.createElement(
        'div',
        { id: 'def-' + def.properties.id, className: 'def', onClick: this.handleClick, style: {
            border: '1px solid lavender',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            minWidth: 200
          } },
        React.createElement(
          'div',
          { className: 'def-content', style: {
              position: 'relative',
              border: '2px solid azure',
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4,
              backgroundColor: 'white'
            } },
          def.properties.start_id === partner_node.properties.id ? partner : null,
          React.createElement(
            'div',
            { className: 'in-index', style: {
                display: 'inline-block',
                verticalAlign: 'middle',
                color: selected ? 'darkturquoise' : 'lavender',
                margin: 2,
                marginLeft: 4
              } },
            def.properties.in_index
          ),
          React.createElement(
            'div',
            { className: 'def-details', style: {
                display: 'inline-block',
                margin: 2,
                border: node.properties.commit_v ? 'none' : '1px solid darkorchid',
                borderTopRightRadius: 4,
                borderBottomLeftRadius: 4,
                padding: 2,
                backgroundColor: 'white',
                whiteSpace: 'nowrap'
              } },
            init_v.join(',') + '\n' + hide_v.join(',') + '\n' + select_v.join(',') + '\n' + edit_v.join(',')
          ),
          React.createElement(
            'div',
            { className: 'out-index', style: {
                display: 'inline-block',
                verticalAlign: 'middle',
                color: selected ? 'darkturquoise' : 'lavender',
                margin: 2,
                marginLeft: 4
              } },
            def.properties.out_index
          ),
          def.properties.start_id === partner_node.properties.id ? partner : null
        )
      );
    }
  }]);

  return PresSummary;
}(React.Component);

PresSummary.propTypes = {
  user: PropTypes.object.isRequired,
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  node: PropTypes.object.isRequired,
  def: PropTypes.object.isRequired,
  partner_node: PropTypes.object,
  partner_path_press: PropTypes.arrayOf(PropTypes.object)
};

export var PresSummary_InOut = connect(function (state, ownProps) {
  var user_id = state.user_id,
      node_by_id = state.node_by_id,
      link_by_id = state.link_by_id,
      link_by_id_by_end_id = state.link_by_id_by_end_id;
  var node = ownProps.node,
      def = ownProps.def;


  var partner_node = void 0;
  if (def.properties.start_id === node.properties.id) {
    partner_node = node_by_id[def.properties.end_id];
  } else {
    partner_node = node_by_id[def.properties.start_id];
  }

  var partner_path_press = [];
  var partner_path_node_id = node.properties.id;
  while (partner_path_node_id !== user_id) {
    Object.keys(link_by_id_by_end_id[partner_path_node_id]).some(function (link_id) {
      var link = link_by_id[link_id];

      if (link.properties.user_id === user_id && link.properties.hide_v.length === 0 && // not hidden/deleted
      link.type === LinkTypes.PRESENT) {
        partner_path_press.push(link);
        partner_path_node_id = link.properties.start_id;
        return true;
      }
      return false;
    });
  }

  return {
    partner_node: partner_node,
    partner_path_press: partner_path_press
  };
})(PresSummary);