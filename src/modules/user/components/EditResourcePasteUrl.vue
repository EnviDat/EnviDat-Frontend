<template>
  <v-card id="EditResourcePasteUrl"
          class="pa-4"
          :flat
  >

    <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ labels.title }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field
            :label="labels.textFieldLabel"
            v-model="url"
            ref="urlTextField"
            :prepend-icon="mdiLink"
            clearable
            :clear-icon="mdiClose"
            :error-messages="validationErrors.url"
            @keyup="blurOnEnterKey"
            @input="checkCreateButtonDisabled"
          />
        </v-col>
      </v-row>

      <v-row no-gutters justify="end">
        <v-col class="flex-grow-0">
          <BaseRectangleButton
            :color="createButtonDisabled ? 'grey' : 'primary'"
            :disabled="createButtonDisabled"
            :buttonText="labels.buttonText"
            @clicked="createButtonClick"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * @summary Shows a textfield to enter a url for a resource
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-18 13:23:35
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import * as yup from 'yup';

import {mdiClose, mdiLink} from '@mdi/js';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';

export default {
  name: 'EditResourcePasteUrl',
  props: {
    flat: {
      type: Boolean,
      default: false,
    },
  },
  computed: {},
  methods: {
    blurOnEnterKey(keyboardEvent) {
      if (keyboardEvent.key === 'Enter') {
        keyboardEvent.target.blur();
      }
    },
    checkCreateButtonDisabled() {

      const urlSchema = yup.object({
        url: yup.string()
            .url('Please enter a valid URL.'),
      });
      const objToValidate = { url: this.url };

      this.createButtonDisabled = !isObjectValidCheckAllProps(objToValidate, urlSchema, this.validationErrors);
    },
    createButtonClick() {
      this.$emit('createUrlResources', this.url);
    },
  },
  data: () => ({
    mdiLink,
    mdiClose,
    url: '',
    labels: {
      title: 'Create Resource From Link',
      instructions: 'Paste a link to create a new resource. Make sure to add the file format and size afterwards. If you have links to DORA publications, please add them under in \'Related Publications\' in the related information step.',
      buttonText: 'Create Resource',
      textFieldLabel: 'Link',
    },
    validationErrors: {
      url: null,
    },
    createButtonDisabled: true,
  }),
  components: {
    BaseRectangleButton,
  },
};
</script>

<style scoped></style>
