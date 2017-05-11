module.exports = function () {
  var DragTypes = {
    Pres: 'Pres'
  };

  var NodeLabels = {
    Node: 'Node', // all mindscape nodes are :Nodes
    //
    User: 'User',
    Coord: 'Coord',
    //
    T: 'T',
    X: 'X',
    Y: 'Y',
    Z: 'Z'
  };

  var LinkTypes = {
    DEFINE: 'DEFINE',
    PRESENT: 'PRESENT'
  };

  var Defaults = {
    Node: {
      labels: [NodeLabels.Node],
      properties: {
        init_vect: [0, 0, 0, 0],
        hide_vect: [],
        commit_vect: [],
        edit_vect: [],
        id: '',
        user_id: '',
        index: null, //the index of the vect for which this node's string is a value
        string: ''
      }
    },
    DEFINE: {
      type: LinkTypes.DEFINE,
      properties: {
        id: '',
        start_id: '',
        out_index: 0,
        end_id: '',
        in_index: 0,
        init_v: [],
        hide_v: [],
        select_v: [],
        edit_v: []
      }
    },
    PRESENT: {
      type: LinkTypes.PRESENT,
      properties: {
        id: '',
        user_id: '',
        start_id: '',
        out_index: 0,
        enlist: true,
        v: [0, 0, 0, 0],
        end_id: '',
        in_index: 0,
        open: false,
        list: false,
        init_v: [0, 0, 0, 0],
        hide_v: [],
        select_v: [],
        edit_v: []
      }
    }
  };
  return {
    DragTypes: DragTypes,
    NodeLabels: NodeLabels,
    LinkTypes: LinkTypes
  };
}();