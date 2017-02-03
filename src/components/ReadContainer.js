import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

//import * as force from 'd3-force';

import { setReads, setCurrentReadId } from '../actions';

import { PositionModes, DisplayModes, SequenceDirections, DragTypes } from '../types';

import { getSuperReads, filterSubReadId } from '../util';
import { flow, merge } from 'lodash';

import { findDOMNode } from 'react-dom'

import { DragSource, DropTarget } from 'react-dnd';

import { Note } from './Note';
import { ReadSpaceContainer } from './ReadSpaceContainer';

class Read extends React.Component { //Read
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    const { user, reading, setCurrentReadId } = this.props;

    setCurrentReadId(user.id, reading[0].id);
  }

  render() {
    console.log('render Read', this.props);
    const {
      user,
      reading,
      note,
      isDragging,
      connectDragSource,
      connectDragPreview,
      connectDropTarget
    } = this.props;

    const scatterplot = (
      reading[1] && reading[1].properties.display_mode === DisplayModes.PLANE && // parent in plane mode
      reading[0].properties.position_mode === PositionModes.SCATTERPLOT // self in scatterplot mode
    );

    const sequence_down = (reading[1] && reading[1].properties.sequence_direction === SequenceDirections.DOWN);
    // direction of sequence of parent

    const is_current = (user.current_read_id === reading[0].id);

    const style = {
      read: {
        position: scatterplot ? 'absolute' : 'static',
        left: reading[0].properties.x,
        top: reading[0].properties.y,
        float: sequence_down ? 'left' : 'none',
        clear: sequence_down ? 'both' : 'none',
        display: 'inline-block',
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: 'azure',
        border: is_current ? '1px solid darkturquoise' : '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        margin: 2,
      },
      header: {
        position: 'relative',
        borderRadius: 2,
        margin: 2,
      },
      handle: {
        position: 'absolute',
        left: -5,
        top: -5,
        width: 12,
        height: 12,
        opacity: 0.9,
        backgroundColor: 'lightyellow',
        border: is_current ? '1px solid darkturquoise' : '1px solid gold',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
      },
      body: {
        display: 'block',
        overflow: 'scroll',
        border: '1px solid lavender',
        borderBottomLeftRadius: 2,
        margin: 2,
      },
    };

    const handle = (user.frame_read_id == reading[0].id) // TODO set frame using handle?
      ? null
      : connectDragSource(
        <div className='read-handle' style={style.handle}>
        </div>
      );

    return connectDragPreview(connectDropTarget(
      <div id={'read-'+reading[0].id} className='read' style={style.read} onClick={this.handleClick}>
        <div className='read-header' style={style.header}>
          {handle}
          <Note reading={reading} note={note} />
        </div>
        <div className='read-body' style={style.body}>
          <ReadSpaceContainer reading={reading} />
        </div>
      </div>
    ));
  }
}

Read.propTypes = {
  // own
  read_id: PropTypes.number.isRequired,
  // state
  user: PropTypes.object,
  reading: PropTypes.arrayOf(PropTypes.object),
  note: PropTypes.object,
  write: PropTypes.object,
  reads: PropTypes.arrayOf(PropTypes.object),
  links: PropTypes.arrayOf(PropTypes.object),
  // dispatch
  setReads: PropTypes.func,
  setCurrentReadId: PropTypes.func,
  // drag n drop
  isDragging: PropTypes.bool,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
  connectDropTarget: PropTypes.func,
}

function getStateProps(state, ownProps) {
  const { read_id } = ownProps;

  const reading = getSuperReads(state, read_id);

  const user = state.node_by_id[reading[0].end];
  const note = state.node_by_id[reading[0].start];

  const write = state.relationship_by_id[note.write_id];
  const reads = note.read_ids.map(read_id => state.relationship_by_id[read_id]);
  const links = note.link_ids.map(link_id => state.relationship_by_id[link_id]);

  return {
    user,
    reading,
    note,
    write,
    reads,
    links,
  };
}

function getDispatchProps(dispatch, ownProps) {
  // don't need to position children!
  return {
    setReads: (reading, description) => {
      dispatch(setReads(reading, description));
    },
    setCurrentReadId: (user_id, read_id) => {
      dispatch(setCurrentReadId(user_id, read_id));
    }
  };
}

function getDragSourceProps(connector, monitor) {
  return {
    isDragging: monitor.isDragging(),
    connectDragSource: connector.dragSource(),
    connectDragPreview: connector.dragPreview(),
  };
}
const noteDragSource = {
  canDrag: (props) => {
    return true;
  },
  beginDrag: (props) => {
    const item = {
      reading: props.reading,
    };  
    console.log('beginDrag', item);
    return item;
  },
  isDragging: (props, monitor) => {
    const item = monitor.getItem();
    if (props.reading[0].id === item.reading[0].id) {
      return true;
    }
    return false;
  },
}


function getDropTargetProps(connector, monitor) { // dragNDropProps
  return {
    connectDropTarget: connector.dropTarget(),
  };
}
const sequenceReadDropTarget = {
  canDrop: (props, monitor) => {
    const item = monitor.getItem();
    if (props.reading[0].properties.position_mode !== PositionModes.SEQUENCE) {
      // cant drop if target is not a unit in a line/sequence
      return false;
    }
    for (let i = 0; i < props.reading.length; i++) {
      if (props.reading[i].id === item.reading[0].id) {
        // cant drop if target is source, or child of source
        return false;
      }
    }
    return true;
  },
  drop: (props, monitor, component) => {
    if (monitor.didDrop() || !(monitor.canDrop())) {
      return; // drop was handled by child dropTarget
    }

    // collect relationships to edit
    const reads = [];

    const item = monitor.getItem();

    // update item read
    const read = Object.assign({}, item.reading[0], {
      properties: Object.assign({}, item.reading[0].properties, {
        position_mode: PositionModes.SEQUENCE,
        super_read_id: props.reading[0].id,
        x: 0,
        y: 0,
      }),
    });
    reads.push(read);


    const targetClientRect = findDOMNode(component).getBoundingClientRect();
    const cursorClientOffset = monitor.getClientOffset();

    const cursorY = cursorClientOffset.y - targetClientRect.top;
    const targetMiddleY = (targetClientRect.bottom - targetClientRect.top) / 2;

    const insertAfter = (cursorY > targetMiddleY);

    // update item super read
    if (props.reading[1].id === item.reading[1].id) {
      // target parent already contains item
      const super_read = filterSubReadId(props.reading[1], item.reading[0].id)
      const super_read2 = insertSubReadId(super_read, props.reading[0].id, item.reading[0].id, insertAfter);
      reads.push(super_read2);
    }
    else {
      // remove item from prev super
      const prev_super_read = filterSubReadId(item.reading[1], item.reading[0].id);
      reads.push(prev_super_read);

      // add item to next super
      const next_super_read = insertSubReadId(props.reading[1], props.reading[0].id, item.reading[0].id, insertAfter);
      reads.push(next_super_read); // TODO adjust directionality
    }


    props.setReads(reads);
  },
};

function insertSubReadId(read, target_id, insert_id, insertAfter) {
  const target_index = read.properties.sub_read_ids.indexOf(target_id);
  const insert_index = insertAfter ? target_index + 1 : target_index;

  return Object.assign({}, read, {
    properties: Object.assign({}, read.properties, {
      sub_read_ids: [...read.properties.sub_read_ids].splice(insert_index, 0, insert_id),
    }),
  });
}

export const ReadContainer = flow(
  DragSource(DragTypes.NOTE, noteDragSource, getDragSourceProps),
  DropTarget(DragTypes.NOTE, sequenceReadDropTarget, getDropTargetProps),
  connect(getStateProps, getDispatchProps),
)(Read);
