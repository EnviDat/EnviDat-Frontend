/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho and Sam Woodcock
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-11 16:50:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import { METADATA_EDITING } from './storybookFolder';

const storybookFolder = `${METADATA_EDITING} / Data Infos`;


storiesOf(storybookFolder, module)
  .add('Edit Geo Information', () => ({
    // components: { EditGeoInfo },
    template: `
    <v-col>

      <v-row>
        EditGeoInfo Empty
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditGeoInfo />
        </v-col>
      </v-row>

      <v-row>
        EditGeoInfo with spatial info
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditGeoInfo v-bind="genericProps" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
//      eventBus.$on(SELECT_EDITING_RESOURCE, this.editComponentsChanged);
    },
    beforeDestroy() {
//      eventBus.$off(SELECT_EDITING_RESOURCE, this.editComponentsChanged);
    },
    methods: {
      editComponentsChanged(updateObj) {
         this.genericProps = updateObj.data;
      },
    },
    data: () => ({
      genericProps: {

      },
    }),
  }));
