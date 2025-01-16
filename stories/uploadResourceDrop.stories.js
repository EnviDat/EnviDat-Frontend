// noinspection JSUnusedGlobalSymbols

/**
 * @summary story of upload sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-25 12:21:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */

import EditResourcePasteUrl from '@/modules/user/components/EditResourcePasteUrl.vue';
import EditDropResourceFiles from '@/modules/user/components/EditDropResourceFiles.vue';
import EditMultiDropResourceFiles from '@/modules/user/components/EditMultiDropResourceFiles.vue';
import {
  UPLOAD_STATE_RESOURCE_CREATED, UPLOAD_STATE_UPLOAD_COMPLETED,
  UPLOAD_STATE_UPLOAD_PROGRESS,
  UPLOAD_STATE_UPLOAD_STARTED,
} from '@/factories/eventBus';

export default {
  title: '3 Dataset / 2 Edit / Upload Resources',
  component: EditDropResourceFiles,
};

const metadataId = 'storybook_testing_metadataId';

export const Empty = {
  args: { metadataId },
};

export const UploadStarted = {
  args: {
    ...Empty.args,
    state: UPLOAD_STATE_UPLOAD_STARTED,
    progress: 0,
  },
}

export const ResourceCreated = {
  args: {
    ...Empty.args,
    state: UPLOAD_STATE_RESOURCE_CREATED,
    progress: 0,
  },
}

export const Progress = {
  args: {
    ...Empty.args,
    state: UPLOAD_STATE_UPLOAD_PROGRESS,
    progress: 34,
  },
}

export const Completed = {
  args: {
    ...Empty.args,
    state: UPLOAD_STATE_UPLOAD_COMPLETED,
    progress: 100,
  },
}

export const Error = {
  args: {
    ...Empty.args,
    error: 'Network Error',
    errorDetails: 'CORS something something',
  },
}
