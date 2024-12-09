/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-10-07 13:12:18
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import OrganizationTree from '@/modules/user/components/OrganizationTree.vue';
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';

import { getOrganizationMapObject } from '@/factories/organizationFactory';
import testOrganizations from './js/organizations';

const organizationsMap = getOrganizationMapObject(testOrganizations);

export default {
  title: '3 Dataset / 1 Views / Organization Tree',
  component: OrganizationTree,
};

export const OrganizationTreeView = () => ({
    components: { OrganizationTree },
    template: `
    <v-col>

      <v-row>
        OrganizationTree
      </v-row>

      <v-row>
        <v-col>
          Selection of the Organization Tree:
        </v-col>
        <v-col>
          {{ selectedOrga }}
        </v-col>
      </v-row>

      <v-row class='py-3' >
        <v-col >
          <OrganizationTree v-bind='genericProps' />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
      eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.showSelectedOrga);
    },
    beforeUnmount() {
      eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.showSelectedOrga);
    },
    methods: {
      showSelectedOrga(updateObj) {
        if (updateObj.object === EDITMETADATA_ORGANIZATION) {
          this.selectedOrga = updateObj.data;
        }
      },
    },
    data: () => ({
      genericProps: {
        organizationsMap,
      },
      selectedOrga: '',
      preSelectedOrganization: 'wsl',
    }),
  });
