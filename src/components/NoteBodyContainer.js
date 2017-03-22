import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { LinkTypes, NotePositions, NoteDisplays, NoteBodies } from '../types';

import { createNote } from '../actions';

//import * as force from 'd3-force';

import { NoteDropTargetContainer } from './NoteDropTargetContainer';
import { NoteContainer } from './NoteContainer';
//import { ArrowContainer } from './ArrowContainer';

export class NoteBody extends React.Component { //NoteBodyContainer
  constructor(props) {
    super(props);

    this.createChildNote = this.createChildNote.bind(this);
    // this.force = d3.force
    // draw axes
  }

  createChildNote(event) {
    event.stopPropagation();
    const { user, path, out_user_pres, dispatch } = this.props;
    //dispatch(createNote({user, }));
  }

  render() {
    const { user, main_path, path, out_user_pres } = this.props;

    const { body, radius } = path[path.length - 1].properties;

    let pres = out_user_pres;
    if (body === NoteBodies.PLANE) { // re order pres so that absolute positioned Notes are stacked with lower index on top
      pres = [];
      const absolute_pres = [];
      out_user_pres.forEach(pre => {
        if (pre.properties.position === NotePositions.STATIC) {
          pres.push(pre); // maintain ordering
        }
        else {
          absolute_pres.unshift(pre);
        }
      });
      pres.push.apply(absolute_pres);
    }

    return (
      <div className='notebody' style={{
        position: 'relative',
        //backgroundColor:'white',
        margin: 2,
        //marginTop: 0,
        paddingLeft: 6,
        border: is_sequence ? 'none' : '1px solid lavender',
        borderBottomLeftRadius: 2,
        borderTopRightRadius: 2,
      }}>
        <div className='notebody-content' style={{
          width: (body === NoteBodies.LIST) ? 'auto' : path[0].properties.radius || 800,
          height: (body === NoteBodies.LIST) ? 'auto' : path[0].properties.radius || 800,
          resize: 'both',
        }}>
          <div className='primer' onClick={this.createChildNote} style={{
            display: 'inline-block',
            //verticalAlign: 'middle',
            float: 'left',
            margin: 2,
            border: '1px solid lavender',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            cursor: 'pointer',
          }}>
            <div className='primer-content' style={{
              border: '1px solid azure',
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4,
              height: 12, //this.props.isOver ? 200 : 0,
              width: 80,
              backgroundColor: 'white',
            }}/>
          </div>
          {
            pres.map(pre => {
              const child_path = [...path, pre];
              return (
                <NoteContainer
                  key={'note-'+pre.properties.end_id}
                  user={user}
                  main_path={main_path}
                  path={child_path}
                  peer_user_pres={pres}
                />
              );
            })
          }
          <div style={{clear: 'both'}} />
        </div>
      </div>
    );
  }
}

NoteBody.propTypes = {
  user: PropTypes.object.isRequired,
  main_path: PropTypes.arrayOf(PropTypes.object).isRequired,
  path: PropTypes.arrayOf(PropTypes.object).isRequired,
  in_user_defs: PropTypes.arrayOf(PropTypes.object).isRequired,
  out_user_pres: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleted_out_user_pres: PropTypes.arrayOf(PropTypes.object),
  //
  dispatch: PropTypes.func.isRequired,
  //arrow_ids: PropTypes.arrayOf(PropTypes.number),
}

export const NoteBodyContainer = connect()(NoteBody);