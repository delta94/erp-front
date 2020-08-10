import thunk from 'redux-thunk';
import axios from 'axios';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { handleRequests } from '@redux-requests/core';
import { createDriver } from '@redux-requests/axios';

import auth from './auth/reducer';
import users from './users/reducer';

const loggerMiddleware = createLogger();

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

const { requestsReducer: requests, requestsMiddleware } = handleRequests({
  driver: createDriver(instance),
});

const rootReducer = combineReducers({
  requests,
  auth,
  users,
});

const middlewares = [
  ...requestsMiddleware,
  thunk,
];

// Disable Logger at server side.
// eslint-disable-next-line no-undef
if (process.browser && process.env.NODE_ENV !== 'production') {
  middlewares.push(loggerMiddleware);
}

const store = createStore(
  rootReducer,
  undefined,
  composeWithDevTools(applyMiddleware(...middlewares)),
);

export default store;
