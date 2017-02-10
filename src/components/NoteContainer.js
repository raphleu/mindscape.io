import React, { PropTypes } from 'react';
import { connect } from 'react-redux'; 

import { DisplayModes } from '../types';

import { cancelNote, setNote, commitNote } from '../actions';

import { Editor, EditorState, ContentState } from 'draft-js';

class Note extends React.Component {
  constructor(props) {
    super(props);

    const { note } = this.props;

    if (note.write_id == null) {
      this.state = {
        position_editorState: note.position_editorState
          ? note.position_editorState
          : EditorState.createEmpty(),
      };
    }

    this.setPositionTextEditorRef = this.setPositionTextEditorRef.bind(this);

    this.getNoteWithEditorState = this.getNoteWithEditorState.bind(this);

    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
  }

  componentDidMount() {
    const { user, note, path } = this.props;

    if (note.write_id == null && user.current_read_id === path[0].id) {
      this.position_textEditor.focus();
    }
  }

  setPositionTextEditorRef(ref) {
    this.position_textEditor = ref;
  }

  getNoteWithEditorState() {
    const { note } = this.props;
    const { position_editorState } = this.state;

    const position_contentState = position_editorState.getCurrentContent();
    const position_text = position_contentState.getPlainText();

    console.log('positionText', '@'+position_text+'@');

    return Object.assign({}, note, {
      position_text,
      position_editorState,
    });
  }

  handleCancel(event) {
    const { user, note, path, dispatch } = this.props;
    const { timer_id } = this.state;

    clearTimeout(timer_id);

    dispatch(cancelNote(user, note, path[0], path[1]));
  }

  handleChange(editorState) {
    const { user, path, dispatch } = this.props;
    const { timer_id } = this.state;

    clearTimeout(timer_id);

    this.setState({
      position_editorState: editorState,
      timer_id: setTimeout(() => {
        const note = this.getNoteWithEditorState();

        dispatch(setNote(user, note, path[0]));
      }, 1000),
    });
  }

  handleCommit(event) {
    const { user, path, dispatch } = this.props;
    const { position_editorState, timer_id } = this.state;

    clearTimeout(timer_id);

    const note = this.getNoteWithEditorState();
    
    dispatch(commitNote(user, note, path[0]))
  }

  render() {
    //console.log('render Note', note)
    const { note } = this.props;

    // TODO on read.properties.mode == minimized, display text up to first double newline
    const style = {
      main: {
        display: 'inline-block',
        margin: 2,
        border: (note.write_id == null) ? '1px solid darkturquoise' : 'none',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        padding: 2,
        backgroundColor: 'white',
        whiteSpace: 'nowrap',
      },
      position: {
        display: 'inline-block',
        padding: 2,
        minWidth: 200,
        cursor: (note.write_id == null) ? 'text' : 'pointer',
      },
      buttons: {
        display: 'inline-block',
      },
      button: {
        display: 'inline-block',
        margin: 2,
        border: '1px solid lavender',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
      },
      button_liner: {
        border: '1px solid azure',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        padding: 2,
        backgroundColor: 'white',
        color: 'darkgrey',
      }
    };

    let position;
    let commit_or_cancel;
    if (note.write_id == null) {
      const { position_editorState } = this.state;

      position = (
        <Editor
          ref={this.setPositionTextEditorRef}
          editorState={position_editorState}
          onChange={this.handleChange}
        />
      );

      commit_or_cancel = (
        <div style={style.buttons}>
          <div style={style.button} onClick={this.handleCommit}>
            <div style={style.button_liner}>
              commit
            </div>
          </div>
          <div style={style.button} onClick={this.handleCancel}>
            <div style={style.button_liner}>
              cancel
            </div>
          </div>
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
  user: PropTypes.object,
  note: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.object),
  dispatch: PropTypes.func,
};

export const NoteContainer = connect()(Note);