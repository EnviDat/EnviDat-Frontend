/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-09-01 16:18:24
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import EditOrganization from '@/modules/user/components/EditOrganization';
import OrganizationTree from '@/modules/user/components/OrganizationTree';
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';

import testOrganizations from './js/organizations';


function getOrganizationMap(organizations) {

  const mainOrgas = {};
  const topLevel = [];

  for (let i = 0; i < organizations.length; i++) {
    const orga = organizations[i];
    let orgasSublist = null;

    if (orga?.groups?.length > 0) {
      const main = orga.groups[0].name;
      if (main && !mainOrgas[main]) {
        mainOrgas[main] = [];
      }

      orgasSublist = mainOrgas[main];
    }

    if (orgasSublist && !orgasSublist.includes(orga)) {
      orgasSublist.push(orga);
    } else {
      topLevel.push(orga);
    }
    
  }

  for (let i = 0; i < topLevel.length; i++) {
    const k = topLevel[i];
    mainOrgas[k.name] = k;
  }

  return mainOrgas;
}

// const organizationsMap = getOrganizationMap(testOrganizations);

storiesOf('8 Metadata Creation Views / Organization', module)
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
          <OrganizationTree :organizationsMap="genericProps.organizationsMap"
                            :preSelectedOrganization="'wsl'" />
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
    }),
  }))
  .add('Edit Organization component', () => ({
    components: { EditOrganization },
    template: `
    <v-col>

      <!-- v-row>
        EditOrganization
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditOrganization />
        </v-col>
      </v-row -->

      <v-row>
        EditOrganization preselected and editing disabled
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <EditOrganization :genericProps="genericProps" />
        </v-col>
      </v-row>

    </v-col>
    `,
    created() {
    },
    beforeDestroy() {
    },
    methods: {
    },  
    data: () => ({
      genericProps: {
        organization: 'community-ecology',
        selectionDisabled: true,
      },
    }),
  }));
