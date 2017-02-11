import React, { PropTypes } from 'react';
import { Displays, Positions, DragTypes } from '../types';

import { DragLayer } from 'react-dnd';


class Layer extends React.Component { // aka AddNote
  constructor(props) {
    super(props);
  }
  
  render() {
    const { is_dragging, children } = this.props;

    const style = {
      zIndex: 100,
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      pointer: is_dragging ? '-webkit-grabbing' : 'auto',
      pointerEvents: 'none',
    };

    return (
      <div className='read-drag-layer' style={style}>
        {children}
      </div>
    );
  } 
}

Layer.propTypes = {
  is_dragging: PropTypes.bool,
}

function getDragLayerProps(monitor) {
  return {
    is_dragging: monitor.isDragging(),
  };
}
export const ReadDragLayer = DragLayer(getDragLayerProps)(Layer);