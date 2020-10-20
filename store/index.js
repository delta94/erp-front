import thunk from 'redux-thunk';
import axios from 'axios';
import router from 'next/router';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { handleRequests } from '@redux-requests/core';
import { createDriver } from '@redux-requests/axios';

import auth from './auth/reducer';
import users from './users/reducer';
import invitations from './invitations/reducer';
import projects from './projects/reducer';
import clients from './clients/reducer';
import payments from './payments/reducer';
import expenses from './expenses/reducer';
import accounts from './accounts/reducer';
import tags from './tags/reducer';
import worktime from './worktime/reducer';
import { BASE_URL } from '../utils/constants';

const loggerMiddleware = createLogger();

export const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

const { requestsReducer: requests, requestsMiddleware } = handleRequests({
  driver: createDriver(instance),
  onError: (e) => {
    if (e.response && e.response.status === 401) router.replace('/login');
    throw e;
  },
});

const rootReducer = combineReducers({
  requests,
  auth,
  users,
  invitations,
  projects,
  clients,
  payments,
  expenses,
  accounts,
  tags,
  worktime,
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
