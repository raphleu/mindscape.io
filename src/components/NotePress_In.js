import React from 'react';
import { NodeInitor_Out } from './NodeInitor_Out';
import { Note } from './Note';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';

import { LinkTypes } from '../types';
import { sortByOutIndex } from '../utils';

//import * as force from 'd3-force';

class NotePress extends React.Component { //NotePressPress
  constructor(props) {
    super(props);
    // this.force = d3.force
    // draw axes
  }

  render() {
    const { getVect, user, path_press, out_press, in_defs, select_press } = this.props;

    const pres = path_press[path_press.length - 1];

    const child_press = [];
    const child_press2 = [];
    out_press.forEach(out_pres => {
      if (
        out_pres.properties.user_id === user.properties.id &&
        out_pres.properties.hide_v.length === 0
      ) {
        if (pres.properties.list || out_pres.properties.enlist) {
          child_press.push(out_pres);
        }
        else {
          child_press2.push(out_pres); // render absolutely positioned child notes on top, higher index on top
        }
      }
    });
    child_press.sort(sortByOutIndex).reverse(); // stack that
    child_press2.sort(sortByOutIndex); // stack these too (greater out_index on top z-index (not really) wise)
    child_press.push.apply(child_press2);

    return (
      <div className='notePress' style={{
        position: 'relative',
        //backgroundColor:'white',
        margin: 2,
        //marginTop: 0,
        paddingLeft: 6,
        border: '1px solid lavender',
        borderBottomLeftRadius: 2,
        borderTopRightRadius: 2,
      }}>
        <div className='notePress-content content' style={{
          width: pres.properties.list ? 'auto' : pres.properties.radius || 2400,
          height: pres.properties.list ? 'auto' : pres.properties.radius || 2400,
          resize: 'both',
        }}>
          <NodeInitor_Out
            getVect={getVect}
            user={user}
            path_press={path_press}
            out_press={out_press}
            in_defs={in_defs}
          />
          {
            child_press.map(child_pres => {
              const child_path_press = [...path_press, child_pres];
              return (
                <Note
                  key={'note-'+child_pres.properties.end_id}
                  getVect={getVect}
                  user={user}
                  path_press={child_path_press}
                  peer_press={child_press}
                  select_press={select_press}
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

NotePress.propTypes = {
  getVect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  // state
  out_defs: PropTypes.arrayOf(PropTypes.object), // set new pre out_index, when create new child
  in_press: PropTypes.arrayOf(PropTypes.object),
  in_defs: PropTypes.arrayOf(PropTypes.object), // set new def in_index, when create new child 
  out_press: PropTypes.arrayOf(PropTypes.object),
  //
  dispatch: PropTypes.func.isRequired,
  //arrow_ids: PropTypes.arrayOf(PropTypes.number),
}


export const NotePress_In = connect((state, ownProps) => {
  const { link_by_id, link_by_id_by_start_id, link_by_id_by_end_id } = state;
  const { path_press } = ownProps;

  const pres = path_press[path_press.length - 1];

  const in_defs = [];
  const in_press = [];
  Object.keys(link_by_id_by_end_id[ pres.properties.end_id ] || {}).forEach(link_id => {
    const link = link_by_id[link_id];
    if (link.type === LinkTypes.DEFINE) {
      in_defs.push(link);
    }
    else if (link.type === LinkTypes.PRESENT) {
      in_press.push(link);
    }
  });

  const out_defs = [];
  const out_press = [];
  Object.keys(link_by_id_by_start_id[ pres.properties.end_id ] || {}).forEach(link_id => {
    const link = link_by_id[link_id];
    if (link.type === LinkTypes.DEFINE) {
      out_defs.push(link);
    }
    else if (link.type === LinkTypes.PRESENT) {
      out_press.push(link);
    }
  });

  return {
    out_defs, 
    in_press,
    in_defs, 
    out_press,
  };
})(NotePress);