import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { NodeLabels, NotePositions, NoteDisplays, NoteBodies } from '../types';

import { flow } from 'lodash';

import { findDOMNode } from 'react-dom'

import { DragSource } from 'react-dnd';

import { NoteHeadContainer } from './NoteHeadContainer';
import { NoteBodyContainer } from './NoteBodyContainer';

function Note(props) {
  const {
    user,
    main_path,
    path,
    //
    note,
    peer_user_pres,
    in_user_defs,
    out_user_pres,
    deleted_out_user_pres,
    //
    is_dragging,
    connectDragSource,
    connectDragPreview,
  } = props;

  const { frame, current, position, x, y, display } = path[path.length - 1].properties;

  const effective_position = (frame || path[path.length - 2].properties.display === NoteDisplays.LIST)
    ? NotePositions.STATIC
    : position;

  return connectDragPreview(
    <div id={'note-' + note.properties.id} className='note' style={{
        zIndex: current ? 100 : 'auto',
        display: 'block',
        float: 'left',
        clear: 'both',
        position: effective_position,
        left: x,
        top: y,
        margin: 2,
        opacity: is_dragging ? 0.5 : 1,
    }}>
      <div className='note-content' style={{
        position: 'relative',
        border: (current === 1)
          ? '1px solid darkturquoise' 
          : (note.properties.id === note.properties.author_id)
            ? '1px solid darkorchid'
            : current ? '1px solid steelblue' : '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        width: frame ? '100%' : 'auto',
      }}>
        {
          frame
            ? null 
            : connectDragSource(
              <div className='point' style={{
                zIndex: 5,
                position: 'absolute',
                left: -6,
                top: -6,
                width: 6,
                height: 6,
                backgroundColor: (effective_position === NotePositions.STATIC) ? 'white' : 'lightyellow',
                border: current
                  ? (current === 1) ? '1px solid darkturquoise' : '1px solid steelblue'
                  : (effective_position === NotePositions.STATIC) ? '1px solid lavender' : '1px solid gold',
                borderRadius: 2,
                cursor: '-webkit-grab',
              }}/>
            )
        }
        {
          (frame || display === NoteDisplays.HEAD || display === NoteDisplays.BODY)
            ? <NoteHeadContainer user={user} path={path} note={note} />
            : null
        }
        {
          (frame || display === NoteDisplays.BODY)
            ? <NoteBodyContainer
                user={user}
                main_path={main_path}
                path={path}
                note={note}
                in_user_defs={in_user_defs}
                out_user_pres={out_user_pres}
                deleted_out_user_pres={deleted_out_user_pres}
              />
            : null 
        }
      </div>
    </div>
  );
}

Note.propTypes = {
  user: PropTypes.object.isRequired,
  main_path: PropTypes.arrayOf(PropTypes.object).isRequired,
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  peer_user_pres: PropTypes.arrayOf(PropTypes.object).isRequired, // set peer pres out_indexes, when move Note to new parent
  // state
  note: PropTypes.object,
  in_user_def: PropTypes.arrayOf(PropTypes.object), // set new def in_index, when create new child 
  deleted_in_user_def: PropTypes.arrayOf(PropTypes.object),
  out_user_pres: PropTypes.arrayOf(PropTypes.object), // set new pre out_index, when create new child
  deleted_out_user_pres: PropTypes.arrayOf(PropTypes.object),
  dispatch: PropTypes.func,
  // drag n drop
  is_dragging: PropTypes.bool,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
}

function sortByInIndex(a, b) {
  if (a.properties.in_index < b.properties.in_index) {
    return -1;
  }
  if (a.properties.in_index > b.properties.in_index) {
    return 1;
  }
  return 0;
}

function sortByOutIndex(a, b) {
  if (a.properties.out_index < b.properties.out_index) {
    return -1;
  }
  if (a.properties.out_index > b.properties.out_index) {
    return 1;
  }
  return 0;
}

export const NoteContainer = flow(
  connect((state, ownProps) => {
    const { note_by_id, link_by_id, link_by_id_by_start_id, link_by_id_by_end_id } = state;
    const { user, path } = ownProps;

    const note = note_by_id[ path[path.length - 1].properties.end_id ];

    const in_user_defs = [];
    const deleted_in_user_defs = [];
    Object.keys(link_by_id_by_end_id[ note.properties.id ]).forEach(link_id => {
      const in_link = link_by_id[link_id];
      if (
        in_link.properties.author_id === user.properties.id &&
        in_link.type === LinkTypes.DEFINE
      ) {
        if (in_link.properties.delete_t) {
          deleted_in_user_defs.push(in_link);
        }
        else {
          in_user_defs.push(in_link);
        }
      }
    });

    const out_user_pres = [];
    const deleted_out_user_pres = [];
    Object.keys(link_by_id_by_start_id[ note.properties.id ]).forEach(link_id => {
      const out_link = link_by_id[link_id];
      if (
        out_link.properties.author_id === user.properties.id &&
        out_link.type === LinkTypes.PRESENT
      ) {
        if (out_link.properties.delete_t) {
          deleted_out_user_pres.push(out_link);
        }
        else {
          out_user_defs.push(out_link);
        }
      }
    });

    return {
      note,
      in_user_defs: in_user_defs.sort(sortByInIndex),
      deleted_in_user_defs: deleted_in_user_defs.sort(sortByInIndex),
      out_user_pres: out_user_pres.sort(sortByOutIndex),
      deleted_out_user_pres: deleted_out_user_pres.sort(sortByOutIndex),
    };
  }),
  DragSource(
    NodeLabels.Note,
    {
      canDrag: (props, monitor) => {
        const { path } = props;
        return (!path[path.length - 1].properties.frame);
      },
      beginDrag: (props, monitor, component) => {
        const { user, path, note, peer_user_pres } = props;
        const item = {
          user,
          path,
          note,
          peer_user_pres,
          clientRect: findDOMNode(component).getBoundingClientRect(),
        };  
        console.log('beginDrag', item);
        return item;
      },
      isDragging: (props, monitor) => {
        const { note } = props;
        const item = monitor.getItem();
        return (note.properties.id === item.note.properties.id);
      },
    }, 
    (connector, monitor) => {
      return {
        is_dragging: monitor.isDragging(),
        connectDragSource: connector.dragSource(),
        connectDragPreview: connector.dragPreview(),
      };
    }
  ),
)(Note);
