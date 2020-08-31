import {
  ADD_CLIENT, FETCH_CLIENT, FETCH_CLIENT_FIELD_TYPES, FETCH_CLIENT_ORIGINS, FETCH_CLIENTS,
} from './types';
import { composeQuery } from '../../utils';

/**
 * @param {PaginationQuery} query
 */
export const fetchClients = (query = { page: 1, size: 10 }) => {
  const params = composeQuery(query);
  return {
    type: FETCH_CLIENTS,
    request: {
      method: 'GET',
      url: '/clients',
      params,
    },
  };
};

export const addClient = ({ photos, ...data }) => {
  const payload = { ...data };
  if (photos) {
    payload.photos = photos.map((photo) => photo.response?.id).filter((photo) => !!photo);
  }

  return {
    type: ADD_CLIENT,
    request: {
      method: 'POST',
      url: '/clients',
      data: payload,
    },
  };
};

export const fetchClientOrigins = () => ({
  type: FETCH_CLIENT_ORIGINS,
  request: {
    method: 'GET',
    url: '/clients/origins',
  },
});

export const fetchClientFieldTypes = () => ({
  type: FETCH_CLIENT_FIELD_TYPES,
  request: {
    method: 'GET',
    url: '/clients/fields',
  },
});

export const fetchClient = (id) => ({
  type: FETCH_CLIENT,
  request: {
    method: 'GET',
    url: `/clients/${id}`,
  },
});
