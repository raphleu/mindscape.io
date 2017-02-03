import fetch from 'isomorphic-fetch';

import { getHeaders, setToken, setLocalState } from './util';

export const FETCH_STATE_REQUEST = 'FETCH_STATE_REQUEST';
export const FETCH_STATE_SUCCESS = 'FETCH_STATE_SUCCESS';
export const FETCH_STATE_FAILURE = 'FETCH_STATE_FAILURE';

export const SET_RELATIONSHIPS = 'SET_RELATIONSHIPS';

export const SET_CURRENT_READ_ID = 'SET_CURRENT_READ_ID';

export const EDIT_FRAME_NODE_IDS = 'EDIT_FRAME_NODE_IDS';

const initialize_url = '/api/state/initialize';
const author_url = '/api/author';
const read_url = '/api/read';


export function initialize(user_ids) {
  return dispatch => {
    const params = {
      user_ids
    };
    return fetchState(dispatch, params, initialize_url);
  };
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

export function logOut(user) {
  
}

export function setAuthor(token, author) {
  return dispatch => {
    const params = {
      token,
      author,
    };
    return fetchState(dispatch, params, author_url);
  };
}

export function setReads(reads) {
  return dispatch => {
    dispatch(setRelationships(reads));

    const params = {
      reads,
    };
    return fetchState(dispatch, params, read_url);
  }
}

function setRelationships(relationships) {
  console.log('setRelationships', relationships);
  return {
    type: SET_RELATIONSHIPS,
    payload: {
      relationships,
    },
  };
}

export function addNote(position_text, super_read_id) {

}

export function setCurrentReadId(user_id, read_id) {
  return {
    type: SET_CURRENT_READ_ID,
    payload: {
      user_id,
      read_id,
    },
  };
}
