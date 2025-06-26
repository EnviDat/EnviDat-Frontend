<template>
  <v-card class="pa-4"
          :flat
  >
    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12" class="text-h6 pb-0">{{ labels.contactPerson }}</v-col>
        <v-col cols="12" class="text-body-1">{{
          labels.authorInstructions
        }}</v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="6" class="pt-5">
          <v-text-field
            ref="contactEmail"
            data-field="contactEmail"
            :id="METADATA_CONTACT_EMAIL"
            :label="labels.labelContactEmail"
            :error-messages="validationErrors[METADATA_CONTACT_EMAIL]"
            :readonly="isContactPropertyReadOnly(METADATA_CONTACT_EMAIL)"
            hide-details="auto"
            persistent-hint
            :hint="contactPropertyHint(METADATA_CONTACT_EMAIL)"
            :prepend-icon="mdiEmail"
            :placeholder="labels.placeholderContactEmail"
            v-model="local.contactEmail"
            @keyup="blurOnEnterKey"
          />
        </v-col>

        <v-col cols="12" sm="6" class="pl-sm-4">
          <BaseUserPicker
            :users="fullNameUsers"
            :preSelected="preselectAuthorNames"
            :hint="labels.authorPickHint"
            @removedUsers="catchPickerAuthorChange($event, false)"
            @pickedUsers="catchPickerAuthorChange($event, true)"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          class="text-body-1"
          v-html="labels.authorAutoComplete"
        />
      </v-row>

      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            ref="contactFirstName"
            data-field="contactFirstName"
            :id="METADATA_CONTACT_FIRSTNAME"
            :label="labels.labelContactFirstName"
            :error-messages="validationErrors[METADATA_CONTACT_FIRSTNAME]"
            :readonly="isContactPropertyReadOnly(METADATA_CONTACT_FIRSTNAME)"
            hide-details="auto"
            persistent-hint
            :hint="contactPropertyHint(METADATA_CONTACT_FIRSTNAME)"
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
            :readonly="isContactPropertyReadOnly(METADATA_CONTACT_LASTNAME)"
            hide-details="auto"
            persistent-hint
            :hint="contactPropertyHint(METADATA_CONTACT_LASTNAME)"
            :prepend-icon="mdiAccount"
            :placeholder="labels.placeholderContactLastName"
            v-model="local.contactLastName"
            @keyup="blurOnEnterKey"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mdiAccount, mdiEmail } from '@mdi/js';
import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';

const METADATA_CONTACT_EMAIL = 'contactEmail';
const METADATA_CONTACT_FIRSTNAME = 'contactFirstName';
const METADATA_CONTACT_LASTNAME = 'contactLastName';

export default {
  name: 'EditContactPerson',
  emits: ['save'],
  components: { BaseUserPicker },
  props: {
    contactEmail: String,
    contactFirstName: String,
    contactLastName: String,
    fullNameUsers: { type: Array, default: () => [] },
    preselectAuthorNames: { type: Array, default: () => [] },
    validationErrors: { type: Object, default: () => ({}) },
    isContactPropertyReadOnly: { type: Function, default: () => false },
    contactPropertyHint: { type: Function, default: () => '' },
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
        authorInstructions: 'Enter an e-mail address or pick a user.',
        labelContactEmail: 'Contact E-mail',
        labelContactFirstName: 'Contact First Name',
        labelContactLastName: 'Contact Last Name',
        placeholderContactEmail: 'name@example.org',
        placeholderContactFirstName: 'John',
        placeholderContactLastName: 'Doe',
        authorPickHint: 'Start typing a name',
        authorAutoComplete:
          'Picking an author auto-fills the name fields; otherwise type them manually.',
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
    blurOnEnterKey(e) {
      if (e.key === 'Enter') e.target.blur();
    },
    catchPickerAuthorChange(fullName, hasAuthor) {
      if (!hasAuthor) return;

      /* cerca l'autore completo (con e-mail) */
      const authorObj = this.authors.find(
        (a) => `${a.firstName} ${a.lastName}` === fullName,
      );

      if (authorObj) {
        this.local.contactFirstName = authorObj.firstName;
        this.local.contactLastName = authorObj.lastName;
        this.local.contactEmail = authorObj.email || '';
      } else {
        /* fallback – mantieni la vecchia split() se non trovi match */
        const [first, ...rest] = fullName.split(' ');
        this.local.contactFirstName = first || '';
        this.local.contactLastName = rest.join(' ');
      }
    },
  },
};
</script>
