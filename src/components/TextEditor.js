import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { addNote } from '../actions';

import { Editor, EditorState, ContentState } from 'draft-js';

export class TextEditor extends React.Component {
  constructor(props) {
    super(props);

    const contentState = ContentState.createFromText(this.props.initialText || '');
    const editorState =  EditorState.createWithContent(contentState);
    this.state = {
      editorState,
      pristine: true,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(editorState) {
    this.setState({
      editorState,
      pristine: false,
    });
  }

  addNote() {

  }
  // addNote on doubleEnter, get context from props (e.g. parent note, or prev note)
  render() {
    const { handleSave } = this.props;
    const { editorState, pristine } = this.state;
    const style = {
      editor: {
        position: 'relative',
        display: 'inline-block',
        width: 400,
        padding: 2,
        border: pristine ? '' : '1px solid darkturquoise',
      },
      save: {
        position: 'absolute',
        left: 0,
        bottom: 0,
      }
    }

    const save_button = pristine
      ? null
      : (
        <div style={style.save} onClick={handleSave}>
          save
        </div>
      );

    return (
      <div style={style.editor}>
        <Editor editorState={editorState} onChange={this.handleChange} />
      </div>
    );
  }
}

TextEditor.propTypes = {
  handleSave: PropTypes.func,
}