function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { NodeLabels, LinkTypes } from './types';

import { convertToRaw } from 'draft-js';

import uuid from 'uuid/v4';
import { now } from 'lodash';

import * as firebase from 'firebase/app';
import 'firebase/auth';

function resolveFetch(dispatch, dont_resolve) {
  return function (response) {
    console.log('res', response);
    response.json().then(function (json) {
      if (response.ok) {
        dispatch({
          type: dont_resolve ? ACCEPT_FETCH : RESOLVE_FETCH,
          payload: json.data
        });
      } else {
        dispatch({
          type: REJECT_FETCH,
          payload: json.data
        });
      }
    });
  };
}

function resolveError(dispatch) {
  return function (error) {
    dispatch({
      type: REJECT_FETCH,
      payload: error
    });
  };
}

function getNodeExpFromEditorState(node) {
  return node.editorState.getCurrentContent().getPlainText('\n'); // TODO FIXME
}

export var SET_GEO_VECT = 'SET_GEO_VECT';

export var AUTH_RESUME = 'AUTH_RESUME';
export var AUTH_LOGIN = 'AUTH_LOGIN';
export var AUTH_SIGN = 'AUTH_SIGN';
export var AUTH_LOGOUT = 'AUTH_LOGOUT';

export var FETCH_RESUME = 'FETCH_RESUME';
export var FETCH_LOGIN = 'FETCH_LOGIN';
export var FETCH_SIGN = 'FETCH_SIGN';
export var FETCH_LOGOUT = 'FETCH_LOGOUT';

export var FETCH_NODE_INIT = 'FETCH_NODE_INIT';
export var FETCH_NODE_EDIT = 'FETCH_NODE_EDIT';
export var FETCH_NODE_COMMIT = 'FETCH_NODE_COMMIT';
export var FETCH_NODE_HIDE = 'FETCH_NODE_HIDE';

export var FETCH_PRES_SELECT = 'FETCH_PRES_SELECT';
export var FETCH_PRES_MOVE = 'FETCH_PRES_MOVE';

export var SET_FRAME_FETCH = 'SET_FRAME_FETCH';
//
export var ACCEPT_FETCH = 'ACCEPT_FETCH'; // fetch succeeded, but don't update store with results
export var RESOLVE_FETCH = 'RESOLVE_FETCH';
export var REJECT_FETCH = 'REJECT_FETCH';

export function setGeoVect(geo_vect) {
  return {
    type: SET_GEO_VECT,
    payload: {
      geo_vect: geo_vect
    }
  };
}

export function resume() {
  // TODO init from local storage (eventually integrate with git)
  return function (dispatch, getState) {
    var _getState = getState(),
        geo_vect = _getState.geo_vect,
        auth_token = _getState.auth_token;

    var vect = [now()].concat(_toConsumableArray(geo_vect.slice(1)));

    dispatch({
      type: FETCH_RESUME,
      payload: null
    });

    var unsub = firebase.auth().onAuthStateChanged(function (auth_user) {
      unsub();

      if (auth_user) {
        auth_user.getToken(true).then(function (auth_token) {
          dispatch({
            type: AUTH_RESUME,
            payload: {
              auth_user: auth_user,
              auth_token: auth_token
            }
          });

          fetch('/api/resume', {
            method: 'POST',
            credentials: 'same-origin',
            headers: new Headers({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
              vect: vect,
              auth_token: auth_token
            })
          }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
        });
      } else {
        dispatch({
          type: RESOLVE_FETCH,
          payload: {
            // no user, no dish
          }
        });
      }
    });
  };
}

export function login1(_ref) {
  var email = _ref.email,
      pass = _ref.pass,
      new_email = _ref.new_email,
      google = _ref.google,
      facebook = _ref.facebook,
      anonymous = _ref.anonymous;

  return {
    type: FETCH_LOGIN,
    payload: {
      email: email,
      pass: pass,
      new_email: new_email,
      google: google,
      facebook: facebook,
      anonymous: anonymous
    }
  };
}

export function login2(auth_user) {
  return function (dispatch, getState) {
    var _getState2 = getState(),
        geo_vect = _getState2.geo_vect,
        auth_token = _getState2.auth_token;

    var vect = [now()].concat(_toConsumableArray(geo_vect.slice(1)));

    auth_user.getToken(true).then(function (auth_token) {
      dispatch({
        type: AUTH_LOGIN,
        payload: {
          vect: vect,
          auth_user: auth_user,
          auth_token: auth_token
        }
      });

      fetch('/api/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          vect: vect,
          auth_token: auth_token
        })
      }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
    });
  };
}

export function sign1(_ref2) {
  var google = _ref2.google,
      facebook = _ref2.facebook,
      pass = _ref2.pass;

  return {
    type: FETCH_SIGN,
    payload: {
      google: google,
      facebook: facebook,
      pass: pass
    }
  };
}

export function sign2(_ref3) {
  var auth_user = _ref3.auth_user,
      user = _ref3.user,
      google = _ref3.google,
      facebook = _ref3.facebook,
      pass = _ref3.pass;

  return function (dispatch, getState) {
    var _getState3 = getState(),
        geo_vect = _getState3.geo_vect,
        auth_token = _getState3.auth_token;

    var vect = [now()].concat(_toConsumableArray(geo_vect.slice(1)));

    var node_by_id = _defineProperty({}, user.properties.id, Object.assign({}, user, {
      properties: Object.assign({}, user.properties, {
        sign_v: vect,
        google: google,
        facebook: facebook,
        pass: pass
      })
    }));

    dispatch({
      type: AUTH_SIGN,
      payload: {
        auth_user: auth_user,
        node_by_id: node_by_id
      }
    });

    fetch('/api/set', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        vect: vect,
        auth_token: auth_token,
        node_by_id: node_by_id
      })
    }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
  };
}

export function logout(auth_user) {
  return function (dispatch, getState) {
    var _getState4 = getState(),
        geo_vect = _getState4.geo_vect,
        auth_token = _getState4.auth_token;

    var vect = [now()].concat(_toConsumableArray(geo_vect.slice(1)));

    dispatch({
      type: FETCH_LOGOUT,
      payload: null
    });

    firebase.auth().signOut().then(function () {
      dispatch({
        type: AUTH_LOGOUT,
        payload: null
      });

      fetch('/api/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          vect: vect,
          auth_token: auth_token
        })
      }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
    });
  };
}

export function nodeInit(_ref4) {
  var parent_path_press = _ref4.parent_path_press,
      parent_out_press = _ref4.parent_out_press,
      parent_out_defs = _ref4.parent_out_defs;

  return function (dispatch, getState) {
    var _parent_path_press$re;

    var _getState5 = getState(),
        geo_vect = _getState5.geo_vect,
        auth_token = _getState5.auth_token,
        auth_user = _getState5.auth_user;

    var vect = [now()].concat(_toConsumableArray(geo_vect.slice(1)));

    var user_id = auth_user.uid;

    var parent_id = parent_path_press[parent_path_press.length - 1].properties.end_id;
    var child_id = uuid();
    var def_id = uuid();
    var pres_id = uuid();

    var node_by_id = _defineProperty({}, child_id, {
      labels: [NodeLabels.Node],
      properties: {
        id: child_id,
        user_id: user_id,
        exp: '',
        raw: null,
        init_v: vect,
        hide_v: [],
        commit_v: [],
        edit_v: []
      }
    });

    var link_by_id = parent_path_press.reduce(function (pres_by_id, pres) {
      // select everything along path
      return Object.assign(pres_by_id, _defineProperty({}, pres.properties.id, Object.assign({}, pres, {
        properties: Object.assign({}, pres.properties, {
          select_v: vect
        })
      })));
    }, (_parent_path_press$re = {}, _defineProperty(_parent_path_press$re, def_id, {
      type: LinkTypes.DEFINE,
      properties: {
        id: def_id,
        user_id: user_id,
        start_id: parent_id,
        out_index: parent_out_defs.reduce(function (push_index, def) {
          return push_index <= def.properties.in_index ? def.properties.in_index + 1 : push_index;
        }, 0),
        end_id: child_id,
        in_index: 0,
        init_v: vect,
        hide_v: [],
        select_v: [],
        edit_v: []
      }
    }), _defineProperty(_parent_path_press$re, pres_id, {
      type: LinkTypes.PRESENT,
      properties: {
        id: pres_id,
        user_id: user_id,
        start_id: parent_id,
        out_index: parent_out_press.reduce(function (push_index, pres) {
          return push_index <= pres.properties.out_index ? pres.properties.out_index + 1 : push_index;
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
        edit_v: []
      }
    }), _parent_path_press$re));

    dispatch({
      type: FETCH_NODE_INIT,
      payload: {
        node_by_id: node_by_id,
        link_by_id: link_by_id
      }
    });

    fetch('/api/set', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        vect: vect,
        auth_token: auth_token,
        node_by_id: node_by_id,
        link_by_id: link_by_id
      })
    }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
  };
}

export function nodeEdit(_ref5) {
  var node = _ref5.node,
      editorState = _ref5.editorState;

  return function (dispatch, getState) {
    var _getState6 = getState(),
        geo_vect = _getState6.geo_vect,
        auth_token = _getState6.auth_token;

    var vect = [now()].concat(_toConsumableArray(geo_vect.slice(1)));

    var content = editorState.getCurrentContent();
    var node_by_id = _defineProperty({}, node.properties.id, Object.assign({}, node, {
      properties: Object.assign({}, node.properties, {
        edit_v: vect,
        exp: content.getPlainText('\n').split('\n')[0],
        raw: convertToRaw(content)
      }),
      editorState: editorState
    }));

    dispatch({
      type: FETCH_NODE_EDIT,
      payload: {
        node_by_id: node_by_id
      }
    });

    fetch('/api/set', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        vect: vect,
        auth_token: auth_token,
        node_by_id: node_by_id
      }) }).then(resolveFetch(dispatch, true)).catch(resolveError(dispatch));
  };
}

export function nodeCommit(_ref6) {
  var node = _ref6.node;

  return function (dispatch, getState) {
    var _getState7 = getState(),
        geo_vect = _getState7.geo_vect,
        auth_token = _getState7.auth_token;

    var vect = [now()].concat(_toConsumableArray(geo_vect.slice(1)));

    var node_by_id = _defineProperty({}, node.properties.id, Object.assign({}, node, {
      properties: Object.assign({}, node.properties, {
        commit_v: vect,
        exp: getNodeExpFromEditorState(node)
      }),
      coords: vect.map(function (exp) {
        return {
          exp: exp,
          node_id: uuid(),
          def_oc_id: uuid(), // used on create c
          def_cn_id: uuid()
        };
      })
    }));

    dispatch({
      type: FETCH_NODE_COMMIT,
      payload: {
        node_by_id: node_by_id
      }
    });

    fetch('/api/set', { // TODO special fetch url? for specific commit function? yes!
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        vect: vect,
        auth_token: auth_token,
        node_by_id: node_by_id
      })
    }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
  };
}

export function nodeHide(node) {
  return function (dispatch, getState) {
    var _getState8 = getState(),
        geo_vect = _getState8.geo_vect,
        auth_token = _getState8.auth_token;

    var vect = [now()].concat(_toConsumableArray(geo_vect.slice(1)));

    var node_by_id = _defineProperty({}, node.properties.id, Object.assign({}, node, {
      properties: Object.assign({}, node.properties, {
        hide_v: node.properties.hide_v && node.properties.hide_v.length !== 0 ? [] : vect })
    }));

    dispatch({
      type: FETCH_NODE_HIDE,
      payload: {
        node_by_id: node_by_id
      }
    });

    fetch('/api/set', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        vect: vect,
        auth_token: auth_token,
        node_by_id: node_by_id
      })
    }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
  };
}

export function presSelect(path_press) {
  return function (dispatch, getState) {
    var _getState9 = getState(),
        geo_vect = _getState9.geo_vect,
        auth_token = _getState9.auth_token;

    var vect = [now()].concat(_toConsumableArray(geo_vect.slice(1)));

    var link_by_id = path_press.reduce(function (link_by_id, pres) {
      return Object.assign({}, link_by_id, _defineProperty({}, pres.properties.id, Object.assign({}, pres, {
        properties: Object.assign({}, pres.properties, {
          select_v: vect
        })
      })));
    }, {}); // select everything along path

    dispatch({
      type: FETCH_PRES_SELECT,
      payload: {
        link_by_id: link_by_id
      }
    });

    fetch('/api/set', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        vect: vect,
        auth_token: auth_token,
        link_by_id: link_by_id
      })
    }).then(resolveFetch(dispatch, true)).catch(resolveError(dispatch));
  };
}

export function presMove(_ref7) {
  var modify_read = _ref7.modify_read,
      delete_read = _ref7.delete_read,
      create_read = _ref7.create_read;

  return function (dispatch, getState) {
    var _getState10 = getState(),
        geo_vect = _getState10.geo_vect,
        auth_token = _getState10.auth_token;

    var vect = [now()].concat(_toConsumableArray(geo_vect.slice(1)));

    var params = {
      vect: vect,
      user_id: auth_user.uid,
      node_by_id: {},
      link_by_id: {}
    };

    if (modify_read) {
      params.link_by_id[modify_read.properties.id] = Object.assign({}, modify_read, {
        properties: Object.assign({}, modify_read.properties, {
          modify_t: t,
          modify_x: x,
          modify_y: y,
          modify_z: z
        })
      });
    } else if (delete_read && create_read) {
      params.link_by_id[delete_read.properties.id] = Object.assign({}, delete_read, {
        properties: Object.assign({}, delete_read.properties, {
          delete_t: t,
          delete_x: x,
          delete_y: y,
          delete_z: z
        })
      });

      params.link_by_id[create_read.properties.id] = Object.assign({}, create_read, {
        properties: Object.assign({}, delete_read.properties, {
          create_t: t,
          create_x: x,
          create_y: y,
          create_z: z
        })
      });
    }

    dispatch({
      type: FETCH_PRES_MOVE,
      payload: params
    });

    fetch('/api/set', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        vect: vect,
        auth_token: auth_token
      })
    }).then(resolveFetch(dispatch)).catch(resolveError(dispatch));
  };
}

export function linkInit(author, start_node, start_path, end_node, end_path) {
  return function (dispatch, getState) {
    var vect = [now()].concat(_toConsumableArray(getState().vect.slice(1)));
  };
}

export function selectDef() {}