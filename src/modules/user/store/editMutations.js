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

import { METADATA_EDITING_LOAD_DATASET } from './userMutationsConsts';

export default {
  [METADATA_EDITING_LOAD_DATASET](state) {
    state.loadingCurrentEditingContent = true;
    state.currentEditingContent = null;
    state.currentEditingContentError = null;
  },
};
