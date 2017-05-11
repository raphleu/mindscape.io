var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';
import { Vector } from './Vector';

import { connect } from 'react-redux';
import { nodeHide } from '../actions';

var NodeHide = function (_React$Component) {
  _inherits(NodeHide, _React$Component);

  function NodeHide(props) {
    _classCallCheck(this, NodeHide);

    var _this = _possibleConstructorReturn(this, (NodeHide.__proto__ || Object.getPrototypeOf(NodeHide)).call(this, props));

    _this.hide = _this.hide.bind(_this);
    return _this;
  }

  _createClass(NodeHide, [{
    key: 'hide',
    value: function hide() {
      var _props = this.props,
          node = _props.node,
          dispatch = _props.dispatch;


      dispatch(nodeHide(node));
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          user = _props2.user,
          node = _props2.node;


      var hidden = node.properties.hide_v && node.properties.hide_v.length !== 0;
      var permitted = node.properties.user_id === user.properties.id;

      var style = {
        button: {
          display: 'inline-block',
          margin: 2,
          border: '1px solid darkgrey',
          borderTopRightRadius: 2,
          borderBottomLeftRadius: 2,
          color: 'darkgrey'
        },
        button_content: {
          borderTopRightRadius: 2,
          borderBottomLeftRadius: 2
        }
      };

      return React.createElement(
        'div',
        { className: 'NodeHide', style: {
            display: 'inline-block',
            verticalAlign: 'middle',
            minWidth: 200
          } },
        permitted ? React.createElement(
          'button',
          { onClick: this.hide },
          React.createElement(
            'div',
            null,
            hidden ? 'Unhide' : 'Hide'
          )
        ) : React.createElement(
          'div',
          { className: 'item' },
          React.createElement(
            'div',
            { className: 'content', style: style.button },
            hidden ? React.createElement(
              'div',
              null,
              '\'Hidden\'',
              React.createElement(Vector, { vect: node.properties.hide_v })
            ) : React.createElement(
              'div',
              null,
              'Unhidden'
            )
          )
        )
      );
    }
  }]);

  return NodeHide;
}(React.Component);

NodeHide.propTypes = {
  user: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  dispatch: PropTypes.func
};

export var NodeHide_o = connect()(NodeHide);