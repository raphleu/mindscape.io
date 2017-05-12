import React from 'react';
import  { PropTypes } from 'prop-types';
import { Vector } from './Vector';

import { connect } from 'react-redux'; 
import { nodeCommit } from '../actions';

class NodeCommit extends React.Component {
  constructor(props) {
    super(props);

    this.commit = this.commit.bind(this);
  }

  commit() {
    const { node, dispatch } = this.props;

    const confirmed = confirm('Commit? You cannot edit a Node once it is committed.')
    if (confirmed) {
      dispatch(nodeCommit(node));
    }
  }

  render() {
    const { user, node } = this.props;

    const committed = (node.properties.commit_v && node.properties.commit_v.length !== 0);
    const permitted = node.properties.user_id === user.properties.id;

    const style = {
      button: {
        display: 'inline-block',
        margin: 2,
        border: '1px solid darkgrey',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        borderColor: 'darkorchid',
        color: 'darkorchid',
      },
      button_content: {
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
      },
    };

    return (
      <div className='NodeCommit' style={{
        display:'inline-block',
        verticalAlign: 'middle',
        minWidth: 200,
      }}>
        {
          committed
            ? (
              <div>
                Committed
                <Vector vect={node.properties.commit_v} />
              </div>
            )
            : permitted
              ? (
                <button onClick={this.commit}>
                  <div>
                    Commit
                  </div>
                </button>
              )
              : (
                <div>
                  Uncommitted
                </div>
              )
        }
      </div>
    );
  }
}

NodeCommit.propTypes = {
  user: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
};

export const NodeCommit_o = connect()(NodeCommit)