import fetch from 'isomorphic-fetch';

import { Defaults, Displays, Relationships } from './types';
import { getHeaders, setToken, setLocalStorageState, assignById } from './util';

export const SET_LOCAL_STATE = 'SET_LOCAL_STATE';

export const FETCH_STATE_REQUEST = 'FETCH_STATE_REQUEST';
export const FETCH_STATE_SUCCESS = 'FETCH_STATE_SUCCESS';
export const FETCH_STATE_FAILURE = 'FETCH_STATE_FAILURE';

const initialize_url = '/api/state/initialize';
const update_url = 'api/state/update';
const commit_url = 'api/state/commit';
const delete_url = 'api/state/delete';

export function initialize() {
  let comment = 'initialize state'
  return dispatch => {
    fetchState(dispatch, initialize_url, {}, comment)
      .then(state => {
        dispatch(setLocalState(state, comment));

        // save some state to local storage (user_ids, token_by_id)
        setLocalStorageState(state);
      })
      .catch(error => {
        console.error(error, comment);
      });
  };
}

export function stageNote(author, super_note, super_read) {
  let comment = 'stage note';
  return dispatch => {
        // allocate temp_ids
    let timestamp = Date.now();
    const link_id = 'temp-' + timestamp;

    timestamp++;
    const note_id = 'temp-' + timestamp;

    timestamp++;
    const read_id = 'temp-' + timestamp;

    const update = {
      node_by_id: {
        [author.id]: Object.assign({}, author, {
          current_read_id: read_id,
        }),
        [note_id]: Object.assign({}, Defaults.Note, {
          id: note_id,
          read_ids: [read_id],
          link_ids: [link_id],
        }),
      },
      relationship_by_id: {
        [link_id]: Object.assign({}, Defaults.LINK, {
          id: link_id,
          start: super_note.id,
          end: note_id,
          //properties: Object.assign({}, Defaults.LINK.properties, {}),
        }),
        [read_id]: Object.assign({}, Defaults.READ, {
          id: read_id,
          start: note_id,
          end: author.id,
          properties: Object.assign({}, Defaults.READ.properties, {
            super_read_id: super_read.id,
          }),
        }),
        [super_read.id]: Object.assign({}, super_read, {
          properties: Object.assign({}, super_read.properties, {
            sub_read_ids: [read_id, ...(super_read.properties.sub_read_ids || [])],
          }),
        }),
      },
    };

    dispatch(setLocalState(update, comment));
  };
}

export function cancelNote(author, note, read, super_read) {
  let comment = 'cancel note'
  return dispatch => {
    const update = {
      node_by_id: {
        [author.id]: Object.assign({}, author, {
          current_read_id: super_read.id,
        }),
        [note.id]: null,
      },
      relationship_by_id: {
        [read.id]: null,
        [super_read.id]: Object.assign({}, super_read, {
          properties: Object.assign({}, super_read.properties, {
            sub_read_ids: super_read.properties.sub_read_ids.filter(sub_read_id => (sub_read_id !== read.id)),
          }),
        }),
      },
    };

    dispatch(setLocalState(update, comment));
  };
}

export function setNote(author, note, read) {
  let comment = 'set note';
  return dispatch => {
    const update = {
      node_by_id: {
        [note.id]: note
      }
    };
    dispatch(setLocalState(update, comment));

    // TODO strip out position_editorState on the client-side?

    if (note.write_id) { // if note is committed
      fetchState(dispatch, update_url, {author, update}, comment); 
    }
  };
}

export function commitNote(author, note, read) {
  let comment = 'commit note';
  return dispatch => {
    const update = {
      node_by_id: {
        [note.id]: Object.assign({}, note, {
          committing: true,
        }),
      },
    };
    setLocalState(update, comment);

    const units = [{
      note,
      read,
    }];

    fetchState(dispatch, commit_url, {author, units}, 'commit note')
      .then(state => {
        const update2 = {
          node_by_id: Object.assign({[note.id]: null}, state.node_by_id),
          relationship_by_id: Object.assign({[read.id]: null}, state.relationship_by_id),
        };

        dispatch(setLocalState(update2, comment))
      });
  };
}

export function deleteNote(author, note, read) {
  let comment = 'delete note';
  return dispatch => {
    const update = {
      node_by_id: {
        [note.id]: Object.assign({}, note, {
          deleting: true,
        }),
      },
    };
    setLocalState(update, comment);

    const units = [{
      note,
      read,
    }];

    fetchState(dispatch, delete_url, {author, units}, comment)
      .then(state => {
        const update2 = {
          node_by_id: {
            [note.id]: null,
          },
          relationship_by_id: Object.assign({[read.id]: null}, state.relationship_by_id),
        }
        setLocalState(update2, comment);
      });
  }
}

export function moveNote(author, note, read, super_read, prev_super_read) {
  let comment = 'move note';
  return dispatch => {
    const update = {
      node_by_id: {
        [author.id]: Object.assign({}, author, {
          current_read_id: read.id,
        }),
      },
      relationship_by_id: [read, super_read, prev_super_read].reduce(assignById, {}),
    };

    dispatch(setLocalState(update, comment));

    if (note.write_id) { // if note is committed
      fetchState(dispatch, update_url, {author, update}, comment);
    }
  };
}

export function currentNote(author, note, read) {
  let comment = 'current note';
  return dispatch => {
    if (read.id === author.current_read_id) {
      return;
    }

    const update = {
      node_by_id: {
        [author.id]: Object.assign({}, author, {
          current_read_id: read.id,
        }),
      },
    };

    dispatch(setLocalState(update, comment));

    if (note.write_id) {
      fetchState(dispatch, update_url, {author, update}, comment);
    }
  };
}

export function frameNote(author, note, read) {
  let comment = 'frame note';
  return dispatch => {
    if (note.write_id == null) {
      return;
    }
    if (read.id === author.root_read_id) {
      return;
    }

    const is_frame = (read.id === author.frame_read_id);

    const update = {
      node_by_id: {
        [author.id]: Object.assign({}, author, {
          frame_read_id: is_frame ? author.root_read_id : read.id,
        }),
      },
      relationship_by_id: {
        [read.id]: Object.assign({}, read, {
          properties: Object.assign({}, read.properties, {
            display: is_frame ? Displays.SEQUENCE : Displays.PLANE,
          }),
        }),
      },
    };

    dispatch(setLocalState(update, comment));
    
    fetchState(dispatch, update_url, {author, update}, comment);
  }
}

function setLocalState(state, comment) {
  return {
    type: SET_LOCAL_STATE,
    payload: {
      state,
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
  }).then(response => {
      return response.json()
        .then(json => {
          if (response.ok) { 
            dispatch(fetchStateSuccess(url, params, json.data, comment));
            return json.data;
          }
          else {
            throw Error(json.data);
          }
        });
    })
    .catch(error => {
      dispatch(fetchStateFailure(url, params, error, comment));

      return null;
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

