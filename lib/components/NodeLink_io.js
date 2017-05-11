var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { DefSummary_InOut } from './DefSummary_InOut';
import { PresSummary_InOut } from './PresSummary_InOut';
import { NodeSummary } from './NodeSummary';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { setModeDef, setModePres } from '../actions';

import { LinkTypes } from '../types';
import { sortByInIndex, sortByOutIndex } from '../utils';

var NodeLink = function (_React$Component) {
  _inherits(NodeLink, _React$Component);

  function NodeLink(props) {
    _classCallCheck(this, NodeLink);

    return _possibleConstructorReturn(this, (NodeLink.__proto__ || Object.getPrototypeOf(NodeLink)).call(this, props));

    //this.hide = this.hide.bind(this);
    //this.unhide = this.unhide.bind(this);
  }

  _createClass(NodeLink, [{
    key: 'render',
    value: function render() {
      //console.log('render Note', this.props)
      var _props = this.props,
          user = _props.user,
          path_press = _props.path_press,
          out_defs = _props.out_defs,
          in_press = _props.in_press,
          node = _props.node,
          out_press = _props.out_press,
          in_defs = _props.in_defs;


      return React.createElement(
        'div',
        { className: 'NodeLink', style: {
            display: 'inline-block',
            verticalAlign: 'middle',
            minWidth: 200
          } },
        React.createElement(
          'div',
          { className: 'out-defs linklist' },
          out_defs.forEach(function (link) {
            return React.createElement(DefSummary_InOut, { key: 'define-' + link.properties.id, user: user, path_press: path_press, node: node, def: link });
          })
        ),
        '---',
        React.createElement(
          'div',
          { className: 'in-press linklist' },
          in_press.forEach(function (link) {
            return React.createElement(PresSummary_InOut, { key: 'present-' + link.properties.id, user: user, path_press: path_press, node: node, pres: link });
          })
        ),
        React.createElement(NodeSummary, { user: user, node: node }),
        React.createElement(
          'div',
          { className: 'out-press linklist' },
          out_press.forEach(function (link) {
            return React.createElement(PresSummary_InOut, { key: 'present-' + link.properties.id, user: user, path_press: path_press, node: node, pres: link });
          })
        ),
        '---',
        React.createElement(
          'div',
          { className: 'in-defs linklist' },
          in_defs.forEach(function (link) {
            return React.createElement(DefSummary_InOut, { key: 'define-' + link.properties.id, user: user, path_press: path_press, node: node, def: link });
          })
        )
      );
    }
  }]);

  return NodeLink;
}(React.Component);

NodeLink.propTypes = {
  user: PropTypes.object.isRequired,
  //
  out_defs: PropTypes.arrayOf(PropTypes.object), // set new pre out_index, when create new child
  in_press: PropTypes.arrayOf(PropTypes.object),
  node: PropTypes.object.isRequired,
  in_defs: PropTypes.arrayOf(PropTypes.object), // set new def in_index, when create new child 
  out_press: PropTypes.arrayOf(PropTypes.object),
  //
  dispatch: PropTypes.func
};

export var NodeLink_io = connect(function (state, ownProps) {
  var link_by_id = state.link_by_id,
      link_by_id_by_start_id = state.link_by_id_by_start_id,
      link_by_id_by_end_id = state.link_by_id_by_end_id;
  var node = ownProps.node;


  var in_defs = [];
  var in_press = [];
  Object.keys(link_by_id_by_end_id[node.properties.id] || {}).forEach(function (link_id) {
    var link = link_by_id[link_id];
    if (link.type === LinkTypes.DEFINE) {
      in_defs.push(link);
    } else if (link.type === LinkTypes.PRESENT) {
      in_press.push(link);
    }
  });
  in_defs.sort(sortByInIndex);
  in_press.sort(sortByInIndex);

  var out_defs = [];
  var out_press = [];
  Object.keys(link_by_id_by_start_id[node.properties.id] || {}).forEach(function (link_id) {
    var link = link_by_id[link_id];
    if (link.type === LinkTypes.DEFINE) {
      out_defs.push(link);
    } else if (link.type === LinkTypes.PRESENT) {
      out_press.push(link);
    }
  });
  out_defs.sort(sortByOutIndex);
  out_press.sort(sortByOutIndex);

  return {
    out_defs: out_defs,
    in_press: in_press,
    in_defs: in_defs,
    out_press: out_press
  };
})(NodeLink);