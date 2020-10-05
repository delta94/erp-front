import {
  ADD_PROJECT,
  FETCH_PROJECT_STATUSES,
  FETCH_PROJECTS,
  FETCH_PROJECT_ACCOUNTS, FETCH_PROJECT_WORKTIME, CLEAR_PROJECTS,
} from './types';
import { composeQuery } from '../../utils';

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

export const fetchProjectStatuses = () => ({
  type: FETCH_PROJECT_STATUSES,
  request: {
    method: 'GET',
    url: '/projects/statuses',
  },
});

export const addProject = ({
  photos, developers, start_date: startDate, ...data
}) => {
  const payload = { ...data };
  payload.developers = developers.map((d) => ({ ...d, salary_based: !!d.salary_based }));
  if (photos) {
    payload.photos = photos.map((photo) => photo.response?.id).filter((photo) => !!photo);
  }
  if (startDate) {
    payload.start_date = startDate.format('YYYY-MM-DD');
  }

  return {
    type: ADD_PROJECT,
    request: {
      method: 'POST',
      url: '/projects',
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

export const clearProjects = () => ({
  type: CLEAR_PROJECTS,
});
