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

import EditDropResourceFiles from '@/modules/user/components/EditDropResourceFiles.vue';
import EditMultiDropResourceFiles from '@/modules/user/components/EditMultiDropResourceFiles.vue';

export default {
  title: '9 Editing Metadata / Upload Elements',
  decorators: [],
  parameters: {
  },
};

const metadataId = 'storybook_testing_metadataId';

export const EditDropResourceFilesView = () => ({
  components: { EditDropResourceFiles },
  template: '<EditDropResourceFiles :metadataId="metadataId" /> ',
  data: () => ({
    metadataId,
  }),
});

export const EditMultiDropResourceFilesView = () => ({
  components: { EditMultiDropResourceFiles },
  template: '<EditMultiDropResourceFiles :metadataId="metadataId" /> ',
  data: () => ({
    metadataId,
  }),
});
