<template>
  <v-card id="EditUserProfile" class="pa-0" :height="height" :width="minWidth" :loading="loadingColor">
    <v-container fluid class="pa-4">
      <v-row>
        <v-col class="text-h5">
          {{ labels.cardTitle }}
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
          <BaseStatusLabelView status="error" statusColor="error" :statusText="error" :expandedText="errorDetails" />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row no-gutters class="pt-4">
        <v-col>
          <v-text-field
            ref="firstName"
            id="firstName"
            :label="labels.firstName"
            :readonly="isReadOnly('firstName')"
            :hint="readOnlyHint('firstName')"
            :prepend-icon="mdiAccount"
            :error-messages="validationErrors.firstName"
            :placeholder="labels.firstName"
            :model-value="firstNameField"
            @focusin="focusIn($event)"
            @focusout="focusOut('firstName', $event)"
            @update:model-value="previewChange('firstName', $event.target.value)"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col>
          <v-text-field
            ref="lastName"
            id="lastName"
            :label="labels.lastName"
            :readonly="isReadOnly('lastName')"
            :hint="readOnlyHint('lastName')"
            :prepend-icon="mdiAccount"
            :error-messages="validationErrors.lastName"
            :placeholder="labels.lastName"
            :model-value="lastNameField"
            @focusin="focusIn($event)"
            @focusout="focusOut('lastName', $event)"
            @update:model-value="previewChange('lastName', $event.target.value)"
          />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col>
          <v-text-field
            ref="email"
            id="email"
            :label="labels.email"
            :readonly="isReadOnly('email')"
            :hint="readOnlyHint('email')"
            :prepend-icon="mdiEmail"
            :error-messages="validationErrors.email"
            :placeholder="labels.email"
            :model-value="emailField"
            @focusin="focusIn($event)"
            @focusout="focusOut('email', $event)"
            @update:model-value="previewChange('email', $event.target.value)"
          />
        </v-col>
      </v-row>

      <v-row v-if="showPreview">
        <v-col>
          <UserCard v-bind="userCardPreviewObject" />
          <!--          :width="300"-->
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
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
import { mdiAccount, mdiEmail } from '@mdi/js';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import UserCard from '@/components/Cards/UserCard.vue';
import { getAuthorName, getNameInitials } from '@/factories/authorFactory';
import { getValidationMetadataEditingObject, isFieldValid, isObjectValid } from '@/factories/userEditingValidations';
import {
  USER_PROFILE,
  EDIT_USER_PROFILE,
  EDIT_USER_PROFILE_EVENT,
  EDITMETADATA_CLEAR_PREVIEW,
  eventBus,
} from '@/factories/eventBus';

import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';

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
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
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
    validations() {
      return getValidationMetadataEditingObject(EDIT_USER_PROFILE);
    },
    userCardPreviewObject() {
      return {
        userName: this.userFullName,
        nameInitials: this.initials,
        email: this.emailField,
        emailHash: this.emailHash,
        datasetCount: this.datasetCount,
      };
    },
    anyUserElementsActive() {
      return this.activeElements.firstName || this.activeElements.lastName || this.activeElements.email;
    },
    anyPreviewsChanged() {
      return this.previews.firstName !== null || this.previews.lastName !== null || this.previews.email !== null;
    },
  },
  methods: {
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
      };

      if (isObjectValid(this.validationProperties, userObject, this.validations, this.validationErrors)) {
        const userInfo = {
          ...this.$props,
          ...userObject,
        };

        eventBus.emit(EDIT_USER_PROFILE_EVENT, {
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
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
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
    validationProperties: ['firstName', 'lastName', 'email'],
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
    mdiEmail,
    mdiAccount,
  }),
  components: {
    UserCard,
    BaseStatusLabelView,
  },
};
</script>

<style scoped></style>
