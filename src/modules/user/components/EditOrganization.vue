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
                      :value="organization"
                      />
      </v-col>
    </v-row>

    <OrganizationTree :organizationsMap="organizationsMap"
                      :preSelectedOrganization="organization"
                      :selectionDisabled="selectionDisabled"
                      @organizationChanged="catchOrganizationChanged" />

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
  computed: {
    organizationsMap() {
      return this.mixinMethods_getGenericProp('organizationsMap', {});
      // return getOrganizationMap(testOrganizations);
    },
    organization() {
      return this.mixinMethods_getGenericProp('organization', '');
    },
    selectionDisabled() {
      return this.mixinMethods_getGenericProp('selectionDisabled', false);
    },
  },
  methods: {
    catchOrganizationChanged(organization) {

      const newGenericProps = {
        ...this.genericProps,
        organization,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_ORGANIZATION,
        data: newGenericProps,
      });
    },
  },
  data: () => ({
    EDIT_ORGANIZATION_TITLE,
  }),
  components: {
    OrganizationTree,
  },
};


</script>
