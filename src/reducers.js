import {
  FETCH_RESUME,
  //
  FETCH_REGISTER,
  FETCH_LOGIN,
  FETCH_LOGOUT,
  FETCH_EDIT,
  //
  FETCH_NODE_INIT,
  FETCH_NODE_HIDE,
  FETCH_NODE_COMMIT,
  FETCH_NODE_EDIT,
  //
  MOVE_NODE_FETCH,
  //
  FETCH_NODE_SELECT,
  //
  ACCEPT_FETCH,
  REJECT_FETCH,
} from './actions';

import { routerReducer as routing } from 'react-router-redux';

function fetching(state = false, action) {
  switch (action.type) {
    case FETCH_RESUME:
    //
    case FETCH_REGISTER:
    case FETCH_LOGIN:
    case FETCH_LOGOUT:
    case FETCH_EDIT:
    //
    case FETCH_NODE_INIT:
    case FETCH_NODE_HIDE:
    case FETCH_NODE_COMMIT:
    case FETCH_NODE_EDIT:
    //
    case FETCH_NODE_SELECT:
    case MOVE_NODE_FETCH:
      return true;
    case ACCEPT_FETCH:
    case REJECT_FETCH:
      return false;
    default:
      return state;
  }
}

function user_id(state = '', action) {
  switch (action.type) {
    case FETCH_REGISTER:
    case FETCH_LOGIN:
    case FETCH_LOGOUT:
      return '';
    case ACCEPT_FETCH:
      return (action.payload.user_id != null) ? action.payload.user_id : state;
    default:
      return state;
  }
}

function node_by_id(state = {}, action) {
  switch (action.type) {
    case FETCH_REGISTER:
    case FETCH_LOGIN:
    case FETCH_LOGOUT:
      return {};
    //
    case FETCH_NODE_INIT:
    case FETCH_NODE_HIDE:
    case FETCH_NODE_COMMIT:
    case FETCH_NODE_EDIT:
    //
    case MOVE_NODE_FETCH:
    case FETCH_NODE_SELECT:
    //
    case ACCEPT_FETCH:
      return Object.keys(action.payload.node_by_id || {}).reduce((state, node_id) => {
        return Object.assign({}, state, {
          [node_id]: Object.assign({}, state[node_id], action.payload.node_by_id[node_id]),
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
    case FETCH_REGISTER:
    case FETCH_LOGIN:
    case FETCH_LOGOUT:
      return empty_links;
    //
    case FETCH_NODE_INIT:
    case FETCH_NODE_SELECT:
    case MOVE_NODE_FETCH:
    //
    case ACCEPT_FETCH:
      return Object.keys(action.payload.link_by_id || {}).reduce((state, link_id) => {
        console.log(state);
        const link = Object.assign({}, state.link_by_id[link_id], action.payload.link_by_id[link_id]);
        return {
          link_by_id: Object.assign({}, state.link_by_id, {
            [link_id]: link
          }),
          link_by_id_by_start_id: Object.assign({}, state.link_by_id_by_start_id, {
            [link.properties.start_id]: Object.assign({}, state.link_by_id_by_start_id[ link.properties.start_id ], {
              [link_id]: link,
            }),
          }),
          link_by_id_by_end_id: Object.assign({}, state.link_by_id_by_end_id, {
            [link.properties.end_id]: Object.assign({}, state.link_by_id_by_end_id[ link.properties.end_id ], {
              [link_id]: link,
            }),
          }),
        };
      }, state);
    default:
      return state;
  }
}

export function rootReducer(state = empty_links, action) {
  console.log('rootReducer', state);
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
    node_by_id: node_by_id(state.node_by_id, action),
    link_by_id,
    link_by_id_by_start_id,
    link_by_id_by_end_id,
  };
}
