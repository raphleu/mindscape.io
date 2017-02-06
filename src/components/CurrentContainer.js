import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class Current extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { current_reads, path_by_id } = this.props;

    const style = {
      main: {
        display: 'block',
        margin: 2,
        marginTop: 0,
        padding: 4,
        backgroundColor: 'white',
      },
    };

    const current_components = current_reads.map(current_read => {

    })
    return (
      <div className='current' style={style.main}>

      </div>
    );

  }
}

Current.propTypes = {
  current_reads: PropTypes.arrayOf(PropTypes.object),
  path_by_id: PropTypes.object,
  note_by_id: PropTypes.object,
  write_by_id: PropTypes.object,
  reads_by_id: PropTypes.object,
  links_by_id: PropTypes.object,
}

function getStateProps(state) {
  const current_reads = state.current_read_ids.map(current_read_id => state.relationship_by_id[current_read_id]);

  const path_by_id = {};
  const note_by_id = {};
  const write_by_id = {};
  const reads_by_id = {};
  const links_by_id = {};

  const getPath = (path, read) => {
    if (read == null) {
      return path;
    }
    return getPath([...path, read], state.relationship_by_id[read.properties.super_read_id]);
  }

  current_reads.forEach(current_read => {
    path_by_id[current_read.id] = getPath([], current_read);

    const note = state.node_by_id[current_read.start];
    note_by_id[current_read.id] = note;

    write_by_id[current_read.id] = state.relationship_by_id[note.write_id];
    reads_by_id[current_read.id] = note.read_ids.map(read_id => state.relationship_by_id[read_id]);
    links_by_id[current_read.id] = note.link_ids.map(link_id => state.relationship_by_id[link_id]); 
  });

  return {
    current_reads,
    path_by_id,
    note_by_id,
    write_by_id,
    reads_by_id,
    links_by_id,
  };
}
function getDispatchProps(dispatch) {
  return {

  };
}

export const CurrentContainer = connect(getStateProps, getDispatchProps)(Current);