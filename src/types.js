module.exports = (function() {
  const PositionModes = {
    SEQUENCE: 'SEQUENCE',
    SCATTERPLOT: 'SCATTERPLOT',
  };

  const DisplayModes = {
    MIN: 'MIN',
    BASIC: 'BASIC',
    SEQUENCE: 'SEQUENCE',
    PLANE: 'PLANE',
  };

  const SequenceDirections = {
    DOWN: 'DOWN',
    RIGHT: 'RIGHT',
  };

  const DragTypes = {
    NOTE: 'NOTE',
  };

  return  {
    PositionModes,
    DisplayModes,
    SequenceDirections,
    DragTypes
  };
})();

