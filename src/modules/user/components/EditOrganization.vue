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

          <v-text-field v-if="userOrganizationsNameList.length === 1"
                        :value="userOrganizationsNameList[0]"
                        outlined
                        readonly
                        :error-messages="validationErrors.organization"
                        >
           </v-text-field>

          <v-select     v-else
                        @input="setOrganization('organization', $event)"
                        :value="organizationField"
                        :items="userOrganizationsNameList"
                        outlined
                        chips
                        append-icon="arrow_drop_down"
                        :readonly="readonly"
                        label="Organization"
                        :error-messages="validationErrors.organization"
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

// TODO add organization remove methods, emit methods, etc.

import {
  mapState,
} from 'vuex';

import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  eventBus,
} from '@/factories/eventBus';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingFactory';
import {
  getObjectInOtherCase,
  toCamelCase,
} from '@/factories/mappingFactory';

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
    organization: {
      type: Object,
      default: () => {},
      },
    readonly: {
      type: Boolean,
      default: false,
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
  },
  beforeMount() {
    if (this.user) {
      this.fetchUserOrganisationData();
    }
  },
  computed: {
    ...mapState(USER_SIGNIN_NAMESPACE, ['user']),
    ...mapState(USER_NAMESPACE, ['userOrganizationsList']),
    organizationField () {
      return this.organization.title
    },
    userOrganizationsNameList () {
      if (this.userOrganizationsList) {
        return this.userOrganizationsList.map(org => org.title);
      }
      return []
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_ORGANIZATION);
    },
  },
  methods: {
    setOrganization(property, value) {

      let selectedOrg = this.userOrganizationsList.filter(x => x.title === value);
      selectedOrg = getObjectInOtherCase(selectedOrg, toCamelCase);
      // Remove unused properties
      const { capacity, displayName, imageDisplayUrl, ...updatedOrg } = selectedOrg[0];

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_ORGANIZATION,
        data: {property: updatedOrg},
      });
    },
    fetchUserOrganisationData() {
      this.$store.dispatch(`${USER_NAMESPACE}/${USER_GET_ORGANIZATION_IDS}`, this.user.id);
    },
    validateProperty(property, value){
      return isFieldValid(property, value, this.validations, this.validationErrors)
    },
  },
  data: () => ({
    EDIT_ORGANIZATION_TITLE,
    validationErrors: {
      organization: null,
    },
  }),
  components: {
    BaseStatusLabelView,
  },
};


</script>
