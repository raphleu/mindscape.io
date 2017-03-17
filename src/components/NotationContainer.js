import React, { PropTypes } from 'react';

import { AuthorContainer } from './AuthorContainer';
import { CurrentContainer } from './CurrentContainer';

function Notation(props) {
  const {user, current_path} = props;
  // sync up header and notation to use the same positioning strategy
  return (
    <div id='notation' style={{
      display: 'block',
      whiteSpace: 'nowrap',
    }}>
      <div id='dashboard' style={{
        zIndex: 8,
        display: 'inline-block',
        verticalAlign: 'top',
        position: 'fixed',
        margin: 2,
        border: '1px solid steelblue',
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4,
      }}>
        <div id='dashboard-content' style={{
          position: 'relative',
          border: '1px solid azure',
          borderTopLeftRadius: 4,
          borderBottomRightRadius: 4,
          padding: 4,
          width: 152,
          backgroundColor: 'white',
          whiteSpace: 'normal',
          overflow: 'auto',
          textAlign: 'left',
        }}>
          <CurrentContainer user={user} current_path={current_path} />
        </div>
      </div>
      <div className='spacer' style={{
        display: 'inline-block',
        width: 165,
      }}/>
      <div id='notes' style={{
        display: 'inline-block',
      }}>
        <AuthorContainer user={user} current_path={current_path} />
      </div>
    </div>
  );
}

export const NotationContainer = connect(state => {
  const { user_id, note_by_id, link_by_id_by_start_id } = state;

  const current_path = []; // path of current READs; path always refers to READ path

  let note_id = user_id
  while (note_id != null) {
    const sub_link_by_id = link_by_id_by_start_id[note_id];

    note_id = null;

    Object.keys(sub_link_by_id).some(id => {
      const sub_link = sub_link_by_id[id];

      if (sub_link.properties.author_id === user_id && sub_link.properties.current) { // current only exists on READs
        current_path.push(sub_link);
        note_id = sub_link.properties.end_id;
        return true;
      }
      return false;
    });
  }

  return {
    user: note_by_id[user_id],
    current_path,
  };
})(Notation)


