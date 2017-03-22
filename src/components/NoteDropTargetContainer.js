import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { NodeLabels, LinkTypes, NotePositions, NoteDisplays } from '../types';

import { moveNote } from '../actions';

import { flow, now } from 'lodash';

import { DropTarget } from 'react-dnd';

import { findDOMNode } from 'react-dom'


function NoteDropTarget(props) {
  const {is_over, connectDropTarget, children} = props;
  return connectDropTarget(
    <div className='note-drop-target' style={{
      border: is_over ? '2px solid darkturquoise' : 'none',
    }}>
      {children}
    </div>
  );
}

NoteDropTarget.propTypes = {
  path: PropTypes.arrayOf(PropTypes.object), // path has all super_reads; readout would have all sub_reads
  depth: PropTypes.number,
  position: PropTypes.string,
  // state 
  dispatch: PropTypes.func,
  // drag n drop
  is_over: PropTypes.bool,
  connectDropTarget: PropTypes.func,
};

const dropTarget = {
  canDrop: (props, monitor) => {
    const { path, depth, item_position } = props;
    const item = monitor.getItem();
    for (let i = 0; i < path.length; i++) {
      if (item.note.properties.id === path[i].properties.end_id) {
        return false; // item contains/is target
      }
    }
    return true;
  },
  drop: (props, monitor, component) => {
    if (monitor.didDrop() || !monitor.canDrop()) {
      return;
    }
    console.log('drop', props)

    const { user, path, depth, position, dispatch } = props; // target props
    const target_clientRect = findDOMNode(component).getBoundingClientRect();

    const cursor_clientOffset = monitor.getClientOffset();
    const item = monitor.getItem();
    const item_clientOffset = monitor.getSourceClientOffset();

    // mark prev read as deleted_t, deleted_x, etc
    // mark next read as created_t, etc
    // next read might be an old/deleted read
    // get from drop target? or from item?
    // let item hold deleted super_reads!


    // create another DropTarget type for inserting in list?

    const target_read = path[path.length - 1 - depth];
    const item_read = item.path[item.path.length - 1];

    if (target_read.properties.end_id === item_read.properties.start_id) {
      // item is already sub_read of target
      let modify_read = Object.assign({}, item_read, {
        properties: Object.assign({}, item_read.properties, {
          position,
        }),
      });

      if (position === NotePositions.ABSOLUTE) {
        modify_read.properties.x = Math.max(item_clientOffset.x - target_clientRect.left, 0);
        modify_read.properties.y = Math.max(item_clientOffset.y - target_clientRect.top, 0);
      }
      else { // (position === NotePositions.STATIC)
        if (depth === 1) {
          // adjust index... shit.
        }
        // else preserve original xy coordinates
      }

      dispatch(moveNote({modify_read}));
    }
    else {
      let delete_read = item_read;

      let create_read = {
        type: LinkTypes.READ,
        properties: {},
      };

      item.deleted_reads.some(deleted_item_read => {
        if (target_read.properties.end_id === deleted_item_read.properties.start_id) {
          // if read existed between these notes before, reuse that read
          create_read = deleted_item_read;
          return true;
        }
        return false;
      });

      if (position === NotePositions.ABSOLUTE) {

      }
      else { // (position === NotePostions.STATIC)
        create_read.properties.x = 0;
        create_read.properties.y = 0;
      }
      create_read = Object.assign({}, create_read, {
        properties: Object.assign({}, create_read.properties, {
          position,
          x: (position === NotePositions.STATIC)
            ? 0
            : (depth === 0)
              ? Math.max(item_clientOffset.x - target_clientRect.left, 0)
              : (depth === 1),
          y: (position === NotePositions.STATIC) ? 0 : Math.max(item_clientOffset.y - target_clientRect.top, 0)
        }),
      });

      dispatch() // delete, create (substitute) a relationship (delete_notes, delete_links, create_notes, create_links)
    }

    dispatch(moveNote({
      prev_read,
      next_read,
      same_read,
    }))

    let next_read;



    let prev_super_read;
    let super_read;

    if (depth === 0) { // if dropping item into target (taking target as super)
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
        prev_super_read = filterSubRead(item.path[1], item.path[0]);

        super_read = Object.assign({}, path[depth]);     
        super_read.properties.sub_read_ids.unshift(item.path[0].id);
      }
    }
    else if (depth === 1) { // if dropping item into target's super (taking target as neighbor)
      // insert before target, if drop in upper half
      // inser after target, if drop in lower half
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
        // TODO handle case where item originates from inside target (target will shrink, top of item will not be aligned)
      }

      if (change_super_read) {
        prev_super_read = filterSubRead(item.path[1], item.path[0]);

        super_read = Object.assign({}, path[depth]);      
        super_read = insertSubRead(super_read, read, path[0], insert_before_target);
      }
      else {
        super_read = filterSubRead(item.path[1], item.path[0]);
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

export const NoteDropTargetContainer = flow(
  connect(),
  DropTarget(NodeLabels.Note, dropTarget, (connector, monitor) => { 
    return {
      is_over: (monitor.isOver({shallow: true}) && monitor.canDrop()),
      connectDropTarget: connector.dropTarget(),
    };
  }),
)(NoteDropTarget);