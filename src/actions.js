import fetch from 'isomorphic-fetch';

import { getHeaders, setToken, setLocalState } from './util';

export const FETCH_STATE_REQUEST = 'FETCH_STATE_REQUEST';
export const FETCH_STATE_SUCCESS = 'FETCH_STATE_SUCCESS';
export const FETCH_STATE_FAILURE = 'FETCH_STATE_FAILURE';

export const SET_INTERIM_NODES = 'SET_INTERIM_NODES';
export const SET_INTERIM_RELATIONSHIPS = 'SET_INTERIM_RELATIONSHIPS';

export const SET_CURRENT_READ_ID = 'SET_CURRENT_READ_ID';
export const SET_FRAME_READ_ID = 'SET_FRAME_READ_ID';

const initialize_url = '/api/state/initialize';
const state_url = 'api/state';
const author_url = '/api/author';
const read_url = '/api/read';

export function initialize() {
  return dispatch => {
    return fetchState(dispatch, {}, initialize_url);
  };
}

export function setState(params) {
  const { authors, notes, reads, writes, links } = params;

  return dispatch => {
    const nodes = [...(authors || []), ...(notes || [])];
    if (nodes.length > 0) {
      dispatch(setInterimNodes(nodes));
    }

    const relationships = [...(reads || []), ...(writes || []), ...(links || [])];
    if (relationships.length > 0) {
      dispatch(setInterimRelationships(relationships));
    }

    fetchState(dispatch, params, state_url)
  }
}

function fetchState(dispatch, params, url) {
  dispatch(fetchStateRequest(params, url));

  return fetch(url, {
    method: 'post',
    headers: getHeaders(),
    body: JSON.stringify(params),
  })
  .then(response => {
    return response.json()
      .then(json => {
        if (response.ok) { 
          dispatch(fetchStateSuccess(json.data, url));

          setLocalState(json.data);
        }
        else {
          dispatch(fetchStateFailure(json.data, url));
        }
      });
  })
  .catch(err => {
    dispatch(fetchStateFailure(err, url));
  });
}

function fetchStateRequest(params, url) {
  return  {
    type: FETCH_STATE_REQUEST,
    payload: {
      params,
      url,
    },
  };
}

function fetchStateSuccess(state, url) {
  return {
    type: FETCH_STATE_SUCCESS,
    payload: {
      state,
      url,
    },
  };
}

function fetchStateFailure(error, url) {
  console.error(error);
  return {
    type: FETCH_STATE_FAILURE,
    payload: {      
      error,
      url,
    },
  };
}


function setInterimNodes(nodes) {
  return {
    type: SET_INTERIM_NODES,
    payload: {
      nodes,
    },
  };
}

function setInterimRelationships(relationships) {
  return {
    type: SET_INTERIM_RELATIONSHIPS,
    payload: {
      relationships,
    },
  };
}


