module.exports = (function() {
  const Nodes = {
    Author: 'Author',
    Note: 'Note',
  };

  const Relationships = {
    WRITE: 'WRITE',
    READ: 'READ',
    LINK: 'LINK',
  };
  const Displays = {
    POINT: 'POINT',
    HEADER: 'HEADER',
    POSITION: 'POSITION',
    MOMENTUM: 'MOMENTUM',
    SEQUENCE: 'SEQUENCE',
    PLANE: 'PLANE',
  };

  const Directions = {
    UP: 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
  };

  const Positions = {
    DOCK: 'DOCK',
    DRIFT: 'DRIFT',
  };

  const DragTypes = {
    READ: 'READ',
  };

  const Defaults = {
    Note: {
      id: null,
      initial_time: null,
      final_time: null,
      // elapsed_time: the time spent writing!
      position_text: '',
      position_editorState: null,
      momentum_text: '',
      momentum_editorState: null,
      write_id: null,
      read_ids: [],
      link_ids: [],
    },
    READ: {
      id: null,
      start: null,
      end: null,
      type: Relationships.READ,
      properties: {
        initial_time: null,
        final_time: null,
        super_read_id: null,
        position: Positions.DOCK,
        x: 0,
        y: 0,
        display: Displays.SEQUENCE,
        direction: Directions.DOWN,
        radius: 1600,
        sub_read_ids: [],
      },
    },
  };

  return  {
    Nodes,
    Relationships,
    Displays,
    Directions,
    Positions,
    DragTypes,
    Defaults,
  };
})();

