import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { assign, filter, merge } from 'lodash';
import {
  FETCH_STATE_REQUEST, FETCH_STATE_SUCCESS, FETCH_STATE_FAILURE,
  SET_RELATIONSHIPS,
  SET_CURRENT_READ_ID,
} from './actions';


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
      return assign({}, state, action.payload.state.token_by_id);

    default:
      return state;
  }
}

function node_by_id(state = {}, action) {
  switch (action.type) {
    case FETCH_STATE_SUCCESS:
      return assign({}, state, action.payload.state.node_by_id);

    case SET_CURRENT_READ_ID:
      const next_state = assign({}, state);
      next_state[action.payload.user_id].current_read_id = action.payload.read_id;
      return next_state;

    default:
      return state;
  }
}

function relationship_by_id(state = {}, action) {
  switch (action.type) {
    case FETCH_STATE_SUCCESS:
      return assign({}, state, action.payload.state.relationship_by_id);

    case SET_RELATIONSHIPS:
      const next_state = assign({}, state);
      action.payload.relationships.forEach((relationship) => {
        next_state[relationship.id] = assign({}, relationship, {
          substitute: true,
        });
      });
      return next_state;

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

function current_read_ids(state = [], action) {
  switch (action.type) {
    case SET_CURRENT_READ_ID:
      return [action.payload.read_id];

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
  current_read_ids,
});