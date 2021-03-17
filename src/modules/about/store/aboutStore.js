/**
 * about page store module
 *
 * @summary main vuex store
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-11-22 13:28:12
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import actions from '@/modules/about/store/aboutActions';
import mutations from '@/modules/about/store/aboutMutations';

const aboutState = {
  guidelinesMarkdown: null,
  guidelinesLoading: false,
  policiesMarkdown: null,
  policiesLoading: false,
  dmpMarkdown: null,
  dmpLoading: false,
};


export const about = {
  namespaced: true,
  state: aboutState,
  getters: {
    guidelinesMarkdown: state => state.guidelinesMarkdown,
    guidelinesLoading: state => state.guidelinesLoading,
    policiesMarkdown: state => state.policiesMarkdown,
    policiesLoading: state => state.policiesLoading,
    dmpMarkdown: state => state.dmpMarkdown,
    dmpLoading: state => state.dmpLoading,
  },
  mutations,
  actions,
};
