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
import EditOrganization from '@/modules/user/components/EditOrganization';
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

      <v-row class='py-3' >
        <v-col >
          <OrganizationTree v-bind='genericProps' />
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
  .add('Edit Dataset Organization', () => ({
    components: { EditOrganization },
    template: `
    <v-col>

      <v-row>
        EditOrganization
      </v-row>

      <v-row class='py-3' >
        <v-col >
          <EditOrganization :organizationId='genericProps.organizationId'
                            :userOrganizations='genericProps.userOrganizations'
                            :allOrganizations='genericProps.userOrganizations'
          />
        </v-col>
      </v-row>

      <v-row>
        EditOrganization with only one existing organization
      </v-row>

      <v-row class='py-3' >
        <v-col >
          <EditOrganization :organizationId='genericProps2.organizationId'
                            :userOrganizations='genericProps2.userOrganizations'
                            :allOrganizations='genericProps2.userOrganizations'
          />
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
        organizationId: '0cf1daf3-4dea-4325-a9a9-ea63c659ae45',
        userOrganizations: [
          {
              'id': '0cf1daf3-4dea-4325-a9a9-ea63c659ae45',
              'name': 'epfl',
              'title': 'EPFL',
              'type': 'organization',
              'description': 'EPFL is Europe’s most cosmopolitan technical university with students, professors and staff from over 120 nations. A dynamic environment, open to Switzerland and the world, EPFL is centered on its three missions: teaching, research and technology transfer. EPFL works together with an extensive network of partners including other universities and institutes of technology, developing and emerging countries, secondary schools and colleges, industry and economy, political circles and the general public, to bring about real impact for society.\r\n\r\nMore information: http://www.epfl.ch/',
              'image_url': '2021-04-04-210008.435647index.png',
              'created': '2016-11-02T11:15:27.444553',
              'is_organization': true,
              'approval_status': 'approved',
              'state': 'active',
              'capacity': 'editor',
              'display_name': 'EPFL',
              'image_display_url': 'https://envidat04.wsl.ch/uploads/group/2021-04-04-210008.435647index.png',
          },
/*
          {
              'id': 'bd536a0f-d6ac-400e-923c-9dd351cb05fa',
              'name': 'trusted',
              'title': 'Trusted Users Organization',
              'type': 'organization',
              'description': 'Administrator Approved Users',
              'image_url': '2021-04-04-210008.435647index.png',
              'created': '2016-10-19T10:46:53.557869',
              'is_organization': true,
              'approval_status': 'approved',
              'state': 'active',
              'capacity': 'editor',
              'display_name': 'Trusted Users Organization',
              'image_display_url': 'https://envidat04.wsl.ch/uploads/group/2021-04-04-210008.435647index.png',
          },
*/
      ],
      },
      genericProps2: {
        organizationId: 'bd536a0f-d6ac-400e-923c-9dd351cb05fa',
        userOrganizations: [
          {
              'id': '0cf1daf3-4dea-4325-a9a9-ea63c659ae45',
              'name': 'epfl',
              'title': 'EPFL',
              'type': 'organization',
              'description': 'EPFL is Europe’s most cosmopolitan technical university with students, professors and staff from over 120 nations. A dynamic environment, open to Switzerland and the world, EPFL is centered on its three missions: teaching, research and technology transfer. EPFL works together with an extensive network of partners including other universities and institutes of technology, developing and emerging countries, secondary schools and colleges, industry and economy, political circles and the general public, to bring about real impact for society.\r\n\r\nMore information: http://www.epfl.ch/',
              'image_url': '2021-04-04-210008.435647index.png',
              'created': '2016-11-02T11:15:27.444553',
              'is_organization': true,
              'approval_status': 'approved',
              'state': 'active',
              'capacity': 'editor',
              'display_name': 'EPFL',
              'image_display_url': 'https://envidat04.wsl.ch/uploads/group/2021-04-04-210008.435647index.png',
          },
          {
              'id': 'bd536a0f-d6ac-400e-923c-9dd351cb05fa',
              'name': 'trusted',
              'title': 'Trusted Users Organization',
              'type': 'organization',
              'description': 'Administrator Approved Users',
              'image_url': '2021-04-04-210008.435647index.png',
              'created': '2016-10-19T10:46:53.557869',
              'is_organization': true,
              'approval_status': 'approved',
              'state': 'active',
              'capacity': 'editor',
              'display_name': 'Trusted Users Organization',
              'image_display_url': 'https://envidat04.wsl.ch/uploads/group/2021-04-04-210008.435647index.png',
          },
      ],
      },
    }),
  }))
  .add('Edit Organization component', () => ({
    components: { EditOrganizationTree },
    template: `
    <v-col>

      <v-row>
        EditOrganizationTree
      </v-row>

      <v-row class='py-3' >
        <v-col >
          <EditOrganizationTree v-bind='genericProps' />
        </v-col>
      </v-row>

      <v-row>
        EditOrganizationTree preselected and editing disabled
      </v-row>

      <v-row class='py-3' >
        <v-col >
          <EditOrganizationTree v-bind='genericProps2' />
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
