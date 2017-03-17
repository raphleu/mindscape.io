
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Relationships, Displays, Directions, Positions, DragTypes } from '../types';

import { stageNote } from '../actions';

//import * as force from 'd3-force';

import { ReadDropTargetContainer } from './ReadDropTargetContainer';
import { ReadContainer } from './ReadContainer';
//import { ArrowContainer } from './ArrowContainer';

export class SubReads extends React.Component { //SubReadsContainer
  constructor(props) {
    super(props);

    this.handlePrimerClick = this.handlePrimerClick.bind(this);
    // this.force = d3.force
    // draw axes
  }

  handlePrimerClick(event) {
    event.stopPropagation();
    const { user, note, path, dispatch } = this.props;
    dispatch(stageNote(user, note, path[0]));
  }

  render() {
    const { path, sub_reads } = this.props;

    const is_sequence = (path[0].properties.display === Displays.SEQUENCE);
    const is_plane = (path[0].properties.display === Displays.PLANE);

    if (!is_sequence && !is_plane) {
      console.error('invalid display type');
      return null;
    }

    let ordered_sub_reads;
    if (is_sequence) {
      ordered_sub_reads = sub_reads;
    }
    else {
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

      ordered_sub_reads = [...dock_sub_reads, ...drift_sub_reads];
    }

    const radius = is_sequence ? 'auto' : path[0].properties.radius;

    // <div className='background' style={{
    //   position: 'absolute',
    //   left: 0,
    //   top: 0,
    //   width: '100%',
    //   height: '100%',
    //   backgroundColor: 'floralwhite',
    //   opacity: .08,
    //   cursor: 'default',
    // }}/>
    const content = (
      <div className='subreads-content' style={{
        width: radius,
        height: radius,
        resize: 'both',
      }}>
        <div className='primer' onClick={this.handlePrimerClick} style={{
          display: 'inline-block',
          //verticalAlign: 'middle',
          float: 'left',
          margin: 2,
          border: '1px solid lavender',
          borderTopRightRadius: 4,
          borderBottomLeftRadius: 4,
          cursor: 'pointer',
        }}>
          <ReadDropTargetContainer path={path} depth={0} item_position={Positions.DOCK}>
            <div className='primer-content' style={{
              border: '1px solid azure',
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4,
              height: 12, //this.props.isOver ? 200 : 0,
              width: 80,
              backgroundColor: 'white',
            }}/>
          </ReadDropTargetContainer>
        </div>
        {
          ordered_sub_reads.map(sub_read => {
            const sub_path = [sub_read, ...path];
            return <ReadContainer key={'read-'+sub_read.id} path={sub_path} />;
          })
        }
        <div style={{clear: 'both'}} />
      </div>
    );

    const content2 = is_sequence ? content : ( // enable drop as child
      <ReadDropTargetContainer path={path} depth={0} item_position={Positions.DRIFT}>
        { content }
      </ReadDropTargetContainer>
    );
   
    return (
      <div className='subreads' style={{
        position: 'relative',
        //backgroundColor:'white',
        margin: 2,
        //marginTop: 0,
        paddingLeft: 6,
        border: is_sequence ? 'none' : '1px solid lavender',
        borderBottomLeftRadius: 2,
        borderTopRightRadius: 2,
      }}>
        { content2 }
      </div>
    );
  }
}

SubReads.propTypes = {
  user: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  sub_reads: PropTypes.arrayOf(PropTypes.object).isRequired,
  dispatch: PropTypes.func.isRequired,
  //arrow_ids: PropTypes.arrayOf(PropTypes.number),
}

export const SubReadsContainer = connect()(SubReads);

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