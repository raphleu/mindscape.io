module.exports = (function() {
  const DragTypes = {
    Note: 'Note',
  };

  const NodeLabels = {
    Node: 'Node', // all mindscape nodes are :Nodes
    //
    User: 'User',
    Coord: 'Coord',
    //
    T: 'T',
    X: 'X',
    Y: 'Y',
    Z: 'Z',
  };

  const LinkTypes = {
    DEFINE: 'DEFINE',
    PRESENT: 'PRESENT',
  };

  const Defaults = {
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
        string: '',
      },
    },
    DEFINE: {
      type: LinkTypes.DEFINE,
      properties: {
        init_vect: [],
        hide_vect: [],
        select_vect: [],
        edit_vect: [],
        id: '',
        start_id: '',
        out_index: 0,
        end_id: '',
        in_index: 0,
      }
    },
    PRESENT: {
      type: LinkTypes.PRESENT,
      properties: {
        init_vect: [0, 0, 0, 0],
        hide_vect: [],
        select_vect: [],
        edit_vect: [],
        id: '',
        user_id: '',
        start_id: '',
        out_index: 0,
        list: true,
        vect: [0, 0, 0, 0],
        end_id: '',
        in_index: 0,
        present_: false,
        present_list: false,
      }
    }
  }
  return  {
    DragTypes,
    NodeLabels,
    LinkTypes,
  };
})();

