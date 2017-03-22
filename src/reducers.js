import {
  INIT_FETCH,
  REGISTER_FETCH,
  LOGOUT_FETCH,
  LOGIN_FETCH,
  //
  CREATE_NOTE_FETCH,
  MODIFY_NOTE_FETCH,
  COMMIT_NOTE_FETCH,
  DELETE_NOTE_FETCH,
  //
  MOVE_NOTE_FETCH,
  //
  SET_CURRENT_FETCH,
  SET_FRAME_FETCH,
  //
  FETCH_ACCEPT,
  FETCH_REJECT,
} from './actions';

import { routerReducer as routing } from 'react-router-redux';

function fetching(state = false, action) {
  switch (action.type) {
    case INIT_FETCH:
    case REGISTER_FETCH:
    case LOGOUT_FETCH:
    case LOGIN_FETCH:
    //
    case CREATE_NOTE_FETCH:
    case DELETE_NOTE_FETCH:
    case COMMIT_NOTE_FETCH:
    //
    case MOVE_NOTE_FETCH:
    //
    case SET_CURRENT_FETCH:
    case SET_FRAME_FETCH:
      return true;
    case FETCH_ACCEPT:
    case FETCH_REJECT:
      return false;
    default:
      return state;
  }
}

function user_id(state = '', action) {
  switch (action.type) {
    case REGISTER_FETCH:
    case LOGIN_FETCH:
    case LOGOUT_FETCH:
      return '';
    case FETCH_ACCEPT:
      return (action.payload.user_id != null) ? action.payload.user_id : state;
    default:
      return state;
  }
}

function note_by_id(state = {}, action) {
  switch (action.type) {
    case REGISTER_FETCH:
    case LOGIN_FETCH:
    case LOGOUT_FETCH:
      return {};
    //
    case CREATE_NOTE_FETCH:
    case DELETE_NOTE_FETCH:
    case COMMIT_NOTE_FETCH:
    //
    case MOVE_NOTE_FETCH:
    case SET_CURRENT_FETCH:
    case SET_FRAME_FETCH:
    //
    case FETCH_ACCEPT:
      return Object.keys(action.payload.note_by_id || {}).reduce((i_state, note_id) => {
        return Object.assign({}, i_state, {
          [note_id]: Object.assign({}, i_state[note_id], action.payload.note_by_id[note_id]),
        });
      }, state);
    default:
      return state;
  }
}

const empty_links = {
  link_by_id: {},
  link_by_id_by_start_id: {},
  link_by_id_by_end_id: {},
};
function links(state = empty_links, action) {
  switch (action.type) {
    case REGISTER_FETCH:
    case LOGIN_FETCH:
    case LOGOUT_FETCH:
      return empty_links;
    //
    case CREATE_NOTE_FETCH:
    case DELETE_NOTE_FETCH:
    case COMMIT_NOTE_FETCH:
    //
    case MOVE_NOTE_FETCH:
    case SET_CURRENT_FETCH:
    case SET_FRAME_FETCH:
    //
    case FETCH_ACCEPT:
      return Object.keys(action.payload.link_by_id || {}).reduce((i_state, link_id) => {
        const link = Object.assign({}, i_state.link_by_id[link_id], action.payload.link_by_id[link_id]);
        return {
          link_by_id: Object.assign({}, i_state.link_by_id, {
            [link_id]: link
          }),
          link_by_id_by_start_id: Object.assign({}, i_state.link_by_id_by_start_id, {
            [link.properties.start_id]: Object.assign({}, i_state.link_by_id_by_start_id[ link.properties.start_id ], {
              [link_id]: link,
            }),
          }),
          link_by_id_by_end_id: Object.assign({}, state.link_by_id_by_end_id, {
            [link.properties.end_id]: Object.assign({}, i_state.link_by_id_by_end_id[ link.properties.end_id ], {
              [link_id]: link,
            }),
          }),
        };
      }, state);
    default:
      return state;
  }
}

export function rootReducer(state = {}, action) {
  const { link_by_id, link_by_id_by_start_id, link_by_id_by_end_id } = links({
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
    link_by_id,
    link_by_id_by_start_id,
    link_by_id_by_end_id,
  };
}
