var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux';
import { presSelect } from '../actions';

var PresSelect = function (_React$Component) {
  _inherits(PresSelect, _React$Component);

  function PresSelect(props) {
    _classCallCheck(this, PresSelect);

    var _this = _possibleConstructorReturn(this, (PresSelect.__proto__ || Object.getPrototypeOf(PresSelect)).call(this, props));

    _this.state = {
      clicks: 0,
      click_timer_id: null
    };

    _this.handleClick = _this.handleClick.bind(_this);
    _this.dispatchClicks = _this.dispatchClicks.bind(_this);
    return _this;
  }

  _createClass(PresSelect, [{
    key: 'handleClick',
    value: function handleClick(event) {
      console.log('click');
      event.stopPropagation();
      var _state = this.state,
          clicks = _state.clicks,
          click_timer_id = _state.click_timer_id;


      if (click_timer_id) {
        clearTimeout(click_timer_id);
      }

      this.setState({
        clicks: clicks + 1,
        click_timer_id: setTimeout(this.dispatchClicks, 500)
      });
    }
  }, {
    key: 'dispatchClicks',
    value: function dispatchClicks() {
      var _props = this.props,
          path_press = _props.path_press,
          dispatch = _props.dispatch;
      var clicks = this.state.clicks;


      dispatch(presSelect(path_press));

      this.setState({
        clicks: 0,
        click_timer_id: null
      });

      // TODO something different if clicks > 1
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'node-selector', onClick: this.handleClick },
        this.props.children
      );
    }
  }]);

  return PresSelect;
}(React.Component);

PresSelect.propTypes = {
  path_press: PropTypes.arrayOf(PropTypes.object).isRequired
};

export var PresSelect_o = connect()(PresSelect);