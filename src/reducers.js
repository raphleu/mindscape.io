import { combineReducers } from 'redux';

import {
  // fetching
  FETCH_STATE_REQUEST,
  FETCH_STATE_SUCCESS,
  FETCH_STATE_FAILURE,
  // set state
  SET_LOCAL_STATE,
  RESOLVE_LOCAL_STATE,
  //
} from './actions';

import { routerReducer as routing } from 'react-router-redux';

function node_by_id(state = {}, action) {
  switch (action.type) {
    case SET_LOCAL_STATE:
      return Object.assign({}, state, action.payload.state.node_by_id);

    default:
      return state;
  }
}

function relationship_by_id(state = {}, action) {
  switch (action.type) {
    case SET_LOCAL_STATE:
      return Object.assign({}, state, action.payload.state.relationship_by_id);

    default:
      return state;
  }
}

function token_by_id(state = {}, action) {
  switch (action.type) {
    case SET_LOCAL_STATE:
      return Object.assign({}, state, action.payload.state.token_by_id);

    default:
      return state;
  }
}

function user_ids(state = [], action) {
  switch (action.type) {
    case SET_LOCAL_STATE:
      return (action.payload.state.user_ids)
        ? [...action.payload.state.user_ids]
        : state;

    default: 
      return state;
  }
}

function fetching_state(state = false, action) {
  switch (action.type) {
    case SET_LOCAL_STATE:
      return (action.payload.state.fetching_state)
        ? action.payload.state.fetching_state
        : state;

    case FETCH_STATE_REQUEST:
      return true;

    case FETCH_STATE_SUCCESS:
    case FETCH_STATE_FAILURE:
      return false;

    default:
      return state;
  }
}

export const rootReducer = combineReducers({
  node_by_id,
  relationship_by_id,
  token_by_id,
  user_ids,
  fetching_state,
  routing,
});

function tempAssignById(object, item) { // use this as the callBack in an array.reduce() call
  return Object.assign({}, object, {
    [item.id]: Object.assign({}, item, {
      temp: true,
    }),
  });
}
