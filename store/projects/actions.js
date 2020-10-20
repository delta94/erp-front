import {
  ADD_PROJECT,
  FETCH_PROJECT_STATUSES,
  FETCH_PROJECTS,
  FETCH_PROJECT_ACCOUNTS,
  FETCH_PROJECT_WORKTIME,
  CLEAR_PROJECTS,
  FETCH_PROJECT,
  EDIT_PROJECT,
  FETCH_PROJECT_USERS,
} from './types';
import { composeQuery } from '../../utils';
import { CLEAR_USER_SUB_STATE } from '../users/types';

/**
 * @param {PaginationQuery} query
 */
export const fetchProjects = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_PROJECTS,
    request: {
      method: 'GET',
      url: '/projects',
      params,
    },
  };
};

export const fetchProject = (id, query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_PROJECT,
    request: {
      method: 'GET',
      url: `/projects/${id}`,
      params,
    },
  };
};

export const fetchProjectStatuses = () => ({
  type: FETCH_PROJECT_STATUSES,
  request: {
    method: 'GET',
    url: '/projects/statuses',
  },
  meta: { subState: 'statuses' },
});

export const addProject = ({
  photos, developers, ...data
}) => {
  const payload = { ...data };
  payload.developers = developers.map((d) => ({
    ...d,
    salary_based: !!d.salary_based,
    start_date: d.start_date.format('YYYY-MM-DD'),
  }));
  if (photos) payload.photos = photos.map((photo) => photo.response?.id).filter((photo) => !!photo);

  return {
    type: ADD_PROJECT,
    request: {
      method: 'POST',
      url: '/projects',
      data: payload,
    },
  };
};

export const editProject = (id, {
  photos = [], developers, ...data
}) => {
  const payload = { ...data };
  payload.developers = developers.map((d) => ({
    ...d,
    salary_based: !!d.salary_based,
    start_date: d.start_date.format('YYYY-MM-DD'),
  }));
  payload.photos = photos.map((photo) => photo.response?.id).filter((photo) => !!photo);

  return {
    type: EDIT_PROJECT,
    request: {
      method: 'PATCH',
      url: `/projects/${id}`,
      data: payload,
    },
  };
};

export const fetchProjectAccounts = (id, query) => {
  const params = composeQuery(query);
  return ({
    type: FETCH_PROJECT_ACCOUNTS,
    request: {
      method: 'GET',
      url: `/projects/${id}/accounts`,
      params,
    },
    meta: { subState: 'accounts' },
  });
};

export const fetchProjectWorktime = (id, query, meta = {}) => {
  const params = composeQuery(query);
  return ({
    type: FETCH_PROJECT_WORKTIME,
    request: {
      method: 'GET',
      url: `/projects/${id}/worktime`,
      params,
    },
    meta: { subState: 'worktime', ...meta },
  });
};

export const fetchProjectUsers = (id, query, meta = {}) => {
  const params = composeQuery(query);
  return ({
    type: FETCH_PROJECT_USERS,
    request: {
      method: 'GET',
      url: `/projects/${id}/users`,
      params,
    },
    meta: { subState: 'users', ...meta },
  });
};

export const clearProjects = () => ({
  type: CLEAR_PROJECTS,
});

export const clearProjectSubState = (name) => ({
  type: CLEAR_USER_SUB_STATE,
  meta: { subState: name },
});
