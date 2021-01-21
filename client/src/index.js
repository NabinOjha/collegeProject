import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers/rootReducer';
import thunk from 'redux-thunk';

import { composeWithDevTools } from 'redux-devtools-extension';

ReactDOM.render(
  <Provider store={createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))}>
    <App />
  </Provider>,
  document.getElementById('root')
);
