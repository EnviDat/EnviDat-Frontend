<template>
  <v-card id="EditCustomFields"
          class="pa-0"
          :loading="loading" >

    <v-container fluid
                  class="pa-4" >

      <template slot="progress">
        <v-progress-linear color="primary"
                           indeterminate />
      </template>

      <v-row>
        <v-col cols="6"
               class="text-h5">
          {{ labels.cardTitle }}
        </v-col>

        <v-col v-if="message" >
          <BaseStatusLabelView statusIcon="check"
                               statusColor="success"
                               :statusText="message"
                               :expandedText="messageDetails" />
        </v-col>
        <v-col v-if="error"  >

          <BaseStatusLabelView statusIcon="error"
                               statusColor="error"
                               :statusText="error"
                               :expandedText="errorDetails" />
        </v-col>

      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-body-1">{{ labels.cardInstructions }}</div>
        </v-col>
      </v-row>

      <v-row v-for="(item, index) in customFieldsProp"
          :key="`${item}_${index}`"
           no-gutters
          :class="index === 0 ? 'pt-4' : 'py-1'" >

        <v-col cols="6"
                class="pr-2" >
          <v-text-field :label="labels.labelFieldName"
                        outlined
                        dense
                        :readonly="mixinMethods_isFieldReadOnly('fieldName')"
                        :hint="mixinMethods_readOnlyHint('fieldName')"
                        :value="item.fieldName"
                        :error-messages="validationErrors[index].fieldName"
                        @change="notifyChange(index, 'fieldName', $event)"
                        />
        </v-col>
        <v-col cols="6"
               class="pl-2" >
          <v-text-field :label="labels.labelContent"
                        outlined
                        dense
                        :readonly="mixinMethods_isFieldReadOnly('content')"
                        :hint="mixinMethods_readOnlyHint('content')"
                        :value="item.content"
                        :error-messages="validationErrors[index].content"
                        @change="notifyChange(index, 'content', $event)"
                        />
        </v-col>
      </v-row>

      <v-row v-if="maxCustomFieldsReached">
        <v-col cols="12">
          <div class="text-subtitle-2"><span class="red--text">{{ this.maxCustomFieldsMessage }}</span></div>
        </v-col>
      </v-row>

    </v-container>
  </v-card>

</template>

<script>

/**
 * @summary shows the custom field names and contents
 * @author Rebecca Kurup Buchholz
 * Created at     : 2021-07-05
 * Last modified  : 2021-09-01 17:52:29
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mapState } from 'vuex';

import {
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import {
  deleteEmptyObject,
  getValidationMetadataEditingObject,
  isArrayValid,
  isMaxLength,
  isObjectEmpty,
} from '@/factories/userEditingFactory';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

export default {
  name: 'EditCustomFields',
  data: () => ({
    maxCustomFieldsReached: false,
    labels: {
      cardTitle: 'Custom Fields',
      cardInstructions: 'Advance custom data fields (optional)',
      labelFieldName: 'Field Name',
      labelContent: 'Content',
    },
    validationErrors: [{
      fieldName: '',
      content: '',
    }],
    defaultUserEditMetadataConfig: {
      customFieldsMax: 10,
    },
    emptyEntry: {
      fieldName: '',
      content: '',
    },
  }),
  props: {
    customFields: {
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
  computed: {
    ...mapState([
      'config',
    ]),
    maxCustomFields() {
      return this.config?.userEditMetadataConfig.customFieldsMax || this.defaultUserEditMetadataConfig.customFieldsMax;
    },
    customFieldsProp: {
      get() {
        let fields = [...this.customFields];

        if (fields.length <= 0) {
          fields = [{...this.emptyEntry}];
        } else {
          this.addEmptyFieldObj(fields);
        }

        return fields;
      },
    },
    maxCustomFieldsMessage() {
      return `Maximum number of custom fields: ${this.maxCustomFields}. Please contact the EnviDat support team if you need additional custom fields.`;
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_CUSTOMFIELDS);
    },
  },
  methods: {
     addEmptyFieldObj(localFields) {

      const lastCustomFieldObj = localFields[localFields.length - 1];

      const lastCustomFieldName = lastCustomFieldObj?.fieldName;
      const lastCustomFieldContent = lastCustomFieldObj?.content;

      let addCustomField = true;
      if (lastCustomFieldName === '' || lastCustomFieldContent === '') {
        addCustomField = false;
      }

      // If addCustomField is true and length of localFields is less than maxCustomFields then push new custom field object to customFieldsArray
      // Else if addCustomField is true and localFields is greater than or equal to maxCustomFields then assign maxCustomFieldsReached to true
      // Else if localFields is less than maxCustomFields then assign maxCustomFieldsReached to false
      if (addCustomField && localFields.length < this.maxCustomFields) {
        localFields.push({...this.emptyEntry});

        const sizeDiff = localFields.length - this.validationErrors.length;

        for (let i = 0; i < sizeDiff; i++) {
          this.validationErrors.push({...this.emptyEntry});
        }
      }
    },
     // Assign filledCustomFieldsArray to a copy of customFieldsArray with last empty custom field object removed
     // Emit filledCustomFieldsArray to eventBus
    checkEnoughEntries(localFields) {

      const lastCustomField = localFields[localFields.length - 1];

       // Assign isEmpty to true if all values in lastCustomField are null or empty strings, else assign isEmpty to false
      const isEmpty = isObjectEmpty(lastCustomField);

      // If isEmpty is true and filledCustomFieldsArray has at least one item then remove last element of array
      if (isEmpty && localFields.length > 0) {
        localFields.pop();
      }
    },
    editEntry(array, index, property, value) {
      if (array.length <= index) {
        return;
      }

      const currentEntry = array[index];
      array[index] = {
        ...currentEntry,
        [property]: value,
      };
    },
    setCustomFields(value) {

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_CUSTOMFIELDS,
        data: { customFields: value },
      });
    },
    // eslint-disable-next-line no-unused-vars
    notifyChange(index, property, value) {

      const localyCopy = [...this.customFieldsProp];
      const errorArray = this.validationErrors;

      this.editEntry(localyCopy, index, property, value);

      const deleted = deleteEmptyObject(index, localyCopy);
      if (deleted) {
        // delete also from the errorArray to keep the arrays in sync
        deleteEmptyObject(index, errorArray);
      }

      this.checkEnoughEntries(localyCopy);

      if (deleted || !deleted && isArrayValid(localyCopy, 'customFields', index, property, this.validations, errorArray)) {
        this.setCustomFields(localyCopy);
      }

      this.maxCustomFieldsReached = isMaxLength(this.maxCustomFields, localyCopy);
    },
  },
  components: {
    BaseStatusLabelView,
  },
};
</script>

<style scoped>
</style>