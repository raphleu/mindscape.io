import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Displays, Positions, DragTypes } from '../types';

import { setState } from '../actions';

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

function getDispatchProps(dispatch) {
  return {
    setState: (params) => {
      dispatch(setState(params));
    },
  };
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

    const { path, depth, item_position, setState } = props; // target props
    const target_clientRect = findDOMNode(component).getBoundingClientRect();

    const item = monitor.getItem();

    const reads = []; // collect reads to modify

    let insert_after_target;

    let item_super_read2;
    // remove item from prev item_super_read
    const item_super_read1 = filterSubRead(item.path[1], item.path[0]);

    if (item.path[1].id === path[depth].id) {
      item_super_read2 = item_super_read1;
    }
    else {
      reads.push(item_super_read1);

      item_super_read2 = Object.assign({}, path[depth]);
    }

    // add item to next item_super_read
    if (depth === 0) {
      // if we set target as parent, then push item onto end of list
      item_super_read2.properties.sub_read_ids.push(item.path[0].id);
    }
    else if (depth === 1) {
      // if we set target as peer, then insert item before/after target based on click location
      const target_clientMiddleY = target_clientRect.top + (target_clientRect.bottom - target_clientRect.top) / 2;
      const cursor_clientOffset = monitor.getClientOffset();

      insert_after_target = (cursor_clientOffset.y > target_clientMiddleY);

      item_super_read2 = insertSubRead(item_super_read2, item.path[0], path[0], insert_after_target);
    }

    reads.push(item_super_read2);


    let item_read_props;
    if (item_position === Positions.DOCK) { // if moving item to dock
      if (item.path[1].id !== path[depth].id) { // if item to new super_read
        // initialize coords at origin
        item_read_props = {
          x: 0,
          y: 0,
        };
      }
    }
    else if (item_position === Positions.DRIFT) {
      if (depth === 0) { // if target as super_read
        const item_clientOffset = monitor.getSourceClientOffset();
        item_read_props = {
          x: Math.max(item_clientOffset.x - target_clientRect.left, 0),
          y: Math.max(item_clientOffset.y - target_clientRect.top, 0),
        }; 
      }
      else if (depth === 1) {
        if (insert_after_target) {
          item_read_props = {
            x: path[0].properties.x, 
            y: path[0].properties.y + target_clientRect.height + 2,
          };       
        }
        else {
          item_read_props = {
            x: path[0].properties.x, 
            y: Math.max(path[0].properties.y - item.clientRect.height - 2, 0),
          }; 
        }
      }
    }
    const item_read = Object.assign({}, item.path[0], {
      properties: Object.assign({}, item.path[0].properties, item_read_props, {
        super_read_id: path[depth].id,
        position: item_position,
      }),
    });
    reads.push(item_read);

    console.log('reads', reads);

    setState({
      reads
    });
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

function insertSubRead(read, insert_sub_read, target_sub_read, insert_after_target) {
  const target_index = read.properties.sub_read_ids.indexOf(target_sub_read.id);
  const insert_index = insert_after_target ? target_index + 1 : target_index;
  // return a copy of read w/ insert_sub_read.id inserted before/after target_sub_read
  const read2 = Object.assign({}, read);
  read2.properties.sub_read_ids.splice(insert_index, 0, insert_sub_read.id);
  return read2;
}

export const ReadDropContainer = flow(
  DropTarget(DragTypes.READ, dropTarget, getDropTargetProps),
  connect(null, getDispatchProps),
)(ReadDrop);