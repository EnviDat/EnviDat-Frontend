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
import { METADATA_EDITING } from './storybookFolder';

export default {
  title: `${METADATA_EDITING} / Upload Elements`,
  decorators: [],
  parameters: {
  },
};


export const EditDropResourceFilesViews = () => ({
  components: { EditDropResourceFiles },
  template: `
    <v-row >

    <v-col cols="12">
      EditDropResourceFiles empty
    </v-col>

    <v-col cols="12">
      <EditDropResourceFiles  />
    </v-col>

    <v-col cols="12">
      TitleCard with props I don't know yet
    </v-col>

    <v-col >
      <EditDropResourceFiles  />
    </v-col>

    </v-row>
  `,
});
