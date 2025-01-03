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

export default {
  title: '3 Dataset / 2 Edit / Upload Elements',
  decorators: [],
  parameters: {
  },
};

const metadataId = 'storybook_testing_metadataId';

const EditDropResourceFilesTemplate = (args, { argTypes }) => ({
  components: { EditDropResourceFiles },
  props: Object.keys(argTypes),
  template: '<EditDropResourceFiles v-bind="$props" />',
});

export const EmptyEditDropResourceFiles = EditDropResourceFilesTemplate.bind({});
EmptyEditDropResourceFiles.args = { metadataId };
export const ErrorEditDropResourceFiles = EditDropResourceFilesTemplate.bind({});
ErrorEditDropResourceFiles.args = {
  ...EmptyEditDropResourceFiles.args,
  error: 'Network Error',
  errorDetails: 'CORS something something',
};


export const EditMultiDropResourceFilesView = () => ({
  components: { EditMultiDropResourceFiles },
  template: '<EditMultiDropResourceFiles :metadataId="metadataId" /> ',
  data: () => ({
    metadataId,
  }),
});

const EditResourcePasteUrlTemplate = (args, { argTypes }) => ({
  components: { EditResourcePasteUrl },
  props: Object.keys(argTypes),
  template: '<EditResourcePasteUrl v-bind="$props" />',
});

export const EmptyEditResourcePasteUrl = EditResourcePasteUrlTemplate.bind({});

