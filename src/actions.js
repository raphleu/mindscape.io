import { Node, Relationship, Display, Position,} from './types';

import { setLocalStorageState, getLocalStorageState } from './util';

import uuid from 'uuid/v4';

import { now } from 'lodash';

export const START_FETCH = 'START_FETCH';
export const ACCEPT_FETCH = 'ACCEPT_FETCH';
export const REJECT_FETCH= 'REJECT_FETCH';

export function init() {
  return dispatch => {
    new Promise((resolve, reject) => {
      const user_id = localStorage.getItem('user_id');
      const note_by_id = localStorage.getItem('note_by_id');
      const link_by_id = localStorage.getItem('link_by_id');

      dispatch({
        type: 'INIT',
        payload: {
          user_id,
          note_by_id,
          link_by_id,
        },
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          resolve({
            t: position.timestamp,
            x: position.coords.longitude,
            y: position.coords.latitude,
            z: position.coords.altitude,
          });
        });
      }
      else {
        resolve({
          t: now(),
          x: null,
          y: null,
          z: null,
        });
      }
    }).then(({t, x, y, z}) => {
      dispatch({
        type: START_FETCH,
        payload: {
          params: {
            user_id,
            t,
            x,
            y,
            z,
          },
        },
      });

      fetch(`/api/inventory?user_id=${user_id}&t=${t}&x=${x}&y=${y}&z=${z}`, {
        method: 'GET',
        headers: new Headers(),
      }).then(response => {
        console.log('response blob', response.blob());
        if (response.ok) {
          dispatch({
            type: ACCEPT_FETCH,
            payload: response.json(),
          });
        }
        else {
          dispatch({
            type: REJECT_FETCH,
            payload: response.json(),
          });
        }
      });
    }).catch(error => {
      console.error(error);
    });
  };
}

export function stageNote({author, parent_note, present_index, current_read}) {
  return dispatch => {
    // allocate temp_ids
    const timestamp = now();
    const note_id = uuid();
    const write_id = uuid();
    const define_id = uuid();
    const read_id = uuid();
    const present_id = uuid();

    const update = {
      node_by_id: {
        [note_id]: {
          labels: [Node.Note],
          properties: {
            id: note_id,
            author_id: author.properties.id,
            text: '',
            meta_text: '',
            created_time: timestamp,
          },
        },
      },
      relationship_by_id: {
        [read_id]: {
          type: Relationship.READ,
          properties: {
            id: read_id,
            start_id: note_id,
            end_id: author.properties.id,
            author_id: author.properties.id,
            display: Display.SEQUENCE,
            current: true,
            created_time: timestamp,
          },
        },
        [present_id]: {
          type: Relationship.PRESENT,
          properties: {
            id: present_id,
            start_id: parent_note.properties.id,
            end_id: note_id,
            index: 0,
            position: Position.STATIC,
            x: 0,
            y: 0,
            created_time: timestamp,
          },
        },
        [current_read.properties.id]: Object.assign({}, current_read, {
          properties: Object.assign({}, current_read.properties, {current: false}),
        }),
      },
    };


  };
}

export function cancelNote({author, note, read, present, parent_read}) {
  return {
    type: CANCEL_NOTE,
    payload: {
      node_by_id: 
        [note.properties.id]: null,
      },
      relationship_by_id: {
        [read.properties.id]: null,
        [present.properties.id]: null,
        [parent_read.id]: Object.assign({}, parent_read, {
          properties: Object.assign({}, parent_read.properties, {
            current: false,
          }),
        }),
      },
    },
  };
}

export function addLink(author, start_note, start_path, end_note, end_path) {
  return dispatch => {
    Promise((accept, reject) => {
    const link_id = now();
    const modification = {
      relationship_by_id: {
        [link_id]: {
          id: link_id,
          start: start_note.id,
          end: end_note.id,
          type: 'LINK',
        },
      },
    };

    dispatch({
      type: ADD_LINK,
      payload: state
    });

    if (start_note.commit && end_note.commit) {
      dispatch({
        type: START_FETCH,
        payload: state,
      });

      fetch(set_url, {
        method: 'post',
        headers: new Headers({
          'Content-Type': 'application/json',
          'author': JSON.stringify(author),
        }),
        body: JSON.stringify({graph: state}),
      }).then(response => {
        if (response.ok) {
          dispatch({
            type: ACCEPT_FETCH,
            payload: response.blob(),
          });

          dispatch({
            type: REMOVE_LINK,
            payload: link_id
          });

          const modification2 = Object.assign({}, modification, response.blob());
          accept(response.blob());
        }
        else {
          dispatch({
            type: REJECT_FETCH,
            payload: response.blob(),
          });

          reject(response.blob());
        }
      });
    }
    else {
      accept(modification);
    }

  });
}

export function moveNote(author, note, read, super_read, prev_super_read) {
  return dispatch => {
    const state = {
      node_by_id: {
        [author.id]: Object.assign({}, author, {
          current_read_id: read.id,
        }),
      },
      relationship_by_id: [read, super_read, prev_super_read].reduce(
        (relationship_by_id, relationship) => Object.assign({}, relationship_by_id, {
          [relationship.id]: relationship
        }), {}),
    };

    dispatch({
      type: MOVE_NOTE,
      payload: state,
    });

    if (note.commit && read.commit) {
      dispatch({
        type: 'START_FETCH',
        payload: state,
      });

    }
  };
}

export function setCurrent({user, current_path, path}) {
  return dispatch => {
    const link_by_id = {};

    let current = path.length;
    let i = 0;
    // follow intersection from root
    while (current_path[i] && path[i] && current_path[i].properties.id === path[i].properties.id) {
      if (path[i].properties.current != current) {
        const link = path[i];
        link_by_id[link.properties.id] = Object.assign({}, link, {
          properties: Object.assign({}, link.properties, {
            current--,
          }),
        });
      }
      i++;
    }
    // de-current current_path branch
    for (let j = i; j < current_path.length; j++) {
      const link = current_path[j];
      link_by_id[link.properties.id] = Object.assign({}, link, {
        properties: Object.assign({}, link.properties, {
          current: 0,
        }),
      });
    }
    // current path branch
    for (let k = i; k < path.length; k++) {
      const link = path[k];
      link_by_id[link.properties.id] = Object.assign({}, link, {
        properties: Object.assign({}, link.properties, {
          current--,
        }),
      });
    }

    dispatch({
      type: 'SET_CURRENT',
      payload: {
        link_by_id,
      },
    });

    const params = {
      user_id: user.properties.id,
      note_by_id: {},
      link_by_id,
    };

    dispatch({
      type: START_FETCH,
      payload: {
        params,
      },
    });

    fetch(`/api/feature`, {
      method: 'PUT',
      headers: new Headers(),
      body: JSON.stringify(params),
    }).then(response => {
      if (response.ok) {
        dispatch({
          type: ACCEPT_FETCH,
          payload: response.json(),
        });
      }
      else {
        dispatch({
          type: REJECT_FETCH,
          payload: response.json(),
        });
      }
    }).catch(error => {
      console.error(error);
    });
  };
}

