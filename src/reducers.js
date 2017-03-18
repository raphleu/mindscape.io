import {
  INIT_FETCH,
  LOGOUT_FETCH,
  LOGIN_FETCH
  MOVE_NOTE_FETCH,
  SET_CURRENT_FETCH,
  FETCH_ACCEPT,
  FETCH_REJECT,
  LOGIN_FETCH_ACCEPT,
} from './actions';

import { routerReducer as routing } from 'react-router-redux';

function fetching(state = false, action) {
  switch (action.type) {
    case INIT_FETCH:
    case LOGOUT_FETCH:
    case LOGIN_FETCH:
    case MOVE_NOTE_FETCH:
    case SET_CURRENT_FETCH:
      return true;
    case FETCH_ACCEPT:
    case FETCH_REJECT:
    case LOGIN_FETCH_ACCEPT:
      return false;
    default:
      return state;
  }
}

function user_id(state = '', action) {
  switch (action.type) {
    case LOGOUT_FETCH:
      return '';
    default:
      return (action.payload.user_id != null) ? action.payload.user_id : state;
  }
}

function note_by_id(state = {}, action) {
  switch (action.type) {
    case LOGOUT_FETCH:
      return {};
    default:
      const prev_state = (action.type === LOGIN_FETCH_ACCEPT) ? {} : state; 
      return Object.keys(action.payload.note_by_id || {}).reduce((note_by_id, id) => {
        return Object.assign({}, note_by_id, {
          [id]: action.payload.note_by_id[id],
        }),
      }, prev_state);
  }
}

const empty_links = {
  link_by_id: {},
  link_by_id_by_start_id: {},
  link_by_id_by_end_id: {},
};
function links(state = empty_links, action) {
  switch (action.type) {
    case LOGOUT_FETCH:
      return empty_links;
    default:
      const prev_state = (action.type === LOGIN_FETCH_ACCEPT) ? empty_links : state;
      return Object.keys(action.payload.link_by_id || {}).reduce((links, id) => {
        const link = action.payload.link_by_id[id];
        return {
          link_by_id: Object.assign({}, links.link_by_id, {
            [id]: link
          }),
          link_by_id_by_start_id: Object.assign({}, links.link_by_id_by_start_id, {
            [link.properties.start_id]: Object.assign({}, state.link_by_id_by_start_id[link.properties.start_id], {
              [id]: link,
            }),
          }),
          link_by_id_by_end_id: Object.assign({}, state.link_by_id_by_end_id, {
            [link.properties.end_id]: Object.assign({}, state.link_by_id_by_end_id[link.properties.end_id], {
              [id]: link,
            }),
          }),
        };
      }, prev_state);
  }
}

export function rootReducer(state = {}, action) {
  const links = links({
    link_by_id: state.link_by_id,
    link_by_id_by_start_id: state.link_by_id_by_start_id,
    link_by_id_by_end_id: state.link_by_id_by_end_id,
  }, action);

  return {
    routing: routing(state.routing, action),
    fetching: fetching(state.fetching, action),
    //
    user_id: user_id(state.user_id, action),
    //
    note_by_id: note_by_id(state.note_by_id, action),
    link_by_id: links.link_by_id,
    link_by_id_by_start_id: links.link_by_id_by_start_id,
    link_by_id_by_end_id: links.link_by_id_by_end_id,
  };
}
