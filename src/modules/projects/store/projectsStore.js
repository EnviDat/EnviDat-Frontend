/**
 * projects store module
 *
 * @summary projects store
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51 
 * Last modified  : 2019-10-23 16:41:03
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import actions from './projectsActions';
import mutations from './projectsMutations';

const projectsState = {
  projects: [],
  projectsPageBackRoute: null,
  loading: false,
};


export const projects = {
  namespaced: true,
  state: projectsState,
  getters: {
    projects: state => state.projects,
    projectsCardsParents: (state) => {
      const noSubs = [];
      const pros = state.projects;

      if (!pros) {
        return noSubs;
      }

      for (let i = 0; i < pros.length; i++) {
        const p = pros[i];
        if (!p.parent) {
          noSubs.push(p);
        }
      }

      return noSubs;
    },
    projectsPageBackRoute: state => state.projectsPageBackRoute,
    loading: state => state.loading,
  },
  mutations,
  actions,
};
