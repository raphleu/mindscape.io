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
  var path_press = props.path_press,
      select_press = props.select_press,
      dragged = props.dragged,
      connectDragSource = props.connectDragSource,
      connectDragPreview = props.connectDragPreview;


  var pres = path_press[path_press.length - 1]; // node_pres

  var selected = pres.properties.id === select_press[select_press.length - 1].properties.id;

  var listed = path_press.length === 1 || path_press[path_press.length - 2].properties.list || pres.properties.enlist;

  return connectDragPreview(React.createElement(
    'div',
    { id: 'Pres-' + pres.properties.id, className: 'Pres', style: {
        zIndex: selected ? 100 : 'auto',
        display: 'block',
        float: 'left',
        clear: 'both',
        position: listed ? 'static' : 'absolute',
        left: pres.properties.v[1],
        top: pres.properties.v[2],
        margin: 2,
        border: selected ? '1px solid darkturquoise' : '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        opacity: dragged ? 0.5 : 1
      } },
    React.createElement(
      Joint_i,
      {
        path_press: path_press,
        select_press: select_press
      },
      connectDragSource(React.createElement('div', { className: 'point', style: {
          display: path_press.length === 1 ? 'none' : 'block',
          zIndex: 5,
          position: 'absolute',
          left: -5,
          top: -5,
          width: 8,
          height: 8,
          backgroundColor: listed ? 'white' : 'lightyellow',
          border: selected ? '1px solid darkturquoise' : listed ? '1px solid lavender' : '1px solid gold',
          borderRadius: 2,
          cursor: '-webkit-grab'
        } })),
      React.createElement(Node_i, {
        path_press: path_press,
        select_press: select_press
      })
    )
  ));
}

Pres1.propTypes = {
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  peer_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  // drag n drop
  dragged: PropTypes.bool,
  connectDragSource: PropTypes.func,
  connectDragPreview: PropTypes.func
};

export var Pres = DragSource(DragTypes.Pres, {
  canDrag: function canDrag(props, monitor) {
    var path_press = props.path_press;


    return path_press.length > 1; // cant drag root
  },
  beginDrag: function beginDrag(props, monitor, component) {
    var path_press = props.path_press,
        peer_press = props.peer_press;


    var item = {
      path_press: path_press,
      peer_press: peer_press,
      clientRect: findDOMNode(component).getBoundingClientRect()
    };
    console.log('beginDrag', item);
    return item;
  },
  isDragging: function isDragging(props, monitor) {
    var path_press = props.path_press;

    var item = monitor.getItem();

    return path_press[path_press.length - 1].properties.id === item.path_press[item.path_press.length - 1].properties.id;
  }
}, function (connector, monitor) {
  return {
    dragged: monitor.isDragging(),
    connectDragSource: connector.dragSource(),
    connectDragPreview: connector.dragPreview()
  };
})(Pres1);