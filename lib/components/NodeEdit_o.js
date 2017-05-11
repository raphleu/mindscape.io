var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';
import { Vector } from './Vector';

import { Editor, EditorState, ContentState, convertFromRaw } from 'draft-js';

import { connect } from 'react-redux';
import { nodeEdit } from '../actions';

import { debounce } from 'lodash';

var NodeEdit = function (_React$Component) {
  _inherits(NodeEdit, _React$Component);

  function NodeEdit(props) {
    _classCallCheck(this, NodeEdit);

    var _this = _possibleConstructorReturn(this, (NodeEdit.__proto__ || Object.getPrototypeOf(NodeEdit)).call(this, props));

    var _this$props = _this.props,
        user = _this$props.user,
        node = _this$props.node;


    var permitted = node.properties.user_id === user.properties.id;

    _this.state = {
      editorState: permitted ? node.editorState ? node.editorState : node.properties.raw ? EditorState.createWithContent(createFromRaw(node.properties.raw)) : EditorState.createEmpty() : null,
      //edit_timer_id: null,
      prisitine: true
    };

    _this.setEditorRef = _this.setEditorRef.bind(_this);

    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.edit = debounce(_this.edit.bind(_this), 2000);
    return _this;
  }

  _createClass(NodeEdit, [{
    key: 'setEditorRef',
    value: function setEditorRef(ref) {
      this.editor = ref;
    }
  }, {
    key: 'handleClick',
    value: function handleClick(event) {
      this.editor.focus();
    }
  }, {
    key: 'handleChange',
    value: function handleChange(editorState) {
      var _props = this.props,
          node = _props.node,
          dispatch = _props.dispatch;


      this.setState({
        editorState: editorState,
        pristine: false
      });
    }
  }, {
    key: 'edit',
    value: function edit() {
      var _props2 = this.props,
          node = _props2.node,
          dispatch = _props2.dispatch;
      var editorState = this.state.editorState;


      dispatch(nodeEdit({
        node: node,
        editorState: editorState
      }));
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var selected = this.props.selected;


      console.log('NodeEdit mount', this.props);
      if (selected) {
        console.log('focus', this.editor);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          user = _props3.user,
          node = _props3.node;
      var _state = this.state,
          pristine = _state.pristine,
          editorState = _state.editorState;
      // TODO if minimized, display text up to first newline

      var committed = node.properties.commit_v && node.properties.commit_v.length !== 0;
      var permitted = node.properties.user_id === user.properties.id;

      return React.createElement(
        'div',
        { className: 'NodeEdit', style: {
            display: 'inline-block',
            verticalAlign: 'middle',
            border: '1px solid lavender'
          } },
        permitted && !committed ? React.createElement(
          'button',
          { className: 'button', disabled: pristine, onClick: this.edit },
          React.createElement(
            'div',
            null,
            'Edit'
          )
        ) : null,
        React.createElement(
          'div',
          { className: 'item', onClick: this.handleClick, style: {
              minWidth: 200,
              cursor: 'text'
            } },
          React.createElement(Editor, {
            ref: this.setEditorRef,
            editorState: editorState,
            readOnly: permitted && !committed,
            onChange: this.handleChange
          })
        ),
        React.createElement(Vector, { vect: node.properties.edit_v })
      );
    }
  }]);

  return NodeEdit;
}(React.Component);

NodeEdit.propTypes = {
  user: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  dispatch: PropTypes.func
};

export var NodeEdit_o = connect()(NodeEdit);