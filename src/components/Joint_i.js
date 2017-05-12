import React from 'react';
import { PropTypes } from 'prop-types';
import { Node_i } from './Node_i';
import { Pres } from './Pres';
import { NodeInit_o } from './NodeInit_o';

import { connect } from 'react-redux';

import { LinkTypes } from '../types';
import { sortByOutIndex } from '../utils';

//import * as force from 'd3-force';

class Joint extends React.Component { //JointPress
  constructor(props) {
    super(props);
    // this.force = d3.force
    // draw axes
  }

  render() {
    const { user, select_press, path_press, out_defs, out_press, } = this.props;

    const pres = path_press[path_press.length - 1];

    const child_press = [];
    const child_press2 = [];
    out_press.forEach(out_pres => {
      if (
        out_pres.properties.user_id === user.properties.id &&
        (out_pres.properties.hide_v == null || out_pres.properties.hide_v.length === 0)
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
      <div className='Joint' style={{
        width: (path_press.length === 1) ? '100%' : 'auto', // TODO maximize
        position: 'relative',
        border: '1px solid azure',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        padding: 2,
        paddingLeft: 6,
        width: pres.properties.list ? 'auto' : pres.properties.radius || 2400,
        height: pres.properties.list ? 'auto' : pres.properties.radius || 2400,
        resize: 'both',
      }}>
        <div style={{marginLeft: -6, marginTop: -2}}>
          { this.props.children }
        </div>
        <NodeInit_o
          parent_path_press={path_press}
          parent_out_defs={out_defs}
          parent_out_press={out_press}
        />
        {
          child_press.map(child_pres => {
            const child_path_press = [...path_press, child_pres];
            return (
              <Pres
                key={'Pres-'+child_pres.properties.id}
                path_press={child_path_press}
                peer_press={child_press}
                select_press={select_press}
              />
            );
          })
        }
        <div style={{clear: 'both'}} />
      </div>
    );
  }
}

Joint.propTypes = {
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  // state
  user: PropTypes.object,
  out_defs: PropTypes.arrayOf(PropTypes.object), // set new pre out_index, when create new child
  in_press: PropTypes.arrayOf(PropTypes.object),
  in_defs: PropTypes.arrayOf(PropTypes.object), // set new def in_index, when create new child 
  out_press: PropTypes.arrayOf(PropTypes.object),
  //
  dispatch: PropTypes.func.isRequired,
  //arrow_ids: PropTypes.arrayOf(PropTypes.number),
}


export const Joint_i = connect((state, ownProps) => {
  const { auth_user, node_by_id, link_by_id, link_by_id_by_start_id, link_by_id_by_end_id } = state;
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
    user: node_by_id[auth_user.uid],
    out_defs, 
    in_press,
    in_defs, 
    out_press,
  };
})(Joint);