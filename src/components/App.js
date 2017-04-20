import React from 'react';
import { PropTypes } from 'prop-types';

import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import { Main_In } from './Main_In';
import { Notation_InOut } from './Notation_InOut';


//import styles from './App.css';

// TODO add more routes <Route path="about" component={AboutContainer} />

export function App(props) {
  const { store, history } = props;
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={Main_In}>
          <IndexRoute component={Notation_InOut} />
        </Route>
      </Router>
    </Provider>
  );
};