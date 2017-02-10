import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Displays, Directions, Positions, DragTypes } from '../types';

import { currentNote, frameNote, stageNote } from '../actions';

import { flow } from 'lodash';
//import * as force from 'd3-force';

import { findDOMNode } from 'react-dom'

import { DragSource } from 'react-dnd';

import { ReadDropContainer } from './ReadDropContainer';
import { NoteContainer } from './NoteContainer';
import { SubReads } from './SubReads';

class Read extends React.Component { //Read
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);

    this.stageSubNote = this.stageSubNote.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    console.log('click');

    const { user, note, path, dispatch } = this.props;

    dispatch(currentNote(user, note, path[0]));
  }

  handleDoubleClick(event) {
    event.stopPropagation();
    console.log('doubleClick');

    const { user, note, path, dispatch } = this.props;

    dispatch(frameNote(user, note, path[0]));;
  }

  stageSubNote(event) {
    event.stopPropagation();

    const { user, path, dispatch } = this.props;

    dispatch(stageNote(user, path[0]));
  }

  render() {
    //console.log('render Read', this.props);
    const {
      user,
      note,
      path,
      sub_reads,
      //
      is_drag,
      connectDragSource,
      connectDragPreview,
    } = this.props;

    const is_current = (user.current_read_id === path[0].id);
    const is_frame = (user.frame_read_id === path[0].id);
    const is_root = (user.root_read_id === path[0].id);

    const direction = (path[1] == null) // dock/sequence direction
      ? Directions.DOWN
      : path[1].properties.direction;

    const position = (path[1] == null || path[1].properties.display === Displays.SEQUENCE)
      ? Positions.DOCK
      : path[0].properties.position;

    const display = is_frame ? Displays.PLANE : path[0].properties.display;

    const style = {
      main: {
        display: (direction === Directions.DOWN) ? 'block' : 'inline-block',
        float: 'left',
        clear: (direction === Directions.DOWN) ? 'both' : 'none',
        position: (position === Positions.DOCK) ? 'static' : 'absolute',
        left: path[0].properties.x,
        top: path[0].properties.y,
        margin: 2,
        opacity: is_drag ? 0.5 : 1,
      },
      view: {
        border: is_current
          ? '1px solid darkturquoise'
          : (is_root ? '1px solid darkorchid' : (is_frame ? '1px solid steelblue' : '1px solid lavender')),
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        minWidth: 200,
        width: is_frame ? '100%' : 'auto',
      },
      header: {
        marginBottom: 2,
        borderBottom: '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
      },
      header_liner: {
        position: 'relative',
        border: '2px solid azure',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        backgroundColor: 'white',
        cursor: 'pointer',
      },
      point: {
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
              : (position === Positions.DOCK) ? '1px solid lavender' : '1px solid gold'
            )
          ),
        borderRadius: 2
      },
      index: {
        display: 'inline-block',
        color: is_current ? 'darkturquoise' : (is_root ? 'darkorchid' : (is_frame ? 'steelblue' : 'lavender')),
        margin: 2,
        marginLeft: 4,
      },
    };

    const content = (
      <div>
        {
          connectDragSource(
            <div style={style.header}>
              <div style={style.header_liner}>
                {
                  is_frame ? null : <div style={style.point} />
                }
                <div style={style.index}>
                  {
                    (path[1] && ((path[1].properties.sub_read_ids || []).indexOf(path[0].id) + 1)) || 0
                  }
                </div>
                <NoteContainer user={user} note={note} path={path} />
              </div>
            </div>
          )
        }
        {
          (note.write_id == null)
            ? null
            : <SubReads sub_reads={sub_reads} path={path} stageSubNote={this.stageSubNote} />
        }
      </div>
    );

    let view;
    if (is_frame) { //if frame read
      view = (
        <div style={style.view}>
          {content}
        </div>
      );
    }
    else {
      view = (
        <ReadDropContainer path={path} depth={1} item_position={position} style={style.view}>
          {content}
        </ReadDropContainer>
      );
    }
    return connectDragPreview(
      <div id={'read-'+path[0].id} style={style.main} onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>
        {view}
      </div>
    );
  }
}

Read.propTypes = {
  path: PropTypes.arrayOf(PropTypes.object),
  // state
  note: PropTypes.object,
  user: PropTypes.object,
  sub_reads: PropTypes.arrayOf(PropTypes.object),
  dispatch: PropTypes.func,
  // drag n drop
  is_drag: PropTypes.bool,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
}

function getStateProps(state, ownProps) {
  const { path } = ownProps;

  const note = state.node_by_id[path[0].start];
  const user = state.node_by_id[path[0].end];

  const sub_reads = (path[0].properties.sub_read_ids || []).map(sub_read_id => state.relationship_by_id[sub_read_id]);

  return {
    path,
    note,
    user,
    sub_reads
  };
}

function getDragSourceProps(connector, monitor) {
  return {
    is_drag: monitor.isDragging(),
    connectDragSource: connector.dragSource(),
    connectDragPreview: connector.dragPreview(),
  };
}
const noteDragSource = {
  canDrag: (props) => {
    return true;
  },
  beginDrag: (props, monitor, component) => {
    const { user, note, path } = props;
    const clientRect = findDOMNode(component).getBoundingClientRect();

    const item = {
      user,
      note,
      path,
      clientRect,
    };  
    console.log('beginDrag', item);

    return item;
  },
  isDragging: (props, monitor) => {
    const item = monitor.getItem();
    if (props.path[0].id === item.path[0].id) {
      return true;
    }
    return false;
  },
}

export const ReadContainer = flow(
  DragSource(DragTypes.READ, noteDragSource, getDragSourceProps),
  connect(getStateProps),
)(Read);
