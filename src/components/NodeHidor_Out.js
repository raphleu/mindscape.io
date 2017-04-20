import React from 'react';

import { PropTypes } from 'prop-types';

import { connect } from 'react-redux'; 
import { nodeHide } from '../actions';

class NodeHidor extends React.Component {
  constructor(props) {
    super(props);

    this.hide = this.hide.bind(this);
  }

  hide() {
    const { getVect, node, dispatch } = this.props;

    dispatch(nodeHide({
      vect: getVect(),
      node,
    }));
  }

  render() {
    const { node } = this.props;

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
      <div className='node-hidor' style={{
        display:'inline-block',
        verticalAlign: 'middle',
        minWidth: 200,
      }}>
        {
          node.properties.hide_vect.length === 0
            ? (
              <div className='hide button' onClick={this.hide} style={style.button}>
                <div className='content' style={style.button_content}>
                  hide
                </div>
              </div>
            )
            : (
              <div className='unhide button' onClick={this.hide} style={style.button}>
                <div className='content' style={style.button}>
                  unhide
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

NodeHidor.propTypes = {
  getVect: PropTypes.func.isRequired,
  node: PropTypes.object.isRequired,
  //
  dispatch: PropTypes.func,
};

export const NodeHidor_Out = connect()(NodeHidor)

