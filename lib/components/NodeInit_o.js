var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { nodeInit } from '../actions';

var NodeInit = function (_React$Component) {
  _inherits(NodeInit, _React$Component);

  function NodeInit(props) {
    _classCallCheck(this, NodeInit);

    var _this = _possibleConstructorReturn(this, (NodeInit.__proto__ || Object.getPrototypeOf(NodeInit)).call(this, props));

    _this.handleClick = _this.handleClick.bind(_this);
    return _this;
  }

  _createClass(NodeInit, [{
    key: 'handleClick',
    value: function handleClick(event) {
      event.stopPropagation();
      var _props = this.props,
          parent_path_press = _props.parent_path_press,
          parent_out_defs = _props.parent_out_defs,
          parent_out_press = _props.parent_out_press,
          dispatch = _props.dispatch;


      dispatch(nodeInit({
        parent_path_press: parent_path_press,
        parent_out_defs: parent_out_defs,
        parent_out_press: parent_out_press
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'NodeInit' },
        React.createElement(
          'button',
          { onClick: this.handleClick },
          React.createElement(
            'div',
            null,
            'Init child'
          )
        )
      );
    }
  }]);

  return NodeInit;
}(React.Component);

NodeInit.propTypes = {
  parent_path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  parent_out_defs: PropTypes.arrayOf(PropTypes.object).isRequired,
  parent_out_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func
};

export var NodeInit_o = connect()(NodeInit);