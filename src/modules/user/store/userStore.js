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

import { tagsIncludedInSelectedTags } from '@/factories/metadataFilterMethods';
import { getEmptyMetadataInEditingObject } from '@/factories/userEditingFactory';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_DATA_RESOURCES,
} from '@/factories/eventBus';


import actions from './userActions';
import editActions from './editActions';
import createActions from './createActions';

import mutations from './userMutations';
import editMutations from './editMutations';
import createMutations from './createMutations';

const userState = {
  error: null,
  errorType: '',
  errorField: '',
  filteringTagNames: [],
  userDatasetsLoading: false,
  userDatasetsError: null,
  userDatasets: [],
  collaboratorDatasetIdsLoading: false,
  collaboratorDatasetIds: [],
  collaboratorDatasetsLoading: false,
  collaboratorDatasets: [],
  collaboratorDatasetsLimit: 1000,
  userOrganizationLoading: false,
  userOrganizationIds: [],
  userOrganizationNames: [],
  userOrganizations: {},
  userOrgaDatasetsError: null,
  metadataSavingMessageTimeoutTime: 2500,
  metadataSavingErrorTimeoutTime: 15000,
  lastEditedDataset: '',
  lastEditedDatasetPath: '',
  lastEditedBackPath: '',
  metadataInEditing: getEmptyMetadataInEditingObject(),
  selectedResourceId: '',
  selectedAuthorId: '',
  loadingCurrentEditingContent: false,
  currentEditingContent: null,
  currentEditingContentError: null,
};


export const user = {
  namespaced: true,
  state: userState,
  getters: {
    resources: state => state.metadataInEditing[EDITMETADATA_DATA_RESOURCES].resources,
    authors: state => state.metadataInEditing[EDITMETADATA_AUTHOR_LIST].authors,
    getMetadataEditingObject: state => key => state.metadataInEditing[key],
    filteredDatasets: (state, getters) => {
      const filteredContent = [];
      const content = getters.userDatasets;

      if (content) {
        for (let i = 0; i < content.length; i++) {
          const entry = content[i];

          if (entry.tags && tagsIncludedInSelectedTags(entry.tags, state.filteringTagNames)) {
            filteredContent.push(entry);
          }
        }
      }

      return filteredContent;
    },
  },
  mutations: {
    ...mutations,
    ...editMutations,
    ...createMutations,
  },
  actions: {
    ...actions,
    ...editActions,
    ...createActions,
  },
};
