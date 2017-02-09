import React, { PropTypes } from 'react';
import { connect } from 'react-redux'; 

import { DisplayModes } from '../types';

import { setNote } from '../actions';

import { Editor, EditorState, ContentState } from 'draft-js';

export class Note extends React.Component {
  constructor(props) {
    super(props);

    const { note } = this.props;

    if (note.live) {
      this.state = {
        position_editorState: note.position_editorState
          ? note.position_editorState
          : EditorState.createEmpty(),
      };
    }

    this.setPositionTextEditorRef = this.setPositionTextEditorRef.bind(this);
    this.focus = this.focus.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
  }

  setPositionTextEditorRef(ref) {
    this.position_textEditor = ref;
  }

  focus() {
    this.position_textEditor && this.position_textEditor.focus();
  }

  handlePositionChange(editorState) {
    const { handlePositionTextChange } = this.props;
    const { timer_id } = this.state;

    clearTimeout(timer_id);

    this.setState({
      position_editorState: editorState,
      timer_id: setTimeout(() => {
        handlePositionTextChange(editorState);
      }, 1000),
    });
  }

  render() {
    //console.log('render Note', note)
    const { note } = this.props;

    // TODO on read.properties.mode == minimized, display text up to first double newline
    const style = {
      main: {
        display: 'inline-block',
        margin: 2,
        border: note.live ? '1px solid darkturquoise' : 'none',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        padding: 2,
        backgroundColor: 'white',
      },
      position: {
        display: 'inline-block',
        padding: 2,
        minWidth: 200,
        cursor: note.live ? 'text': 'pointer',
      },
      position_editor: {

      }
    };

    let position;
    let commit_or_cancel;
    if (note.live) {
      const { position_editorState } = this.state;

      position = (
        <div style={style.position_editor}>
          <Editor
            ref={this.setPositionTextEditorRef}
            editorState={position_editorState}
            onChange={this.handlePositionChange}
          />
        </div>
      );
    }
    else {
      position = note.position_text;
    }
    // TODO add momentum_text, with toggle

    return (
      <div id={'note-'+note.id} style={style.main}>
        <div style={style.position}>
          {position}
        </div>
        {commit_or_cancel}
      </div>
    );
  }
}

Note.propTypes = {
  note: PropTypes.object,
  handlePositionTextChange: PropTypes.func,
};