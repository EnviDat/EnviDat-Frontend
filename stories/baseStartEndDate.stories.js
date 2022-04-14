/**
 * @summary story of BaseIconButton & BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-31 08:14:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import BaseStartEndDate from '@/components/BaseElements/BaseStartEndDate';
import { BASE_ELEMENTS } from './storybookFolder';

export default {
  title: `${BASE_ELEMENTS} / BaseStartEndDate`,
  decorators: [],
  parameters: {},
};

export const BaseStartEndDateViews = () => ({
  components: { BaseStartEndDate },
  template: `
    <v-row style="border: solid 1px;">
    
      <v-col cols="12">
        <BaseStartEndDate  />
      </v-col>

      <v-col cols="12">
        <BaseStartEndDate  start-date="2022-04-11"
                            end-date="2022-04-14"/>
      </v-col>

    </v-row>
  `,
  data: () => ({
  }),
});
