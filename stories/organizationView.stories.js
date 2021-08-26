/* eslint-disable object-property-newline */
/**
 * @summary story of all the Editing Author MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-08-26 17:37:12
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';

import OrganizationTree from '@/modules/user/components/OrganizationTree';
import testOrganizations from './js/organizations';

function organizationMap(organizations) {

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
  

  return mainOrgas;
}

const organizationsMap = organizationMap(testOrganizations);

storiesOf('8 Metadata Creation Views / Organization', module)
  .add('Organization Tree view', () => ({
    components: { OrganizationTree },
    template: `
    <v-col>

      <v-row>
      OrganizationTree
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
      // eventBus.$on(SELECT_EDITING_RESOURCE, this.selectResource);
    },
    beforeDestroy() {
      // eventBus.$off(SELECT_EDITING_RESOURCE, this.selectResource);
    },
    methods: {
    },  
    data: () => ({
      genericProps: {
        organizationsMap,
      },
    }),
  }));
