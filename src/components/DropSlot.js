import React, { PropTypes } from 'react';

import { PositionModes } from '../types';

import { ReadDropTargetContainer } from './ReadDropTargetContainer';
import { TextEditor } from './TextEditor';

export class DropSlot extends React.Component { // aka AddNote
  constructor(props) {
    super(props);

    this.state = {
      show_editor: false,
    }

    this.toggleEditor = this.toggleEditor.bind(this);
  }
  
  toggleEditor() {
    this.setState({
      show_editor: !this.state.show_editor,
    });
  }
  
  render() {
    const { reading } = this.props;
    const { show_editor } = this.state;

    const style = {
      fill:{
        height: 18, //this.props.isOver ? 200 : 0,
        width: 400,
        backgroundColor: 'lavender',
      },
    };

    const content = show_editor
      ? (
        <TextEditor handleSave={null} />
      )
      : (
        <div style={style.fill}></div>
      );

    return (
      <div className='drop-slot'>
        <ReadDropTargetContainer reading={reading} position_mode={PositionModes.SEQUENCE}>
          {content}
        </ReadDropTargetContainer>
      </div>
    );
  } 
}

DropSlot.propTypes = {
  // ownProps
  reading: PropTypes.arrayOf(PropTypes.object),
}
