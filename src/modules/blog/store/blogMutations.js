/**
 * blog store mutations
 *
 * @summary guidelines store mutations
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-29 20:54:09
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  GET_BLOG_LIST,
  GET_BLOG_LIST_SUCCESS,
  GET_BLOG_LIST_ERROR,
  GET_BLOG_POST,
  GET_BLOG_POST_SUCCESS,
  GET_BLOG_POST_ERROR,
  CLOSE_BLOG_POST,
} from '@/modules/blog/store/blogMutationsConsts';

import { ADD_USER_NOTIFICATION } from '@/store/mainMutationsConsts';
import { getSpecificApiError } from '@/factories/notificationFactory';


export default {
  [GET_BLOG_LIST](state) {
    state.loadingList = true;
  },
  [GET_BLOG_LIST_SUCCESS](state, payload) {
    state.list = payload;
    state.loadingList = false;
  },
  [GET_BLOG_LIST_ERROR](state, reason) {
    state.loadingList = false;

    const details = 'An error occurred while loading the list of blog posts!';
    const errObj = getSpecificApiError(details, reason);

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [GET_BLOG_POST](state) {
    state.loadingPost = true;
    state.post = null;
    state.postContent = null;
  },
  [GET_BLOG_POST_SUCCESS](state, { postFile, postContent }) {

    const posts = state.list;

    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      if (p.postFile === postFile) {
        state.post = p;
        break;
      }
    }

    state.postContent = postContent;
    state.loadingPost = false;
  },
  [GET_BLOG_POST_ERROR](state, reason) {
    state.loadingPost = false;

    const details = 'An error occurred while loading the a blog post!';
    const errObj = getSpecificApiError(details, reason);

    this.commit(ADD_USER_NOTIFICATION, errObj);
  },
  [CLOSE_BLOG_POST](state) {
    state.post = null;
    state.postContent = null;
  },
};
