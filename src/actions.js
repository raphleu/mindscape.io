import { Node, Relationship, Display, Position,} from './types';

import { setLocalStorageState, getLocalStorageState } from './util';

import uuid from 'uuid/v4';

import { now } from 'lodash';

function getCoordinates() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        resolve({
          t: position.timestamp(),
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
  });
}

export const INIT_FETCH = 'INIT_FETCH';
export const LOGOUT_FETCH = 'LOGOUT_FETCH';
export const LOGIN_FETCH = 'LOGIN_FETCH';

export const MOVE_NOTE_FETCH = 'MOVE_NOTE_FETCH';
export const SET_CURRENT_FETCH = 'SET_CURRENT_FETCH';

export const FETCH_ACCEPT = 'FETCH_ACCEPT';
export const FETCH_REJECT = 'FETCH_REJECT';
export const LOGIN_FETCH_ACCEPT = 'LOGIN_FETCH_ACCEPT';

// TODO init from local storage
// TODO store state into local storage... on every change? by dispatching action from Notation?

export function init() {
  return dispatch => {
    Promise.resolve(getCoordinates())
      .then(({t, x, y, z}) => {
        const payload = {
          user_id: localStorage.getItem('user_id'),
          t, x, y, z,
        };

        dispatch({
          type: INIT_FETCH,
          payload,
        });

        fetch('/api/init', {
            method: 'POST',
            headers: new Headers(),
            body: JSON.stringify(payload),
          })
          .then(response => {
            console.log('response blob', response.blob());
            const data = response.json().data;
            console.log('data', data);

            if (response.ok) {
              localStorage.setItem('user_id', data.user_id);

              dispatch({
                type: FETCH_ACCEPT,
                payload: data,
              });
            }
            else {
              dispatch({
                type: FETCH_REJECT,
                payload: data,
              });
            }
          });
      })
      .catch(error => {
        console.error(error);
      });
  };
}

export function logout(user) {
  return dispatch => {
    Promise.resolve(getCoordinates())
      .then(({t, x, y, z}) => {
        const payload = {
          user_id: user.properties.id,
          t, x, y, z,
        };

        dispatch({
          type: LOGOUT_FETCH,
          payload,
        });

        fetch('/api/logout', {
            method: 'POST',
            headers: new Headers(),
            body: JSON.stringify(payload),
          })
          .then(response => {
            const data = response.json().data;

            if (response.ok) {
              localStorage.setItem('user_id', data.user_id);

              dispatch({
                type: FETCH_ACCEPT,
                payload: data,
              });
            }
            else {
              dispatch({
                type: FETCH_REJECT,
                payload: data,
              });
            }
          });
      })
      .catch(error => {
        console.error(error);
      });
  };
}

export function login({user, name, pass}) {
  return dispatch => {
    Promise.resolve(getCoordinates())
      .then(({t, x, y, z}) => {
        const payload = {
          user_id: user.properties.id,
          name,
          pass,
          t, x, y, z,
        };
        
        dispatch({
          type: LOGIN_FETCH,
          payload,
        });

        fetch('/api/login', {
            method: 'POST',
            headers: new Headers(),
            body: JSON.stringify(payload),
          })
          .then(response => {
            const data = response.json().data;

            if (response.ok) {
              localStorage.setItem('user_id', data.user_id);

              dispatch({
                type: LOGIN_FETCH_ACCEPT,
                payload: data,
              })
            }
            else {
              dispatch({
                type: FETCH_REJECT,
                payload: data,
              });
            }
          });
      })
      .catch(error => {
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
            type: FETCH_ACCEPT,
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
            type: FETCH_REJECT,
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

export function moveNote({user, modify_read, delete_read, create_read}) {
  return dispatch => {
    Promise.resolve(getCoordinates())
      .then(({t, x, y, z}) => {
        const params = {
          user_id: user.properties.id,
          note_by_id: {},
          link_by_id: {},
        };

        if (modify_read) {
          params.link_by_id[modify_read.properties.id] = Object.assign({}, modify_read, {
            properties: Object.assign({}, modify_read.properties, {
              modify_t: t,
              modify_x: x,
              modify_y: y,
              modify_z: z,
            }),
          });
        }
        else if (delete_read && create_read) {
          params.link_by_id[delete_read.properties.id] = Object.assign({}, delete_read, {
            properties: Object.assign({}, delete_read.properties, {
              delete_t: t,
              delete_x: x,
              delete_y: y,
              delete_z: z,
            }),
          });

          params.link_by_id[create_read.properties.id] = Object.assign({}, create_read, {
            properties: Object.assign({}, delete_read.properties, {
              create_t: t,
              create_x: x,
              create_y: y,
              create_z: z,
            }),
          });
        }

        dispatch({
          type: MOVE_NOTE_FETCH,
          payload: params,
        });

        fetch(`/api/feature`, {
          method: 'PUT',
          headers: new Headers(),
          body: JSON.stringify(params),
        }).then(response => {
            if (response.ok) {
              dispatch({
                type: FETCH_ACCEPT,
                payload: response.json(),
              });
            }
            else {
              dispatch({
                type: FETCH_REJECT,
                payload: error,
              });
            }
          });
      })
      .catch(error => {
        console.error(error);
      });
  };
}

export function setCurrent({user, current_path, path}) {
  return dispatch => {
    Promise.resolve(getCoordinates())
      .then(({t,x,y,z}) => {
        const params = {
          user_id: user.properties.id,
          note_by_id: {},
          link_by_id: {},
        };

        let current = path.length;
        let i = 0;
        // follow intersection from root
        while (current_path[i] && path[i] && current_path[i].properties.id === path[i].properties.id) {
          if (path[i].properties.current != current) {
            const link = path[i];
            params.link_by_id[link.properties.id] = Object.assign({}, link, {
              properties: Object.assign({}, link.properties, {
                current--,
                modify_t: t,
                modify_x: x,
                modify_y: y,
                modify_z: z,
              }),
            });
          }
          i++;
        }
        // de-current current_path branch
        for (let j = i; j < current_path.length; j++) {
          const link = current_path[j];
          params.link_by_id[link.properties.id] = Object.assign({}, link, {
            properties: Object.assign({}, link.properties, {
              current: 0,
              modify_t: t,
              modify_x: x,
              modify_y: y,
              modify_z: z,
            }),
          });
        }
        // current path branch
        for (let k = i; k < path.length; k++) {
          const link = path[k];
          params.link_by_id[link.properties.id] = Object.assign({}, link, {
            properties: Object.assign({}, link.properties, {
              current--,
              modify_t: t,
              modify_x: x,
              modify_y: y,
              modify_z: z,
            }),
          });
        }

        dispatch({
          type: SET_CURRENT_FETCH,
          payload: params,
        });

        fetch(`/api/feature`, {
          method: 'PUT',
          headers: new Headers(),
          body: JSON.stringify(params),
        }).then(response => {
            if (response.ok) {
              dispatch({
                type: FETCH_ACCEPT,
                payload: response.json(),
              });
            }
            else {
              dispatch({
                type: FETCH_REJECT,
                payload: error,
              });
            }
          });
      })
      .catch(error => {
        console.error(error);
      });
  };
}

