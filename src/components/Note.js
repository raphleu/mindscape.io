import React, { PropTypes } from 'react';
import { connect } from 'react-redux'; 

import { DisplayModes } from '../types';

import { TextEditor } from './TextEditor';


export class Note extends React.Component {
  constructor(props) {
    super(props);
    this.commitChanges = this.commitChanges.bind(this);
  }
  commitChanges() {
    //this.props.commitNote();
  }
  render() {
    const { note } = this.props;

    // TODO on read.properties.mode == minimized, display text up to first double newline
    const style = {
      main: {
        display: 'inline-block',
        //position: 'absolute',
        margin: 2,
        //border: '1px solid lavender',
        borderTopRightRadius: 2,
        backgroundColor: 'white',
      },
      position_text: {
        display: 'inline-block',
        margin: 2,
        marginTop: 4,
      }
    };
    // TODO move handle here?
    // TODO add momentum_text, with toggle


    const position_text = <TextEditor initialText={this.props.note.position_text} />;
    const momentum_text = this.props.note.momentum_text
      ? (
        <TextEditor initialText={this.props.note.momentum_text} />
      )
      : null;

    return (
      <div id={'note-'+note.id} style={style.main}>
        <div style={style.position_text}>
          {this.props.note.position_text}
        </div>
      </div>
    );
  }
}

Note.propTypes = {
  note: PropTypes.object,
};