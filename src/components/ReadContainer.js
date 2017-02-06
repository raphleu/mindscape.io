import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Displays, Directions, Positions, DragTypes } from '../types';

import { setCurrentReadId } from '../actions';

import { getSuperReads } from '../util';
import { flow } from 'lodash';
//import * as force from 'd3-force';

import { findDOMNode } from 'react-dom'

import { DragSource } from 'react-dnd';

import { ReadDropContainer } from './ReadDropContainer';
import { Note } from './Note';
import { SubReadsContainer } from './SubReadsContainer';

class Read extends React.Component { //Read
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.stopPropagation();
    const { path, user, setCurrentReadId } = this.props;

    setCurrentReadId(user.id, path[0].id);
  }

  render() {
    //console.log('render Read', this.props);
    const {
      path,
      note,
      user,
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
      },
      view_liner: {
        border: '2px solid azure',
        borderTopRightRadius: 2,
        borderBottomLeftRadius:2,
      },
      header: {
        position: 'relative',
        cursor: 'pointer',
      },
      point: {
        position: 'absolute',
        left: -4,
        top: -4,
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

    const index = (path[1] && ((path[1].properties.sub_read_ids || []).indexOf(path[0].id) + 1)) || 0; 

    const content = (
      <div style={style.view_liner}>
        {connectDragSource(
          <div style={style.header}>
            <div style={style.point} />
            <div style={style.index}>
              {index}
            </div>
            <Note path={path} note={note} />
          </div>
        )}
        <SubReadsContainer path={path} />
      </div>
    );

    let view;
    if (path[1] == null) { //if frame read
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
      <div id={'read-'+path[0].id} style={style.main} onClick={this.handleClick}>
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
  // dispatch
  setCurrentReadId: PropTypes.func,
  // drag n drop
  is_drag: PropTypes.bool,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func,
}

function getStateProps(state, ownProps) {
  const { path } = ownProps;

  const note = state.node_by_id[path[0].start];
  const user = state.node_by_id[path[0].end];

  return {
    path,
    note,
    user,
  };
}

function getDispatchProps(dispatch, ownProps) {
  // don't need to position children!
  return {
    setCurrentReadId: (user_id, read_id) => {
      dispatch(setCurrentReadId(user_id, read_id));
    }
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
    const { path } = props;
    const clientRect = findDOMNode(component).getBoundingClientRect();

    const item = {
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
  connect(getStateProps, getDispatchProps),
)(Read);
