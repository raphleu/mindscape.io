import React from 'react';
import { PropTypes } from 'prop-types';

import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { Main_io } from './Main_io';
import { Notation_i } from './Notation_i';

//import styles from './App.css';

// TODO add more routes <Route path="about" component={AboutContainer} />

export function App(props) {
  var store = props.store,
      history = props.history;

  return React.createElement(
    Provider,
    { store: store },
    React.createElement(
      Router,
      { history: history },
      React.createElement(
        Route,
        { path: '/', component: Main_io },
        React.createElement(IndexRoute, { component: Notation_i })
      )
    )
  );
};