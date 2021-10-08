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

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import EditOrganizationTree from '@/modules/user/components/EditOrganizationTree';
import OrganizationTree from '@/modules/user/components/OrganizationTree';
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';

import { getOrganizationMap } from '@/factories/metaDataFactory';
import testOrganizations from './js/organizations';
import { METADATA_EDITING } from './storybookFolder';

const organizationsMap = getOrganizationMap(testOrganizations);
const organizationsMap2 = { ...organizationsMap };

const storybookFolder = `${METADATA_EDITING} / Organization`;

storiesOf(storybookFolder, module)
  .add('Organization Tree view', () => ({
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

      <v-row class="py-3" >
        <v-col >
          <OrganizationTree v-bind="genericProps" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
      eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.showSelectedOrga);
    },
    beforeDestroy() {
      eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.showSelectedOrga);
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
  }))
  .add('Edit Organization component', () => ({
    components: { EditOrganizationTree },
    template: `
    <v-col>

      <v-row>
        EditOrganizationTree
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditOrganizationTree v-bind="genericProps" />
        </v-col>
      </v-row>

      <v-row>
        EditOrganizationTree preselected and editing disabled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditOrganizationTree v-bind="genericProps2" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
      eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.updateOrga);
    },
    beforeDestroy() {
      eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.updateOrga);
    },
    methods: {
      updateOrga(updateObj) {
        if (updateObj.object === EDITMETADATA_ORGANIZATION
          && updateObj.data.id === this.genericProps.id) {
          this.genericProps = updateObj.data;
        }
      },
    },
    data: () => ({
      genericProps: {
        id: '1',
        organizationsMap,
        organization: 'wabio',
        selectionDisabled: false,
      },
      genericProps2: {
        organizationsMap: organizationsMap2,
        organization: 'community-ecology',
        selectionDisabled: true,
      },
    }),
  }));
