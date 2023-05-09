<template>
  <v-card id="EditOrganization" class="pa-0" :loading="loading">
    <v-container fluid class="pa-4">
      <template slot="progress">
        <v-progress-linear color="primary" indeterminate />
      </template>

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

<!--
      <v-row no-gutters align="center">
        <v-col class="pt-2 text-body-1">
          Changing the Organization of a datasets is for now not possible.
          <br />
          Contact the Envidat team for support to make such a change.
        </v-col>
      </v-row>
      -->

      <v-row>
        <v-col v-if="onlyOneUserOrganziation">
          <v-text-field
            outlined
            prepend-icon="home_filled"
            :value="selectedOrganization.title"
            readonly
          />

<!--
            readonly=""
            hint='This field is "readonly" only the EnviDat Team can change it.'
-->

        </v-col>

        <v-col v-if="!onlyOneUserOrganziation">
          <v-select @input="setOrganization($event)"
                    :value="organizationField"
                    :items="userOrganizations"
                    item-text="title"
                    item-value="id"
                    outlined
                    chips
                    prepend-icon="home_filled"
                    append-icon="arrow_drop_down"
                    :readonly="mixinMethods_isFieldReadOnly('organization')"
                    :hint="mixinMethods_readOnlyHint('organization')"
                    label="Organization"
                    :error-messages="validationErrors.organizationId"
          >
          </v-select>

        </v-col>

<!--
        <v-col >
          <MetadataOrganizationChip :organization="selectedOrganization.title" />
        </v-col>
-->
      </v-row>

      <!--
      <v-row>
        <v-col>

          <v-text-field v-if="!userIsPartOfSelectedOrganization"
                        outlined
                        readonly
                        hint='This field is "readonly" because you belong to only one organization.'
                        :error-messages="validationErrors.organizationId"
                        >
            <MetadataOrganizationChip :organization="selectedOrganization.title" />

          </v-text-field>

          <v-select     v-else
                        @input="setOrganization($event)"
                        :value="selectedOrganization"
                        :items="userOrganizationsListItems"
                        item-text="title"
                        item-value="id"
                        outlined
                        chips
                        append-icon="arrow_drop_down"
                        :readonly="mixinMethods_isFieldReadOnly('organization')"
                        :hint="mixinMethods_readOnlyHint('organization')"
                        label="Organization"
                        :error-messages="validationErrors.organizationId"
                        >

         </v-select>

        </v-col>
      </v-row>
-->
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

import { mapState } from 'vuex';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
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
import {
  USER_GET_ORGANIZATION_IDS,
  USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

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
  mounted() {
    //  beforeMount() {
    if (this.currentUser) {
      this.fetchUserOrganisationData();
    }
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  computed: {
    organizationField: {
      get() {
        return this.previewOrganizationId ? this.previewOrganizationId : this.organizationId;
      },
    },
    ...mapState(USER_SIGNIN_NAMESPACE, ['user']),
    // ...mapState(USER_NAMESPACE, ['userOrganizationsList']),
    currentUser() {
      if (this.$store) {
        return this.user;
      }

      return null;
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

      if (
        isFieldValid(
          'organizationId',
          orgId,
          this.validations,
          this.validationErrors,
        )
      ) {
        const newOrgId = this.userOrganizations.filter(
          x => x.id === orgId,
        )[0].id;

        eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_ORGANIZATION,
          data: { organizationId: newOrgId },
        });
      }
    },
    fetchUserOrganisationData() {
      this.$store.dispatch(
        `${USER_NAMESPACE}/${USER_GET_ORGANIZATION_IDS}`,
        this.currentUser?.id,
      );
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
  },
};
</script>
