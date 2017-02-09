import fetch from 'isomorphic-fetch';

import { Defaults, Displays, Relationships } from './types';
import { getHeaders, setToken, setLocalState, assignById } from './util';

export const FETCH_STATE_REQUEST = 'FETCH_STATE_REQUEST';
export const FETCH_STATE_SUCCESS = 'FETCH_STATE_SUCCESS';
export const FETCH_STATE_FAILURE = 'FETCH_STATE_FAILURE';

export const SET_TEMP_STATE = 'SET_TEMP_STATE';
export const RESOLVE_TEMP_STATE = 'RESOLVE_TEMP_STATE';

export const SET_CURRENT_READ_ID = 'SET_CURRENT_READ_ID';
export const SET_FRAME_READ_ID = 'SET_FRAME_READ_ID';

const initialize_url = '/api/state/initialize';
const state_url = 'api/state';
const write_url = 'api/write';

export function initialize() {
  return dispatch => {
    const comment = 'initialize';
    return fetchState(dispatch, initialize_url, {}, comment);
  };
}
export function moveNote(read, super_read, prev_super_read) {
  return dispatch => {
    const comment = 'moveNote';

    const reads = [read];

    if (super_read && prev_super_read) {
      reads.push(super_read);
      reads.push(prev_super_read);
    }

    dispatch(setTempState({
      relationship_by_id: reads.reduce(assignById, {}),
    }, comment));

    fetchState(dispatch, state_url, {reads}, comment);
  };
}

export function currentNote(read, super_read, author) {
  return dispatch => {
    const comment = 'currentNote';
    if (read.id === author.current_read_id) {
      return;
    }

    const author2 = Object.assign({}, author, {
      current_read_id: read.id,
    });

    dispatch(setTempState({
      node_by_id: assignById({}, author2),
      //relationship_by_id: assignById({}, super_read2),
    }, comment));

    /*
    fetchState(dispatch, state_url, {
      authors: [author2],
      //reads: [super_read2],
    }, comment);
    */
  };
}

export function frameNote(read, author) {
  return dispatch => {
    const comment = 'frameNote'
    if (read.id === author.root_read_id) {
      return;
    }

    const is_frame = (read.id === author.frame_read_id);

    const author2 = Object.assign({}, author, {
      frame_read_id: is_frame ? author.root_read_id : read.id,
    });

    const read2 = Object.assign({}, read, {
      properties: Object.assign({}, read.properties, {
        display: is_frame ? Displays.SEQUENCE : Displays.PLANE,
      }),
    });

    dispatch(setTempState({
      node_by_id: assignById({}, author2),
      relationship_by_id: assignById({}, read2),
    }, comment));

    fetchState(dispatch, state_url, {
      authors: [author2],
      reads: [read2],
    }, comment);
  }
}

export function addNote(super_read, author) {
  return dispatch => {
    const comment = 'addNote';

    // allocate temp_ids
    let timestamp = Date.now();
    const note_id = 'temp-' + timestamp;

    timestamp++;
    const write_id = 'temp-' + timestamp;

    timestamp++;
    const read_id = 'temp-' + timestamp;


    dispatch(setTempState({
      node_by_id: {
        [author.id]: Object.assign({}, author, {
          current_read_id: read_id,
        }),
        [note_id]: Object.assign({}, Defaults.Note, {
          live: true,
          id: note_id,
          write_id: write_id,
          read_ids: [read_id],
          link_ids: [],
        }),
      },
      relationship_by_id: {
        [write_id]: Object.assign({}, Defaults.WRITE, {
          id: write_id,
          start: super_read.end,
          end: note_id,
          type: Relationships.WRITE,
          properties: Object.assign({}, Defaults.WRITE.properties, {
            super_read_id: super_read.id,
          }),
        }),
        [read_id]: Object.assign({}, Defaults.WRITE, {
          id: read_id,
          start: note_id,
          end: super_read.end,
          type: Relationships.READ,
          properties: Object.assign({}, Defaults.WRITE.properties, {
            super_read_id: super_read.id,
          }),
        }),
        [super_read.id]: Object.assign({}, super_read, {
          properties: Object.assign({}, super_read.properties, {
            sub_read_ids: [read_id, ...(super_read.properties.sub_read_ids || [])],
          }),
        }),
      },
    }, comment));

    fetchState(dispatch, write_url, {super_read}, comment)
      .then(state => {
        // TODO merge temp data into newly assigned note, read, id
        let new_note_id;
        let new_write_id;
        let new_read_id;
        console.log(state);
        resolveTempState([note_id, write_id, read_id]);
      });
  }
}

export function setNote(read, note, commit) {
  return dispatch => {
    const comment = 'setNote';

    const notes = [note];

    dispatch(setTempState({
      node_by_id: notes.reduce(assignById, {}),
    }, comment));

    if (commit) {
      fetchState(dispatch, state_url, {
        notes: notes.map(note => {
          return Object.assign({}, note, {
            read,
            position_editorState: null,
          });
        }),
      }, comment); 
    }
  };
}

function setTempState(state, comment) {
  return {
    type: SET_TEMP_STATE,
    payload: {
      state,
    },
    comment,
  };
}

function resolveTempState(temp_ids, comment) {
  return {
    type: RESOLVE_TEMP_STATE,
    payload: {
      temp_ids,
    },
    comment,
  };
}

function fetchState(dispatch, url, params, comment) {
  dispatch(fetchStateRequest(url, params, comment));

  return fetch(url, {
    method: 'post',
    headers: getHeaders(),
    body: JSON.stringify(params),
  })
  .then(response => {
    return response.json()
      .then(json => {
        if (response.ok) { 
          dispatch(fetchStateSuccess(url, params, json.data, comment));

          setLocalState(json.data);
        }
        else {
          dispatch(fetchStateFailure(url, params, json.data, comment));
        }
        return json.data;
      });
  })
  .catch(err => {
    dispatch(fetchStateFailure(url, params, err, comment));
  });

  function fetchStateRequest(url, params, comment) {
    return  {
      type: FETCH_STATE_REQUEST,
      payload: {
        url,
        params,
      },
      comment
    };
  }

  function fetchStateSuccess(url, params, state, comment) {
    return {
      type: FETCH_STATE_SUCCESS,
      payload: {
        url,
        params,
        state,
      },
      comment,
    };
  }

  function fetchStateFailure(url, params, error, comment) {
    console.error(error);
    return {
      type: FETCH_STATE_FAILURE,
      payload: {  
        url,
        params,
        error,
      },
      comment,
    };
  }
}

