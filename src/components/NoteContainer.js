import React, { PropTypes } from 'react';
import { connect } from 'react-redux'; 

import { Positions, Displays } from '../types';

import { cancelNote, setNote, commitNote, currentNote } from '../actions';

import { Editor, EditorState, ContentState } from 'draft-js';

class Note extends React.Component {
  constructor(props) {
    super(props);

    const { note } = this.props;

    if (note.write_id == null) {
      this.state = {
        editorState: note.editorState
          ? note.editorState
          : EditorState.createEmpty(),
      };
    }
    else {
      this.state = {};
    }

    this.setEditorRef = this.setEditorRef.bind(this);

    this.getEditedNote = this.getEditedNote.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
  }

  componentDidMount() {
    const { user, note, path } = this.props;

    if (note.write_id == null && user.current_read_id === path[0].id) {
      this.editor.focus();
    }
  }

  setEditorRef(ref) {
    this.editor = ref;
  }

  getEditedNote() {
    const { note } = this.props;
    const { editorState } = this.state;

    const contentState = editorState.getCurrentContent();
    const text = contentState.getPlainText();

    console.log('text', '@'+text+'@');

    return Object.assign({}, note, {
      text,
      editorState,
    });
  }

  handleClick(event) {
    const { user, note, path, dispatch } = this.props;

    if (note.write_id == null) {
      event.stopPropagation(); // prevent read-drag, so we can hilight text!

      dispatch(currentNote(user, note, path[0]));
    }
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
      editorState: editorState,
      timer_id: setTimeout(() => {
        const note = this.getEditedNote();

        dispatch(setNote(user, note, path[0]));
      }, 1000),
    });
  }

  handleCommit(event) {
    const { user, path, dispatch } = this.props;
    const { position_editorState, timer_id } = this.state;

    clearTimeout(timer_id);

    const note = this.getEditedNote();
    
    dispatch(commitNote(user, note, path[0]))
  }

  render() {
    //console.log('render Note', this.props)
    const { user, note, path, connectDragSource } = this.props;
    const { editorState } = this.state;

    // TODO on read.properties.mode == minimized, display text up to first double newline
    const style = {
      text_content: {
        minWidth: 200,
      },
      button: {
        display: 'inline-block',
        margin: 2,
        border: '1px solid darkgrey',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        cursor: 'pointer',
        color: 'darkgrey',
      },
      button_content: {
        border: '1px solid azure',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        padding: 2,
        backgroundColor: 'white',
      },
    };
    style.commit_button = Object.assign({}, style.button, {
      borderColor: 'darkorchid',
      color: 'darkorchid'
    });

    const is_current = (user.current_read_id === path[0].id);
    const is_frame = (user.frame_read_id === path[0].id);
    const is_root = (user.root_read_id === path[0].id);

    const position = (path[1] == null || path[1].properties.display === Displays.SEQUENCE)
      ? Positions.DOCK
      : path[0].properties.position;

    const index = (path[1] && ((path[1].properties.sub_read_ids || []).indexOf(path[0].id) + 1)) || 0;

    const text_content = (note.write_id == null) ? (
      <div className='text-content' style={style.text_content}>
        <div className='editor' style={{
          display:'inline-block',
          verticalAlign: 'middle',
          minWidth: 100,
          cursor: 'text',
        }}>
          <Editor ref={this.setEditorRef} editorState={editorState} onChange={this.handleChange} />
        </div>
        <div className='editor-controls' style={{
          display: 'inline-block',
          verticalAlign: 'bottom',
        }}>
          <div className='commit' onClick={this.handleCommit} style={style.commit_button}>
            <div style={style.button_content}>
              commit
            </div>
          </div>
          <div className='cancel' onClick={this.handleCancel} style={style.button}>
            <div style={style.button_content}>
              cancel
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className='text-content' style={style.text_content}>
        { note.text }
      </div>
    );

    const main = (
      <div id={'note-'+note.id} className='note' style={{
        border: '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        minWidth: 200,
        cursor: '-webkit-grab',
      }}>
        <div className='note-content' style={{
          position: 'relative',
          border: '2px solid azure',
          borderTopRightRadius: 4,
          borderBottomLeftRadius: 4,
          backgroundColor: 'white',
        }}>
          {
            is_frame ? null : (
              <div className='point' style={{
                zIndex: 5,
                position: 'absolute',
                left: -6,
                top: -6,
                width: 6,
                height: 6,
                backgroundColor: (position === Positions.DOCK) ? 'white' : 'lightyellow',
                border: is_current
                  ? '1px solid darkturquoise'
                  : (is_root 
                    ? '1px solid darkorchid'
                    : (is_frame
                      ? '1px solid steelblue'
                      : ((position === Positions.DOCK) ? '1px solid lavender' : '1px solid gold'))),
                borderRadius: 2,
              }}/>
            )
          }
          <div className='index' style={{
            display: 'inline-block',
            color: is_current
              ? 'darkturquoise'
              : (is_root
                ? 'darkorchid'
                : (is_frame ? 'steelblue' : 'lavender')),
            margin: 2,
            marginLeft: 4,
          }} >
            { index }
          </div>
          <div className='text' onClick={this.handleClick} style={{
            display: 'inline-block',
            margin: 2,
            border: (note.write_id == null) ? '1px solid darkturquoise' : 'none',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            padding: 2,
            backgroundColor: 'white',
            whiteSpace: 'nowrap',
            cursor: (note.write_id == null) ? 'default' : '-webkit-grab',
          }}>
            { text_content }
          </div>
        </div>
      </div>
    );

    if (is_frame) {
      return main;
    }
    else {
      return connectDragSource(main);
    }
  }
}

Note.propTypes = {
  user: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  connectDragSource: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
};

export const NoteContainer = connect()(Note);