/**
 * The store of the user module
 *
 * @summary user module store
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 14:13:14
 * Last modified  : 2021-07-29 16:16:35
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import actions from './userSignInActions';
import mutations from './userSignInMutations';

const userSignInState = {
  signInLoading: false,
  signInSuccess: false,
  requestLoading: false,
  requestSuccess: false,
  error: null,
  errorType: '',
  errorField: '',
  user: null,
  userLoading: false,
};

export const userSignIn = {
  namespaced: true,
  state: userSignInState,
  getters: {},
  mutations,
  actions,
};
