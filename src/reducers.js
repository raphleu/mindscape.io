import {
  SET_GEO_VECT,

  AUTH_RESUME,
  AUTH_LOGIN,
  AUTH_SIGN,
  AUTH_LOGOUT,

  FETCH_RESUME,
  FETCH_SIGN,
  FETCH_LOGOUT,
  FETCH_LOGIN,
  //
  FETCH_NODE_INIT,
  FETCH_NODE_HIDE,
  FETCH_NODE_COMMIT,
  FETCH_NODE_EDIT,
  //
  FETCH_PRES_MOVE,
  //
  FETCH_PRES_SELECT,
  //
  ACCEPT_FETCH,
  RESOLVE_FETCH,
  REJECT_FETCH,
} from './actions';

import { routerReducer as routing } from 'react-router-redux';

function fetching(state = false, action) {
  switch (action.type) {
    case FETCH_RESUME:
    case FETCH_LOGIN:
    case FETCH_SIGN:
    case FETCH_LOGOUT:
    //
    case FETCH_NODE_INIT:
    case FETCH_NODE_HIDE:
    case FETCH_NODE_COMMIT:
    case FETCH_NODE_EDIT:
    //
    case FETCH_PRES_SELECT:
    case FETCH_PRES_MOVE:
      return true;
    case ACCEPT_FETCH:
    case RESOLVE_FETCH:
    case REJECT_FETCH:
      return false;
    default:
      return state;
  }
}

function geo_vect(state = [0, 0, 0, 0], action) {
  switch (action.type) {
    case SET_GEO_VECT:
      return action.payload.geo_vect;
    default:
      return state;
  }
}

function auth_token(state = '', action) {
  switch (action.type) {
    case AUTH_RESUME:
    case AUTH_LOGIN:
      return action.payload.auth_token || '';
    case AUTH_LOGOUT:
      return '';
    default:
      return state;
  }
}

function auth_user(state = {}, action) {
  switch (action.type) {
    case AUTH_RESUME:
    case AUTH_LOGIN:
    case AUTH_SIGN:
      return action.payload.auth_user || {};
    case AUTH_LOGOUT:
      return {};
    default:
      return state;
  }
}

function node_by_id(state = {}, action) {
  switch (action.type) {
    case FETCH_LOGOUT:
      return {};
    //
    case AUTH_SIGN:
    case FETCH_NODE_INIT:
    case FETCH_NODE_EDIT:
    case FETCH_NODE_COMMIT:
    case FETCH_NODE_HIDE:
    //
    case RESOLVE_FETCH:
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
    case FETCH_LOGOUT:
      return empty_links;
    //
    case FETCH_NODE_INIT:
    case FETCH_PRES_SELECT:
    case FETCH_PRES_MOVE:
    //
    case RESOLVE_FETCH:
      return Object.keys(action.payload.link_by_id || {}).reduce((state, link_id) => {
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
  const { link_by_id, link_by_id_by_start_id, link_by_id_by_end_id } = links({
    link_by_id: state.link_by_id,
    link_by_id_by_start_id: state.link_by_id_by_start_id,
    link_by_id_by_end_id: state.link_by_id_by_end_id,
  }, action);

  return {
    routing: routing(state.routing, action),
    fetching: fetching(state.fetching, action),
    //
    geo_vect: geo_vect(state.geo_vect, action),
    //
    auth_token: auth_token(state.auth_token, action),
    auth_user: auth_user(state.auth_user, action),
    //
    node_by_id: node_by_id(state.node_by_id, action),
    link_by_id,
    link_by_id_by_start_id,
    link_by_id_by_end_id,
  };
}
