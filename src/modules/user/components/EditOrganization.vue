<template>

  <v-card id="EditOrganization"
          class="pa-0"
          :loading="loading" >

    <v-container fluid
                 class="pa-4" >

      <template slot="progress">
        <v-progress-linear color="primary"
                           indeterminate />
      </template>

      <v-row>
        <v-col cols="6"
               class="text-h5">
            {{ EDIT_ORGANIZATION_TITLE }}
        </v-col>

        <v-col v-if="message" >
          <BaseStatusLabelView statusIcon="check"
                               statusColor="success"
                               :statusText="message"
                               :expandedText="messageDetails" />
        </v-col>
        <v-col v-if="error"  >

          <BaseStatusLabelView statusIcon="error"
                               statusColor="error"
                               :statusText="error"
                               :expandedText="errorDetails" />
        </v-col>

      </v-row>

      <v-row>
        <v-col>

          <v-text-field v-if="userOrganizationsListItems.length === 1"
                        :value="userOrganizationsListItems[0]"
                        outlined
                        readonly
                        hint='This field is "readonly" because you belong to only one organization.'
                        :error-messages="validationErrors.organizationId"
                        >
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

import {
  mapState,
} from 'vuex';

import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingFactory';

import {
  USER_SIGNIN_NAMESPACE,
  USER_NAMESPACE,
  USER_GET_ORGANIZATION_IDS,
} from '@/modules/user/store/userMutationsConsts';
import { EDIT_ORGANIZATION_TITLE } from '@/factories/metadataConsts';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

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
    allOrganizations: {
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
    eventBus.$on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  mounted() {
//  beforeMount() {
    if (this.user) {
      this.fetchUserOrganisationData();
    }
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreview);
  },
  computed: {
    ...mapState(USER_SIGNIN_NAMESPACE, ['user']),
    ...mapState(USER_NAMESPACE, ['userOrganizationsList']),
    previewOrganization() {
      return this.previewOrganizationId || this.organizationId;
    },
    selectedOrganization () {
      // Get organization title, filtering userOrganizationsList by organizationId prop

      let userOrg = null;

      if (this.allOrganizations?.length > 0) {
        userOrg = this.allOrganizations.filter(x => x.id === this.previewOrganization)[0];
      }

      if (!userOrg) {
        userOrg = this.userOrganizationsList.filter(x => x.id === this.previewOrganization)[0];
      }

      if (!userOrg) {
        return this.emptySelection
      }

      return {
        id: userOrg.id,
        title: userOrg.title,
      };
    },
    userOrganizationsListItems () {
      // Return formatted list of organizations user is member of, with id/title

      if (this.userOrganizationsList) {
        return this.userOrganizationsList.map(org => ({
          id: org.id,
          title: org.title,
        }));
      }

      return [this.emptySelection]
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_ORGANIZATION);
    },
  },
  methods: {
    clearPreview() {
      this.previewOrganizationId = '';
    },
    setOrganization(orgId) {
      // Select organization based on picked item and pass via event bus

      this.previewOrganizationId = orgId;

      if (isFieldValid('organizationId', orgId, this.validations, this.validationErrors)) {

        const newOrgId = this.userOrganizationsList.filter(x => x.id === orgId)[0].id;

        eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_ORGANIZATION,
          data: {organizationId: newOrgId},
        });
      }
    },
    fetchUserOrganisationData() {
      this.$store.dispatch(`${USER_NAMESPACE}/${USER_GET_ORGANIZATION_IDS}`, this.user.id);
    },
    validateProperty(property, value) {
      return isFieldValid(property, value, this.validations, this.validationErrors)
    },
  },
  data: () => ({
    EDIT_ORGANIZATION_TITLE,
    validationErrors: {
      organizationId: null,
    },
    emptySelection: {
      'id': '',
      'title': '',
    },
    previewOrganizationId: '',
  }),
  components: {
    BaseStatusLabelView,
  },
};


</script>
