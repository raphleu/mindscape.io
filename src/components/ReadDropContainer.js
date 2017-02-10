import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Displays, Positions, DragTypes } from '../types';

import { moveNote } from '../actions';

import { flow } from 'lodash';

import { DropTarget } from 'react-dnd';

import { findDOMNode } from 'react-dom'


class ReadDrop extends React.Component { // aka AddNote
  constructor(props) {
    super(props);
  }
  
  render() {
    const { style, is_over, connectDropTarget, children } = this.props;

    let style2 = Object.assign({}, style, {
      border: is_over ? '1px solid darkturquoise' : style.border
    });

    return connectDropTarget(
      <div className='read-drop' style={style2}>
        {children}
      </div>
    );
  } 
}

ReadDrop.propTypes = {
  // ownProps
  path: PropTypes.arrayOf(PropTypes.object), // path has all super_reads; readout would have all sub_reads
  depth: PropTypes.number,
  item_position: PropTypes.string,
  style: PropTypes.object,
  // dispatch 
  setState: PropTypes.func,
  // drag n drop
  is_over: PropTypes.bool,
  connectDropTarget: PropTypes.func,
}

function getDropTargetProps(connector, monitor) { // dragNDropProps
  return {
    is_over: (monitor.isOver({shallow: true}) && monitor.canDrop()),
    connectDropTarget: connector.dropTarget(),
  };
}

const dropTarget = {
  canDrop: (props, monitor) => {
    const { path, depth, item_position } = props;
    if (path[depth] == null) {
      // target not defined
      console.log('no target', path, depth);
      return false;
    }
    const item = monitor.getItem();
    for (let i = 0; i < path.length; i++) {
      if (path[i].id === item.path[0].id) {
        // item equals target or is super of target
        return false;
      }
    }
    return true;
  },
  drop: (props, monitor, component) => {
    if (monitor.didDrop() || !monitor.canDrop()) {
      return;
    }

    const { user, path, depth, item_position, dispatch } = props; // target props
    const target_clientRect = findDOMNode(component).getBoundingClientRect();

    const item = monitor.getItem();

    const read = Object.assign({}, item.path[0], {
      properties: Object.assign({}, item.path[0].properties, {
        super_read_id: path[depth].id,
        position: item_position,
      }),
    });

    let prev_super_read;
    let super_read;

    const change_super_read = (item.path[1].id !== path[depth].id);

    if (change_super_read) {
      prev_super_read = filterSubRead(item.path[1], item.path[0]);
      super_read = Object.assign({}, path[depth]);      
    }

    if (depth === 0) { // if target == super
      if (read.properties.position === Positions.DOCK) {
        if (change_super_read) {
          read.properties.x = 0;
          read.properties.y = 0;
        }
      }
      else if (read.properties.position === Positions.DRIFT) {
        const item_clientOffset = monitor.getSourceClientOffset();

        read.properties.x = Math.max(item_clientOffset.x - target_clientRect.left, 0);
        read.properties.y = Math.max(item_clientOffset.y - target_clientRect.top, 0);  
      }

      if (change_super_read) {
        super_read.properties.sub_read_ids.unshift(item.path[0].id);
      }
    }
    else if (depth === 1) {
      const target_clientMiddleY = target_clientRect.top + (target_clientRect.bottom - target_clientRect.top) / 2;
      const cursor_clientOffset = monitor.getClientOffset();

      const insert_before_target = (cursor_clientOffset.y < target_clientMiddleY);

      if (read.properties.position === Positions.DOCK) {
        if (change_super_read) {
          read.properties.x = 0;
          read.properties.y = 0;
        }
      }
      else if (read.properties.position === Positions.DRIFT) {
        read.properties.x = path[0].properties.x;
        read.properties.y = insert_before_target
          ? Math.max(path[0].properties.y - item.clientRect.height - 2, 0)
          : path[0].properties.y + target_clientRect.height + 2; //TODO make sure within bounds
      }

      if (change_super_read) {
        super_read = insertSubRead(super_read, read, path[0], insert_before_target);
      }
    }

    dispatch(moveNote(item.user, item.note, read, super_read, prev_super_read));
  },
};

function filterSubRead(read, sub_read) {
  // return a copy of read w/ sub_read.id removed from read.sub_read_ids
  return Object.assign({}, read, {
    properties: Object.assign({}, read.properties, {
      sub_read_ids: read.properties.sub_read_ids.filter(sub_read_id => sub_read_id !== sub_read.id),
    }),
  })
}

function insertSubRead(read, insert_sub_read, target_sub_read, insert_before_target) {
  const target_index = read.properties.sub_read_ids.indexOf(target_sub_read.id);
  const insert_index = insert_before_target ? target_index : target_index + 1;
  // return a copy of read w/ insert_sub_read.id inserted before/after target_sub_read
  const read2 = Object.assign({}, read);
  read2.properties.sub_read_ids.splice(insert_index, 0, insert_sub_read.id);
  return read2;
}

export const ReadDropContainer = flow(
  DropTarget(DragTypes.READ, dropTarget, getDropTargetProps),
  connect(),
)(ReadDrop);