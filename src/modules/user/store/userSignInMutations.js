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

import { enhanceUserObject } from '@/factories/mappingFactory';

import {
  GET_USER_CONTEXT,
  GET_USER_CONTEXT_ERROR,
  GET_USER_CONTEXT_SUCCESS,
  USER_EDITING_UPDATE,
  USER_EDITING_UPDATE_ERROR,
  USER_EDITING_UPDATE_SUCCESS,
  USER_SIGNIN_NAMESPACE,
  USER_SIGNOUT,
  USER_SIGNOUT_ERROR,
  USER_SIGNOUT_SUCCESS,
  VALIDATION_ERROR,
  USER_SIGNIN,
  USER_SIGNIN_SUCCESS,
  USER_SIGNIN_ERROR,
  REQUEST_TOKEN,
  REQUEST_TOKEN_SUCCESS,
  REQUEST_TOKEN_ERROR,
} from './userMutationsConsts';

 function resetUser(state) {
   state.signInLoading = false;
   state.signInSuccess = false;
   state.requestLoading = false;
   state.requestSuccess = false;
   state.errorType = '';
   state.errorField = '';
   state.errorFieldText = '';
   state.user = null;
   state.userLoading = false;
 }

 function extractError(store, reason, errorProperty = 'error') {
   let type = '';
   let field = '';
   let msg =
     'There was an error on the server, please try again. If it consists please contact envidat@wsl.ch.';

   const error = reason?.response?.data?.error || reason?.error || reason;

   if (error) {
     type = error.__type;

     if (!type) {
       type = 'formError';
     }

     switch (type) {
       case VALIDATION_ERROR: {
         const errKey = Object.keys(error)[0];

         field = errKey;
         msg = error[errKey];
         break;
       }
       default: {
         msg = error.message;
         break;
       }
     }
   } else if (reason?.response && reason.response.status !== 200) {
     msg = `${reason.response.status} ${reason.response.statusText}
           url: ${reason.response.config?.url} Message: ${reason.response.data?.error?.message} type: ${reason.response.data?.error?.__type}`;
     store._vm.$set(store.state.user, errorProperty, msg);
     return;
   }

   store.state[USER_SIGNIN_NAMESPACE].errorField = field;
   store.state[USER_SIGNIN_NAMESPACE].errorType = type;
   store.state[USER_SIGNIN_NAMESPACE].errorFieldText = msg;
   // store.state[USER_SIGNIN_NAMESPACE][errorProperty] = msg;

   // store._vm.$set(store.state[USER_SIGNIN_NAMESPACE], errorProperty, msg);
 }

 function resetErrorObject(state) {
   state.errorType = '';
   state.errorField = '';
   state.errorFieldText = '';
 }


 export default {
   [GET_USER_CONTEXT](state) {
     state.userLoading = true;

     resetErrorObject(state);
   },
   [GET_USER_CONTEXT_SUCCESS](state, payload) {
     state.userLoading = false;

     const user = payload.user || null;

     if (!user) {
       resetUser(state);
     } else {
       state.user = enhanceUserObject(user);
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
     const user = payload.user;
     state.user = enhanceUserObject(user);
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
     state.requestSuccess = payload && payload.message === 'success';
   },
   [REQUEST_TOKEN_ERROR](state, reason) {
     state.requestLoading = false;
     state.requestSuccess = false;

     extractError(this, reason);
   },
   [USER_SIGNOUT](state) {
     state.userLoading = true;

     resetErrorObject(state);
   },
   [USER_SIGNOUT_SUCCESS](state) {
     resetUser(state);

     resetErrorObject(state);
   },
   [USER_SIGNOUT_ERROR](state, reason) {
     resetUser(state);

     extractError(this, reason);
   },
   [USER_EDITING_UPDATE](state) {
     state.userEditLoading = true;

     resetErrorObject(state);
   },
   [USER_EDITING_UPDATE_SUCCESS](state) {
     state.userEditLoading = false;
   },
   [USER_EDITING_UPDATE_ERROR](state, reason) {
     state.userEditLoading = false;

     extractError(this, reason);
   },

 };
