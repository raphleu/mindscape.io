import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { NodeLabels, NotePositions, NoteDisplays, NoteBodies } from '../types';

import { setCurrent } from '../actions';

import { flow } from 'lodash';
//import * as force from 'd3-force';

import { findDOMNode } from 'react-dom'

import { DragSource } from 'react-dnd';

import { NoteDropTargetContainer } from './NoteDropTargetContainer';
import { NoteContainer } from './NoteContainer';
import { SubNotesContainer } from './SubNotesContainer';

class Note extends React.Component { //Note
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    console.log('click');

    const { user, current_path, path, dispatch } = this.props;

    dispatch(setCurrent({user, current_path, path}));
  }

  handleDoubleClick(event) {
    event.stopPropagation();
    console.log('doubleClick');

    const { user, note, path, dispatch } = this.props;

    //dispatch(frameNote(user, note, path[0])); // TODO maximize a note
  }

  render() {
    //console.log('render Note', this.props);
    const {
      user,
      path,
      //
      note,
      sub_reads,
      //
      is_dragging,
      connectDragSource,
      connectDragPreview,
    } = this.props;

    const is_current = (path[path.length - 1].properties.current === 1);

    const position = (path[path.length - 2].properties.display === NoteDisplays.OUTLINE) // if parent note in list mode, override position
      ? NotePositions.STATIC
      : path[path.length - 1].properties.position;

    const content = (
      <div className='note-content' style={{
        border: is_current ? '1px solid darkturquoise' : '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        width: 'auto',
      }}>
        <NoteHeadContainer user={user} note={note} path={path} connectDragSource={connectDragSource}/>
        {
          (path[path.length - 1].properties.display === NoteDisplays.BODY)
            ? <NoteBodyContainer user={user} note={note} path={path} sub_reads={sub_reads} />
            : null 
        }
      </div>
    );

    return connectDragPreview(
      <div id={'note-' + note.properties.id} className='note'
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        style={{
          zIndex: is_current ? 100 : 'auto',
          display: 'block',
          float: 'left',
          clear: 'both',
          position: (position === NotePositions.STATIC) ? 'static' : 'absolute',
          left: path[0].properties.x,
          top: path[0].properties.y,
          margin: 2,
          opacity: is_dragging ? 0.5 : 1,
        }}
      >
        {
          path[path.length - 1].properties.frame ? content : (
            <NoteDropTargetContainer path={path} depth={1} position={position}>
              { content }
            </NoteDropTargetContainer>
          )
        }
      </div>
    );
  }
}

Note.propTypes = {
  user: PropTypes.object,
  current_path: PropTypes.arrayOf(PropTypes.object).isRequired,
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  // state
  dispatch: PropTypes.func,
  note: PropTypes.object,
  sub_reads: PropTypes.arrayOf(PropTypes.object),
  deleted_super_reads: PropTypes.arrayOf(PropTypes.object),
  // drag n drop
  is_dragging: PropTypes.bool,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
}

export const NoteContainer = flow(
  connect((state, ownProps) => {
    const { note_by_id, link_by_id_by_start_id } = state;
    const { user, path } = ownProps;

    const note = note_by_id[path[0].properties.end_id];

    const sub_link_by_id = link_by_id_by_start_id[note.properties.id];
    const sub_reads = Object.keys(sub_link_by_id).reduce((sub_reads, id) => {
      const sub_link = sub_link_by_id[id];
      if (
        sub_link.type === LinkTypes.READ &&
        sub_link.properties.author_id === user.properties.id &&
        sub_link.properties.deleted_t == null
      ) {
        return [...sub_reads, sub_link];
      }
      else {
        return sub_reads;
      }
    }, []);

    const super_link_by_id = link_by_id_by_end_id[note.properties.id];
    const deleted_super_reads = Object.keys(super_link_by_id).reduce((deleted_super_reads, id) => {
      const super_link = super_link_by_id[id];
      if (
        super_link.type === LinkTypes.READ &&
        super_link.properties.author_id === user.properties.id &&
        super_link.properties.deleted_t != null
      ) {
        return [...deleted_super_reads, super_link];
      }
      else {
        return deleted_super_reads;
      }
    }, []);

    return {
      note,
      sub_reads,
      deleted_super_reads,
    };
  }),
  DragSource(
    NodeLabels.Note,
    {
      beginDrag: (props, monitor, component) => {
        const { user, note, path } = props;
        const clientRect = findDOMNode(component).getBoundingClientRect();

        const item = {
          user,
          path,
          note,
          deleted_super_reads,
          clientRect,
        };  
        console.log('beginDrag', item);

        return item;
      },
      isDragging: (props, monitor) => {
        const item = monitor.getItem();
        return (props.note.properties.id === item.note.properties.id);
      },
    }, 
    (connector, monitor) => {
      const props = {
        is_dragging: monitor.isDragging(),
        connectDragSource: connector.dragSource(),
        connectDragPreview: connector.dragPreview(),
      };
      return props;
    }
  ),
)(Note);
