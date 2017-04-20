import React, { PropTypes } from 'react';
import { NodeSelector_Out } from './NodeSelector_Out';
import { NodeEditor_Out } from './NodeEditor_Out';

import { connect } from 'react-redux';

class Node extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { getVect, user, path_press, node, select_press } = this.props;

    const pres = path_press[path_press.length - 1];

    const selected = (pres.properties.select_vect[0] === path_press[0].properties.select_vect[0]);
    const exact_selected = (pres.properties.id === select_press[select_press.length - 1].properties.id);

    return (
      <div id={'node-'+node.properties.id} className='node' style={{
        border: '1px solid lavender',
        borderTopRightRadius: 4,
        borderBottomLeftRadius: 4,
        minWidth: 200,
      }}>
        <NodeSelector_Out getVect={getVect} path_press={path_press}>
          <div className='node-content content' style={{
            position: 'relative',
            borderTopRightRadius: 4,
            borderBottomLeftRadius: 4,
          }}>
            <div className='index' style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              color: exact_selected ? 'darkturquoise' : 'lavender',
              margin: 2,
              marginLeft: 4,
            }}>
              { pres.properties.out_index }
            </div>
            <div className='value' style={{
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
                (node.properties.user_id != user.properties.id || node.properties.commit_vect.length !== 0)
                  ? node.properties.string
                  : (
                    <NodeEditor_Out
                      getVect={getVect}
                      node={node}
                      exact_selected={exact_selected}
                    />
                  )
              }
            </div>
          </div>
        </NodeSelector_Out>
      </div>
    );
  }

}

Node.propTypes = {
  getVect: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  select_press: PropTypes.arrayOf(PropTypes.object).isRequired,
  node: PropTypes.object,
};

export const Node_In = connect((state, ownProps) => {
  const { node_by_id } = state;
  const { path_press } = ownProps;

  const pres = path_press[path_press.length - 1];

  return {
    node: node_by_id[pres.properties.end_id],
  }
})(Node);