/**
 * @summary story of BaseIconLabelView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-27 16:00:17
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import ModeView from '@/components/Layouts/ModeView';
import { SWISSFL_MODE } from '@/store/metadataMutationsConsts';
import { LABLE_VIEWS } from './storybookFolder';

export default {
  title: `${LABLE_VIEWS} / Mode View`,
  decorators: [],
  parameters: {},
};

export const SwissForestLabView = () => ({
components: { ModeView },
  template: `
  <v-row>

    <v-col cols="12" style="border: solid 1px;" >
      <mode-view :mode="SWISSFL_MODE" />
    </v-col>

    <v-col cols="12" style="border: solid 1px;" >
      <mode-view :mode="SWISSFL_MODE" :compact="true" />
    </v-col>

    <v-col cols="12" style="border: solid 1px;" >
      <mode-view :mode="emptyMode" />
    </v-col>

  </v-row> `,
  data: () => ({
    SWISSFL_MODE,
    emptyMode: '',
  }),
});
