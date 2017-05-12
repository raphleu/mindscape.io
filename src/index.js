//import 'babel-polyfill' // import 'es6-promise'
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './reducers';

import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'

//import { AppContainer } from 'react-hot-loader';
import { App } from './components/App';

import * as firebase from 'firebase/app';
import 'firebase/auth';

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBHOkv_5p_nQpA0Pvd55WK1Ep2dgswJKKk",
  authDomain: "mindscape-868a8.firebaseapp.com",
  databaseURL: "https://mindscape-868a8.firebaseio.com",
  projectId: "mindscape-868a8",
  storageBucket: "mindscape-868a8.appspot.com",
  messagingSenderId: "797370840442"
};

firebase.initializeApp(config);

const logger = store => next => action => {
  console.group(action.type);
  console.info('dispatching', action);

  const result = next(action);
  console.log('next state', store.getState());

  console.groupEnd();

  return result;
}

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    logger
  )
);

const history = syncHistoryWithStore(browserHistory, store);

function render(Component) {
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

