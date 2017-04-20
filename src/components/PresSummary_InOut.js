import React from 'react';
import { NodeSelector_Out } from './NodeSelector_Out';
import { NodeSummary } from './NodeSummary';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { selectNode } from '../actions';

class PresSummary extends React.Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    console.log('click');
    event.stopPropagation();

    const { getVect, user, path_press, node, dispatch } = this.props;

    dispatch(selectPresSummary({
      getVect,
      user,
      path_press,
      node,
    }));
  };

  render() {
    const { getVect, user, path_press, node, def, partner_path_press, partner_node, } = this.props;

    const selected = false;

    const partner = (
      <NodeSelector_Out getVect={getVect} path_press={partner_path_press}>
        <NodeSummary user={user} node={partner_node} />
      </NodeSelector_Out>
    );

    return (
      <div id={'def-'+def.properties.id} className='def' onClick={this.handleClick} style={{
        border: '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        minWidth: 200,
      }}>
        <div className='def-content' style={{
          position: 'relative',
          border: '2px solid azure',
          borderTopRightRadius: 4,
          borderBottomLeftRadius: 4,
          backgroundColor: 'white',
        }}>
          {
            (def.properties.start_id === partner_node.properties.id)
              ? partner
              : null
          }
          <div className='in-index' style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            color: selected ? 'darkturquoise' : 'lavender',
            margin: 2,
            marginLeft: 4,
          }}>
            { def.properties.in_index }
          </div>
          <div className='def-details' style={{
            display: 'inline-block',
            margin: 2,
            border: node.properties.commit_vect ? 'none' : '1px solid darkorchid',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
            padding: 2,
            backgroundColor: 'white',
            whiteSpace: 'nowrap',
          }}>
            {
              init_vect.join(',') + '\n' + hide_vect.join(',') + '\n' + select_vect.join(',') + '\n' + edit_vect.join(',')
            }
          </div>
          <div className='out-index' style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            color: selected ? 'darkturquoise' : 'lavender',
            margin: 2,
            marginLeft: 4,
          }}>
            { def.properties.out_index }
          </div>
          {
            (def.properties.start_id === partner_node.properties.id)
              ? partner
              : null
          }
        </div>
      </div>
    );
  }

}

PresSummary.propTypes = {
  getVect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  node: PropTypes.object.isRequired,
  def: PropTypes.object.isRequired,
  partner_node: PropTypes.object,
  partner_path_press: PropTypes.arrayOf(PropTypes.object),
};

export const PresSummary_InOut = connect((state, ownProps) => {
  const { user_id, node_by_id, link_by_id, link_by_id_by_end_id } = state;
  const { node, def } = ownProps;

  let partner_node;
  if (def.properties.start_id === node.properties.id) {
    partner_node = node_by_id[def.properties.end_id];
  }
  else {
    partner_node = node_by_id[def.properties.start_id];
  }

  const partner_path_press = [];
  let partner_path_node_id = node.properties.id;
  while (partner_path_node_id !== user_id) {
    Object.keys(link_by_id_by_end_id[partner_path_node_id]).some(link_id => {
      const link = link_by_id[link_id];

      if (
        link.properties.user_id === user_id &&
        link.properties.hide_vect.length === 0 && // not hidden/deleted
        link.type === LinkTypes.PRESENT
      ) {
        partner_path_press.push(link);
        partner_path_node_id =  link.properties.start_id;
        return true;
      }
      return false;
    });
  }

  return {
    partner_node,
    partner_path_press,
  };
})(PresSummary);