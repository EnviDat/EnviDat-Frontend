<template>
  <v-card id="EditAddAuthor"
          class="pa-0"
          :loading="loading">

    <BaseIconButton v-if="isEditingAuthor"
                    id="EditResourceCloseButton"
                    class="ma-2"
                    :class="{ 'mx-1' : $vuetify.breakpoint.smAndDown }"
                    style="position: absolute; top: 0; right: 0; z-index: 2;"
                    material-icon-name="close"
                    icon-color="primary"
                    color="primary"
                    outlined
                    tooltipText="Cancel author editing"
                    :tooltipBottom="true"
                    @clicked="$emit('closeClicked')" />

    <v-container fluid
                 class="pa-4 fill-height">

      <template slot="progress">
        <v-progress-linear color="primary"
                           indeterminate/>
      </template>

      <v-row>

        <v-col class="text-h5" cols="8">
          {{ titleLabel }}
        </v-col>

        <v-col v-if="message" cols="4" class="pl-16">
          <BaseStatusLabelView statusIcon="check"
                               statusColor="success"
                               :statusText="message"
                               :expandedText="messageDetails"/>
        </v-col>

        <v-col v-if="error" cols="4" class="pl-16">
          <BaseStatusLabelView statusIcon="error"
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
                        outlined
                        :error-messages="validationErrors.email"
                        prepend-icon="email"
                        :placeholder="labels.placeholderEmail"
                        :value="emailField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('email', $event)"
                        @input="changeProperty('email', $event)"
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
                        outlined
                        :error-messages="validationErrors.firstName"
                        prepend-icon="person"
                        :placeholder="labels.placeholderFirstName"
                        :value="firstNameField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('firstName', $event)"
                        @input="changeProperty('firstName', $event)"
          />

        </v-col>

        <v-col class="pl-4">

          <v-text-field ref="lastName"
                        id="lastName"
                        :label="labels.labelLastName"
                        outlined
                        :error-messages="validationErrors.lastName"
                        prepend-icon="person"
                        :placeholder="labels.placeholderLastName"
                        :value="lastNameField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('lastName', $event)"
                        @input="changeProperty('lastName', $event)"
          />

        </v-col>

      </v-row>

      <v-row dense
             class="px-4">

        <v-col>

          <v-text-field ref="affiliation"
                        id="affiliation"
                        :label="labels.labelAffiliation"
                        outlined
                        :error-messages="validationErrors.affiliation"
                        prepend-icon="handshake"
                        :placeholder="labels.placeholderAffiliation"
                        :value="affiliationField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('affiliation', $event)"
                        @input="changeProperty('affiliation', $event)"
          />

        </v-col>

        <v-col class="pl-4">

          <v-text-field ref="identifier"
                        id="identifier"
                        :label="labels.labelIdentifier"
                        outlined
                        :error-messages="validationErrors.identifier"
                        prepend-icon="card_membership"
                        :placeholder="labels.placeholderIdentifier"
                        :value="identifierField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('identifier', $event)"
                        @input="changeProperty('identifier', $event)"
          />

        </v-col>

      </v-row>

      <v-row v-if="isEditingAuthor" >
        <v-col>
          <BaseRectangleButton material-icon-name="clear"
                                icon-color="white"
                                color="error"
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

import BaseUserPicker from '@/components/BaseElements/BaseUserPicker';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';

import { EDIT_METADATA_ADD_AUTHOR_TITLE } from '@/factories/metadataConsts';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import { createAuthor, getArrayOfFullNames, getAuthorName } from '@/factories/authorFactory';
import {
  getValidationMetadataEditingObject,
  isFieldValid,
  isObjectValid,
} from '@/factories/userEditingValidations';
import imageContact from '@/assets/icons/contact.png';
import imageMail from '@/assets/icons/mail.png';

import {
  EDITMETADATA_AUTHOR, EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus, REMOVE_EDITING_AUTHOR,
} from '@/factories/eventBus';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

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
    eventBus.$on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
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
      const author = this.getAuthorByEmail(this.emailField);
      const fullName = this.getFullName(author);

      return fullName ? [fullName] : [];
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
        return `Change the information of ${getAuthorName({ firstName: this.firstName, lastName: this.lastName })}`;
      }

      return 'Create a new author which is not a on any dataset.';
    },
  },
  methods: {
    clearPreviews() {
      this.fillPreviews(null, null, null, null, null);
    },
    getFullName(authorObj) {
      if (!authorObj) {
        return [];
      }
      return getAuthorName(authorObj);
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
        const author = this.getAuthorByName(pickedAuthorName);
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
    getAuthorByName(fullName) {
      const authors = this.existingAuthors;
      const found = authors.filter(auth => auth.fullName === fullName);
      return found[0] || {};
    },
    getAuthorByEmail(email) {
      const authors = this.existingAuthors;
      const found = authors.filter(auth => auth.email === email);
      return found[0] || {};
    },
    notifyAuthorChange(property, value) {
      if (this.anyUserElementsActive) {
        return;
      }

      if (!this.anyPreviewsChanged) {
        return;
      }

      // default to filling all the infos from the text-field input
      // so that single text-field changes are captured too
      let authorObject = {
        firstName: this.firstNameField,
        lastName: this.lastNameField,
        email: this.emailField,
        identifier: this.identifierField,
        affiliation: this.affiliationField,
      };

      if (property === 'email') {
        if (isFieldValid(property, value, this.validations, this.validationErrors)) {

          // autocomplete author
          const autoAuthor = this.getAuthorByEmail(value);

          if (autoAuthor) {
            const autoAuthorObj = createAuthor(autoAuthor);

            this.fillPreviews(autoAuthorObj.email, autoAuthorObj.firstName,
                autoAuthorObj.lastName, autoAuthorObj.identifier, autoAuthorObj.affiliation);

            // overwrite any infos from the text-fields with the author infos
            // from the autocomplete
            authorObject = autoAuthorObj;

            // this makes the text-fields readonly again
            this.authorPickerTouched = false;
          }
        }
      }

      // store all the contact infos because notifyChanges is only called
      // when the user focus leaves any of the fields, therefore all changes
      // must be stored

      if (isObjectValid(this.validationProperties, authorObject, this.validations, this.validationErrors)) {
        this.setAuthorInfo(authorObject);
      }

    },
    setAuthorInfo(authorObject) {

      const newAuthorInfo = {
        ...authorObject,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
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
      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: REMOVE_EDITING_AUTHOR,
        data: email,
      });
    },
  },
  data: () => ({
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
    iconName: imageContact,
    iconMail: imageMail,
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
