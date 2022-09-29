<template>
  <v-card id="EditAddAuthor"
          class="pa-0"
          :loading="loading">

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

<!--
      <v-row>
        <v-col class="text-body-1 pb-0">
          {{ labels.instructions }}
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-body-1">
          {{ labels.instructions2 }}
        </v-col>
      </v-row>
-->

      <v-row>
        <v-col class="text-body-1">
          {{ labels.authorInstructions }}
        </v-col>
      </v-row>

      <v-row dense
             class="pt-2">
        <v-col>

          <v-text-field ref="authorEmail"
                        id="authorEmail"
                        :label="labels.labelEmail"
                        outlined
                        :error-messages="validationErrors.authorEmail"
                        prepend-icon="email"
                        :placeholder="labels.placeholderAuthorEmail"
                        :value="authorEmailField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('authorEmail', $event)"
                        @input="changeProperty('authorEmail', $event)"
          />

        </v-col>

        <v-col class="shrink px-4 text-body-1 "
               style="text-align: center;"
               cols="2"
               v-html="labels.authorOr">
          <!--        {{ labels.authorOr }} -->
        </v-col>

        <v-col>

          <BaseUserPicker :users="fullNameUsers"
                          :preSelected="preselectAuthorNames"
                          @removedUsers="catchPickerAuthorChange($event, false)"
                          @pickedUsers="catchPickerAuthorChange($event, true)"/>
        </v-col>

      </v-row>

      <v-row dense>

        <v-col class="pl-10 text-body-1"
               v-html="labels.authorAutoComplete">
        </v-col>
      </v-row>

      <v-row dense
             class="pt-2 pl-10">

        <v-col>

          <v-text-field ref="authorGivenName"
                        id="authorGivenName"
                        :label="labels.labelAuthorGivenName"
                        outlined
                        :error-messages="validationErrors.authorGivenName"
                        prepend-icon="person"
                        :placeholder="labels.placeholderAuthorGivenName"
                        :value="authorGivenNameField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('authorGivenName', $event)"
                        @input="changeProperty('authorGivenName', $event)"
          />

        </v-col>

        <v-col class="pl-4">

          <v-text-field ref="authorSurname"
                        id="authorSurname"
                        :label="labels.labelAuthorSurname"
                        outlined
                        :error-messages="validationErrors.authorSurname"
                        prepend-icon="person"
                        :placeholder="labels.placeholderAuthorSurname"
                        :value="authorSurnameField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('authorSurname', $event)"
                        @input="changeProperty('authorSurname', $event)"
          />

        </v-col>

      </v-row>

      <v-row dense
             class="pt-2 pl-10">

        <v-col>

          <v-text-field ref="affiliation"
                        id="affiliation"
                        :label="labels.labelAffiliation"
                        outlined
                        :error-messages="validationErrors.affiliation"
                        prepend-icon="person"
                        :placeholder="labels.placeholderAffiliation"
                        :value="affiliationField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('affiliation', $event)"
                        @input="changeProperty('affiliation', $event)"
          />

        </v-col>

        <v-col class="pl-4">

          <v-text-field ref="orcId"
                        id="orcId"
                        :label="labels.labelOrcId"
                        outlined
                        :error-messages="validationErrors.orcId"
                        prepend-icon="person"
                        :placeholder="labels.placeholderOrcId"
                        :value="orcIdField"
                        @focusin="focusIn($event)"
                        @focusout="focusOut('orcId', $event)"
                        @input="changeProperty('orcId', $event)"
          />

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
import { EDIT_METADATA_ADD_AUTHOR_TITLE } from '@/factories/metadataConsts';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import { getArrayOfFullNames, getAuthorName } from '@/factories/authorFactory';
import {
  getValidationMetadataEditingObject,
  isFieldValid,
  isObjectValid,
} from '@/factories/userEditingValidations';
import imageContact from '@/assets/icons/contact.png';
import imageMail from '@/assets/icons/mail.png';

import {
  EDITMETADATA_AUTHOR,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

export default {
  name: 'EditAddAuthor',
  props: {
    titleLabel: {
      type: String,
      default: EDIT_METADATA_ADD_AUTHOR_TITLE,
    },
    authorGivenName: {
      type: String,
      default: '',
    },
    authorSurname: {
      type: String,
      default: '',
    },
    authorEmail: {
      type: String,
      default: '',
    },
    orcId: {
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
  computed: {
    affiliationField: {
      get() {
        return this.previews.affiliation !== null ? this.previews.affiliation : this.affiliation;
      },
    },
    authorGivenNameField: {
      get() {
        return this.previews.authorGivenName !== null ? this.previews.authorGivenName : this.authorGivenName;
      },
    },
    authorSurnameField: {
      get() {
        return this.previews.authorSurname !== null ? this.previews.authorSurname : this.authorSurname;
      },
    },
    authorEmailField: {
      get() {
        return this.previews.authorEmail !== null ? this.previews.authorEmail : this.authorEmail;
      },
    },
    orcIdField: {
      get() {
        return this.previews.orcId !== null ? this.previews.orcId : this.orcId;
      },
    },
    preselectAuthorNames() {
      const author = this.getAuthorByEmail(this.authorEmailField);
      const fullName = this.getFullName(author);

      return fullName ? [fullName] : [];
    },
    existingAuthorsWrap() {
      if (this.$store) {
        return this.$store.getters[`${METADATA_NAMESPACE}/existingAuthors`];
      }

      return this.existingAuthors;
    },
    fullNameUsers() {
      const localAuthors = [...this.existingAuthorsWrap];
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
      return this.activeElements.authorEmail
          || this.activeElements.authorGivenName
          || this.activeElements.authorSurname
          || this.activeElements.affiliation
          || this.activeElements.orcId;
    },
    anyPreviewsChanged() {
      return this.previews.authorEmail !== null
          || this.previews.authorGivenName !== null
          || this.previews.authorSurname !== null
          || this.previews.affiliation !== null
          || this.previews.orcId !== null;
    },
  },
  methods: {
    clearPreviews() {
      this.fillPreviews(null, null, null, null, null);
    },
    // Validate contact author properties by calling isFieldValid()
    // Returns true if all properties are valid, else returns false
    validateAuthor(authorObject) {

      const properties = ['authorEmail', 'authorGivenName', 'authorSurname', 'orcId', 'affiliation'];

      // Validate fields corresponding to properties
      for (let i = 0; i < properties.length; i++) {
        isFieldValid(properties[i], authorObject[properties[i]], this.validations, this.validationErrors);
      }

      // Return false if any of the properties have a validation error
      for (let i = 0; i < properties.length; i++) {
        const prop = properties[i];
        if (this.validationErrors[prop]) {
          return false;
        }
      }

      return true;
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
      this.notifyContactChange(property, event.target.value);
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
        const authorObject = this.getAuthorObject(author);

        this.fillPreviews(authorObject.authorEmail, authorObject.authorGivenName,
            authorObject.authorSurname, authorObject.orcId, authorObject.affiliation);

        if (this.validateAuthor(authorObject)) {
          this.setAuthorInfo(authorObject);
        }
      } else {
        // has to be an empty string here otherwise the old value (via $props)
        // would be shown
        this.fillPreviews('', '', '', '', '');
      }

    },
    getAuthorByName(fullName) {
      const authors = this.existingAuthorsWrap;
      const found = authors.filter(auth => auth.fullName === fullName);
      return found[0] || null;
    },
    getAuthorByEmail(email) {
      const authors = this.existingAuthorsWrap;
      const found = authors.filter(auth => auth.email === email);
      return found[0] || null;
    },
    getAuthorObject(author) {

      if (author) {
        return {
          authorGivenName: author.firstName?.trim(),
          authorSurname: author.lastName?.trim(),
          authorEmail: author.email?.trim(),
          orcId: author.orcId?.trim(),
          affiliation: author.affiliation?.trim(),
        };
      }

      return null;
    },
    notifyContactChange(property, value) {
      if (this.anyUserElementsActive) {
        return;
      }

      if (!this.anyPreviewsChanged) {
        return;
      }

      // default to filling all the infos from the text-field input
      let authorObject = {
        authorGivenName: this.authorGivenNameField,
        authorSurname: this.authorSurnameField,
        authorEmail: this.authorEmailField,
        orcId: this.orcIdField,
        affiliation: this.affiliationField,
      }

      if (property === 'authorEmail') {
        if (isFieldValid(property, value, this.validations, this.validationErrors)) {

          // autocomplete author
          const author = this.getAuthorByEmail(value);
          const autoAuthorObj = this.getAuthorObject(author);

          if (autoAuthorObj) {
            this.fillPreviews(autoAuthorObj.authorEmail, autoAuthorObj.authorGivenName,
                autoAuthorObj.authorSurname, autoAuthorObj.orcId, autoAuthorObj.affiliation);

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

      const newHeaderInfo = {
        ...this.$props,
        ...authorObject,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_AUTHOR,
        data: newHeaderInfo,
      });
    },
    fillPreviews(email, given, last, orcId, affiliation) {
      this.previews.authorEmail = email;
      this.previews.authorGivenName = given;
      this.previews.authorSurname = last;
      this.previews.orcId = orcId;
      this.previews.affiliation = affiliation;
    },
  },
  data: () => ({
    authorIsPicked: false,
    authorPickerTouched: false,
    previews: {
      authorEmail: null,
      orcId: null,
      affiliation: null,
      authorGivenName: null,
      authorSurname: null,
    },
    labels: {
      // title: EDIT_METADATA_ADD_AUTHOR_TITLE,
      instructions: 'Create a new author which is not a on any Metadata entry and is not EnviDat users.',
      labelEmail: 'Author Email',
      labelAuthorGivenName: 'Author Given Name',
      labelAuthorSurname: 'Author Surname',
      labelOrcId: 'Identifier - OrcId',
      labelAffiliation: 'Affiliation',
      placeholderAuthorEmail: 'Enter author email address',
      placeholderAuthorGivenName: 'Enter author given (first) name',
      placeholderAuthorSurname: 'Enter author surname name',
      placeholderOrcId: 'Enter the authors OrcId',
      placeholderAffiliation: 'Enter authors affiliation',
      instructions2: 'Enter a title for your research dataset. Please make sure that title is meaningful and specific.',
      authorInstructions: 'Enter an email address of author.',
      authorOr: '<strong>Or</strong> pick <br /> an author',
      authorAutoComplete: 'If an author is picked or found with the email address the other fields are <strong>autocompleted</strong>!',
    },
    validationProperties: [
      'authorEmail',
      'authorGivenName',
      'authorSurname',
      'orcId',
      'affiliation',
    ],
    validationErrors: {
      authorEmail: null,
      orcId: null,
      affiliation: null,
      authorGivenName: null,
      authorSurname: null,
    },
    activeElements: {
      authorEmail: null,
      orcId: null,
      affiliation: null,
      authorGivenName: null,
      authorSurname: null,
    },
    iconName: imageContact,
    iconMail: imageMail,
  }),
  components: {
    BaseUserPicker,
    BaseStatusLabelView,
  },
};
</script>

<style scoped>


</style>
