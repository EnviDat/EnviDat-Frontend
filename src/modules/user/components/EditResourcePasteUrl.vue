<template>
  <v-card id="EditResourcePasteUrl"
          class="pa-4" >
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
            prepend-icon="link"
            clearable
            clear-icon="close"
            :error-messages="validationErrors.url"
            @input="checkCreateButtonDisabled"
          />
        </v-col>
      </v-row>

      <v-row no-gutters justify="end">
        <v-col class="shrink">
          <BaseRectangleButton
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
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import * as yup from 'yup';
import { isObjectValidCheckAllProps } from '@/factories/userEditingValidations';

export default {
  name: 'EditResourcePasteUrl',
  props: {
    genericProps: Object,
  },
  computed: {},
  methods: {
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
    url: '',
    labels: {
      title: 'Create Resource From Link',
      instructions: 'Paste a link to create a new resource. Make sure add the file format and size afterwards.',
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