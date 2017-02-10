import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { Displays, Positions } from '../types';

class Current extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user, path, note, write, reads, links } = this.props;

    if (user == null) {
      return null;
    }

    const style = {
      main: {
        display: 'block',
        margin: 2,
        marginTop: 0,
        backgroundColor: 'white',
      },
    };

    const position = (path[1] == null || path[1].properties.display === Displays.SEQUENCE)
      ? Positions.DOCK
      : path[0].properties.position;

    return (
      <div className='current' style={style.main}>
        CURRENT
        <div>
          note_id: {note.id}
        </div>
        <div>
          author_id: {write && write.start}
        </div>
        <div>
          path: {path.map(read => read.id).join(' < ')}
        </div>
        <div>
          position: {position}
        </div>
        <div>
          display: {path[0].properties.display}
        </div>
        <div>
          read_count: {reads.length}
        </div>
        <div>
          links: [{links.map(link => link.id).join(', ')}]
        </div>
      </div>
    );
  }
}

Current.propTypes = {
  user: PropTypes.object,
  path: PropTypes.arrayOf(PropTypes.object),
  note: PropTypes.object,
  write: PropTypes.object,
  reads: PropTypes.arrayOf(PropTypes.object),
  links: PropTypes.arrayOf(PropTypes.object),
};

function getStateProps(state) {
  const user = state.node_by_id[state.user_ids[0]];
  if (user == null) {
    return {};
  }

  const current_read = state.relationship_by_id[user.current_read_id];
  if (current_read == null) {
    return {};
  }

  const path = (function getPath(path, read) {
    if (read == null) {
      return path;
    }
    const super_read = state.relationship_by_id[read.properties.super_read_id];
    return getPath([...path, read], super_read);
  })([], current_read);

  const note = state.node_by_id[current_read.start];
  const write = state.relationship_by_id[note.write_id];
  const reads = note.read_ids.map(read_id => state.relationship_by_id[read_id]);
  const links = note.link_ids.map(link_id => state.relationship_by_id[link_id]);

  return {
    user,
    path,
    note,
    write,
    reads,
    links,
  };
}
function getDispatchProps(dispatch) {
  return {

  };
}

export const CurrentContainer = connect(getStateProps, getDispatchProps)(Current);