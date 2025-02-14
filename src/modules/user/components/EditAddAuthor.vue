<template>
  <v-card id="EditAddAuthor"
          class="pa-0"
          :loading="loadingColor">

    <BaseIconButton
      v-if="isEditingAuthor"
      class="editResourceCloseButton ma-2"
      :class="{ 'mx-1' : $vuetify.display.smAndDown }"
      style="position: absolute; top: 0; right: 0; z-index: 2;"
      :icon="mdiClose"
      icon-color="black"
      color="black"
      outlined
      tooltip-text="Cancel author editing"
      tooltip-bottom
      @clicked="$emit('closeClicked')"
    />

    <v-container fluid class="pa-4">
      <v-row>
        <v-col class="text-h5" cols="8">
          {{ titleLabel }}
        </v-col>

        <v-col v-if="message" cols="4" class="pl-16">
          <BaseStatusLabelView status="check"
                               statusColor="success"
                               :statusText="message"
                               :expandedText="messageDetails"/>
        </v-col>

        <v-col v-if="error" cols="4" class="pl-16">
          <BaseStatusLabelView status="error"
                               statusColor="error"
                               :statusText="error"
                               :expandedText="errorDetails"/>
        </v-col>

      </v-row>

      <v-row>
        <v-col class="text-body-1 pb-0">
          {{ editAuthorInstructions }}
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-body-1">
          {{ labels.authorInstructions }}
        </v-col>
      </v-row>

      <v-row dense
             class="pt-2">
        <v-col>

          <v-text-field ref="email"
                        id="email"
                        :label="labels.labelEmail"
                        :error-messages="validationErrors.email"
                        :readonly="isReadOnly('authors')"
                        :hint="readOnlyHint('authors')"
                        :prepend-icon="mdiEmail"
                        :placeholder="labels.placeholderEmail"
                        :model-value="emailField"
                        @keyup="blurOnEnterKey"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('email', $event)"
                        @input="changeProperty('email', $event.target.value)"
          />

        </v-col>
      </v-row>

      <v-row v-if="!isEditingAuthor"
             no-gutters
             dense >

        <v-col class="text-body-1"
               v-html="labels.authorOr">

        </v-col>

      </v-row>

      <v-row v-if="!isEditingAuthor"
             dense
             class="pt-2">

        <v-col>

          <BaseUserPicker :users="fullNameUsers"
                          :preSelected="preselectAuthorNames"
                          :readonly="isUserPickerReadOnly"
                          :hint="isUserPickerReadOnly ? readOnlyHint('authors') : labels.authorPickHint"
                          @removedUsers="catchPickerAuthorChange($event, false)"
                          @pickedUsers="catchPickerAuthorChange($event, true)"/>
        </v-col>

      </v-row>

      <v-row class="px-4"
             dense>

        <v-col class="text-body-1"
               v-html="labels.authorAutoComplete">
        </v-col>
      </v-row>

      <v-row dense
             class="pt-2 px-4">

        <v-col>

          <v-text-field ref="firstName"
                        id="firstName"
                        :label="labels.labelFirstName"
                        :error-messages="validationErrors.firstName"
                        :prepend-icon="mdiAccount"
                        :placeholder="labels.placeholderFirstName"
                        :model-value="firstNameField"
                        :readonly="isReadOnly('authors')"
                        :hint="readOnlyHint('authors')"
                        @keyup="blurOnEnterKey"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('firstName', $event)"
                        @input="changeProperty('firstName', $event.target.value)"
          />

        </v-col>

        <v-col class="pl-4">

          <v-text-field ref="lastName"
                        id="lastName"
                        :label="labels.labelLastName"
                        :error-messages="validationErrors.lastName"
                        :prepend-icon="mdiAccount"
                        :placeholder="labels.placeholderLastName"
                        :model-value="lastNameField"
                        :readonly="isReadOnly('authors')"
                        :hint="readOnlyHint('authors')"
                        @keyup="blurOnEnterKey"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('lastName', $event)"
                        @input="changeProperty('lastName', $event.target.value)"
          />

        </v-col>

      </v-row>

      <v-row dense
             class="px-4">

        <v-col>

          <v-text-field ref="affiliation"
                        id="affiliation"
                        :label="labels.labelAffiliation"
                        :error-messages="validationErrors.affiliation"
                        :prepend-icon="mdiHandshake"
                        :placeholder="labels.placeholderAffiliation"
                        :model-value="affiliationField"
                        :readonly="isReadOnly('authors')"
                        :hint="readOnlyHint('authors')"
                        @keyup="blurOnEnterKey"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('affiliation', $event)"
                        @input="changeProperty('affiliation', $event.target.value)"
          />

        </v-col>

        <v-col class="pl-4">

          <v-text-field ref="identifier"
                        id="identifier"
                        :label="labels.labelIdentifier"
                        :error-messages="validationErrors.identifier"
                        :prepend-icon="mdiWalletMembership"
                        :placeholder="labels.placeholderIdentifier"
                        :model-value="identifierField"
                        :readonly="isReadOnly('authors')"
                        :hint="readOnlyHint('authors')"
                        @keyup="blurOnEnterKey"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('identifier', $event)"
                        @input="changeProperty('identifier', $event.target.value)"
          />

        </v-col>

      </v-row>

      <v-row v-if="isEditingAuthor" >
        <v-col>
          <BaseRectangleButton :icon="mdiClose"
                               icon-color="white"
                               color="error"
                               :disabled="isReadOnly('authors')"
                               button-text="Remove Author"
                               tooltip-text="Remove this author from the dataset"
                               @clicked="removeAuthorClick(email)"/>

        </v-col>
      </v-row>

    </v-container>

  </v-card>
</template>

<script>
/**
 * @summary Show a title, instructions and a button to create a new author
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-18 16:09:39
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import { mdiAccount, mdiClose, mdiEmail, mdiHandshake, mdiWalletMembership } from '@mdi/js';
import BaseUserPicker from '@/components/BaseElements/BaseUserPicker.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

import { EDIT_METADATA_ADD_AUTHOR_TITLE } from '@/factories/metadataConsts';

import {
  createAuthor,
  getArrayOfFullNames,
  getAuthorByEmail,
  getAuthorByName,
  getAuthorName,
} from '@/factories/authorFactory';
import {
  getValidationMetadataEditingObject,
  isFieldValid,
  isObjectValid,
} from '@/factories/userEditingValidations';

import {
  EDITMETADATA_AUTHOR, EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  REMOVE_EDITING_AUTHOR,
} from '@/factories/eventBus';

import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';


export default {
  name: 'EditAddAuthor',
  props: {
    titleLabel: {
      type: String,
      default: EDIT_METADATA_ADD_AUTHOR_TITLE,
    },
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
    identifier: {
      type: String,
      default: '',
    },
    affiliation: {
      type: String,
      default: '',
    },
    existingAuthors: {
      type: Array,
      default: () => [],
    },
    isEditingAuthor: {
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
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
  },
  mounted() {
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
    affiliationField: {
      get() {
        return this.previews.affiliation !== null ? this.previews.affiliation : this.affiliation;
      },
    },
    firstNameField: {
      get() {
        return this.previews.firstName !== null ? this.previews.firstName : this.firstName;
      },
    },
    lastNameField: {
      get() {
        return this.previews.lastName !== null ? this.previews.lastName : this.lastName;
      },
    },
    emailField: {
      get() {
        return this.previews.email !== null ? this.previews.email : this.email;
      },
    },
    identifierField: {
      get() {
        return this.previews.identifier !== null ? this.previews.identifier : this.identifier;
      },
    },
    preselectAuthorNames() {
      const author = getAuthorByEmail(this.emailField, this.existingAuthors);

      if (author) {
        const fullName = getAuthorName(author);
        return fullName ? [fullName] : [];
      }

      return undefined;
    },
    fullNameUsers() {
      const localAuthors = [...this.existingAuthors];
      return getArrayOfFullNames(localAuthors);
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_AUTHOR);
    },
    infoReadOnly() {
      return (this.authorPickerTouched && this.authorIsPicked) || (!this.authorPickerTouched && this.authorPickerFoundAuthor);
    },
    authorPickerFoundAuthor() {
      if (this.preselectAuthorNames?.length <= 0 || this.fullNameUsers?.length <= 0) {
        return false;
      }

      const matches = this.fullNameUsers.filter(fullName => fullName === this.preselectAuthorNames[0]);
      return matches.length > 0;
    },
    anyUserElementsActive() {
      return this.activeElements.email
          || this.activeElements.firstName
          || this.activeElements.lastName
          || this.activeElements.affiliation
          || this.activeElements.identifier;
    },
    anyPreviewsChanged() {
      return this.previews.email !== null
          || this.previews.firstName !== null
          || this.previews.lastName !== null
          || this.previews.affiliation !== null
          || this.previews.identifier !== null;
    },
    editAuthorInstructions() {
      if (this.isEditingAuthor){
        return `Change the information of ${getAuthorName({ firstName: this.firstName, lastName: this.lastName })} for this dataset.`;
      }

      return 'Create a new author which is not on any published dataset.';
    },
    isUserPickerReadOnly() {
      return this.isReadOnly('authors');
    },
  },
  methods: {
    blurOnEnterKey(keyboardEvent) {
      if (keyboardEvent.key === 'Enter') {
        keyboardEvent.target.blur();
      }
    },
    clearPreviews() {
      this.fillPreviews(null, null, null, null, null);
    },
    focusIn(event) {
      this.markPropertyActive(event.target, true);
    },
    focusOut(property, event) {
      this.markPropertyActive(event.target, false);
      this.markPropertyActive(event.relatedTarget, true);
      // this.delayedNotifyChange(property, event.target.value);
      this.notifyAuthorChange(property, event.target.value);
    },
    markPropertyActive(toElement, editing) {
      const toId = toElement?.id || null;
      if (toId) {
        this.activeElements[toId] = editing;
      }
    },
    changeProperty(property, value) {
      this.previews[property] = value;
      this.validateProperty(property, value);
    },
    validateProperty(property, value) {
      return isFieldValid(property, value, this.validations, this.validationErrors);
    },
    catchPickerAuthorChange(pickedAuthorName, hasAuthor) {

      this.authorPickerTouched = true;
      this.authorIsPicked = hasAuthor;

      if (this.authorIsPicked) {
        const author = getAuthorByName(pickedAuthorName, this.existingAuthors) || {};
        const authorObject = createAuthor(author);

        this.fillPreviews(authorObject.email, authorObject.firstName,
            authorObject.lastName, authorObject.identifier, authorObject.affiliation);

        if (isObjectValid(this.validationProperties, authorObject, this.validations, this.validationErrors)) {
          this.setAuthorInfo(authorObject);
        }
      } else {
        // has to be an empty string here otherwise the old value (via $props)
        // would be shown
        this.fillPreviews('', '', '', '', '');
      }

    },
    notifyAuthorChange(property, value) {
      if (this.anyUserElementsActive) {
        return;
      }

      if (!this.anyPreviewsChanged) {
        return;
      }

      const authorObj = {
        firstName: this.firstNameField,
        lastName: this.lastNameField,
      };
      const fullName = getAuthorName(authorObj);
      // default to filling all the infos from the text-field input
      // so that single text-field changes are captured too
      let authorObject = createAuthor({
        ...authorObj,
        fullName,
        email: this.emailField,
        identifier: this.identifierField,
        affiliation: this.affiliationField,
      });

      if (property === 'email') {

        if (isFieldValid(property, value, this.validations, this.validationErrors)) {
          const autoAuthor = this.getAutoCompletedAuthor(value);
          if (autoAuthor) {
            authorObject = autoAuthor;
          }
        }

      }

      if (isObjectValid(this.validationProperties, authorObject, this.validations, this.validationErrors)) {
        this.setAuthorInfo(authorObject);
      }

    },
    getAutoCompletedAuthor(email) {

      const autoAuthor = getAuthorByEmail(email, this.existingAuthors);

      if (autoAuthor) {
        const autoAuthorObj = createAuthor(autoAuthor);

        this.fillPreviews(autoAuthorObj.email, autoAuthorObj.firstName,
            autoAuthorObj.lastName, autoAuthorObj.identifier, autoAuthorObj.affiliation);

        // this makes the text-fields readonly again
        this.authorPickerTouched = false;

        return autoAuthorObj;
      }

      return null;
    },
    setAuthorInfo(authorObject) {

      const newAuthorInfo = {
        ...authorObject,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_AUTHOR,
        data: newAuthorInfo,
      });
    },
    fillPreviews(email, firstName, lastName, identifier, affiliation) {
      this.previews.email = email;
      this.previews.firstName = firstName;
      this.previews.lastName = lastName;
      this.previews.identifier = identifier;
      this.previews.affiliation = affiliation;
    },
    removeAuthorClick(email) {
      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: REMOVE_EDITING_AUTHOR,
        data: email,
      });
    },
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
  },
  data: () => ({
    mdiWalletMembership,
    mdiHandshake,
    mdiClose,
    mdiEmail,
    mdiAccount,
    authorIsPicked: false,
    authorPickerTouched: false,
    previews: {
      email: null,
      identifier: null,
      affiliation: null,
      firstName: null,
      lastName: null,
    },
    labels: {
      labelEmail: 'Email',
      labelFirstName: 'Fist Name',
      labelLastName: 'Last Name',
      labelIdentifier: 'Identifier - OrcId',
      labelAffiliation: 'Affiliation',
      placeholderEmail: 'Enter author email address',
      placeholderFirstName: 'Enter author first name',
      placeholderLastName: 'Enter author last name',
      placeholderIdentifier: 'Enter the authors OrcId',
      placeholderAffiliation: 'Enter authors affiliation',
      authorInstructions: 'Enter an email address of the author.',
      authorOr: '<strong>Or</strong> pick an existing author',
      authorAutoComplete: 'If an author is picked or found with the email address these fields are <strong>autocompleted</strong>!',
      authorPickHint: 'Start typing the name in the text field to search for an author.',
    },
    validationProperties: [
      'email',
      'firstName',
      'lastName',
      'affiliation',
      // don't include the identifier here for auto validation, because it's optional
    ],
    validationErrors: {
      email: null,
      identifier: null,
      affiliation: null,
      firstName: null,
      lastName: null,
    },
    activeElements: {
      email: null,
      identifier: null,
      affiliation: null,
      firstName: null,
      lastName: null,
    },
  }),
  components: {
    BaseRectangleButton,
    BaseUserPicker,
    BaseStatusLabelView,
    BaseIconButton,
  },
};
</script>

<style scoped>


</style>
