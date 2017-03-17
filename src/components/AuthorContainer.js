import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { ReadContainer } from './ReadContainer';

class Author extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user, current_path } = this.props;
    
    // NoteBody for container
    // NoteNucleus? or AuthorNucleus for text, authentication
    // SubReads for children Notes
    return (
      <div id='author' style={{border: '1px solid lavender'}}>
        <ReadContainer note={user} />
      </div>
    );

  }
}

Author.propTypes = {
  user: PropTypes.object.isRequired,
  current_path: PropTypes.arrayOf(PropTypes.object).isRequired,
  //
}

export const AuthorContainer = connect()(Author);