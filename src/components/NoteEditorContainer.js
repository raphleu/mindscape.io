import React, { PropTypes } from 'react';
import { connect } from 'react-redux'; 

import { NotePositions, NoteDisplays } from '../types';

import { modifyNote } from '../actions';

import { Editor, EditorState, ContentState } from 'draft-js';

class NoteEditor extends React.Component {
  constructor(props) {
    super(props);

    const { note } = this.props;

    this.state = {
      editorState: note.editorState ? note.editorState : EditorState.createEmpty(),
      change_timer: null,
    };

    this.setEditorRef = this.setEditorRef.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.dispatchChange = this.dispatchChange.bind(this);
  }

  componentDidMount() {
    const { path } = this.props;

    if (path[path.length - 1].properties.current === 1) {
      this.editor.focus();
    }
  }

  setEditorRef(ref) {
    this.editor = ref;
  }

  handleChange(editorState) {
    const { change_timer } = this.state;

    if (change_timer) {
      clearTimeout(change_timer);
    }

    this.setState({
      editorState: editorState,
      change_timer: setTimeout(dispatchChange, 1000),
    });
  }

  dispatchChange() {
    const { user, note, dispatch } = this.props;

    dispatch(modifyNote({user, note}));

    this.setState({
      change_timer: null,
    });
  }

  render() {
    //console.log('render NoteEditor', this.props)
    const { user, path, note } = this.props;
    const { editorState } = this.state;

    // TODO on read.properties.mode == minimized, display text up to first double newline

    return (
      <div className='noteeditor' style={{
        display:'inline-block',
        verticalAlign: 'middle',
        minWidth: 200,
        cursor: 'text',
      }}>
        <Editor ref={this.setEditorRef} editorState={editorState} onChange={this.handleChange} />
      </div>
    );
  }
}

NoteEditor.propTypes = {
  user: PropTypes.object.isRequired,
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  note: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
};

export const NoteEditorContainer = connect()(NoteEditor);

