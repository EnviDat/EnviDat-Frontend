/**
 * blog page store module
 *
 * @summary blog vuex store
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import actions from '@/modules/blog/store/blogActions';
import mutations from '@/modules/blog/store/blogMutations';

const blogState = {
  loadingList: false,
  loadingPost: false,
  list: [],
  post: null,
  postContent: null,
};

export const blog = {
  namespaced: true,
  state: blogState,
  /*
  getters: {
    loadingList: state => state.loadingList,
    blogPostList: state => state.list,
  },
*/
  mutations,
  actions,
};
