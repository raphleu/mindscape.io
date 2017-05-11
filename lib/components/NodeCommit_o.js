var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';
import { Vector } from './Vector';

import { connect } from 'react-redux';
import { nodeCommit } from '../actions';

var NodeCommit = function (_React$Component) {
  _inherits(NodeCommit, _React$Component);

  function NodeCommit(props) {
    _classCallCheck(this, NodeCommit);

    var _this = _possibleConstructorReturn(this, (NodeCommit.__proto__ || Object.getPrototypeOf(NodeCommit)).call(this, props));

    _this.commit = _this.commit.bind(_this);
    return _this;
  }

  _createClass(NodeCommit, [{
    key: 'commit',
    value: function commit() {
      var _props = this.props,
          node = _props.node,
          dispatch = _props.dispatch;


      var confirmed = confirm('Commit? You cannot edit a Node once it is committed.');
      if (confirmed) {
        dispatch(nodeCommit(node));
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          user = _props2.user,
          node = _props2.node;


      var committed = node.properties.commit_v && node.properties.commit_v.length !== 0;
      var permitted = node.properties.user_id === user.properties.id;

      var style = {
        button: {
          display: 'inline-block',
          margin: 2,
          border: '1px solid darkgrey',
          borderTopRightRadius: 2,
          borderBottomLeftRadius: 2,
          borderColor: 'darkorchid',
          color: 'darkorchid'
        },
        button_content: {
          borderTopRightRadius: 2,
          borderBottomLeftRadius: 2
        }
      };

      return React.createElement(
        'div',
        { className: 'NodeCommit', style: {
            display: 'inline-block',
            verticalAlign: 'middle',
            minWidth: 200
          } },
        committed ? React.createElement(
          'div',
          null,
          'Committed',
          React.createElement(Vector, { vect: node.properties.commit_v })
        ) : permitted ? React.createElement(
          'button',
          { onClick: this.commit },
          React.createElement(
            'div',
            null,
            'Commit'
          )
        ) : React.createElement(
          'div',
          null,
          'Uncommitted'
        )
      );
    }
  }]);

  return NodeCommit;
}(React.Component);

NodeCommit.propTypes = {
  user: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  dispatch: PropTypes.func
};

export var NodeCommit_o = connect()(NodeCommit);