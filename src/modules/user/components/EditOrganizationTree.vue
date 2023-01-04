<template>
  <v-card id="EditOrganizationTree" class="pa-4">
    <v-row>
      <v-col cols="12">
        <div class="text-h5">
          {{ EDIT_ORGANIZATION_TITLE }}
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-text-field
          readonly
          outlined
          label="Organization"
          :value="organization"
        />
      </v-col>
    </v-row>

    <OrganizationTree
      :organizationsMap="organizationsMap"
      :preSelectedOrganization="organization"
      :selectionDisabled="selectionDisabled"
      @organizationChanged="catchOrganizationChanged"
    />
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
 * Last modified  : 2021-10-07 13:11:38
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';
import { EDIT_ORGANIZATION_TITLE } from '@/factories/metadataConsts';
import OrganizationTree from '@/modules/user/components/OrganizationTree.vue';

export default {
  name: 'EditOrganizationTree',
  props: {
    organization: {
      type: String,
      default: '',
    },
    organizationsMap: {
      type: Object,
      default: () => {},
    },
    selectionDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {
    catchOrganizationChanged(organization) {
      const newGenericProps = {
        ...this.$props,
        organization,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
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
