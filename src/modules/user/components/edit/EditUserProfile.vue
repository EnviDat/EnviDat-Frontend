<template>
  <v-card id="EditUserProfile"
          class="pa-0"
          :width="minWidth"
          :loading="loading">

    <v-container fluid
                 class="pa-4">

      <template slot="progress">
        <v-progress-linear color="primary"
                           indeterminate />
      </template>

      <v-row>
        <v-col class="text-h5">
          {{ labels.cardTitle }}
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
        <v-col >
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col >

          <UserCard :user-name="userFullName"
                    :name-initials="initials"
                    :email="email"
                    :datasetCount="datasetCount"
                    :width="minWidth"
                    />

        </v-col>
      </v-row>

    </v-container>
  </v-card>

</template>

<script>/**
 * EditUserProfile.vue
 *
 * @summary component for changing the users information
 * @author Haas-Artho
 *
 * Created at     : 2022-04-28
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';
import UserCard from '@/components/Cards/UserCard';
import { getAuthorName, getNameInitials } from '@/factories/authorFactory';


export default {
  name: 'EditUserProfile',
  props: {
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    emailHash: {
      type: String,
      default: '',
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
  computed: {
    userFullName() {
      return getAuthorName({
        firstName: this.firstName,
        lastName: this.lastName,
      });
    },
    initials() {
      return getNameInitials(this.userFullName);
    },
    datasetCount() {
      return 0;
    },
  },
  methods: {

  },
  data: () => ({
    minWidth: 300,
    editingProperty: 'description',
    previewText: null,
    labels: {
      cardTitle: 'Edit User Profile',
      instructions: 'Change your user profile.',
      subtitlePreview: 'Description Preview',
    },
    validationErrors: {
      description: null,
    },
  }),
  components: {
    UserCard,
    BaseStatusLabelView,
  },
};
</script>

<style scoped>

</style>
