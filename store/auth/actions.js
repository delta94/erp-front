import {
  FETCH_ACCOUNT, FETCH_SIGNED_USER, INIT_SESSION, LOGIN, LOGOUT, REGISTER,
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

export const signUp = (data) => ({
  type: REGISTER,
  request: {
    method: 'POST',
    url: '/auth/register',
    data,
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

export const register = (data) => async (dispatch) => {
  await dispatch(initSession());
  return dispatch(signUp(data));
};

export const fetchSignedUser = () => ({
  type: FETCH_SIGNED_USER,
  request: {
    method: 'GET',
    url: '/user',
  },
});

export const logout = () => ({
  type: LOGOUT,
  request: {
    method: 'GET',
    url: '/logout',
  },
});
