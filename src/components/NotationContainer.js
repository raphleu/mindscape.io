import React, { PropTypes } from 'react';

import { LinkTypes } from '../types';

import { User } from './User';
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
          <AuthContainer user={user} />
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
        <User user={user} current_path={current_path} />
      </div>
    </div>
  );
}

export const NotationContainer = connect(state => {
  const { user_id, note_by_id, link_by_id, link_by_id_by_start_id, link_by_id_by_end_id } = state;

  if (!user_id) {
    return {
      user: null,
      current_path: [],
    };
  }

  let user_read;
  Object.keys(link_by_id_by_end_id[user_id]).some(link_id => {
    const link = link_by_id[link_id] 
    if (
      link.properties.author_id === user_id && 
      link.type === LinkTypes.READ
    ) {
      user_read = link;
      return true;
    }
    return false;
  });

  const current_path = [user_read];
  while (current_path[current_path.length - 1].properties.current > 1) {
    Object.keys(link_by_id_by_start_id[ current_path[current_path.length - 1].properties.end_id ]).some(link_id => {
      const link = link_by_id[link_id];
      if (
        link.properties.author_id === user_id &&
        link.properties.current > 0 &&
        link.type === LinkTypes.READ
      ) {
        current_path.push(link);
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


