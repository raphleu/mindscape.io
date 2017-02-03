import React, { PropTypes } from 'react';

import { Provider } from 'react-redux';

import { Router, Route, IndexRoute } from 'react-router';

import { Main } from './Main';
import { NotationContainer } from './NotationContainer';

//import styles from './App.css';

// TODO add more routes <Route path="about" component={AboutContainer} />

export const App = (props) => {
  const { store, history } = props;

  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={Main}>
          <IndexRoute component={NotationContainer} />
        </Route>
      </Router>
    </Provider>
  );
};