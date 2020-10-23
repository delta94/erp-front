import {
  ADD_TAG, EDIT_TAG,
  FETCH_TAG, FETCH_TAGS,
} from './types';
import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 * @param {Object=} meta
 */
export const fetchTags = (query = { page: 1, size: 10 }, meta = {}) => {
  const params = composeQuery(query);
  return {
    type: FETCH_TAGS,
    request: {
      method: 'GET',
      url: '/tags',
      params,
    },
    meta,
  };
};

export const fetchTag = (id, params) => ({
  type: FETCH_TAG,
  request: {
    method: 'GET',
    url: `/tags/${id}`,
    params,
  },
});

export const addTag = (data, meta) => ({
  type: ADD_TAG,
  request: {
    method: 'POST',
    url: '/tags',
    data,
  },
  meta,
});

export const editTag = (id, data) => ({
  type: EDIT_TAG,
  request: {
    method: 'PATCH',
    url: `/tags/${id}`,
    data,
  },
});
