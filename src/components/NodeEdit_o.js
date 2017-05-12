import React from 'react';
import { PropTypes } from 'prop-types';
import { Vector } from './Vector';

import {
  Editor,
  EditorState,
  ContentState,
  convertFromRaw,
} from 'draft-js';

import { connect } from 'react-redux'; 
import { nodeEdit } from '../actions';

import { debounce } from 'lodash';

class NodeEdit extends React.Component {
  constructor(props) {
    super(props);

    const { user, node } = this.props;

    const permitted = node.properties.user_id === user.properties.id;

    this.state = {
      editorState: permitted
        ? node.editorState
          ? node.editorState
          : node.properties.raw
            ? EditorState.createWithContent(createFromRaw(node.properties.raw)) 
            : EditorState.createEmpty()
        : null,
      //edit_timer_id: null,
      prisitine: true,
    };

    this.setEditorRef = this.setEditorRef.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.edit = debounce(this.edit.bind(this), 2000);
  }

  setEditorRef(ref) {
    this.editor = ref;
  }

  handleClick(event) {
    this.editor.focus();
  }

  handleChange(editorState) {
    const { node, dispatch } = this.props;

    this.setState({
      editorState,
      pristine: false,
    });
  }

  edit() {
    const { node, dispatch } = this.props;
    const { editorState } = this.state;

    dispatch((nodeEdit({
      node,
      editorState,
    })))
  }

  componentDidMount() {
    const { selected } = this.props;

    console.log('NodeEdit mount', this.props);
    if (selected) {
      console.log('focus', this.editor);
    }
  }

  render() {
    const { user, node } = this.props;
    const { pristine, editorState } = this.state;
    // TODO if minimized, display text up to first newline

    const committed = (node.properties.commit_v && node.properties.commit_v.length !== 0);
    const permitted = node.properties.user_id === user.properties.id;

    return (
      <div className='NodeEdit' style={{
        display:'inline-block',
        verticalAlign: 'middle',
        border: '1px solid lavender',
      }}>
        {
          permitted && !committed
            ? (
              <button className='button' disabled={pristine} onClick={this.edit}>
                <div>
                  Edit
                </div>
              </button>
            )
            : null
        }
        <div className='item'  onClick={this.handleClick} style={{
          minWidth: 200,
          cursor: 'text',
        }}>
          <Editor
            ref={this.setEditorRef}
            editorState={editorState}
            readOnly={permitted && !committed}
            onChange={this.handleChange}
          />
        </div>
        <Vector vect={node.properties.edit_v} />
      </div>
    );
  }
}

NodeEdit.propTypes = {
  user: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  dispatch: PropTypes.func,
};

export const NodeEdit_o = connect()(NodeEdit);

