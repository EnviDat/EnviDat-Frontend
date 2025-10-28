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

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_DATA_RESOURCES,
} from '@/factories/eventBus';

import { getEmptyMetadataInEditingObject } from '@/factories/workflowFactory.js';
import { DOI_RESERVED_PROPERTY } from '@/modules/user/store/doiMutationsConsts';
import { tagsIncludedInSelectedTags } from '@/factories/keywordsFactory';

import actions from './userActions';
import editActions from './editActions';
import createActions from './createActions';
import doiActions from './doiActions';

import mutations from './userMutations';
import editMutations from './editMutations';
import createMutations from './createMutations';
import doiMutations from './doiMutations';


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
  metadataSavingMessageTimeoutTime: 2500,
  metadataSavingErrorTimeoutTime: 15000,
  lastEditedDataset: '',
  lastEditedDatasetPath: '',
  lastEditedBackPath: '',
  loadingEditingData: false,
  metadataInEditing: getEmptyMetadataInEditingObject(),
  loadingCurrentEditingContent: false,
  currentEditingContent: null,
  currentEditingContentError: null,
  uploadNewResourceLoading: false,
  uploadLoading: false,
  uploadResource: null,
  uploadMetadataId: null,
  uploadError: null,
  envidatUsers: null,
  envidatUsersError: null,
  metadataCreationLoading: false,
  newMetadatasetName: null,
  metadataCreationError: null,
  doiLoading: false,
  [DOI_RESERVED_PROPERTY]: null,
  doiSuccess: false,
  doiError: null,
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
    uploadResource: state => state.uploadResource,
    uploadResourceId: state => state.uploadResource?.id,
    uploadMetadataId: state => state.uploadMetadataId,
  },
  mutations: {
    ...mutations,
    ...editMutations,
    ...createMutations,
    ...doiMutations,
  },
  actions: {
    ...actions,
    ...editActions,
    ...createActions,
    ...doiActions,
  },
};
