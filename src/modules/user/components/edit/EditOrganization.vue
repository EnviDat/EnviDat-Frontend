<template>
  <v-card id="EditOrganization"
          class="pa-0"
          :loading="loadingColor">
    <v-container fluid class="pa-4">

      <v-row>
        <v-col cols="6" class="text-h5">
          {{ EDIT_ORGANIZATION_TITLE }}
        </v-col>

        <v-col v-if="message">
          <BaseStatusLabelView
            statusIcon="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error">
          <BaseStatusLabelView
            statusIcon="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col v-if="onlyOneUserOrganziation">

          <v-select :value="selectedOrganization"
                    :items="userOrganizations"
                    item-text="title"
                    item-value="id"
                    outlined
                    dense
                    chips
                    readonly
                    prepend-icon="home_filled"
                    :hint="readOnlyHint('organization') || 'Your Organization was autocompleted'"
                    persistent-hint
                    label="Organization"
          >
            <template v-slot:selection="{ item }">
              <MetadataOrganizationChip :organization="item.title"/>
            </template>
          </v-select>

        </v-col>

        <v-col v-if="!onlyOneUserOrganziation">

          <v-select @input="setOrganization($event)"
                    :value="organizationField"
                    :items="userOrganizations"
                    item-text="title"
                    item-value="id"
                    outlined
                    dense
                    chips
                    prepend-icon="home_filled"
                    :append-icon="isEditOrganizationReadonly ? '' : 'arrow_drop_down'"
                    :readonly="isEditOrganizationReadonly"
                    :hint="readOnlyHint('organization')"
                    :persistent-hint="isEditOrganizationReadonly"
                    label="Organization"
                    :error-messages="validationErrors.organizationId"
          >
            <template v-slot:selection="{ item }">
              <MetadataOrganizationChip :organization="item.title"/>
            </template>

            <template v-slot:item="{ item }">
              <MetadataOrganizationChip :organization="item.title"/>
            </template>
          </v-select>
        </v-col>

      </v-row>

    </v-container>
  </v-card>
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

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import MetadataOrganizationChip from '@/components/Chips/MetadataOrganizationChip.vue';

import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';
import { EDIT_ORGANIZATION_TITLE } from '@/factories/metadataConsts';
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';

export default {
  name: 'EditOrganization',
  props: {
    organizationId: {
      type: String,
      default: '',
    },
    userOrganizations: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
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
  },
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
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
    organizationField: {
      get() {
        return this.previewOrganizationId ? this.previewOrganizationId : this.organizationId;
      },
    },
    isEditOrganizationReadonly() {
      return this.isReadOnly('organization');
    },
    onlyOneUserOrganziation() {
      return this.userOrganizations?.length === 1;
    },
    selectedOrganization() {

      const id = this.organizationField;

      const userOrg = this.userOrganizations.filter((orga) => orga.id === id)[0] || {};

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
    clearPreview() {
      this.previewOrganizationId = null;
    },
    setOrganization(orgId) {
      // Select organization based on picked item and pass via event bus

      this.previewOrganizationId = orgId;

      if (isFieldValid(
          'organizationId',
          orgId,
          this.validations,
          this.validationErrors,
        )) {
        const newOrgId = this.userOrganizations.filter(x => x.id === orgId)[0].id;

        eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_ORGANIZATION,
          data: { organizationId: newOrgId },
        });
      }
    },
    validateProperty(property, value) {
      return isFieldValid(
        property,
        value,
        this.validations,
        this.validationErrors,
      );
    },
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
  },
  data: () => ({
    EDIT_ORGANIZATION_TITLE,
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
