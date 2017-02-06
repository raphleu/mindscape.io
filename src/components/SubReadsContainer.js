
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { setReads } from '../actions';

import { Displays, Positions, DragTypes } from '../types';

//import * as force from 'd3-force';
import { flow, merge } from 'lodash';

import { findDOMNode } from 'react-dom'

import { DropTarget } from 'react-dnd';

import { ReadDropContainer } from './ReadDropContainer';

import { ReadContainer } from './ReadContainer';
import { ArrowContainer } from './ArrowContainer';


class SubReads extends React.Component { //SubReadsContainer
  constructor(props) {
    super(props);

    // this.force = d3.force
    // draw axes
  }

  render() {
    //console.log('render SubReadsContainer', this.props);
    const { path, sub_reads } = this.props;

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
      body: {
        border: '1px solid lavender',
        borderBottomLeftRadius: 2,
        borderTopRightRadius: 2,
        width: portal_radius,
        height: portal_radius,
        overflow: 'scroll',
        resize: 'both',
      },
      docker: {
        display: 'inline-block',
        float: 'left',
        margin: 2,
        border: '1px solid lavender',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
      },
      docker_liner: {
        border: '1px solid azure',
        borderTopRightRadius:2,
        borderBottomLeftRadius: 2,
        height: 16, //this.props.isOver ? 200 : 0,
        width: 100,
      },
      plane: {
        display: 'inline-block',
        position: 'relative',
        border: '1px solid azure',
        width: radius,
        height: radius,
        //backgroundColor: 'azure',
      },
    };

    const sequence = sub_reads.map(sub_read => {
      const sub_path = [sub_read, ...path];
      return (
        <ReadContainer key={'read-'+sub_path[0].id} path={sub_path} />
      );
    });

    const docker = (
      <ReadDropContainer key={'docker-'+path[0].id} path={path} depth={0} item_position={Positions.DOCK} style={style.docker}>
        <div style={style.docker_liner}></div>
      </ReadDropContainer>
    );

    let body;
    if (path[0].properties.display === Displays.SEQUENCE) {
      if (sub_reads.length === 0) {
        sequence.push(docker);
      }
      body = (
        //<div style={style.body}>
          sequence
        //</div>
      );
    }
    else if (path[0].properties.display === Displays.PLANE) {
      if (sub_reads.filter(sub_read => (sub_read.properties.position === Positions.DOCK)).length === 0) {
        sequence.push(docker);
      }
      body = (
        <ReadDropContainer path={path} depth={0} item_position={Positions.DRIFT} style={style.body}>
          <div style={style.plane}>
            {sequence}
          </div>
        </ReadDropContainer>
      );
    }

    // TODO get arrows in there
    return (
      <div className='set' style={style.main}>
        {body}
        <div style={{clear: 'both'}} />
      </div>
    );
  }
}

SubReads.propTypes = {
  // own
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  // state
  sub_reads: PropTypes.arrayOf(PropTypes.object),
  //arrow_ids: PropTypes.arrayOf(PropTypes.number),
}

function getStateProps(state, ownProps) {
  const { path } = ownProps;

  const sub_reads = path[0].properties.sub_read_ids.map(sub_read_id => state.relationship_by_id[sub_read_id]);


  //const arrow_ids = []; // links between sub_note pairs, where both sub_notes are read 
  //const registered = {}; 


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

  return {
    path,
    sub_reads,
    //arrow_ids,
  };
}

function getDispatchProps(dispatch, ownProps) {

}

export const SubReadsContainer = connect(getStateProps)(SubReads);
