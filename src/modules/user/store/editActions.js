/**
 * user store actions
 *
 * @summary user store actions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-07-14 16:51:52
 * Last modified  : 2021-08-18 10:48:15
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { LOAD_METADATA_CONTENT_BY_ID, METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

import { METADATA_EDITING_LOAD_DATASET, USER_NAMESPACE } from './userMutationsConsts';

export default {
  async [METADATA_EDITING_LOAD_DATASET]({ dispatch }, { metadataId, forceBackendReload = false }) {
    // defining the commitMethod has the effect that mutations of this
    // module are being used with the output of the action from the metadata module
    await dispatch(
      `${METADATA_NAMESPACE}/${LOAD_METADATA_CONTENT_BY_ID}`,
      {
        metadataId,
        commitMethod: `${USER_NAMESPACE}/${METADATA_EDITING_LOAD_DATASET}`,
        forceBackendReload,
      },
      { root: true },
    );
  },
};
