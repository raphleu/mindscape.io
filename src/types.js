module.exports = (function() {
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


  return  {
    Displays,
    Directions,
    Positions,
    DragTypes,
  };
})();

