import React, { PropTypes } from 'react';
import { connect } from 'react-redux'; 

import { merge } from 'lodash';

import { TextEditor } from './TextEditor';

import { DisplayModes } from '../types';

export class Note extends React.Component {
  constructor(props) {
    super(props);
    this.commitChanges = this.commitChanges.bind(this);
  }
  commitChanges() {
    //this.props.commitNote();
  }
  render() {
    const { reading, note } = this.props;

    // TODO on read.properties.mode == minimized, display text up to first double newline
    const style = {
      note: {
        //position: 'absolute',
        display: 'inline-block',
        backgroundColor: 'white',
        border: '1px solid lavender',
        borderTopRightRadius: 2,
        padding: 5, 
      },
      index: {
        display: 'inline-block',
        color: 'darkgrey',
        marginRight: 2,
      },
    };
    // TODO move handle here?
    // TODO add momentum_text, with toggle

    const index = reading[1] && ((reading[1].properties.sub_read_ids || []).indexOf(reading[0].id) + 1); 
    // get the reverse index (bc stacks are cooler than queues)

    const momentum_text = this.props.note.momentum_text
      ? (
        <TextEditor initialText={this.props.note.momentum_text} />
      )
      : null;

    return (
      <div className='note' style={style.note}>
        <div className='index' style={style.index}>{index ? index : ''}</div>
        <TextEditor initialText={this.props.note.position_text} />
      </div>
    );
  }
}

Note.propTypes = {
  reading: PropTypes.arrayOf(PropTypes.object),
  note: PropTypes.object,
};