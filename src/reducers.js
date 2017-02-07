import { combineReducers } from 'redux';

import {
  // fetching
  FETCH_STATE_REQUEST,
  FETCH_STATE_SUCCESS,
  FETCH_STATE_FAILURE,
  // set interim state
  SET_INTERIM_NODES,
  SET_INTERIM_RELATIONSHIPS,
} from './actions';

import { routerReducer as routing } from 'react-router-redux';

import { filter, merge } from 'lodash';


function fetching_state(state = false, action) {
  switch (action.type) {
    case FETCH_STATE_REQUEST:
      return true;

    case FETCH_STATE_SUCCESS:
    case FETCH_STATE_FAILURE:
      return false;

    default:
      return state;
  }
}

function token_by_id(state = {}, action) {
  switch (action.type) {
    case FETCH_STATE_SUCCESS:
      return Object.assign({}, state, action.payload.state.token_by_id);

    default:
      return state;
  }
}

function node_by_id(state = {}, action) {
  switch (action.type) {
    case FETCH_STATE_SUCCESS:
      return Object.assign({}, state, action.payload.state.node_by_id);

    case SET_INTERIM_NODES: 
      return Object.assign({}, state,
        action.payload.nodes.reduce(interimAssignById, {})
      );

    default:
      return state;
  }
}

function relationship_by_id(state = {}, action) {
  switch (action.type) {
    case FETCH_STATE_SUCCESS:
      return Object.assign({}, state, action.payload.state.relationship_by_id);

    case SET_INTERIM_RELATIONSHIPS:
      return Object.assign({}, state,
        action.payload.relationships.reduce(interimAssignById, {})
      );
    default:
      return state;
  }
}

function user_ids(state = [], action) {
  switch (action.type) {
    case FETCH_STATE_SUCCESS:
      if (action.payload.state.user_ids) {
        return [...action.payload.state.user_ids];
      }
      else {
        return state;
      }

    default: 
      return state;
  }
}

export const rootReducer = combineReducers({
  routing,
  fetching_state,
  token_by_id,
  node_by_id,
  relationship_by_id,
  user_ids,
});

function interimAssignById(object, item) { // use this as the callBack in an array.reduce() call
  return Object.assign({}, object, {
    [item.id]: Object.assign({}, item, {
      interim: true,
    }),
  });
}
