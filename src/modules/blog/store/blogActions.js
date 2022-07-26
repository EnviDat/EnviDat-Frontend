/**
 * blog store actions
 *
 * @summary blog store actions
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import axios from 'axios';

import {
  GET_BLOG_LIST,
  GET_BLOG_LIST_ERROR,
  GET_BLOG_LIST_SUCCESS,
  GET_BLOG_POST,
  GET_BLOG_POST_ERROR,
  GET_BLOG_POST_SUCCESS,
} from '@/modules/blog/store/blogMutationsConsts';

const useTestdata = process.env.VITE_USE_TESTDATA === 'true';
let bloglistUrlPrefix = process.env.VITE_ENVIDAT_STATIC_ROOT;

if (process.env.NODE_ENV === 'development' && useTestdata) {
  bloglistUrlPrefix = './testdata';
}

export default {
  [GET_BLOG_LIST]({ commit }) {
    commit(GET_BLOG_LIST);

    const url = `${bloglistUrlPrefix}/blog/bloglist.json?nocache=${new Date().getTime()}`;

    axios
      .get(url)
      .then(response => {
        commit(GET_BLOG_LIST_SUCCESS, response.data);
      })
      .catch(reason => {
        commit(GET_BLOG_LIST_ERROR, reason);
      });
  },
  [GET_BLOG_POST]({ commit }, postFile) {
    commit(GET_BLOG_POST);

    const url = `${bloglistUrlPrefix}/blog/${postFile}?nocache=${new Date().getTime()}`;

    axios
      .get(url)
      .then(response => {
        commit(GET_BLOG_POST_SUCCESS, {
          postFile,
          postContent: response.data,
        });
      })
      .catch(reason => {
        commit(GET_BLOG_POST_ERROR, reason);
      });
  },
};
