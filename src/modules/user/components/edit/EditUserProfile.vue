<template>
  <v-card id="EditUserProfile"
          class="pa-0"
          :height="height"
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

      <v-row no-gutters
              class="pt-4">
        <v-col >
          <v-text-field ref="firstName"
                        id="firstName"
                        :label="labels.firstName"
                        outlined
                        :readonly="checkReadOnly('firstName')"
                        :hint="checkReadOnlyHint('firstName')"
                        prepend-icon="person"
                        :error-messages="validationErrors.firstName"
                        :placeholder="labels.firstName"
                        :value="firstNameField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('firstName', $event)"
                        @input="previewChange('firstName', $event)"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col >
          <v-text-field ref="lastName"
                        id="lastName"
                        :label="labels.lastName"
                        outlined
                        :readonly="checkReadOnly('lastName')"
                        :hint="checkReadOnlyHint('lastName')"
                        prepend-icon="person"
                        :error-messages="validationErrors.lastName"
                        :placeholder="labels.lastName"
                        :value="lastNameField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('lastName', $event)"
                        @input="previewChange('lastName', $event)"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col >
          <v-text-field ref="email"
                        id="email"
                        :label="labels.email"
                        outlined
                        :readonly="checkReadOnly('email')"
                        :hint="checkReadOnlyHint('email')"
                        prepend-icon="email"
                        :error-messages="validationErrors.email"
                        :placeholder="labels.email"
                        :value="emailField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('email', $event)"
                        @input="previewChange('email', $event)"
          />
        </v-col>

      </v-row>

      <v-row v-if="showPreview">
        <v-col >

          <UserCard v-bind="userCardPreviewObject"
                    />
<!--          :width="300"-->

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
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import UserCard from '@/components/Cards/UserCard.vue';
import { getAuthorName, getNameInitials } from '@/factories/authorFactory';
import {
  getValidationMetadataEditingObject,
  isFieldValid,
  isObjectValid,
} from '@/factories/userEditingValidations';
import {
  USER_PROFILE,
  EDIT_USER_PROFILE,
  EDIT_USER_PROFILE_EVENT,
  EDITMETADATA_CLEAR_PREVIEW,
  eventBus,
} from '@/factories/eventBus';


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
    height: {
      type: Number,
      default: undefined,
    },
    minWidth: {
      type: Number,
      default: 300,
    },
    showPreview: {
      type: Boolean,
      default: true,
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
    eventBus.$on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    firstNameField() {
      return this.previews.firstName !== null ? this.previews.firstName : this.firstName;
    },
    lastNameField() {
      return this.previews.lastName !== null ? this.previews.lastName : this.lastName;
    },
    emailField() {
      return this.previews.email !== null ? this.previews.email : this.email;
    },
    userFullName() {
      return getAuthorName({
        firstName: this.firstNameField,
        lastName: this.lastNameField,
      });
    },
    initials() {
      return getNameInitials({ fullName: this.userFullName });
    },
    datasetCount() {
      return 0;
    },
    validations () {
      return getValidationMetadataEditingObject(EDIT_USER_PROFILE);
    },
    userCardPreviewObject() {
      return {
        userName: this.userFullName,
        nameInitials: this.initials,
        email: this.emailField,
        datasetCount: this.datasetCount,
      };
    },
    anyUserElementsActive() {
      return this.activeElements.firstName
          || this.activeElements.lastName
          || this.activeElements.email;
    },
    anyPreviewsChanged() {
      return this.previews.firstName !== null
          || this.previews.lastName !== null
          || this.previews.email !== null;
    },
  },
  methods: {
    checkReadOnly(property) {
      if (!this.$store) {
        return false;
      }

      return this.mixinMethods_isFieldReadOnly(property);
    },
    checkReadOnlyHint(property) {
      if (!this.$store) {
        return '';
      }

      return this.mixinMethods_readOnlyHint(property);
    },
    focusIn(event) {
      this.markPropertyActive(event.target, true);
    },
    focusOut(property, event) {
      this.markPropertyActive(event.target, false);
      this.markPropertyActive(event.relatedTarget, true);
      // this.delayedNotifyChange(property, event.target.value);
      // this.notifyChange(property, event.target.value);
      this.notifyChange();
    },
    markPropertyActive(toElement, editing) {
      const toId = toElement?.id || null;
      if (toId) {
        this.activeElements[toId] = editing;
      }
    },
    previewChange(property, value) {
      this.previews[property] = value;
      this.validateProperty(property, value);
    },
    validateProperty(property, value) {
      return isFieldValid(property, value, this.validations, this.validationErrors);
    },
    notifyChange() {
      if (this.anyUserElementsActive) {
        return;
      }

      if (!this.anyPreviewsChanged) {
        return;
      }

      const userObject = {
        firstName: this.firstNameField,
        lastName: this.lastNameField,
        email: this.emailField,
      }

      if (isObjectValid(this.validationProperties, userObject, this.validations, this.validationErrors)) {

        const userInfo = {
          ...this.$props,
          ...userObject,
        };

        eventBus.$emit(EDIT_USER_PROFILE_EVENT, {
          object: USER_PROFILE,
          data: userInfo,
        });
      }
    },
    clearPreviews() {
      this.previews.firstName = null;
      this.previews.lastName = null;
      this.previews.email = null;
    },
  },
  data: () => ({
    editingProperty: 'description',
    previews: {
      firstName: null,
      lastName: null,
      email: null,
    },
    labels: {
      cardTitle: 'Edit User Profile',
      instructions: 'Change your user profile.',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
    },
    validationProperties: [
      'firstName',
      'lastName',
      'email',
    ],
    validationErrors: {
      firstName: null,
      lastName: null,
      email: null,
    },
    activeElements: {
      firstName: false,
      lastName: false,
      email: false,
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
