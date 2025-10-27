<template>
  <v-container id="EditOrganization" fluid class="pa-4">
    <v-row>
      <v-col v-if="showTitle" cols="12" xl="12" class="mb-0">
        <v-row class="mb-5">
          <v-col>
            <div class="font-weight-bold">{{ EDIT_ORGANIZATION_TITLE }}</div>
          </v-col>
        </v-row>
      </v-col>

      <v-col v-if="message">
        <BaseStatusLabelView
          status="check"
          statusColor="success"
          :statusText="message"
          :expandedText="messageDetails"
        />
      </v-col>
      <v-col v-if="error">
        <BaseStatusLabelView
          status="error"
          statusColor="error"
          :statusText="error"
          :expandedText="errorDetails"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="onlyOneUserOrganization">
        <v-select
          :model-value="selectedOrganization"
          :items="userOrganizations"
          item-title="title"
          item-value="id"
          :readonly="isReadOnly('organizationId')"
          :prepend-icon="mdiHome"
          :menu-icon="
            isReadOnly('organizationId') ? '' : mdiArrowDownDropCircleOutline
          "
          :hint="readOnlyHint('organizationId')"
          persistent-hint
          :label="EDIT_METADATA_ORGANIZATION_LABEL"
        >
        </v-select>
      </v-col>

      <v-col v-else>
        <v-select
          :model-value="selectedOrganization"
          :items="userOrganizations"
          item-title="title"
          item-value="id"
          :readonly="isReadOnly('organizationId')"
          :prepend-icon="mdiHome"
          :menu-icon="
            isReadOnly('organizationId') ? '' : mdiArrowDownDropCircleOutline
          "
          :hint="readOnlyHint('organizationId')"
          :label="EDIT_METADATA_ORGANIZATION_LABEL"
          :error-messages="validationErrors.organizationId"
          @update:model-value="onSelectOrg"
        >
          <template v-slot:selection="{ item }">
            <MetadataOrganizationChip
              v-if="item?.title"
              :organization="item.title"
            />
          </template>

          <template v-slot:item="{ item }">
            <v-list-item v-if="item?.title" density="compact">
              <MetadataOrganizationChip :organization="item.title" />
            </v-list-item>
          </template>
        </v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * EditOrganization.vue renders the a dropdown list with a user's organizations(s).
 * The dataset organization can be edited from a selection in the list.
 *
 *
 * @summary renders the a dropdown list with a user's organizations(s)
 * @author Rebecca Kurup Buchholz & Sam Woodcock
 *
 * Created        : 2021-10-26
 * Last modified  : 2021-11-18
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { mdiArrowDownDropCircleOutline, mdiHome } from '@mdi/js';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import MetadataOrganizationChip from '@/components/Chips/MetadataOrganizationChip.vue';

import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';
import {
  EDIT_METADATA_ORGANIZATION_LABEL,
  EDIT_ORGANIZATION_TITLE,
  METADATA_ORGANIZATION_PROPERTY,
} from '@/factories/metadataConsts';
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

import {
  isReadOnlyField,
  getReadOnlyHint,
} from '@/modules/workflow/utils/useReadonly';

export default {
  name: 'EditOrganization',
  props: {
    organizationId: {
      type: String,
      default: undefined,
    },
    userOrganizations: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    message: {
      type: String,
      default: '',
    },
    messageDetails: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
    errorDetails: {
      type: String,
      default: null,
    },
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
    flat: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },

  mounted() {
    if (
      !this.organizationId &&
      this.onlyOneUserOrganization &&
      !this.isReadOnly('organizationId')
    ) {
      const org = this.userOrganizations[0];
      this.$emit('save', { id: org.id, name: org.title });
    }
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  computed: {
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },

    onlyOneUserOrganization() {
      return (
        Array.isArray(this.userOrganizations) &&
        this.userOrganizations.length === 1
      );
    },
    selectedOrgId() {
      if (this.organizationId) return this.organizationId;
      return this.onlyOneUserOrganization
        ? this.userOrganizations[0].id
        : undefined;
    },
    selectedOrganization() {
      const id = this.organizationId;

      if (!id) {
        return undefined;
      }

      const userOrg =
        this.userOrganizations.filter((orga) => orga.id === id)[0] || {};

      return {
        id: userOrg.id,
        title: userOrg.title,
      };
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_ORGANIZATION);
    },
  },
  methods: {
    onSelectOrg(id) {
      const org = this.userOrganizations.find((o) => o.id === id);
      if (!org) return;
      this.$emit('save', { id: org.id, name: org.title });
    },
    isReadOnly(fieldKey) {
      return isReadOnlyField(fieldKey, this.readOnlyFields);
    },
    readOnlyHint(fieldKey) {
      return getReadOnlyHint(fieldKey, this.readOnlyExplanation);
    },
    clearPreview() {
      this.previewOrganizationId = null;
    },
    setOrganization(value) {
      // Select organization based on picked item and pass via event bus

      this.previewOrganizationId = value.value;

      const newOrg = this.userOrganizations.filter(
        (x) => x.id === value.value,
      )[0];

      const obj = {
        id: newOrg.id,
        name: newOrg.title,
      };
      this.$emit('save', obj);
    },
    validateProperty(property, value) {
      return isFieldValid(
        property,
        value,
        this.validations,
        this.validationErrors,
      );
    },
  },
  data: () => ({
    mdiHome,
    mdiArrowDownDropCircleOutline,
    EDIT_ORGANIZATION_TITLE,
    EDIT_METADATA_ORGANIZATION_LABEL,
    METADATA_ORGANIZATION_PROPERTY,
    validationErrors: {
      organizationId: null,
    },
    emptySelection: {
      id: '',
      title: '',
    },
    previewOrganizationId: null,
  }),
  components: {
    BaseStatusLabelView,
    MetadataOrganizationChip,
  },
};
</script>
