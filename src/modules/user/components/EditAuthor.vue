<template>
  <v-card id="EditAuthor"
            class="pa-4" >

    <BaseIconButton id="EditResourceCloseButton"
                    class="ma-2"
                    :class="{ 'mx-1' : $vuetify.breakpoint.smAndDown }"
                    style="position: absolute; top: 0px; right: 0px; z-index: 2;"
                    material-icon-name="close"
                    icon-color="primary"
                    color="primary"
                    outlined
                    tool-tip-text="Cancel Resource Editing"
                    :tool-tip-bottom="true"
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
                        v-model="firstName" />
        </v-col>

        <v-col cols="6"
              class="pl-2">

          <v-text-field :label="labels.lastName"
                        ref="lastName"
                        outlined
                        required
                        :disabled="loading"
                        :rules="[ v => !!v || `${labels.lastName} is required` ]"
                        v-model="lastName"
                        />
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field :label="labels.email"
                        ref="email"
                        outlined
                        required
                        :rules="rulesEmail"
                        :disabled="loading"
                        v-model="email" />
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
                        v-model="affiliation" />
        </v-col>

        <v-col cols="6"
               class="pl-2">

          <v-text-field :label="labels.identifier"
                        ref="identifier"
                        outlined
                        required
                        :disabled="loading"
                        v-model="identifier"
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
  EDITMETADATA_DATA_AUTHOR,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';


export default {
  name: 'EditAuthor',
  props: {
    genericProps: Object,
  },
  mounted() {
  },
  computed: {
    firstName: {
      get() {
        return this.mixinMethods_getGenericProp('firstName', '');
      },
      set(value) {
        this.notifyChange('firstName', value);
      },
    },
    lastName: {
      get() {
        return this.mixinMethods_getGenericProp('lastName', '');
      },
      set(value) {
        this.notifyChange('lastName', value);
      },
    },
    email: {
      get() {
        return this.mixinMethods_getGenericProp('email', '');
      },
      set(value) {
        this.notifyChange('email', value);
      },
    },
    affiliation: {
      get() {
        return this.mixinMethods_getGenericProp('affiliation', '');
      },
      set(value) {
        this.notifyChange('affiliation', value);
      },
    },
    identifier: {
      get() {
        return this.mixinMethods_getGenericProp('identifier', '');
      },
      set(value) {
        this.notifyChange('identifier', value);
      },
    },
    loading() {
      return this.mixinMethods_getGenericProp('loading', false);
    },
  },
  methods: {
    checkSaveButtonEnabled() {
      this.saveButtonEnabled = this.$refs.editAuthorForm.validate();
    },
    // eslint-disable-next-line no-unused-vars
    notifyChange(property, value) {
      this.checkSaveButtonEnabled();

      // eslint-disable-next-line no-unused-vars
      const newGenericProps = {
        ...this.genericProps,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_AUTHOR,
        data: newGenericProps,
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
    rulesEmail: [
      v => !!v || 'The email address of the author is required',
      v => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'Please enter valid email address',
    ],
  }),
  components: {
    BaseRectangleButton,
    BaseIconButton,
  },
};
</script>

<style scoped>


</style>
