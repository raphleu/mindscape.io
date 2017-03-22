import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { LinkTypes } from '../types';
import { init } from '../actions';

import { WelcomeContainer } from './WelcomeContainer';
import { AuthorContainer } from './AuthorContainer';
import { NoteControlsContainer } from './NoteControlsContainer';
import { NoteLinksContainer } from './NoteLinksContainer';

class Notation extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(init());
  }

  render() {
    const { user, main_path, current_note } = this.props;

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
            <WelcomeContainer user={user} />
            {
              (user && current_note)
                ? (
                  <div id='current_note_details'>
                    <NoteControlsContainer user={user} note={current_note}/>
                    <NoteLinksContianer user={user} note={current_note} />
                  </div>
                )
                : null
            }
          </div>
        </div>
        <div className='spacer' style={{
          display: 'inline-block',
          width: 165,
          height: '100%'
        }}/>
        {
          (user && main_path)
            ? <AuthorContainer user={user} main_path={main_path} />
            : (
              <div id='info' style={{
                display: 'inline-block',
                margin: 2,
                border: '1px solid steelblue',
                borderTopRightRadius: 4,
                borderBottomLeftRadius: 4,
              }}>
                <div id='info' style={{
                  border: '1px solid azure',
                  borderTopRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  padding: '6px 8px',
                  backgroundColor: 'white',
                }}>
                  Check out the code:
                  <a href='https://github.com/geometerJones/mindscape.io'>https://github.com/geometerJones/mindscape.io</a>
                  <br />
                  Register to play! 
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

Notation.propTypes = {
  user: PropTypes.object,
  main_path: PropTypes.arrayOf(PropTypes.object),
  current_note: PropTypes.object,
};

export const NotationContainer = connect(state => {
  const { user_id, note_by_id, link_by_id, link_by_id_by_start_id, link_by_id_by_end_id } = state;

  if (!user_id) {
    return {
      user: null,
      main_path: [],
      current_note: null,
    };
  }

  let user_pre;
  Object.keys(link_by_id_by_end_id[user_id]).some(link_id => {
    const link = link_by_id[link_id] 
    if (
      link.properties.author_id === user_id && 
      link.type === LinkTypes.PRESENT
    ) {
      user_pre = link;
      return true;
    }
    return false;
  });

  // every note has a 'path' of PRESENTs from user to that note
  // the 'frame_path' defines the maximized notes
  // the 'current_path' defines the selected notes
  // the 'main_path' is the union of frame_path and current_path (the two will overlap, bc you must select something in frame)
  const main_path = [user_pre];
  let current_note;

  let i_pre = user_pre;
  while (i_pre.properties.current > 1 || i_pre.properties.frame > 1) {
    const found = Object.keys(link_by_id_by_start_id[ i_pre.properties.end_id ]).some(link_id => {
      const link = link_by_id[link_id];
      if (
        link.properties.author_id === user_id &&
        (link.properties.current > 0 || link.properties.frame > 0) &&
        link.type === LinkTypes.PRESENT
      ) {
        main_path.push(link);
        if (link.properties.current === 1) {
          current_note = note_by_id[link.properties.end_id];
        }

        i_pre = link;
        return true;
      }
      return false;
    });

    if (!found) {
      console.error('main_path not completed', main_path);
    }
  }

  return {
    user: note_by_id[user_id],
    main_path,
    current_note,
  };
})(Notation);