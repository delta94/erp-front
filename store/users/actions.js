import {
  FETCH_USER,
  FETCH_USER_PAYMENTS,
  FETCH_USER_PROJECTS,
  FETCH_USER_RAISES,
  FETCH_USER_ROLES,
  FETCH_USERS,
  FETCH_USER_WORKTIME,
  FETCH_USER_CALENDAR,
  DELETE_USER_WORKTIME,
  ADD_USER_WORKTIME,
  CLEAR_USER,
  CLEAR_USER_SUB_STATE,
  FETCH_USER_PROJECT_DETAILS,
} from './types';
import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 */
export const fetchUsers = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_USERS,
    request: {
      method: 'GET',
      url: '/users',
      params,
    },
  };
};

export const fetchUserRoles = () => ({
  type: FETCH_USER_ROLES,
  request: {
    method: 'GET',
    url: '/users/roles',
  },
}
);

export const fetchUser = (id) => ({
  type: FETCH_USER,
  request: {
    method: 'GET',
    url: `/users/${id}`,
  },
});

/**
 * @param {Number} id
 * @param {PaginationQuery} query
 * @param {Object} meta
 */
export const fetchUserProjects = (id, query = { page: 1, size: 10 }, meta = {}) => {
  const params = composeQuery(query);
  return {
    type: FETCH_USER_PROJECTS,
    request: {
      method: 'GET',
      url: `/users/${id}/projects`,
      params,
    },
    meta: { subState: 'projects', ...meta },
  };
};

/**
 * @param {Number} id
 * @param {PaginationQuery} query
 */
export const fetchUserPayments = (id, query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_USER_PAYMENTS,
    request: {
      method: 'GET',
      url: `/users/${id}/payments`,
      params,
    },
    meta: { subState: 'payments' },
  };
};

/**
 * @param {Number} id
 * @param {PaginationQuery} query
 */
export const fetchUserRaises = (id, query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_USER_RAISES,
    request: {
      method: 'GET',
      url: `/users/${id}/raises`,
      params,
    },
    meta: { subState: 'raises' },
  };
};

/**
 * @param {Number} id
 * @param {PaginationQuery} query
 */
export const fetchUserCalendar = (id, query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_USER_CALENDAR,
    request: {
      method: 'GET',
      url: `/users/${id}/calendar`,
      params,
    },
    meta: { subState: 'calendar' },
  };
};

/**
 * @param {Number} id
 * @param {PaginationQuery} query
 */
export const fetchUserWorktime = (id, query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_USER_WORKTIME,
    request: {
      method: 'GET',
      url: `/users/${id}/worktime`,
      params,
    },
    meta: { subState: 'worktime' },
  };
};

export const deleteUserWorktime = (userId, worktimeId) => ({
  type: DELETE_USER_WORKTIME,
  request: {
    method: 'DELETE',
    url: `/users/${userId}/worktime/${worktimeId}`,
  },
  meta: { subState: 'calendar', key: worktimeId },
});

export const addUserWorktime = (id, data) => ({
  type: ADD_USER_WORKTIME,
  request: {
    method: 'POST',
    url: `/users/${id}/worktime`,
    data,
  },
});

export const clearUser = () => ({
  type: CLEAR_USER,
});

export const clearUserSubState = (name) => ({
  type: CLEAR_USER_SUB_STATE,
  meta: { subState: name },
});

export const fetchUserProjectDetails = (userId, projectId, meta = {}) => ({
  type: FETCH_USER_PROJECT_DETAILS,
  request: {
    method: 'GET',
    url: `/users/${userId}/project/${projectId}`,
  },
  meta,
});
