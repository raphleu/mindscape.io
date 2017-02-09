
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Relationships, Displays, Directions, Positions, DragTypes } from '../types';

import { addNote } from '../actions';

//import * as force from 'd3-force';
import { flow, merge } from 'lodash';

import { findDOMNode } from 'react-dom'

import { DropTarget } from 'react-dnd';

import { ReadDropContainer } from './ReadDropContainer';
import { ReadContainer } from './ReadContainer';
//import { ArrowContainer } from './ArrowContainer';

export class SubReads extends React.Component { //SubReadsContainer
  constructor(props) {
    super(props);

    // this.force = d3.force
    // draw axes
  }

  render() {
    //console.log('render SubReadsContainer', this.props);
    const { sub_reads, path, handlePrimerClick } = this.props;

    let portal_radius;
    let radius;
    if (path[0].properties.display === Displays.SEQUENCE) {
      portal_radius = 'auto';
      radius = 'auto';
    }
    else if (path[0].properties.display === Displays.PLANE) {
      portal_radius = path[0].properties.portal_radius;
      radius = path[0].properties.radius;
    }

    const style = {
      main: {
        display: 'block',
        backgroundColor:'white',
        margin: 2,
        marginTop: 0,
      },
      primer: {
        display: 'inline-block',
        float: 'left',
        margin: 2,
        border: '1px solid lavender',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
      },
      primer_liner: {
        border: '1px solid azure',
        borderTopRightRadius:2,
        borderBottomLeftRadius: 2,
        height: 16, //this.props.isOver ? 200 : 0,
        width: 100,
        backgroundColor: 'white',
        cursor: 'pointer',
      },
      plane_portal: {
        border: '1px solid lavender',
        borderBottomLeftRadius: 2,
        borderTopRightRadius: 2,
        //width: radius,
        //height: radius,
        //overflow: 'scroll',
      },
      plane: {
        display: 'inline-block',
        position: 'relative',
        border: '1px solid azure',
        width: radius,
        height: radius,
        resize: 'both',
        //backgroundColor: 'azure',
      },
    };

    const primer = (
      <ReadDropContainer key={'primer-'+path[0].id} path={path} depth={0} item_position={Positions.DOCK} style={style.primer}>
        <div style={style.primer_liner} onClick={handlePrimerClick} />
      </ReadDropContainer>
    );

    function getReads(sub_reads, path) {
      return sub_reads.map(sub_read => {
        if (sub_read) { 
          const sub_path = [sub_read, ...path];
          return (
            <ReadContainer key={'read-'+sub_path[0].id} path={sub_path} />
          );
        }
        console.error('undef sub_read', path);
        return null;
      });
    }

    let body;
    if (path[0].properties.display === Displays.SEQUENCE) {
      body = (
        <div>
          {primer}
          {
            getReads(sub_reads, path)
          }
          <div style={{clear:'both'}} />
        </div>
      );
    }
    else if (path[0].properties.display === Displays.PLANE) {
      const dock_sub_reads = [];
      const drift_sub_reads = [];

      sub_reads.forEach(sub_read => {
        if (sub_read.properties.position === Positions.DOCK) {
          dock_sub_reads.push(sub_read);
        }
        else if (sub_read.properties.position === Positions.DRIFT) {
          drift_sub_reads.unshift(sub_read);
        }
      });

      body = (
        <ReadDropContainer path={path} depth={0} item_position={Positions.DRIFT} style={style.plane_portal}>
          <div style={style.plane}>
            {primer}
            {
              getReads([...dock_sub_reads, ...drift_sub_reads], path)
            }
          </div>
        </ReadDropContainer>
      ) 
    }

    // TODO get arrows in there
    return (
      <div className='sub-reads' style={style.main}>
        {body}
      </div>
    );
  }
}

SubReads.propTypes = {
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  sub_reads: PropTypes.arrayOf(PropTypes.object),
  //arrow_ids: PropTypes.arrayOf(PropTypes.number),
}

/*
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
}*/