import { NodeLabels, LinkTypes } from './types';

import { convertToRaw } from 'draft-js';

import uuid from 'uuid/v4';
import { now } from 'lodash';

import * as firebase from 'firebase/app';
import 'firebase/auth';

function resolveFetch(dispatch, dont_resolve) {
  return response => {
    console.log('res', response);
    response.json()
      .then(json => {
        if (response.ok) {
          dispatch({
            type: dont_resolve ? ACCEPT_FETCH : RESOLVE_FETCH,
            payload: json.data,
          });
        }
        else {
          dispatch({
            type: REJECT_FETCH,
            payload: json.data,
          });
        }
      });
  };
}

function resolveError(dispatch) {
  return error => {
    dispatch({
      type: REJECT_FETCH,
      payload: error,
    });
  };
}

function getNodeExpFromEditorState(node) {
  return node.editorState.getCurrentContent().getPlainText('\n'); // TODO FIXME
}

export const SET_GEO_VECT = 'SET_GEO_VECT';

export const AUTH_RESUME = 'AUTH_RESUME';
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_SIGN = 'AUTH_SIGN';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';

export const FETCH_RESUME = 'FETCH_RESUME';
export const FETCH_LOGIN = 'FETCH_LOGIN';
export const FETCH_SIGN = 'FETCH_SIGN'
export const FETCH_LOGOUT = 'FETCH_LOGOUT';

export const FETCH_NODE_INIT = 'FETCH_NODE_INIT';
export const FETCH_NODE_EDIT = 'FETCH_NODE_EDIT';
export const FETCH_NODE_COMMIT = 'FETCH_NODE_COMMIT';
export const FETCH_NODE_HIDE = 'FETCH_NODE_HIDE';

export const FETCH_PRES_SELECT = 'FETCH_PRES_SELECT';
export const FETCH_PRES_MOVE = 'FETCH_PRES_MOVE';

export const SET_FRAME_FETCH = 'SET_FRAME_FETCH';
//
export const ACCEPT_FETCH = 'ACCEPT_FETCH'; // fetch succeeded, but don't update store with results
export const RESOLVE_FETCH = 'RESOLVE_FETCH';
export const REJECT_FETCH = 'REJECT_FETCH';


export function setGeoVect(geo_vect) {
  return {
    type: SET_GEO_VECT,
    payload: {
      geo_vect,
    },
  };
}

export function resume() {
  // TODO init from local storage (eventually integrate with git)
  return (dispatch, getState) => {
    const { geo_vect, auth_token } = getState();
    const vect = [now(), ...geo_vect.slice(1)];

    dispatch({
      type: FETCH_RESUME,
      payload: null,
    });

    const unsub = firebase.auth().onAuthStateChanged(auth_user => {
      unsub();

      if (auth_user) {
        auth_user.getToken(true).then(auth_token => {
          dispatch({
            type: AUTH_RESUME,
            payload: {
              auth_user,
              auth_token,
            },
          });

          fetch('/api/resume', {
            method: 'POST',
            credentials: 'same-origin',
            headers: new Headers({
              'Content-Type': 'application/json',
            }),
            body: JSON.stringify({
              vect,
              auth_token,
            }),
          }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
        });
      }
      else {
        dispatch({
          type: RESOLVE_FETCH,
          payload: {
            // no user, no dish
          },
        });
      }
    });
  };
}

export function login1({ email, pass, new_email, google, facebook, anonymous }) {
  return {
    type: FETCH_LOGIN,
    payload: {
      email,
      pass,
      new_email,
      google,
      facebook,
      anonymous,
    },
  };
}

export function login2(auth_user) {
  return (dispatch, getState) => {
    const { geo_vect, auth_token } = getState();
    const vect = [now(), ...geo_vect.slice(1)];

    auth_user.getToken(true).then(auth_token => {
      dispatch({
        type: AUTH_LOGIN,
        payload: {
          vect,
          auth_user,
          auth_token,
        },
      });

      fetch('/api/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          vect,
          auth_token,
        }),
      }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
    })
  };
}

export function sign1({ google, facebook, pass }) {
  return {
    type: FETCH_SIGN,
    payload: {
      google,
      facebook,
      pass,
    }
  }
}

export function sign2({ auth_user, user, google, facebook, pass }) {
  return (dispatch, getState) => {
    const { geo_vect, auth_token } = getState();
    const vect = [now(), ...geo_vect.slice(1)];

    const node_by_id = {
      [user.properties.id]: Object.assign({}, user, {
        properties: Object.assign({}, user.properties, {
          sign_v: vect,
          google,
          facebook,
          pass,
        }),
      }),
    };

    dispatch({
      type: AUTH_SIGN,
      payload: {
        auth_user,
        node_by_id,
      },
    });

    fetch('/api/set', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        vect,
        auth_token,
        node_by_id,
      }),
    }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
  };
}

export function logout(auth_user) {
  return (dispatch, getState) => {
    const { geo_vect, auth_token } = getState();
    const vect = [now(), ...geo_vect.slice(1)];

    dispatch({
      type: FETCH_LOGOUT,
      payload: null,
    });

    firebase.auth().signOut().then(() => {
      dispatch({
        type: AUTH_LOGOUT,
        payload: null,
      });

      fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          vect,
          auth_token,
        }),
      }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
    });
  };
}

export function nodeInit({ parent_path_press, parent_out_press, parent_out_defs}) {
  return (dispatch, getState) => {
    const { geo_vect, auth_token, auth_user } = getState();
    const vect = [now(), ...geo_vect.slice(1)];

    const user_id = auth_user.uid;

    const parent_id = parent_path_press[parent_path_press.length - 1].properties.end_id;
    const child_id = uuid();
    const def_id = uuid();
    const pres_id = uuid();

    const node_by_id = {
      [child_id]: {
        labels: [NodeLabels.Node],
        properties: {
          id: child_id,
          user_id,
          exp: '',
          raw: null,
          init_v: vect,
          hide_v: [],
          commit_v: [],
          edit_v: [],
        },
      },
    };
    
    const link_by_id = parent_path_press.reduce((pres_by_id, pres) => { // select everything along path
      return Object.assign(pres_by_id, {
        [pres.properties.id]: Object.assign({}, pres, {
          properties: Object.assign({}, pres.properties, {
            select_v: vect,
          }),
        }),
      });
    }, {
      [def_id]: {
        type: LinkTypes.DEFINE,
        properties: {
          id: def_id,
          user_id,
          start_id: parent_id,
          out_index: parent_out_defs.reduce((push_index, def) => {
            return (push_index <= def.properties.in_index ) ? def.properties.in_index + 1 : push_index;
          }, 0),
          end_id: child_id,
          in_index: 0,
          init_v: vect,
          hide_v: [],
          select_v: [],
          edit_v: [],
        },
      },
      [pres_id]: {
        type: LinkTypes.PRESENT,
        properties: {
          id: pres_id,
          user_id,
          start_id: parent_id,
          out_index: parent_out_press.reduce((push_index, pres) => {
            return (push_index <= pres.properties.out_index ) ? pres.properties.out_index + 1 :  push_index;
          }, 0),
          enlist: true,
          v: [0, 0, 0, 0],
          end_id: child_id,
          in_index: 0,
          open: true,
          list: true,
          init_v: vect,
          hide_v: [],
          select_v: vect, // newly init Node is auto selected
          edit_v: [],
        },
      },
    });

    dispatch({
      type: FETCH_NODE_INIT,
      payload: {
        node_by_id,
        link_by_id,
      },
    });

    fetch('/api/set', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        vect,
        auth_token,
        node_by_id,
        link_by_id,
      }),
    }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
  };
}

export function nodeEdit({ node, editorState }) { 
  return (dispatch, getState) => {
    const { geo_vect, auth_token } = getState();
    const vect = [now(), ...geo_vect.slice(1)];

    const content = editorState.getCurrentContent();
    const node_by_id = {
      [node.properties.id]: Object.assign({}, node, {
        properties: Object.assign({}, node.properties, {
          edit_v: vect,
          exp: content.getPlainText('\n').split('\n')[0],
          raw: convertToRaw(content),
        }),
        editorState,
      }),
    };

    dispatch({
      type: FETCH_NODE_EDIT,
      payload: {
        node_by_id,
      },
    });

    fetch('/api/set', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        vect,
        auth_token,
        node_by_id,
      }), // TODO strip editorState from posted params? (for efficiency) ideally we'd store this info though
    }).then(resolveFetch(dispatch, true)).catch(resolveError(dispatch));
  }
}

export function nodeCommit({ node }) {
  return (dispatch, getState) => {
    const { geo_vect, auth_token } = getState();
    const vect = [now(), ...geo_vect.slice(1)];

    const node_by_id = {
      [node.properties.id]: Object.assign({}, node, {
        properties: Object.assign({}, node.properties, {
          commit_v: vect,
          exp: getNodeExpFromEditorState(node), 
        }),
        coords: vect.map(exp => {
          return {
            exp,
            node_id: uuid(),
            def_oc_id: uuid(), // used on create c
            def_cn_id: uuid(),
          }
        })
      }),
    };

    dispatch({
      type: FETCH_NODE_COMMIT,
      payload: {
        node_by_id,
      },
    });

    fetch('/api/set', { // TODO special fetch url? for specific commit function? yes!
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        vect,
        auth_token,
        node_by_id,
      }),
    })
    .then(resolveFetch(dispatch))
    .catch(resolveError(dispatch));
  };
}

export function nodeHide(node) {
  return (dispatch, getState) => {
    const { geo_vect, auth_token } = getState();
    const vect = [now(), ...geo_vect.slice(1)];

    const node_by_id = {
      [node.properties.id]: Object.assign({}, node, {
        properties: Object.assign({}, node.properties, {
          hide_v: (node.properties.hide_v && node.properties.hide_v.length !== 0)
            ? []
            : vect, // unhides if already hidden
        }),
      }),
    };

    dispatch({
      type: FETCH_NODE_HIDE,
      payload: {
        node_by_id,
      },
    });

    fetch('/api/set', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        vect,
        auth_token,
        node_by_id,
      }),
    })
    .then(resolveFetch(dispatch))
    .catch(resolveError(dispatch));
  };
}

export function presSelect(path_press) {
  return (dispatch, getState) => {
    const { geo_vect, auth_token } = getState();
    const vect = [now(), ...geo_vect.slice(1)];

    const link_by_id = path_press.reduce((link_by_id, pres) => {
      return Object.assign({}, link_by_id, {
        [pres.properties.id]: Object.assign({}, pres, {
          properties: Object.assign({}, pres.properties, {
            select_v: vect,
          }),
        }),
      });
    }, {}); // select everything along path

    dispatch({
      type: FETCH_PRES_SELECT,
      payload: {
        link_by_id,
      },
    });

    fetch(`/api/set`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        vect,
        auth_token,
        link_by_id,
      }),
    }).then(resolveFetch(dispatch, true)).catch(resolveError(dispatch));
  };
}

export function presMove({ modify_read, delete_read, create_read}) {
  return (dispatch, getState) => {
    const { geo_vect, auth_token } = getState();
    const vect = [now(), ...geo_vect.slice(1)];

    const params = {
      vect,
      user_id: auth_user.uid,
      node_by_id: {},
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
      type: FETCH_PRES_MOVE,
      payload: params,
    });

    fetch(`/api/set`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        vect,
        auth_token,
      }),
    })
    .then(resolveFetch(dispatch))
    .catch(resolveError(dispatch));
  };
}


export function linkInit(author, start_node, start_path, end_node, end_path) {
  return (dispatch, getState) => {
    const vect = [now(), ...getState().vect.slice(1)];


  };
}

export function selectDef() {

}