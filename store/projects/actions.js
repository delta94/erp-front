import {
  FETCH_PROJECTS,
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
