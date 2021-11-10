/* eslint-disable no-underscore-dangle */
/**
* user store mutations
*
* @summary user store mutations
* @author Dominik Haas-Artho
*
* Created at     : 2020-07-14 16:51:52
 * Last modified  : 2021-08-18 10:14:35
*
* This file is subject to the terms and conditions defined in
* file 'LICENSE.txt', which is part of this source code package.
*/


import {
  GET_USER_CONTEXT,
  GET_USER_CONTEXT_ERROR,
  GET_USER_CONTEXT_SUCCESS,
  REQUEST_TOKEN,
  REQUEST_TOKEN_ERROR,
  REQUEST_TOKEN_SUCCESS,
  USER_SIGNIN,
  USER_SIGNIN_ERROR,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_SIGNOUT_ERROR,
  USER_SIGNOUT_SUCCESS,
  VALIDATION_ERROR,
} from './userMutationsConsts';


function extractError(store, reason, errorProperty = 'error') {

  let type = '';
  let field = '';
  let msg = 'There was an error on the server, please try again. If it consists please contact envidat@wsl.ch.';

  if (reason?.response && reason.response.status !== 200) {
    msg = `${reason.response.status} ${reason.response.statusText}
          url: ${reason.response.config?.url} Message: ${reason.response.data?.error?.message} type: ${reason.response.data?.error?.__type}`;
    store._vm.$set(store.state.user, errorProperty, msg);
    return;
  }

  const error = reason?.response?.error || reason?.error || reason;

  if (error) {
    type = error.__type;

    switch (type) {
      case VALIDATION_ERROR: {
        const errKey = Object.keys(error)[1];

        field = errKey;
        msg = error[errKey];
        break;
      }
      default: {
        msg = error;
        break;
      }
    }
  }

  store.state.user.errorField = field;
  store.state.user.errorType = type;

  store._vm.$set(store.state.user, errorProperty, msg);
}


function resetErrorObject(state) {
  state.error = null;
  state.errorType = '';
  state.errorField = '';
}

export default {
  [GET_USER_CONTEXT](state) {
    state.userLoading = true;

    resetErrorObject(state);
  },
  [GET_USER_CONTEXT_SUCCESS](state, payload) {
    state.userLoading = false;
    if (payload?.user) {
      state.user = payload?.user;
    }
  },
  [GET_USER_CONTEXT_ERROR](state, reason) {
    state.userLoading = false;

    extractError(this, reason);
  },
  [USER_SIGNIN](state) {
    state.signInLoading = true;

    resetErrorObject(state);
  },
  [USER_SIGNIN_SUCCESS](state, payload) {
    state.signInLoading = false;
    state.signInSuccess = true;
    state.user = payload.user;
  },
  [USER_SIGNIN_ERROR](state, reason) {
    state.signInLoading = false;
    state.signInSuccess = false;

    extractError(this, reason);
  },
  [REQUEST_TOKEN](state) {
    state.requestLoading = true;
    state.requestSuccess = false;
    state.signInLoading = false;
    state.signInSuccess = false;

    resetErrorObject(state);
  },
  [REQUEST_TOKEN_SUCCESS](state, payload) {
    state.requestLoading = false;
    state.requestSuccess = payload && payload.includes('successful');
  },
  [REQUEST_TOKEN_ERROR](state, reason) {
    state.requestLoading = false;
    state.requestSuccess = false;

    extractError(this, reason);
  },
  [USER_SIGNOUT](state) {
    state.signInLoading = false;
    state.signInSuccess = false;
    state.requestLoading = false;
    state.requestSuccess = false;
    state.userLoading = true;
    state.user = null;

    resetErrorObject(state);
  },
  [USER_SIGNOUT_SUCCESS](state) {
    state.user = null;

    resetErrorObject(state);
  },
  [USER_SIGNOUT_ERROR](state, reason) {
    state.user = null;

    extractError(this, reason);
  },
};
