/**
 * @summary story of BaseIconLabelView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-31 10:56:32
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import ModeView from '@/components/Layouts/ModeView.vue';
import { SWISSFL_MODE } from '@/store/metadataMutationsConsts';


storiesOf('1 Lables / Mode View', module).add('SwissForestLab implementation', () => ({
  components: { ModeView },
  template: `
  <v-row>

    <v-col cols="12" style="border: solid 1px;" >
      <mode-view :mode="SWISSFL_MODE" />
    </v-col>

    <v-col cols="12" style="border: solid 1px;" >
      <mode-view :mode="emptyMode" />
    </v-col>

  </v-row> `,
  data: () => ({
    SWISSFL_MODE,
    emptyMode: '',
  }),
}));
