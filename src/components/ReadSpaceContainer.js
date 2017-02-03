
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { setReads } from '../actions';

import { PositionModes, DisplayModes, DragTypes } from '../types';

//import * as force from 'd3-force';
import { flow, merge } from 'lodash';

import { findDOMNode } from 'react-dom'

import { DropTarget } from 'react-dnd';

import { ReadDropTargetContainer } from './ReadDropTargetContainer';

import { ReadContainer } from './ReadContainer';
import { ArrowContainer } from './ArrowContainer';
import { DropSlot } from './DropSlot';


class ReadSpace extends React.Component { //ReadSpaceContainer
  constructor(props) {
    super(props);

    // this.force = d3.force
    // draw axes
  }

  render() {
    console.log('render ReadSpaceContainer', this.props);
    const { reading, arrow_ids, connectDropTarget, setReads } = this.props;

    let radius = (reading[0].properties.display_mode === DisplayModes.PLANE)
      ? reading[0].properties.plane_radius
      : 'auto';

    const style = {
      plane: {
        position: 'relative',
        display: 'block',
        width: radius,
        height: radius,
        backgroundColor:'white',
        padding: 2,
      },
    };

    let svg;
    if (reading[0].properties.display_mode === DisplayModes.PLANE) {
      const arrows = arrow_ids.map(link_id => (
        <ArrowContainer
          key={'link-'+link_id}
          arrow_id={link_id}
        />
      ));

      svg = (
        <svg className='space-svg' width={radius} height={radius}>
          <defs>
            <marker id='DEFINE'>
              <polyline points='0,0 3,3 0,6' stroke='steelblue' fill='none'/>
            </marker>
            <marker id='PRESENT'>
              <polyline points='0,0 3,3 0,6' stroke='darkturquoise' fill='none'/>
            </marker>
            <marker id='EQUATE'>
              <polyline points='0,0 0,6' stroke='darckorchid' fill='none'/>
            </marker>
          </defs>
          {arrows}
        </svg>
      );
    }
    else {
      svg = null;
    }

    const surface_sub_reads = (reading[0].properties.sub_read_ids || []).map(read_id => (
      <ReadContainer
        key={'read-'+read_id}
        read_id={read_id}
      />
    ));

    // TODO get arrows in there
    return (
      <div className='space' style={style.plane}>
        <ReadDropTargetContainer reading={reading} position_mode={PositionModes.SCATTERPLOT}>
          <DropSlot reading={reading} />
          {surface_sub_reads} 
        </ReadDropTargetContainer>
      </div>
    );
  }
}

ReadSpace.propTypes = {
  // own
  reading: PropTypes.arrayOf(PropTypes.object).isRequired,
  // state
  arrow_ids: PropTypes.arrayOf(PropTypes.number),
}

function getStateProps(state, ownProps) {
  const { reading } = ownProps;

  const arrow_ids = []; // links between sub_note pairs, where both sub_notes are read 
  const registered = {}; 

  const sub_read_ids = [...(reading[0].properties.sub_read_ids || [])];

  while(sub_read_ids.length > 0) {
    const sub_read_id = sub_read_ids.shift();

    const sub_read = state.relationship_by_id[sub_read_id];
    const sub_note = state.node_by_id[sub_read.start];

    // get arrows, i.e. links where both end-notes are in the space
    sub_note.link_ids.forEach(link_id => {
      if (registered[link_id]) {
        arrow_ids.push(link_id);
      }
      else {
        registered[link_id] = true;
      }
    });

    // push the read_notes that are nested within this read_note (the sub_read_notes)
    [].push.apply(sub_read_ids, sub_read.properties.sub_read_ids);
  }

  return {
    reading,
    arrow_ids,
  };
}

function getDispatchProps(dispatch, ownProps) {

}

export const ReadSpaceContainer = connect(getStateProps)(ReadSpace);
