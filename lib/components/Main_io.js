var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { PropTypes } from 'react';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { connect } from 'react-redux';
import { setGeoVect, resume } from '../actions';

import { flow, now } from 'lodash';

var Main = function (_React$Component) {
  _inherits(Main, _React$Component);

  function Main(props) {
    _classCallCheck(this, Main);

    var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, props));

    _this.state = {
      geolocator_id: null,
      spinner_id: null,
      spin: false
    };

    _this.updateVect = _this.updateVect.bind(_this);
    _this.spin = _this.spin.bind(_this);
    return _this;
  }

  _createClass(Main, [{
    key: 'updateVect',
    value: function updateVect(position) {
      var dispatch = this.props.dispatch;


      dispatch(setGeoVect([position.timestamp || 0, position.coords.longitude || 0, position.coords.latitude || 0, position.coords.altitude || 0]));
    }
  }, {
    key: 'spin',
    value: function spin() {
      var spin = this.state.spin;


      this.setState({
        spin: !spin
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var dispatch = this.props.dispatch;


      this.setState({
        geolocator_id: navigator.geolocation ? navigator.geolocation.watchPosition(this.updateVect) : null,
        spinner_id: setInterval(this.spin, 500)
      });

      dispatch(resume());
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _state = this.state,
          spinner_id = _state.spinner_id,
          geolocator_id = _state.geolocator_id;


      if (navigator.geolocation) {
        navigator.geolocation.clearWatch(geolocator_id);
      }

      clearInterval(spinner_id);
    }
  }, {
    key: 'render',
    value: function render() {
      var fetching = this.props.fetching;
      var spin = this.state.spin;

      // TODO add other nav options to header?

      return React.createElement(
        'div',
        { id: 'main' },
        React.createElement(
          'div',
          { id: 'header', style: {
              zIndex: 10,
              position: 'fixed',
              verticalAlign: 'bottom',
              top: 2,
              left: 167
            } },
          React.createElement('div', { id: 'flag', style: {
              display: fetching && spin ? 'block' : 'none',
              zIndex: 11,
              position: 'absolute',
              left: -24,
              bottom: 0,
              border: '1px solid lavender',
              borderTopRightRadius: 4,
              borderBottomLeftRadius: 4,
              width: 21,
              height: 12
            } }),
          React.createElement(
            'div',
            { id: 'logo', style: {
                position: 'absolute',
                left: -19,
                bottom: 0,
                border: '1px solid lavender',
                borderTopRightRadius: 4,
                borderBottomLeftRadius: 4
              } },
            React.createElement('div', { id: 'logo-content', className: 'content', style: {
                borderTopRightRadius: 4,
                borderBottomLeftRadius: 4,
                width: 10,
                height: 15
              } })
          ),
          React.createElement(
            'div',
            { id: 'nav', style: {
                border: '1px solid steelblue',
                borderTopLeftRadius: 4,
                borderBottomRightRadius: 4
              } },
            React.createElement(
              'div',
              { id: 'nav-content', className: 'content', style: {
                  borderTopLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  padding: '6px 8px'
                } },
              'mindscape.io'
            )
          ),
          React.createElement('div', { className: 'point', style: {
              zIndex: 11,
              position: 'absolute',
              left: -5,
              bottom: -5,
              width: 7,
              height: 7,
              backgroundColor: 'lightyellow',
              border: '1px solid gold',
              borderRadius: 2
            } })
        ),
        React.createElement('div', { className: 'header-filler', style: {
            height: 32
          } }),
        this.props.children
      );
    }
  }]);

  return Main;
}(React.Component);

Main.propTypes = {
  fetching: PropTypes.bool,
  dispatch: PropTypes.func
};

export var Main_io = flow(connect(function (state) {
  return {
    fetching: state.fetching
  };
}), DragDropContext(HTML5Backend))(Main);