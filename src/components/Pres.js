import { PropTypes } from 'prop-types';

import React from 'react';
import { Node_i } from './Node_i';
import { Joint_i } from './Joint_i';

import { findDOMNode } from 'react-dom';
import { DragSource } from 'react-dnd';
import { connect } from 'react-redux';

import { DragTypes } from '../types';

import { flow } from 'lodash';

function Pres1(props) {
  const {
    path_press,
    select_press,
    //
    dragged,
    connectDragSource,
    connectDragPreview,
  } = props;

  const pres = path_press[path_press.length - 1]; // node_pres

  const selected = (pres.properties.id === select_press[select_press.length - 1].properties.id);

  const listed = (
    path_press.length === 1 ||
    path_press[path_press.length - 2].properties.list ||
    pres.properties.enlist
  );

  return connectDragPreview(
    <div id={'Pres-' + pres.properties.id} className='Pres' style={{
        zIndex: selected ? 100 : 'auto',
        display: 'block',
        float: 'left',
        clear: 'both',
        position: listed ? 'static' : 'absolute',
        left: pres.properties.v[1],
        top: pres.properties.v[2],
        margin: 2,
        border: selected
          ? '1px solid darkturquoise' 
          : '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        opacity: dragged ? 0.5 : 1,
    }}>
      <Joint_i
        path_press={path_press}
        select_press={select_press}
      >
        {
          connectDragSource(
            <div className='point' style={{
              display: (path_press.length === 1) ? 'none' : 'block', 
              zIndex: 5,
              position: 'absolute',
              left: -5,
              top: -5,
              width: 8,
              height: 8,
              backgroundColor: listed ? 'white' : 'lightyellow',
              border: selected
                ? '1px solid darkturquoise' 
                : listed ? '1px solid lavender' : '1px solid gold',
              borderRadius: 2,
              cursor: '-webkit-grab',
            }}/>
          )
        }
        <Node_i
          path_press={path_press}
          select_press={select_press}
        />
      </Joint_i>
    </div>
  );
}

Pres1.propTypes = {
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  peer_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  // drag n drop
  dragged: PropTypes.bool,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
}


export const Pres = DragSource(
  DragTypes.Pres,
  {
    canDrag: (props, monitor) => {
      const { path_press } = props;

      return (path_press.length > 1); // cant drag root
    },
    beginDrag: (props, monitor, component) => {
      const { path_press, peer_press } = props;

      const item = {
        path_press,
        peer_press,
        clientRect: findDOMNode(component).getBoundingClientRect(),
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
)(Pres1);
