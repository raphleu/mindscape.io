import { NodeLabels, LinkTypes, NotePositions, NoteDisplays, NoteBodies } from './types';

import uuid from 'uuid/v4';

import { now } from 'lodash';

function getCoordinates() {
  console.log('getCoordinates');
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        resolve({
          t: position.timestamp,
          x: position.coords.longitude,
          y: position.coords.latitude,
          z: position.coords.altitude,
        });
      });
    }
    else {
      console.log('no geolocation');
      resolve({
        t: now(),
        x: null,
        y: null,
        z: null,
      });
    }
  });
}

function resetCurrent(main_path, path, t, x, y, z) {
  const link_by_id = {};

  let divergence_index = 0; // the index at which the old current_path is not covered by new path

  // add current to path
  for (let i = 0; i < path.length; i++) {
    const link = path[i];
    link_by_id[link.properties.id] = Object.assign({}, link, {
      properties: Object.assign({}, link.properties, {
        current: path.length - i,
        modify_t: t,
        modify_x: x,
        modify_y: y,
        modify_z: z,
      }),
    });
    if (divergence_index === 0 && link.properties.id != main_path[i].properties.id) {
      divergence_index = i;
    }
  }
  if (divergence_index === 0 && path.length < main_path.length) {
    divergence_index = path.length;
  }

  for (let i = divergence_index; i < main_path.length; i++) {
    // remove current from former main_path branch
    const link = main_path[i];
    link_by_id[link.properties.id] = Object.assign({}, link, {
      properties: Object.assign({}, link.properties, {
        current: 0,
        modify_t: t,
        modify_x: x,
        modify_y: y,
        modify_z: z,
      }),
    });
  }

  return link_by_id;
}

function resolveResponse(response) {
  response.json()
    .then(json => {
      if (response.ok) {
        dispatch({
          type: FETCH_ACCEPT,
          payload: json.data,
        });
      }
      else {
        dispatch({
          type: FETCH_REJECT,
          payload: json.data,
        });
      }
    });
  response.blob()
    .then(blob => {
      console.log(blob);
    });
}

export const INIT_FETCH = 'INIT_FETCH';
export const REGISTER_FETCH = 'REGISTER_FETCH';
export const LOGOUT_FETCH = 'LOGOUT_FETCH';
export const LOGIN_FETCH = 'LOGIN_FETCH';

export const CREATE_NOTE_FETCH = 'CREATE_NOTE_FETCH';
export const MODIFY_NOTE_FETCH = 'MODIFY_NOTE_FETCH';
export const COMMIT_NOTE_FETCH = 'COMMIT_NOTE_FETCH';
export const DELETE_NOTE_FETCH = 'DELETE_NOTE_FETCH';

export const MOVE_NOTE_FETCH = 'MOVE_NOTE_FETCH';

export const SET_CURRENT_FETCH = 'SET_CURRENT_FETCH';
export const SET_FRAME_FETCH = 'SET_FRAME_FETCH';

export const FETCH_ACCEPT = 'FETCH_ACCEPT';
export const FETCH_REJECT = 'FETCH_REJECT';

// TODO init from local storage
// TODO store state into local storage... on every change? by dispatching action from Notation?

export function init() {
  return dispatch => {
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
      return;
    }
    Promise.resolve(getCoordinates())
    .then(({t, x, y, z}) => {
      const params = {
        user_id,
        t, x, y, z,
      };

      dispatch({
        type: INIT_FETCH,
        payload: params,
      });

      fetch('/api/init', {
        method: 'POST',
        headers: new Headers(),
        body: JSON.stringify(params),
      })
      .then(resolveResponse);
    })
    .catch(error => {
      console.error(error);
    });
  };
}

export function register() {
  return dispatch => {
    console.log('register');
    Promise.resolve(getCoordinates())
    .then(({t, x, y, z}) => {
      console.log(t, x, y, z);
      const params = {t, x, y, z};

      dispatch({
        type: REGISTER_FETCH,
        payload: params,
      });

      fetch('/api/register', {
        method: 'POST',
        headers: new Headers(),
        body: JSON.stringify(params),
      })
      .then(resolveResponse);
    })
    .catch(error => {
      console.error(error);
    });
  };
}

export function login({name, pass}) {
  return dispatch => {
    Promise.resolve(getCoordinates())
    .then(({t, x, y, z}) => {
      const params = {
        user_id: user.properties.id,
        name,
        pass,
        t, x, y, z,
      };
      
      dispatch({
        type: LOGIN_FETCH,
        payload: params,
      });

      fetch('/api/login', {
        method: 'POST',
        headers: new Headers(),
        body: JSON.stringify(params),
      })
      .then(resolveResponse);
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
      .then(resolveResponse);
    })
    .catch(error => {
      console.error(error);
    });
  };
}

export function createNote({user, main_path, parent_path, parent_user_in_defs, parent_user_out_pres}) {
  return dispatch => {
    Promise.resolve(getCoordinates())
    .then(({t,x,y,z}) => {
      const parent_note_id = path[path.length - 1].properties.end_id;
      const note_id = uuid();
      const def_id = uuid();
      const pre_id = uuid();

      const pre = {
        type: LinkTypes.PRESENT,
        properties: {
          id: pre_id,
          start_id: parent_note_id,
          end_id: note_id,
          author_id: user.properties.id,
          out_index: parent_extant_user_out_pres.reduce((push_index, pre) => {
            return (push_index > pre.properties.out_index ) ? push_index : pre.properties.out_index + 1;
          }, 0),
          in_index: 0,
          frame: 0,
          current: 1,
          position: NotePositions.STATIC,
          x: 0,
          y: 0,
          display: NoteDisplays.BODY,
          body: NoteBodies.LIST,
          created_t: t,
          created_x: x,
          created_y: y,
          created_z: z,
        },
      };

      const params = {
        user_id: user.properties.id,
        note_by_id: {
          [note_id]: {
            labels: [NodeLabels.Note],
            properties: {
              id: note_id,
              author_id: user.properties.id,
              value: '',
              created_t: t,
              created_x: x,
              created_y: y,
              created_z: z,
            },
          },
        },
        link_by_id: Object.assign({}, resetCurrent({main_path, path: [...parent_path, pre], t, x, y, z}), {
          [def_id]: {
            type: LinkTypes.DEFINE,
            properties: {
              id: def_id,
              end_id: parent_note_id,
              start_id: note_id,
              author_id: user.properties.id,
              in_index:  parent_extant_user_in_defs.reduce((push_index, def) => {
                return (push_index > def.properties.in_index ) ? push_index : def.properties.in_index + 1;
              }, 0),
              out_index: 0,
              created_t: t,
              created_x: x,
              created_y: y,
              created_z: z,
            },
          },
          [pre_id]: pre // overwrite to remove modify_t, etc
        }),
      };

      dispatch({
        type: CREATE_NOTE_FETCH,
        payload: params
      });

      fetch('/api/graph', {
        method: 'POST',
        headers: new Headers(),
        body: JSON.stringify(params),
      })
      .then(resolveResponse);
    })
    .catch(error => {
      console.error(error);
    });
  };
}

export function deleteNote({user, note, defs_bridge, pres_bridge}) {
  return dispatch => {
    Promise.resolve(getCoordinates())
    .then(({t,x,y,z}) => {
      const params = {
        user_id: user.properties.id,
        note_by_id: {
          [note.properties.id]: {
            properties:{
              deleted_t: t,
              deleted_x: x,
              deleted_y: y,
              deleted_z: z,
            },
          },
        },
        link_by_id: {},
      };

      dispatch({
        type: DELETE_NOTE_FETCH,
        payload: params
      });

      fetch('/api/graph', {
        method: 'POST',
        headers: new Headers(),
        body: JSON.stringify(params),
      })
      .then(resolveResponse);
    })
    .catch(error => {
      console.error(error);
    });
  };
}

export function modifyNote({user, note}) {
  return dispatch => {

  };
}

export function commitNote({user, note}) {
  return dispatch => {
    Promise.resolve(getCoordinates())
    .then(({t,x,y,z}) => {
      const params = {
        user_id: user.properties.id,
        note_by_id: {
          [note.properties.id]: {
            properties: {
              value: note.editorState.getCurrentContent().getPlainText(), // TODO FIXME
              deleted_t: t,
              deleted_x: x,
              deleted_y: y,
              deleted_z: z,
            },
            d_nt_id: uuid(),
            d_nx_id: uuid(),
            d_ny_id: uuid(),
            d_nz_id: uuid(),
          },
        },
        link_by_id: {},
      };

      dispatch({
        type: COMMIT_NOTE_FETCH,
        payload: params
      });

      fetch('/api/graph', {
        method: 'POST',
        headers: new Headers(),
        body: JSON.stringify(params),
      })
      .then(resolveResponse);
    })
    .catch(error => {
      console.error(error);
    });
  };
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

      fetch(`/api/graph`, {
        method: 'POST',
        headers: new Headers(),
        body: JSON.stringify(params),
      }).then(response => {
          response.json()
            .then(json => {
              if (response.ok) {
                localStorage.setItem('user_id', data.user_id);

                dispatch({
                  type: FETCH_ACCEPT,
                  payload: json.data,
                });
              }
              else {
                dispatch({
                  type: FETCH_REJECT,
                  payload: json.data,
                });
              }
            });
        });
    })
    .catch(error => {
      console.error(error);
    });
  };
}

export function setCurrent({user, main_path, path}) {
  return dispatch => {
    Promise.resolve(getCoordinates())
    .then(({t,x,y,z}) => {
      const params = {
        user_id: user.properties.id,
        note_by_id: {},
        link_by_id: resetCurrent({user, main_path, path, t, x, y, z}),
      };

      dispatch({
        type: SET_CURRENT_FETCH,
        payload: params,
      });

      fetch(`/api/graph`, {
        method: 'POST',
        headers: new Headers(),
        body: JSON.stringify(params),
      })
      .then(resolveResponse);
    })
    .catch(error => {
      console.error(error);
    });
  };
}

export function setFrame({user, main_path, path}) {
  return dispatch => {
    Promise.resolve(getCoordinates())
    .then(({t,x,y,z}) => {
      const params = {
        user_id: user.properties.id,
        note_by_id: {},
        link_by_id: {},
      };

      for (let i = 0; i < path.length; i++) {
        // add frame to path
        const link = path[i];
        params.link_by_id[link.properties.id] = Object.assign({}, link, {
          properties: Object.assign({}, link.properties, {
            frame: path.length - i,
            modify_t: t,
            modify_x: x,
            modify_y: y,
            modify_z: z,
          }),
        });
      }

      if (path.length < main_path.length) {
        for (let i = path.length; i < main_path.length; i++) {
          // remove frame from former main_path
          const link = main_path[i];
          params.link_by_id[link.properties.id] = Object.assign({}, link, {
            properties: Object.assign({}, link.properties, {
              frame: 0,
              modify_t: t,
              modify_x: x,
              modify_y: y,
              modify_z: z,
            }),
          });
        }
      }

      dispatch({
        type: SET_FRAME_FETCH,
        payload: params,
      });

      fetch(`/api/graph`, {
        method: 'POST',
        headers: new Headers(),
        body: JSON.stringify(params),
      })
      .then(resolveResponse);
    })
    .catch(error => {
      console.error(error);
    });
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
        })
        .then(resolveResponse);
      }
      else {
        accept(modification);
      }
    });
  };
}
