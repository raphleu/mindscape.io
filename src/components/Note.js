import { PropTypes } from 'prop-types';

import React from 'react';
import { Node_In } from './Node_In';
import { NotePress_In } from './NotePress_In';

import { findDOMNote } from 'react-dom';
import { DragSource } from 'react-dnd';
import { connect } from 'react-redux';

import { DragTypes } from '../types';

import { flow } from 'lodash';

function Note1(props) {
  //console.log('Note', props);
  const {
    getVect,
    user,
    path_press,
    // peer_press,
    select_press,
    dragged,
    connectDragSource,
    connectDragPreview,
  } = props;

  const pres = path_press[path_press.length - 1]; // node_pres

  const selected = (pres.properties.select_v[0] === path_press[0].properties.select_v[0]); // selection updates select_v of entire path
  const exact_selected = (pres.properties.id === select_press[select_press.length - 1].properties.id);

  const listed = (
    path_press.length === 1 ||
    path_press[path_press.length - 2].properties.list ||
    pres.properties.enlist
  );

  return connectDragPreview(
    <div id={'note-' + pres.properties.end_id} className='note' style={{
        zIndex: exact_selected ? 100 : 'auto',
        display: 'block',
        float: 'left',
        clear: 'both',
        position: listed ? 'static' : 'absolute',
        left: pres.properties.v[1],
        top: pres.properties.v[2],
        margin: 2,
        opacity: dragged ? 0.5 : 1,
    }}>
      <div className='note-content' style={{
        position: 'relative',
        border: exact_selected
          ? '1px solid darkturquoise' 
          : selected ? '1px solid steelblue' : '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        width: (path_press.length === 1) ? '100%' : 'auto', // TODO maximize
      }}>
        {
          (path_press.length === 1)
            ? null 
            : connectDragSource(
              <div className='point' style={{
                zIndex: 5,
                position: 'absolute',
                left: -4,
                top: -4,
                width: 6,
                height: 6,
                backgroundColor: listed ? 'white' : 'lightyellow',
                border: exact_selected
                  ? '1px solid darkturquoise' 
                  : listed ? '1px solid lavender' : '1px solid gold',
                borderRadius: 2,
                cursor: '-webkit-grab',
              }}/>
            )
        }
        <Node_In
          getVect={getVect}
          user={user}
          path_press={path_press}
          select_press={select_press}
        />
        {
          pres.properties.open
            ? (
              <NotePress_In
                getVect={getVect}
                user={user}
                path_press={path_press}
                select_press={select_press}
              />
            )
            : null 
        }
      </div>
    </div>
  );
}

Note1.propTypes = {
  getVect: PropTypes.func,
  user: PropTypes.object.isRequired,
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  peer_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  // drag n drop
  dragged: PropTypes.bool,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
}


export const Note = DragSource(
  DragTypes.Note,
  {
    canDrag: (props, monitor) => {
      const { path_press } = props;

      return (path_press.length > 1); // cant drag root
    },
    beginDrag: (props, monitor, component) => {
      const { user, path_press, peer_press } = props;

      const item = {
        user,
        path_press,
        peer_press,
        clientRect: findDOMNote(component).getBoundingClientRect(),
      };  
      console.log('beginDrag', item);
      return item;
    },
    isDragging: (props, monitor) => {
      const { path_press } = props;
      const item = monitor.getItem();

      return (path_press[path_press.length - 1].properties.id === item.path_press[item.path_press.length - 1].properties.id);
    },
  }, 
  (connector, monitor) => {
    return {
      dragged: monitor.isDragging(),
      connectDragSource: connector.dragSource(),
      connectDragPreview: connector.dragPreview(),
    };
  }
)(Note1);
