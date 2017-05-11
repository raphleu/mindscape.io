var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

export var DefineArrow = function (_React$Component) {
  _inherits(DefineArrow, _React$Component);

  function DefineArrow(props) {
    _classCallCheck(this, DefineArrow);

    return _possibleConstructorReturn(this, (DefineArrow.__proto__ || Object.getPrototypeOf(DefineArrow)).call(this, props));
  }

  _createClass(DefineArrow, [{
    key: 'getMarker',
    value: function getMarker(relationship) {
      return 'url(#' + relationship.type + ')';
    }
  }, {
    key: 'getPoints',
    value: function getPoints(source, target) {
      var dx = target.x - source.x;
      var dy = target.y - source.y;
      var dr = Math.sqrt(dx * dx + dy * dy);
      var spacing = 12;
      var numPoints = Math.floor(dr / spacing);

      var pts = '';
      if (numPoints > 0) {
        var step_dx = dx / numPoints;
        var step_dy = dy / numPoints;

        for (var i = 0; i < numPoints + 1; i++) {
          pts += source.x + i * step_dx + ',' + (source.y + i * step_dy) + ' ';
        }
      }
      return pts;
    }
    /*<svg className='space-svg' width={radius} height={radius}>
    <defs>
     <marker id='DEFINE'>
       <polyline points='0,0 3,3 0,6' stroke='steelblue' fill='none'/>
     </marker>
     <marker id='PRESENT'>
       <polyline points='0,0 3,3 0,6' stroke='darkturquoise' fill='none'/>
     </marker>
     <marker id='EQUATE'>
       <polyline points='0,0 0,6' stroke='darckorchid' fill='none'/>
     </marker>
    </defs>
    </svg>*/

  }, {
    key: 'render',
    value: function render() {
      return null;
      var _props = this.props,
          relationship = _props.relationship,
          source = _props.source,
          source_read = _props.source_read,
          target = _props.target,
          target_read = _props.target_read;


      var points = this.getPoints(source_read.properties, target_read.properties);
      var marker = this.getMarker(relationship);

      return React.createElement('polyline', {
        className: 'arrow',
        points: points,
        markerMid: marker,
        stroke: 'none',
        strokeWidth: 2
      });
    }
  }]);

  return DefineArrow;
}(React.Component);
function mapStateToProps(state, ownProps) {
  var arrow_id = ownProps.arrow_id;

  var relationship = state.relationship_by_id[arrow_id];

  var source = state.node_by_id[relationship.start];
  var source_read = state.relationship_by_id[source.read_id];

  var x = source_read.properties.x;
  var y = source_read.properties.y;
  var source_super_read_id = source_read.properties.super_read_id;

  function getAbsolutePosition(x, y, read_id) {
    var read = state.relationship_by_id[read_id];
    if (read.properties.super_read_id) {
      // check for minimized/collapsed/expanded/maximized!
      if (read.properties.position_mode === PositionModes.SEQUENCE) {}
      return getAbsolutePosition(x + read.properties.x, y + read.properties.y, read.properties.super_read_id);
    }
    return {
      x: x,
      y: y
    };
  }

  var target = state.node_by_id[relationship.end];
  var target_read = state.relationship_by_id[target.read_id];

  // TODO trace the read path up, aggregating position

  return {
    relationship: relationship,
    source: source,
    source_read: source_read,
    target: target,
    target_read: target_read
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}
export var DefineArrowContainer = connect(mapStateToProps, mapDispatchToProps)(DefineArrow);