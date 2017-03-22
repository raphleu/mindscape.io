module.exports = (function() {
  const NodeLabels = {
    Note: 'Note', // all mindscape nodes are :Notes
    //
    Author: 'Author',
    Coordinator: 'Coordinator',
    T: 'T',
    X: 'X',
    Y: 'Y',
    Z: 'Z',
  };
  const LinkTypes = {
    DEFINE: 'DEFINE', // represent definition or determination
    PRESENT: 'PRESENT', // represents framing
  };


  const NotePositions = {
    STATIC: 'static',
    ABSOLUTE: 'absolute',
  };
  const NoteDisplays = {
    POINT: 'POINT',
    HEAD: 'HEAD',
    BODY: 'BODY',
  };
  const NoteBodies = {
    LIST: 'LIST',
    PLANE: 'PLANE',
  };

  const Defaults = {
    Note: {
      labels: [NodeLabels.Note],
      properties: {
        id: 0,
        author_id: 0,
        value: '',
        create_t: 0,
        create_x: 0,
        create_y: 0,
        create_z: 0,
        modify_t: 0,
        modify_x: 0,
        modify_y: 0,
        modify_z: 0,
        commit_t: 0,
        commit_x: 0,
        commit_y: 0,
        commit_z: 0,
        delete_t: 0,
        delete_x: 0,
        delete_y: 0,
        delete_z: 0,
      },
    },
    DEFINE: {
      type: LinkTypes.DEFINE,
      properties: {
        id: 0,
        end_id: 0,
        start_id: 0,
        author_id: 0,
        in_index: 0,
        out_index: 0,
        create_t: 0,
        create_x: 0,
        create_y: 0,
        create_z: 0,
        modify_t: 0,
        modify_x: 0,
        modify_y: 0,
        modify_z: 0,
        delete_t: 0,
        delete_x: 0,
        delete_y: 0,
        delete_z: 0,
      }
    },
    PRESENT: {
      type: LinkTypes.PRESENT,
      properties: {
        id: 0,
        start_id: 0,
        end_id: 0,
        author_id: 0,
        out_index: 0,
        in_index: 0,
        frame: 0,
        current: 0,
        position: NotePositions.STATIC,
        x: 0,
        y: 0,
        display: NoteDisplays.BODY,
        body: NoteBodies.LIST,
        create_t: 0,
        create_x: 0,
        create_y: 0,
        create_z: 0,
        modify_t: 0,
        modify_x: 0,
        modify_y: 0,
        modify_z: 0,
        delete_t: 0,
        delete_x: 0,
        delete_y: 0,
        delete_z: 0,
      }
    }
  }
  return  {
    NodeLabels,
    LinkTypes,
    NotePositions,
    NoteDisplays,
    NoteBodies,
  };
})();

