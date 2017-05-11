var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PropTypes } from 'react';
import { PresSelect_o } from './PresSelect_o';
import { NodeEdit_o } from './NodeEdit_o';

import { connect } from 'react-redux';

var Node = function (_React$Component) {
  _inherits(Node, _React$Component);

  function Node(props) {
    _classCallCheck(this, Node);

    return _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this, props));
  }

  _createClass(Node, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          path_press = _props.path_press,
          select_press = _props.select_press,
          user = _props.user,
          node = _props.node;


      var pres = path_press[path_press.length - 1];

      var selected = pres.properties.id === select_press[select_press.length - 1].properties.id;

      return React.createElement(
        'div',
        { id: 'Node-' + node.properties.id, className: 'Node', style: {
            border: '1px solid lavender',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            minWidth: 200
          } },
        React.createElement(
          PresSelect_o,
          { path_press: path_press },
          React.createElement(
            'div',
            { className: 'content', style: {
                position: 'relative',
                borderTopRightRadius: 4,
                borderBottomLeftRadius: 4
              } },
            React.createElement(
              'div',
              { className: 'index', style: {
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  color: selected ? 'darkturquoise' : 'lavender',
                  margin: 2,
                  marginLeft: 4
                } },
              pres.properties.out_index
            ),
            React.createElement(
              'div',
              { className: 'value', style: {
                  display: 'inline-block',
                  margin: 2,
                  border: node.properties.commit_v ? 'none' : '1px solid darkorchid',
                  borderTopRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  padding: 2,
                  backgroundColor: 'white',
                  whiteSpace: 'nowrap'
                } },
              React.createElement(NodeEdit_o, {
                user: user,
                node: node,
                selected: selected
              })
            )
          )
        )
      );
    }
  }]);

  return Node;
}(React.Component);

Node.propTypes = {
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.object,
  node: PropTypes.object
};

export var Node_i = connect(function (state, ownProps) {
  var auth_user = state.auth_user,
      node_by_id = state.node_by_id;
  var path_press = ownProps.path_press;


  var pres = path_press[path_press.length - 1];

  return {
    user: node_by_id[auth_user.uid],
    node: node_by_id[pres.properties.end_id]
  };
})(Node);