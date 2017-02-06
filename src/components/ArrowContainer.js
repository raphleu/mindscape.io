import React, { PropTypes } from 'react';
import { connect } from 'react-redux'; 

import { PositionModes, DisplayModes } from '../types';

export class Arrow extends React.Component<IArrowProps, IArrowState> { //Arrow!
  constructor(props) {
    super(props);
  }
  getMarker(relationship) {
    return 'url(#'+relationship.type+')';
  }
  getPoints(source, target) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dr = Math.sqrt(dx*dx + dy*dy);
    const spacing = 12;
    const numPoints = Math.floor(dr / spacing);

    let pts = '';
    if (numPoints > 0) {
      const step_dx = dx / numPoints;
      const step_dy = dy / numPoints;

      for (let i = 0; i < numPoints + 1; i++) {
        pts += (source.x + i*step_dx) + ',' + (source.y + i*step_dy) + ' ';
      }
    }
    return pts;
  }
             /*<svg className='space-svg' width={radius} height={radius}>
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
          </svg>*/
  render() {
    return null;
    const {relationship, source, source_read, target, target_read } = this.props;

    const points = this.getPoints(source_read.properties, target_read.properties);
    const marker = this.getMarker(relationship);

    return (
      <polyline
        className='arrow'
        points={points}
        markerMid={marker}
        stroke='none'
        strokeWidth={2}
      />
    );
  }
}
function mapStateToProps(state, ownProps) {
  const { arrow_id  } = ownProps;
  const relationship = state.relationship_by_id[arrow_id];

  const source = state.node_by_id[relationship.start];
  const source_read = state.relationship_by_id[source.read_id];

  let x = source_read.properties.x;
  let y = source_read.properties.y;
  let source_super_read_id = source_read.properties.super_read_id;

  function getAbsolutePosition(x, y, read_id) {
    const read = state.relationship_by_id[read_id];
    if (read.properties.super_read_id) {
      // check for minimized/collapsed/expanded/maximized!
      if (read.properties.position_mode === PositionModes.SEQUENCE) {

      }
      return getAbsolutePosition(x + read.properties.x, y + read.properties.y, read.properties.super_read_id);
    }
    return {
      x, 
      y,
    };
  }

  const target = state.node_by_id[relationship.end];
  const target_read = state.relationship_by_id[target.read_id];

  // TODO trace the read path up, aggregating position

  return {
    relationship,
    source,
    source_read,
    target,
    target_read,
  };
}
function mapDispatchToProps(dispatch) {
  return {

  };
}
export const ArrowContainer = connect(mapStateToProps, mapDispatchToProps)(Arrow);