<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12" xl="12" class="mb-0">
        <v-row class="mb-5">
          <v-col>
            <div class="font-weight-bold">{{ labels.contactPerson }}</div>
            <div v-html="labels.authorInstructions" class="text-caption"></div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" class="pt-5">
        <v-text-field
          ref="contactEmail"
          data-field="contactEmail"
          :id="METADATA_CONTACT_EMAIL"
          :label="labels.labelContactEmail"
          :error-messages="validationErrors[METADATA_CONTACT_EMAIL]"
          :readonly="isReadOnly('contactEmail')"
          :hint="readOnlyHint('contactEmail')"
          hide-details="auto"
          persistent-hint
          :prepend-icon="mdiEmail"
          :placeholder="labels.placeholderContactEmail"
          v-model="local.contactEmail"
          @keyup="blurOnEnterKey"
        />
      </v-col>

      <v-col cols="12" sm="6" class="pl-sm-4">
        <BaseUserPicker
          ref="contactUserPicker"
          data-field="contactUserPicker"
          :users="userPickerObjects"
          :preSelectedEmails="preselectAuthorEmails"
          :readonly="isReadOnly('contactUserPicker')"
          :hint="readOnlyHint('contactUserPicker')"
          @removedUsers="catchPickerAuthorChange($event, false)"
          @pickedUsers="catchPickerAuthorChange($event, true)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          ref="contactFirstName"
          data-field="contactFirstName"
          :id="METADATA_CONTACT_FIRSTNAME"
          :label="labels.labelContactFirstName"
          :error-messages="validationErrors[METADATA_CONTACT_FIRSTNAME]"
          :readonly="isReadOnly('contactFirstName')"
          :hint="readOnlyHint('contactFirstName')"
          hide-details="auto"
          persistent-hint
          :prepend-icon="mdiAccount"
          :placeholder="labels.placeholderContactFirstName"
          v-model="local.contactFirstName"
          @keyup="blurOnEnterKey"
        />
      </v-col>

      <v-col cols="12" sm="6" class="pl-sm-4">
        <v-text-field
          ref="contactLastName"
          data-field="contactLastName"
          :id="METADATA_CONTACT_LASTNAME"
          :label="labels.labelContactLastName"
          :error-messages="validationErrors[METADATA_CONTACT_LASTNAME]"
          :readonly="isReadOnly('contactLastName')"
          :hint="readOnlyHint('contactLastName')"
          hide-details="auto"
          persistent-hint
          :prepend-icon="mdiAccount"
          :placeholder="labels.placeholderContactLastName"
          v-model="local.contactLastName"
          @keyup="blurOnEnterKey"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiAccount, mdiEmail } from '@mdi/js';
import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';
import { createAuthor, getAuthorByEmail } from '@/factories/authorFactory';

import { isReadOnlyField, getReadOnlyHint } from '@/modules/workflow/utils/useReadonly';

const METADATA_CONTACT_EMAIL = 'contactEmail';
const METADATA_CONTACT_FIRSTNAME = 'contactFirstName';
const METADATA_CONTACT_LASTNAME = 'contactLastName';

export default {
  name: 'ContactPerson',
  emits: ['save'],
  components: { BaseUserPicker },
  props: {
    contactEmail: String,
    contactFirstName: String,
    contactLastName: String,
    userPickerObjects: { type: Array, default: () => [] },
    preselectAuthorEmails: { type: Array, default: () => [] },
    validationErrors: { type: Object, default: () => ({}) },
    authors: { type: Array, default: () => [] },
    flat: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdiAccount,
      mdiEmail,
      local: {
        contactEmail: this.contactEmail,
        contactFirstName: this.contactFirstName,
        contactLastName: this.contactLastName,
      },
      labels: {
        contactPerson: 'Contact Person',
        authorInstructions:
          'Enter an e-mail address or pick a user. <b>Picking an author auto-fills the name fields</b>; otherwise type them manually.',
        labelContactEmail: 'Contact E-mail',
        labelContactFirstName: 'Contact First Name',
        labelContactLastName: 'Contact Last Name',
        placeholderContactEmail: 'name@example.org',
        placeholderContactFirstName: 'John',
        placeholderContactLastName: 'Doe',
        authorPickHint: 'Start typing a name',
      },
      METADATA_CONTACT_EMAIL,
      METADATA_CONTACT_FIRSTNAME,
      METADATA_CONTACT_LASTNAME,
    };
  },
  watch: {
    local: {
      deep: true,
      handler() {
        this.$emit('save', { ...this.local });
      },
    },
  },
  methods: {
    isReadOnly(dateProperty) {
      return isReadOnlyField(dateProperty);
    },
    readOnlyHint(dateProperty) {
      return getReadOnlyHint(dateProperty);
    },
    blurOnEnterKey(e) {
      if (e.key === 'Enter') e.target.blur();
    },
    catchPickerAuthorChange(pickedUserEmail, hasAuthor) {
      if (!hasAuthor) return;

      const author = getAuthorByEmail(pickedUserEmail, this.authors) || {};
      const authorObj = createAuthor(author);

      this.local.contactFirstName = authorObj.firstName;
      this.local.contactLastName = authorObj.lastName;
      this.local.contactEmail = authorObj.email || '';
    },
  },
};
</script>
