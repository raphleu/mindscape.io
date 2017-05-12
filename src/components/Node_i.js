import React, { PropTypes } from 'react';
import { PresSelect_o } from './PresSelect_o';
import { NodeEdit_o } from './NodeEdit_o';

import { connect } from 'react-redux';

class Node extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { 
      path_press,
      select_press,
      user,
      node,
    } = this.props;

    const pres = path_press[path_press.length - 1];
    
    const selected = (pres.properties.id === select_press[select_press.length - 1].properties.id);

    return (
      <div id={'Node-'+node.properties.id} className='Node' style={{
        border: '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        minWidth: 200,
      }}>
        <PresSelect_o path_press={path_press}>
          <div className='content' style={{
            position: 'relative',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
          }}>
            <div className='index' style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              color: selected ? 'darkturquoise' : 'lavender',
              margin: 2,
              marginLeft: 4,
            }}>
              { pres.properties.out_index }
            </div>
            <div className='value' style={{
              display: 'inline-block',
              margin: 2,
              border: node.properties.commit_v ? 'none' : '1px solid darkorchid',
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4,
              padding: 2,
              backgroundColor: 'white',
              whiteSpace: 'nowrap',
            }}>
              <NodeEdit_o
                user={user}
                node={node}
                selected={selected}
              />
            </div>
          </div>
        </PresSelect_o>
      </div>
    );
  }

}

Node.propTypes = {
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.object,
  node: PropTypes.object,
};

export const Node_i = connect((state, ownProps) => {
  const { auth_user, node_by_id } = state;
  const { path_press } = ownProps;

  const pres = path_press[path_press.length - 1];

  return {
    user: node_by_id[auth_user.uid],
    node: node_by_id[pres.properties.end_id],
  }
})(Node);