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

import BaseShinyBadge from '@/components/BaseElements/BaseShinyBadge.vue';

export default {
  title: '1 Base Elements / Shiny Badges',
  component: BaseShinyBadge,
};

export const BaseShinyBadgeViews = () => ({
    components: { BaseShinyBadge },
    template: `
    <v-row style="border: solid 1px; background-color: grey;">
    
      <v-col >
        <BaseShinyBadge text="some long text" />
      </v-col>

      <v-col >
        <BaseShinyBadge text="v_0.7.5"  />
      </v-col>

      <v-col >
        <BaseShinyBadge text="v_0.7.5" :isSmall="true" />
      </v-col>

      <v-col >
        <BaseShinyBadge text="v_0.7.5" :isSmall="true" :showShine="false" />
      </v-col>

      <v-col >
        <BaseShinyBadge :text="version"  />
      </v-col>
    
    </v-row>`,
    data: () => ({
      version : 'version',
    }),
  });

