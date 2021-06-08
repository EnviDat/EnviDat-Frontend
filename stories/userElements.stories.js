/**
 * @summary story of SearchBarView & SmallSearchBarView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-10-20 16:00:30
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

// /* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';

import MetadataCube from '@/components/BaseElements/MetadataCube';


storiesOf('7 Signed-In / MetadataCube', module)
  .add('basic', () => ({
    components: { MetadataCube },
    template: `
      <v-row>
        <v-col cols="12">
          <MetadataCube  />
        </v-col>

        <v-col cols="12">
          <v-row no-gutters>
            <v-col cols="12">
              <MetadataCube :positionOffset="20" color="green" />
            </v-col>
            <v-col cols="12">
              <MetadataCube :positionOffset="20" color="yellow" />
            </v-col>
            <v-col cols="12">
              <MetadataCube :positionOffset="20" color="red" />
            </v-col>
            <v-col cols="12">
              <MetadataCube :positionOffset="20" color="blue" />
            </v-col>
          </v-row>
        </v-col>

      </v-row>
    `,
    methods: {
    },
    data: () => ({
    }),
  }));
