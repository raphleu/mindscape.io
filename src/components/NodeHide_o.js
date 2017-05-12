import React from 'react';
import { PropTypes } from 'prop-types';
import { Vector } from './Vector';

import { connect } from 'react-redux'; 
import { nodeHide } from '../actions';

class NodeHide extends React.Component {
  constructor(props) {
    super(props);

    this.hide = this.hide.bind(this);
  }

  hide() {
    const { node, dispatch } = this.props;

    dispatch(nodeHide(node));
  }

  render() {
    const { user, node } = this.props;

    const hidden = (node.properties.hide_v && node.properties.hide_v.length !== 0);
    const permitted = node.properties.user_id === user.properties.id;

    const style = {
      button: {
        display: 'inline-block',
        margin: 2,
        border: '1px solid darkgrey',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        color: 'darkgrey',
      },
      button_content: {
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
      },
    };

    return (
      <div className='NodeHide' style={{
        display:'inline-block',
        verticalAlign: 'middle',
        minWidth: 200,
      }}>
        {
          permitted
            ? (
              <button onClick={this.hide}>
                <div>
                  {
                    hidden ? 'Unhide' : 'Hide'
                  }
                </div>
              </button>
            )
            : (
              <div className='item'>
                <div className='content' style={style.button}>
                  {
                    hidden
                      ? (
                        <div>
                          'Hidden'
                          <Vector vect={node.properties.hide_v} />
                        </div>
                      )
                      : (
                        <div>
                          Unhidden
                        </div>
                      )
                  }
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

NodeHide.propTypes = {
  user: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
};

export const NodeHide_o = connect()(NodeHide)

