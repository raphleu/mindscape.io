import React, { PropTypes } from 'react';
import { connect } from 'react-redux'; 

import { LinkTypes } from '../types';

import { deleteNote, commitNote } from '../actions';

class NoteControls extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deleting: false,
      //recursive_delete_next_notes: false,
      //reccursive_delete_next_pres: false, // out_pres
      bridge_pres: false,
      //recursive_delete_spec_notes: false,
      //recursive_delete_spec_defs: false, // in_defs
      bridge_defs: false,
      committing: false,
    };

    this.startDelete = this.startDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.finishDelete = this.finishDelete.bind(this);

    this.startCommit = this.startCommit.bind(this);
    this.cancelCommit = this.cancelCommit.bind(this);
    this.finishCommit = this.finishCommit.bind(this);

    this.addLink = this.addLink.bind(this);
  }

  addLink(event) {
    // set state to adding link mode (cursor into attack mode)
    // click node for out_link from current (right click for in_link to current)

    // maybe no button, just right click for out_def from current!

    const { user, note, dispatch } = this.props;
  }
  startDelete() {
    this.setState({deleting: true});
  }
  cancelDelete() {
    this.setState({deleting: false});
  }
  finishDelete() {
    const {
      user,
      note,
      extant_user_in_defs,
      extant_user_out_defs, 
      extant_user_in_pres,
      extant_user_out_pres,
      dispatch,
    } = this.props;

    this.setState({deleting: false});

    const { bridge_defs, bridge_pres } = this.state;

    const defs_bridge = {
      in: bridge_defs ? extant_user_in_defs : [],
      out: bridge_defs ? extant_user_out_defs : [],
    };

    const pres_bridge = {
      in: bridge_pres ? extant_user_in_pres : [],
      out: bridge_pres ? extant_user_out_pres : [],
    };

    dispatch(deleteNote({user, note, defs_bridge, pres_bridge}));
  }

  startCommit() {
    this.setState({committing: true});
  }
  cancelCommit() {
    this.setState({committing: false});
  }
  finishCommit() {
    const { user, note, dispatch } = this.props;

    this.setState({committing: false});

    dispatch(commitNote({user, note}));
  }

  render() {
    //console.log('render Note', this.props)
    const { user, note } = this.props;

    const style = {
      button: {
        display: 'inline-block',
        margin: 2,
        border: '1px solid darkgrey',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        cursor: 'pointer',
        color: 'darkgrey',
      },
      button_content: {
        border: '1px solid azure',
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 2,
        padding: 2,
        backgroundColor: 'white',
      },
    };
    style.commit_button = Object.assign({}, style.button, {
      borderColor: 'darkorchid',
      color: 'darkorchid',
    });

    return (
      <div className='controls' style={{
        display:'inline-block',
        verticalAlign: 'middle',
        minWidth: 200,
      }}>
        {
          deleting
            ? (
              <div className='delete'>
                <div>
                  are you sure you want to delete?
                  if out_pres
                    /* delete -r
                      delete next notes recursively?
                      delete next links recursively? */
                    bridge
                      delete in_pre, delete out_pres, create (prev note)-[pre]->(next note)?
                      bridge other users' links?
                  if in_defs
                    /* delete -r
                      delete spec notes recursively?
                      delete spec links recursively? */
                    bridge
                      delete out_defs, delete in_defs, create (spec note)-[def]->(abst note)?
                      bridge other users' links?
                </div>
                <div className='cancel-delete' onClick={this.cancelDelete} style={style.button}>
                  cancel delete
                </div>
                <div className='finish-delete' onClick={this.finishDelete} style={style.button}>
                  finish deleted
                </div>
              </div>
            )
            : (
              <div className='start-delete' onClick={this.startDelete} style={style.button} >
                <div style={style.button_content}>
                  delete
                </div>
              </div>
            )
        }
        {
          note.properties.commit_t
            ? null
            : committing
                ? (
                  <div className='commit'>
                    <div>
                      are you sure you want to commit?
                    </div>
                    <div className='cancel-commit' onClick={this.cancelCommit} style={style.button}>
                      cancel commit
                    </div>
                    <div className='finish-commit' onClick={this.finishCommit} style={style.button}>
                      finish commit
                    </div>
                  </div>
                )
                : (
                  <div className='start-commit' onClick={this.startCommit} style={style.commit_button}>
                    <div style={style.button_content}>
                      commit
                    </div>
                  </div>
                )
        }
      </div>
    );
  }
}

NoteControls.propTypes = {
  user: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  //
  extant_user_in_defs: PropTypes.arrayOf(PropTypes.object), // extant, i.e. link.properties.deleted_t == null
  extant_user_out_defs: PropTypes.arrayOf(PropTypes.object),
  extant_user_in_pres: PropTypes.arrayOf(PropTypes.object),
  extant_user_out_pres: PropTypes.arrayOf(PropTypes.object),
  dispatch: PropTypes.func,
};

export const NoteControlsContainer = connect((state, ownProps) => {
  const { link_by_id, link_by_id_by_start_id, link_by_id_by_end_id } = state;
  const { user, note } = ownProps;

  const extant_user_in_defs = [];
  const extant_user_in_pres = [];
  Object.keys(link_by_id_by_end_id[ note.properties.id ]).forEach(link_id => {
    const link = link_by_id[link_id];
    if (
      link.properties.author_id === user.properties.id &&
      link.properties.delete_t == null
    ) {
      if (link.type === LinkTypes.DEFINE) {
        extant_user_in_defs.push(link);
      }
      else if (link.type === LinkTypes.PRESENT) {
        extant_user_in_pres.push(link);
      }
    }
  });

  const extant_user_out_defs = [];
  const extant_user_out_pres = [];
    Object.keys(link_by_id_by_start_id[ note.properties.id ]).forEach(link_id => {
    const link = link_by_id[link_id];
    if (
      link.properties.author_id === user.properties.id &&
      link.properties.delete_t == null
    ) {
      if (link.type === LinkTypes.DEFINE) {
        extant_user_out_defs.push(link);
      }
      else if (link.type === LinkTypes.PRESENT) {
        extant_user_out_pres.push(link);
      }
    }
  });

  return {
    extant_user_in_defs,
    extant_user_out_defs,
    extant_user_in_pres,
    extant_user_out_pres,
  };
})(NoteControls);

