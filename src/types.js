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
    CURRENT: 'CURRENT',
    WRITE: 'WRITE', // represent definition or determination
    READ: 'READ', // represents framing
  };


  const NotePositions = {
    STATIC: 'STATIC',
    ABSOLUTE: 'ABSOLUTE',
  };
  const NoteDisplays = {
    POINT: 'POINT',
    HEAD: 'HEAD',
    BODY: 'BODY',
  };
  const NoteBodies = {
    OUTLINE: 'OUTLINE',
    PLANE: 'PLANE',
  };

  const Defaults = {
    READ: {
      type: LinkTypes.READ,
      properties: {
        id: null,
        author_id: null,
        current: 0,
        frame: false,
        position: NotePositions.STATIC,
        x: 0,
        y: 0,
        display: NoteDisplays.BODY,
        body: NoteBodies.OUTLINE,
        created_t: null,
        created_x: null,
        created_y: null,
        created_z: null,
        deleted_t: null,
        deleted_x: null,
        deleted_y: null,
        deleted_z: null,
      }
    }
  }
  return  {
    NodeLabels,
    RelationshipTypes,
    NotePositions,
    NoteDisplays,
    NoteBodies,
  };
})();

