import {
  ADD_CLIENT,
  CLEAR_CLIENTS,
  CLEAR_CLIENTS_SUB_STATE,
  EDIT_CLIENT,
  FETCH_CLIENT,
  FETCH_CLIENT_FIELD_TYPES,
  FETCH_CLIENT_ORIGINS, FETCH_CLIENT_PAYMENTS,
  FETCH_CLIENT_PROJECTS,
  FETCH_CLIENTS,
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

export const editClient = (id, { photos = [], ...data }) => {
  const payload = { ...data };
  payload.photos = photos.map((photo) => photo.response?.id || photo.id).filter((photo) => !!photo);

  return {
    type: EDIT_CLIENT,
    request: {
      method: 'PATCH',
      url: `/clients/${id}`,
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
  meta: { subState: 'origins' },
});

/**
 * @param {Number} id
 * @param {PaginationQuery} query
 * @param {Object=} meta
 */
export const fetchClientProjects = (id, query = { page: 1, size: 10 }, meta) => {
  const params = composeQuery(query);
  return {
    type: FETCH_CLIENT_PROJECTS,
    request: {
      method: 'GET',
      url: `/clients/${id}/projects`,
      params,
    },
    meta: { ...meta, subState: 'projects' },
  };
};

/**
 * @param {Number} id
 * @param {PaginationQuery} query
 * @param {Object=} meta
 */
export const fetchClientPayments = (id, query = { page: 1, size: 10 }, meta) => {
  const params = composeQuery(query);
  return {
    type: FETCH_CLIENT_PAYMENTS,
    request: {
      method: 'GET',
      url: `/clients/${id}/payments`,
      params,
    },
    meta: { ...meta, subState: 'payments' },
  };
};

export const fetchClientFieldTypes = () => ({
  type: FETCH_CLIENT_FIELD_TYPES,
  request: {
    method: 'GET',
    url: '/clients/fields',
  },
  meta: { subState: 'fieldTypes' },
});

export const fetchClient = (id, params) => ({
  type: FETCH_CLIENT,
  request: {
    method: 'GET',
    url: `/clients/${id}`,
    params,
  },
});

export const clearClients = () => ({
  type: CLEAR_CLIENTS,
});

export const clearClientsSubState = (name) => ({
  type: CLEAR_CLIENTS_SUB_STATE,
  meta: { subState: name },
});
