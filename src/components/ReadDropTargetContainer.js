import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { DragTypes, PositionModes } from '../types';

import { setReads } from '../actions';
import { filterSubReadId } from '../util';

import { flow } from 'lodash';

import { DropTarget } from 'react-dnd';

class ReadDropTarget extends React.Component { // aka AddNote
  constructor(props) {
    super(props);
  }
  
  render() {
    const { isOver, connectDropTarget, children } = this.props;

    const style = {
      target: {
        border: isOver ? '1px solid darkturquoise' : '1px solid lavender',
      },
    };

    return connectDropTarget(
      <div className='read-drop-target' style={style.target}>
        {children}
      </div>
    );
  } 
}

DropTarget.propTypes = {
  // ownProps
  reading: PropTypes.arrayOf(PropTypes.object),
  position_mode: PropTypes.string,
  // dispatch 
  setReads: PropTypes.func,
  // drag n drop
  isOver: PropTypes.bool,
  connectDropTarget: PropTypes.func,
}

function getDispatchProps(dispatch) {
  return {
    setReads: (reads) => {
      dispatch(setReads(reads));
    },
  };
}

function getDropTargetProps(connector, monitor) { // dragNDropProps
  return {
    isOver: (monitor.isOver() && monitor.canDrop()),
    connectDropTarget: connector.dropTarget(),
  };
}

const dropTarget = {
  canDrop: (props, monitor) => {
    const item = monitor.getItem();
    for (let i = 0; i < props.reading.length; i++) {
      if (props.reading[i].id === item.reading[0].id) {
        return false;
      }
    }
    return true;
  },
  drop: (props, monitor, component) => {
    if (monitor.didDrop() || !monitor.canDrop()) {
      return;
    }

    const reads = [];

    const item = monitor.getItem();

    // update item super read
    if (props.reading[0].id === item.reading[1].id) {
      // target already contains item
      // move item to front
      const super_read = filterSubReadId(props.reading[0], item.reading[0].id)
      super_read.properties.sub_read_ids.push(item.reading[0].id);
      reads.push(super_read);
    }
    else {
      // remove item from prev super
      const prev_super_read = filterSubReadId(item.reading[1], item.reading[0].id);
      reads.push(prev_super_read);

      // add item to next super
      const next_super_read = Object.assign({}, props.reading[0])
      next_super_read.properties.sub_read_ids.push(item.reading[0].id);
      reads.push(next_super_read); // TODO adjust directionality
    }

    const position = {
      x: 0,
      y: 0,
    };
    if (props.position_mode === PositionModes.SCATTERPLOT) {
      const targetClientRect = findDOMNode(component).getBoundingClientRect();
      const cursorClientOffset = monitor.getClientOffset();

      position.x = cursorClientOffset.x - targetClientRect.left;
      position.y = cursorClientOffset.y - targetClientRect.top;
    }

    // update item read
    const read = Object.assign({}, item.reading[0], {
      properties: Object.assign({}, item.reading[0].properties, {
        position_mode: props.positionMode,
        super_read_id: props.reading[0].id,
        x: position.x,
        y: position.y,
      }),
    });
    reads.push(read);

    props.setReads(reads);
  },
};

export const ReadDropTargetContainer = flow(
  DropTarget(DragTypes.NOTE, dropTarget, getDropTargetProps),
  connect(null, getDispatchProps),
)(ReadDropTarget);