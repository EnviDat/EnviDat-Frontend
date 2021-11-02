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

        <v-text-field v-if="existingOrganizations.length === 1"
                      :value="existingOrganizations[0]"
                      outlined
                      readonly
                      >
         </v-text-field>

        <v-select     v-else
                      @input="setOrganization('organizations', $event)"
                      :value="organizationsField"
                      :items="existingOrganizations"
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
                    @clickedClose="removeOrganization(item)"
                    :isSmall="false"
          />
        </template>

        <template v-slot:item="{ item }">
          <TagChip v-if="item"
                   :name="item"
                   selectable
                   @clicked="catchOrganizationClicked"
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
   existingOrganizations: {
      type: Array,
      default: () => [],
   },
   preselectedOrganization: {
     type: String,
     default: null
   },
    organizations: {
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
    organizationsField: {
      get() {
        return [...this.organizations];
      },
    },
  },
  methods: {
    catchOrganizationClicked(pickedOrganization) {

      // Assign localOrgs to organizations concatenated with pickedOrganization
      const localOrgs = this.organizations.concat([pickedOrganization]);

      // Emit localOrgs to eventBus
      this.setOrganization('organizations', localOrgs);

    },
    removeOrganization(item) {

      // Assign removeIndex to index of organizations element that matches item
      const removeIndex = this.organizations.indexOf(item);

      // Assign localOrgs to copy of organizations
      const localOrgs = [...this.organizations];

      // Remove object with index of removeIndex from localKeywords
      localOrgs.splice(removeIndex, 1);

      // Emit localOrgs to eventBus
      this.setOrganization('organizations', localOrgs);

    },
    setOrganization(property, value) {

      const newOrganizations = {
        ...this.$props,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_ORGANIZATION,
        data: newOrganizations,
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
