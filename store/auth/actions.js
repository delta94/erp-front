import {
  INIT_SESSION, LOGIN,
} from './types';

export const login = (email, password) => ({
  type: LOGIN,
  request: {
    method: 'POST',
    url: '/auth/login',
    data: {
      email, password,
    },
  },
});

export const initSession = () => ({
  type: INIT_SESSION,
  request: {
    method: 'GET',
    url: '/csrf-cookie',
  },
});

export const authorize = (email, password) => async (dispatch) => {
  await dispatch(initSession());
  return dispatch(login(email, password));
};
