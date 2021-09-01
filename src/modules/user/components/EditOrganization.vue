<template>

  <v-card id="EditOrganization"
          class="pa-4">

    <v-row>
      <v-col cols="12"> 
        <div class="text-h5">
          {{ EDIT_ORGANIZATION_TITLE }}
        </div>
      </v-col>
    </v-row>            

    <v-row>
      <v-col>
        <v-text-field readonly
                      outlined
                      label="Organization"
                      :value="selectedOrganization"
                      />
      </v-col>
    </v-row>

    <OrganizationTree :organizationsMap="allOrganizations"
                      :preSelectedOrganization="preSelectedOrganization"
                      :selectionDisabled="selectionDisabled" />

  </v-card>  

</template>


<script>
/**
 * EditOrganization.vue renders the GenericPlaceholder component with a screenshot image of the Metadata Keywords mockup used in the slot
 * 
 *
 * @summary shows a screenshot placeholder of the editing the Related Info 
 * @author Dominik Haas-Artho
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-09-01 15:24:55
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import OrganizationTree from '@/modules/user/components/OrganizationTree';
import testOrganizations from '@/../stories/js/organizations';

import { getOrganizationMap } from '@/factories/metaDataFactory';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';

import { EDIT_ORGANIZATION_TITLE } from '@/factories/metadataConsts';

export default {
  name: 'EditOrganization',
  props: {  
    genericProps: Object,
  },
  created() {
    eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.showSelectedOrga);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.showSelectedOrga);
  },
  computed: {
    allOrganizations() {
      return getOrganizationMap(testOrganizations);
    },
    preSelectedOrganization() {
      return this.mixinMethods_getGenericProp('organization', '');
    },
    selectionDisabled() {
      return this.mixinMethods_getGenericProp('selectionDisabled', false);
    },
  },
  methods: {
    showSelectedOrga(updateObj) {
      if (updateObj.object === EDITMETADATA_ORGANIZATION) {
        this.selectedOrganization = updateObj.data;
      }
    },
  },
  data: () => ({
    selectedOrganization: '',
    EDIT_ORGANIZATION_TITLE,
  }),
  components: {
    OrganizationTree,
  },
};


</script>
