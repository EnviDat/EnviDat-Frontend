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

        <v-text-field v-if="preselectedOrganization"
                      :value="preselectedOrganization"
                      outlined
                      readonly
                      >
         </v-text-field>

        <v-select     v-else
                      :value="selectedOrganizationsDisplay"
                      :items="organizations"
                      outlined
                      chips
                      deletable-chips
                      append-icon="arrow_drop_down"
                      :readonly="readonly"
                      label="Organization"
                      multiple
                      >

        <template v-slot:selection="{ item }" >
          <TagChip  :name="item"
                    selectable
                    closeable
                    :isSmall="false"
          />
        </template>

        <template v-slot:item="{ item }">
          <TagChip v-if="item"
                   :name="item"
                   selectable
                   :isSmall="false" />
        </template>

       </v-select>

      </v-col>
    </v-row>


  </v-card>

</template>


<script>
/**
 * EditOrganization.vue renders the a dropdown list with a user's organizations(s)
 *
 *
 * @summary renders the a dropdown list with a user's organizations(s)
 * @authorRebecca Kurup Buchholz
 *
 * Created        : 2021-10-26
 * Last modified  : 2021-10-26
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

// TODO add organization remove methods, emit methods, etc.

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';

import { EDIT_ORGANIZATION_TITLE } from '@/factories/metadataConsts';
import TagChip from '@/components/Chips/TagChip';


export default {
  name: 'EditOrganization',
  props: {
   preselectedOrganization: {
     type: String,
     default: null
   },
    selectedOrganizations: {
      type: Array,
      default: () => [],
     },
    organizationsInfo: {
      type: Array,
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
  },
  computed: {
    selectedOrganizationsDisplay: {
      get() {
        return [...this.selectedOrganizations];
      },
    },
    organizations() {

      const orgNames = [];

      this.organizationsInfo.forEach(organization => {
        if ('display_name' in organization) {
          orgNames.push(organization.display_name);
        }
      })

      // Remove duplicates from orgNames
      // orgNames = [...new Set(orgNames.map(a => JSON.stringify(a)))].map(a => JSON.parse(a));

      orgNames.sort();

      return orgNames;

    },
  },
  methods: {
    catchOrganizationChanged(organization) {

      const newGenericProps = {
        ...this.$props,
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
    TagChip,
  },
};


</script>
