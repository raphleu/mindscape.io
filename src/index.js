//import 'babel-polyfill' // import 'es6-promise'
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducers';

import { getLocalStorageState } from './util';

import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'

//import { AppContainer } from 'react-hot-loader';
import { App } from './components/App';
/*
  sketch of App component hierarchy
  App
    Main
      Authentication
    Notation
      User
        Dashboard
        Note
          Nucleus
          Space
            Note...
      User...
*/

const logger = store => next => action => {
  console.group(action.type, action.comment);
  console.info('dispatching', action);

  const result = next(action);
  console.log('next state', store.getState());

  console.groupEnd();

  return result;
}

const store = createStore(
  rootReducer,
  getLocalStorageState(),
  applyMiddleware(
    thunkMiddleware,
    logger
  )
);

const history = syncHistoryWithStore(browserHistory, store);

const render = (Component) => {
  ReactDOM.render(
    <Component store={store} history={history} />,
    document.getElementById('root')
  );
}

render(App);

// Hot Module Replacement API
/*
if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NewApp = require('./components/App').App
    render(NewApp)
  });
}
*/
//import { createLogger } from 'redux-logger';

