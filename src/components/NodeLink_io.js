import React from 'react';
import { DefSummary_InOut } from './DefSummary_InOut';
import { PresSummary_InOut } from './PresSummary_InOut';
import { NodeSummary } from './NodeSummary';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux'; 
import { setModeDef, setModePres } from '../actions';

import { LinkTypes } from '../types';
import { sortByInIndex, sortByOutIndex } from '../utils';

class NodeLink extends React.Component {
  constructor(props) {
    super(props);

    //this.hide = this.hide.bind(this);
    //this.unhide = this.unhide.bind(this);
  }

  render() {
    //console.log('render Note', this.props)
    const { user, path_press, out_defs, in_press, node, out_press, in_defs } = this.props;

    return (
      <div className='NodeLink' style={{
        display:'inline-block',
        verticalAlign: 'middle',
        minWidth: 200,
      }}>
        <div className='out-defs linklist'>
        {
          out_defs.forEach(link => (
            <DefSummary_InOut key={'define-'+link.properties.id} user={user} path_press={path_press} node={node} def={link} />
          ))
        }
        </div>
        ---
        <div className='in-press linklist'>
        {
          in_press.forEach(link => (
            <PresSummary_InOut key={'present-'+link.properties.id} user={user} path_press={path_press} node={node} pres={link} />
          ))
        }
        </div>
        <NodeSummary user={user} node={node} />
        <div className='out-press linklist'>
        {
          out_press.forEach(link => (
            <PresSummary_InOut key={'present-'+link.properties.id} user={user} path_press={path_press} node={node} pres={link} />
          ))
        }
        </div>
        ---
        <div className='in-defs linklist'>
        {
          in_defs.forEach(link => (
            <DefSummary_InOut key={'define-'+link.properties.id} user={user} path_press={path_press} node={node} def={link} />
          ))
        }
        </div>
      </div>
    );
  }
}

NodeLink.propTypes = {
  user: PropTypes.object.isRequired,
  //
  out_defs: PropTypes.arrayOf(PropTypes.object), // set new pre out_index, when create new child
  in_press: PropTypes.arrayOf(PropTypes.object),
  node: PropTypes.object.isRequired,
  in_defs: PropTypes.arrayOf(PropTypes.object), // set new def in_index, when create new child 
  out_press: PropTypes.arrayOf(PropTypes.object),
  //
  dispatch: PropTypes.func,
};

export const NodeLink_io = connect((state, ownProps) => {
  const { link_by_id, link_by_id_by_start_id, link_by_id_by_end_id } = state;
  const { node } = ownProps;

  const in_defs = [];
  const in_press = [];
  Object.keys(link_by_id_by_end_id[ node.properties.id ] || {}).forEach(link_id => {
    const link = link_by_id[link_id];
    if (link.type === LinkTypes.DEFINE) {
      in_defs.push(link);
    }
    else if (link.type === LinkTypes.PRESENT) {
      in_press.push(link);
    }
  });
  in_defs.sort(sortByInIndex);
  in_press.sort(sortByInIndex);

  const out_defs = [];
  const out_press = [];
  Object.keys(link_by_id_by_start_id[ node.properties.id ] || {}).forEach(link_id => {
    const link = link_by_id[link_id];
    if (link.type === LinkTypes.DEFINE) {
      out_defs.push(link);
    }
    else if (link.type === LinkTypes.PRESENT) {
      out_press.push(link);
    }
  });
  out_defs.sort(sortByOutIndex);
  out_press.sort(sortByOutIndex);

  return {
    out_defs, 
    in_press,
    in_defs, 
    out_press,
  };
})(NodeLink)

