<template>
  <v-card id="EditAuthor"
            class="pa-4" >

    <BaseIconButton id="EditResourceCloseButton"
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

    <v-form ref="editAuthorForm">

    <v-container fluid
                  class="pa-0">
      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ labels.title }}</div>
        </v-col>

        <v-col cols="12">
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row no-gutters
              class="pt-4">
        <v-col cols="6">

          <v-text-field :label="labels.firstName"
                        ref="firstName"
                        outlined
                        required
                        :disabled="loading"
                        :rules="[ v => !!v || `${labels.firstName} is required` ]"
                        v-model="firstNameField" />
        </v-col>

        <v-col cols="6"
              class="pl-2">

          <v-text-field :label="labels.lastName"
                        ref="lastName"
                        outlined
                        required
                        :disabled="loading"
                        :rules="[ v => !!v || `${labels.lastName} is required` ]"
                        v-model="lastNameField"
                        />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field :label="labels.email"
                        ref="email"
                        outlined
                        required
                        :disabled="loading"
                        v-model="emailField" />
        </v-col>
      </v-row>

      <v-row no-gutters
             class="pt-4">
        <v-col cols="6">

          <v-text-field :label="labels.affiliation"
                        ref="affiliation"
                        outlined
                        required
                        :disabled="loading"
                        :rules="[ v => !!v || `${labels.affiliation} is required` ]"
                        v-model="affiliationField" />
        </v-col>

        <v-col cols="6"
               class="pl-2">

          <v-text-field :label="labels.identifier"
                        ref="identifier"
                        outlined
                        required
                        :disabled="loading"
                        v-model="identifierField"
          />
<!--          :rules="[ v => !!v || `${labels.identifier} is required` ]"-->
        </v-col>
      </v-row>

      <v-row no-gutters
              justify="end">
        <v-col class="shrink">
          <BaseRectangleButton :disabled="!saveButtonEnabled"
                                :loading="loading"
                                :buttonText="labels.createButtonText"
                                @clicked="saveAuthorClick" />
        </v-col>
      </v-row>


    </v-container>
    </v-form>

  </v-card>
</template>

<script>
/**
 * @summary Show all textfields for a author
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-18 16:09:39
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import {
  EDITMETADATA_AUTHOR,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { getAuthorName } from '@/factories/authorFactory';


export default {
  name: 'EditAuthor',
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
    affiliation: {
      type: String,
      default: '',
    },
    identifier: {
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
  mounted() {
  },
  computed: {
    firstNameField: {
      get() {
        return this.firstName;
      },
      set(value) {
        this.notifyChange('firstName', value);
      },
    },
    lastNameField: {
      get() {
        return this.lastName;
      },
      set(value) {
        this.notifyChange('lastName', value);
      },
    },
    emailField: {
      get() {
        return this.email;
      },
      set(value) {
        this.notifyChange('email', value);
      },
    },
    affiliationField: {
      get() {
        return this.affiliation;
      },
      set(value) {
        this.notifyChange('affiliation', value);
      },
    },
    identifierField: {
      get() {
        return this.identifier;
      },
      set(value) {
        this.notifyChange('identifier', value);
      },
    },
  },
  methods: {
    checkSaveButtonEnabled() {
      this.saveButtonEnabled = this.$refs.editAuthorForm.validate();
    },
    // eslint-disable-next-line no-unused-vars
    notifyChange(property, value) {
      this.checkSaveButtonEnabled();

      // if any changes the name was made make sure the changes are part of the fullName
      const firstName = property === 'firstName' ? value : this.firstNameField;
      const lastName = property === 'lastName' ? value : this.lastNameField;
      const fullName = getAuthorName({ firstName, lastName });

      // eslint-disable-next-line no-unused-vars
      const newAuthor = {
        ...this.$props,
        [property]: value,
        fullName,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_AUTHOR,
        data: newAuthor,
      });
    },
    saveAuthorClick() {
      this.$emit('saveAuthor');
    },
    loadImagePreview(file) {
      const vm = this;
      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageRefs = vm.$refs.filePreview;
          const imageRef = imageRefs instanceof Array ? imageRefs[0] : imageRefs;
          imageRef.src = reader.result;
        };

        reader.readAsDataURL(file);
      }

    },
  },
  data: () => ({
    labels: {
      title: 'Edit Selected Author',
      instructions: 'Change information about this author.',
      firstName: 'Given Name(s)',
      lastName: 'Surname',
      email: 'Email',
      affiliation: 'Affiliation',
      identifier: 'Identifier',
      createButtonText: 'Save Author',
    },
    saveButtonEnabled: false,
  }),
  components: {
    BaseRectangleButton,
    BaseIconButton,
  },
};
</script>

<style scoped>


</style>
