import { NodeLabels, LinkTypes } from './types';

import uuid from 'uuid/v4';
import { now } from 'lodash';

function resolveFetch(dispatch) {
  return response => {
    console.log('res', response);
    response.json()
    .then(json => {
      if (response.ok) {
        dispatch({
          type: ACCEPT_FETCH,
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

function getExpFromNodeEditorState(node) {
  return node.editorState.getCurrentContent().getPlainText(); // TODO FIXME
}

export const FETCH_REGISTER = 'FETCH_REGISTER';
export const FETCH_RESUME = 'FETCH_RESUME';

export const FETCH_SIGN = 'FETCH_SIGN'
export const FETCH_LOGOUT = 'FETCH_LOGOUT';
export const FETCH_LOGIN = 'FETCH_LOGIN';

export const FETCH_NODE_INIT = 'FETCH_NODE_INIT';
export const FETCH_NODE_HIDE = 'FETCH_NODE_HIDE';
export const FETCH_NODE_COMMIT = 'FETCH_NODE_COMMIT';
export const FETCH_NODE_EDIT = 'FETCH_NODE_EDIT';

export const FETCH_NODE_SELECT = 'FETCH_NODE_SELECT';
export const MOVE_NODE_FETCH = 'MOVE_NODE_FETCH';

export const SET_FRAME_FETCH = 'SET_FRAME_FETCH';

export const ACCEPT_FETCH = 'ACCEPT_FETCH';
export const REJECT_FETCH = 'REJECT_FETCH';

// TODO init from local storage
// TODO store state into local storage... on every change? by dispatching action from Notation?

export function register({ vect }) {
  return dispatch => {
    const params = {vect};

    dispatch({
      type: FETCH_REGISTER,
      payload: params,
    });

    fetch('/api/register', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  };
}

export function resume({ vect }) {
  return dispatch => {
    // TODO init from local storage (eventually integrate with git)
    const params = {
      vect,
    };

    dispatch({
      type: FETCH_RESUME,
      payload: params,
    });

    fetch('/api/resume', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  };
}

export function sign({ vect, pass, edit_pass }) {
  return dispatch => {
    const params = {
      vect,
      pass,
      edit_pass,
    };

    dispatch({
      type: FETCH_SIGN,
      payload: params,
    });

    fetch('/api/sign', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  }
}

export function logout({ vect }) {
  return dispatch => {
    const params = {vect};

    dispatch({
      type: FETCH_LOGOUT,
      payload: params,
    });

    fetch('/api/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  };
}

export function login({ vect, name, pass }) {
  return dispatch => {
    const params = {
      vect,
      name,
      pass,
    };
    
    dispatch({
      type: FETCH_LOGIN,
      payload: params,
    });

    fetch('/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  };
}

export function edit({ vect, user, name, email }) {
  return dispatch => {
    const node = Object.assign({}, user, {
      properties: Object.assign({}, user.properties),
    });

    if (name) {
      node.properties.exp = name;
    }
    if (email) {
      node.properties.email = email;
    }

    const params = {
      vect,
      node_by_id: {
        [node.properties.id]: node,
      }
    };

    dispatch({
      type: FETCH_SIGN,
      payload: params,
    });

    fetch('/api/graph', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  }
}

export function nodeInit({vect, user, parent_path_press, parent_out_press, parent_in_defs}) {
  return dispatch => {
    const parent_id = parent_path_press[parent_path_press.length - 1].properties.end_id;
    const def_id = uuid();
    const pres_id = uuid();
    const child_id = uuid();

    const params = {
      node_by_id: {
        [child_id]: {
          labels: [NodeLabels.Node],
          properties: {
            init_vect: vect,
            hide_vect: [],
            commit_vect: [],
            edit_vect: [],
            id: child_id,
            user_id: user.properties.id,
            exp: '',
          },
        },
      },
      link_by_id: parent_path_press.reduce((pres_by_id, pres) => { // select everything along path
        return Object.assign(pres_by_id, {
          [pres.properties.id]: Object.assign({}, pres, {
            properties: Object.assign({}, pres.properties, {
              select_vect: vect,
            }),
          }),
        });
      }, {
        [pres_id]: {
          type: LinkTypes.PRESENT,
          properties: {
            init_vect: vect,
            hide_vect: [],
            select_vect: vect, // newly init Node is auto selected
            edit_vect: [],
            id: pres_id,
            user_id: user.properties.id,
            start_id: parent_id,
            out_index: parent_out_press.reduce((push_index, pres) => {
              return (push_index > pres.properties.out_index ) ? push_index : pres.properties.out_index + 1;
            }, 0),
            enlist: true,
            vect: [0, 0, 0, 0],
            end_id: child_id,
            in_index: 0,
            open: true,
            list: true,
          },
        },
        [def_id]: {
          type: LinkTypes.DEFINE,
          properties: {
            init_vect: vect,
            hide_vect: [],
            select_vect: [],
            edit_vect: [],
            id: def_id,
            user_id: user.properties.id,
            end_id: parent_id,
            in_index: parent_in_defs.reduce((push_index, def) => {
              return (push_index > def.properties.in_index ) ? push_index : def.properties.in_index + 1;
            }, 0),
            start_id: child_id,
            out_index: 0,
          },
        },
      }),
    };

    dispatch({
      type: FETCH_NODE_INIT,
      payload: params
    });

    fetch('/api/graph', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  };
}

export function nodeEdit({vect, node}) {
  return dispatch => {
    const params = {
      node_by_id: {
        [node.properties.id]: Object.assign({}, node, {
          properties: Object.assign({}, node.properties, {
            edit_vect: vect,
            exp: getExpFromNodeEditorState(node), 
          }),
        }),
      },
    };

    dispatch({
      type: FETCH_NODE_EDIT,
      payload: params,
    });

    fetch('/api/graph', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params), // TODO strip editorState from posted params? (for efficiency) ideally we'd store this info though
    })
    .then(resolveFetch(dispatch));
  };
}

export function nodeCommit({ vect, node }) {
  return dispatch => {
    const params = {
      node_by_id: {
        [node.properties.id]: Object.assign({}, node, {
          properties: Object.assign({}, node.properties, {
            commit_vect: vect,
            exp: getExpFromNodeEditorState(node), 
          }),
          coords: vect.map(exp => {
            return {
              exp,
              node_id: uuid(),
              def_id: uuid(),
            }
          })
        }),
      },
    };

    dispatch({
      type: FETCH_NODE_COMMIT,
      payload: params,
    });

    fetch('/api/graph', { // TODO special fetch url? for specific commit function? yes!
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  };
}

export function nodeHide({ vect, node }) {
  return dispatch => {
    const params = {
      node_by_id: {
        [node.properties.id]: Object.assign({}, node, {
          properties: Object.assign({}, node.properties, {
            hide_vect: (node.properties.hide_vect.length === 0) ? vect : [], // unhides if already hidden
          }),
        }),
      },
    };

    dispatch({
      type: FETCH_NODE_HIDE,
      payload: params
    });

    fetch('/api/graph', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  };
}

export function nodeSelect({ vect, path_press }) {
  return dispatch => {
    const params = {
      link_by_id: path_press.reduce((link_by_id, pres) => {
        return Object.assign({}, link_by_id, {
          [pres.properties.id]: Object.assign({}, pres, {
            properties: Object.assign({}, pres.properties, {
              select_vect: vect,
            }),
          }),
        });
      }, {}), // select everything along path
    };

    dispatch({
      type: FETCH_NODE_SELECT,
      payload: params,
    });

    fetch(`/api/graph`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  };
}

export function nodeMove({vect, user, modify_read, delete_read, create_read}) {
  return dispatch => {
    const params = {
      vect,
      user_id: user.properties.id,
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
      type: MOVE_NODE_FETCH,
      payload: params,
    });

    fetch(`/api/graph`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    })
    .then(resolveFetch(dispatch));
  };
}


export function linkInit(author, start_node, start_path, end_node, end_path) {
  return dispatch => {

  };
}

export function selectDef() {

}