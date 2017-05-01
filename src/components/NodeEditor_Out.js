import React, { PropTypes } from 'react';

import { Editor, EditorState, ContentState } from 'draft-js';

import { connect } from 'react-redux'; 
import { nodeEdit } from '../actions';

class NodeEditor extends React.Component {
  constructor(props) {
    super(props);
    const { node } = this.props;

    this.state = {
      editorState: node.editorState
        ? node.editorState
        : node.properties.exp
          ? EditorState.createWithContent(ContentState.createFromText(node.properties.exp)) 
          : EditorState.createEmpty(),
      edit_timer_id: null,
    };

    this.setEditorRef = this.setEditorRef.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.dispatchEdit = this.dispatchEdit.bind(this);
  }

  setEditorRef(ref) {
    this.editor = ref;
  }

  handleClick(event) {
    //event.stopPropagation()
  }

  handleEdit(editorState) {
    const { edit_timer_id } = this.state;

    if (edit_timer_id) {
      clearTimeout(edit_timer_id);
    }

    this.setState({
      editorState: editorState,
      //edit_timer_id: setTimeout(this.dispatchEdit, 10000), // autosave edits every 10 sec
    });
  }

  dispatchEdit() {
    const { getVect, node, dispatch } = this.props;
    const { editorState } = this.state;

    /*dispatch(nodeEdit({
      vect: getVect(),
      node: Object.assign({}, node, {
        editorState,
      }),
    }));*/
    console.log('dispatch edit!');

    this.setState({
      edit_timer_id: null,
    });
  }

  componentDidMount() {
    const { exact_selected } = this.props;

    if (exact_selected) {
      this.editor.focus();
    }
  }

  render() {
    const { editorState } = this.state;
    // TODO if minimized, display text up to first newline

    return (
      <div className='nodeEditor' onClick={this.handleClick} style={{
        display:'inline-block',
        verticalAlign: 'middle',
        minWidth: 200,
        border: '1px solid lavender',
        cursor: 'text',
      }}>
        <Editor ref={this.setEditorRef} editorState={editorState} onChange={this.handleEdit} />
      </div>
    );
  }
}

NodeEditor.propTypes = {
  getVect: PropTypes.func.isRequired,
  node: PropTypes.object.isRequired,
  exact_selected: PropTypes.bool.isRequired,
  dispatch: PropTypes.func,
};

export const NodeEditor_Out = connect()(NodeEditor);

