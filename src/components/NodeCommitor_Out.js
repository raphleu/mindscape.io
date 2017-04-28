import React from 'react';

import  { PropTypes } from 'prop-types';

import { connect } from 'react-redux'; 
import { nodeCommit } from '../actions';

class NodeCommitor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      committing: false,
    };

    this.startCommit = this.startCommit.bind(this);
    this.cancelCommit = this.cancelCommit.bind(this);
    this.dispatchCommit = this.dispatchCommit.bind(this);
  }

  startCommit() {
    this.setState({
      committing: true
    });
  }

  cancelCommit() {
    this.setState({
      committing: false
    });
  }

  dispatchCommit() {
    const { getVect, node, dispatch } = this.props;

    dispatch(nodeCommit({
      vect: getVect(),
      node
    }));

    this.setState({
      committing: false
    });

  }

  render() {
    const { node } = this.props;
    const { committing } = this.state;

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
      <div className='commit' style={{
        display:'inline-block',
        verticalAlign: 'middle',
        minWidth: 200,
      }}>
        {
          node.properties.commit_v.length !== 0
            ? 'committed!'
            : committing
                ? (
                  <div className='committing'>
                    <div>
                      are you sure you want to commit?
                    </div>
                    <div className='cancel-commit button' onClick={this.cancelCommit} style={style.button}>
                      <div className='content' style={style.button_content}>
                      cancel
                      </div>
                    </div>
                    <div className='dispatch-commit button' onClick={this.dispatchCommit} style={style.button}>
                      <div className='content' style={style.button_content}>
                        commit!
                      </div>
                    </div>
                  </div>
                )
                : (
                  <div className='start-commit' onClick={this.startCommit} style={style.button}>
                    <div className='content' style={style.button_content}>
                      commit
                    </div>
                  </div>
                )
        }
      </div>
    );
  }
}

NodeCommitor.propTypes = {
  getVect: PropTypes.func.isRequired,
  node: PropTypes.object.isRequired,
  //
  dispatch: PropTypes.func,
};

export const NodeCommitor_Out = connect()(NodeCommitor)