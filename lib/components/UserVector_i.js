var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';
import { Vector } from './Vector';

import { connect } from 'react-redux';

import { now } from 'lodash';

var UserVector = function (_React$Component) {
  _inherits(UserVector, _React$Component);

  function UserVector(props) {
    _classCallCheck(this, UserVector);

    var _this = _possibleConstructorReturn(this, (UserVector.__proto__ || Object.getPrototypeOf(UserVector)).call(this, props));

    _this.state = {
      time: 0,
      timer_id: null
    };

    _this.updateTime = _this.updateTime.bind(_this);
    return _this;
  }

  _createClass(UserVector, [{
    key: 'updateTime',
    value: function updateTime() {
      this.setState({
        time: now()
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({
        time: now(),
        timer_id: setInterval(this.updateTime, 1000)
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearInterval(timer_id);
    }
  }, {
    key: 'render',
    value: function render() {
      var geo_vect = this.props.geo_vect;
      var time = this.state.time;


      var vect = [time].concat(_toConsumableArray(geo_vect.slice(1)));

      return React.createElement(
        'div',
        { className: 'UserVector item' },
        React.createElement(Vector, { vect: vect })
      );
    }
  }]);

  return UserVector;
}(React.Component);

UserVector.propTypes = {
  geo_vect: PropTypes.arrayOf(PropTypes.number)
};

export var UserVector_i = connect(function (state) {
  return {
    geo_vect: state.geo_vect
  };
})(UserVector);