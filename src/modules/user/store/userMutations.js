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

import { getCollaboratorCapacity } from '@/factories/userEditingValidations';

import { enhanceElementsWithStrategyEvents, SELECT_EDITING_DATASET_PROPERTY } from '@/factories/strategyFactory.ts';

import { enhanceMetadataFromCategories, extractUserError } from '@/modules/user/store/mutationFactory';

import { enhanceUserObject } from '@/factories/mappingFactory';

import {
  USER_GET_COLLABORATOR_DATASET_IDS,
  USER_GET_COLLABORATOR_DATASET_IDS_ERROR,
  USER_GET_COLLABORATOR_DATASET_IDS_SUCCESS,
  USER_GET_COLLABORATOR_DATASETS,
  USER_GET_COLLABORATOR_DATASETS_ERROR,
  USER_GET_COLLABORATOR_DATASETS_SUCCESS,
  USER_GET_DATASETS,
  USER_GET_DATASETS_ERROR,
  USER_GET_DATASETS_SUCCESS,
  GET_USER_LIST,
  GET_USER_LIST_SUCCESS,
  GET_USER_LIST_ERROR,
} from './userMutationsConsts';

function resetErrorObject(state) {
  state.error = null;
  state.errorType = '';
  state.errorField = '';
}

export default {
  [GET_USER_LIST](state) {
    state.envidatUsers = null;
    state.envidatUsersError = null;
  },
  [GET_USER_LIST_SUCCESS](state, payload) {
    const users = payload;

    for (let i = 0; i < users.length; i++) {
      users[i] = enhanceUserObject(users[i]);
    }

    state.envidatUsers = users;
  },
  [GET_USER_LIST_ERROR](reason) {
    extractUserError(this, reason, 'envidatUsersError');
  },
  [USER_GET_DATASETS](state) {
    state.userDatasetsLoading = true;
    state.userDatasetsError = null;

    resetErrorObject(state);
  },
  [USER_GET_DATASETS_SUCCESS](state, payload) {
    state.userDatasetsLoading = false;

    const datasets = enhanceMetadataFromCategories(this, payload.datasets);

    // TODO - check config for dataset editing enabled
    enhanceElementsWithStrategyEvents(datasets, SELECT_EDITING_DATASET_PROPERTY);

    // use the $set to make sure updates are triggered
    state.userDatasets = datasets;

    resetErrorObject(state);
  },
  [USER_GET_DATASETS_ERROR](state, reason) {
    state.userDatasetsLoading = false;

    extractUserError(this, reason, 'userDatasetsError');
  },
  [USER_GET_COLLABORATOR_DATASET_IDS](state) {
    state.collaboratorDatasetIdsLoading = true;
    // state.userDatasetsError = null;

    resetErrorObject(state);
  },
  [USER_GET_COLLABORATOR_DATASET_IDS_SUCCESS](state, payload) {
    state.collaboratorDatasetIdsLoading = false;

    const listOfPackageIds = payload;
    const datasetIds = [];

    for (let i = 0; i < listOfPackageIds.length; i++) {
      const entry = listOfPackageIds[i];
      datasetIds.push({
        id: entry.package_id,
        role: entry.capacity,
      });
    }

    state.collaboratorDatasetIds = datasetIds;
  },
  [USER_GET_COLLABORATOR_DATASET_IDS_ERROR](state, reason) {
    state.collaboratorDatasetIdsLoading = false;

    extractUserError(this, reason);
  },
  [USER_GET_COLLABORATOR_DATASETS](state) {
    state.collaboratorDatasetsLoading = false;
    state.collaboratorDatasets = [];

    resetErrorObject(state);
  },
  [USER_GET_COLLABORATOR_DATASETS_SUCCESS](state, { datasets, collaboratorIds }) {
    state.collaboratorDatasetsLoading = false;

    for (let i = 0; i < datasets.length; i++) {
      const dSet = datasets[i];
      dSet.role = getCollaboratorCapacity(dSet.id, collaboratorIds);
    }

    const enhancedDatasets = enhanceMetadataFromCategories(this, datasets) || [];

    // TODO - check config for dataset editing enabled
    enhanceElementsWithStrategyEvents(enhancedDatasets, SELECT_EDITING_DATASET_PROPERTY);

    const collaboratorDatasets = [...state.collaboratorDatasets, ...enhancedDatasets];

    // use the $set to make sure updates are triggered
    state.collaboratorDatasets = collaboratorDatasets;
  },
  [USER_GET_COLLABORATOR_DATASETS_ERROR](state, reason) {
    state.collaboratorDatasetsLoading = false;

    extractUserError(this, reason);
  },
};
