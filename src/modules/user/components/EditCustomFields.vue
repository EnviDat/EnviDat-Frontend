<template>
  <v-card id="EditCustomFields"
          class="pa-0"
          :loading="loadingColor">
    <v-container fluid class="pa-4">

      <v-row>
        <v-col cols="6" class="text-h5">
          {{ labels.cardTitle }}
        </v-col>

        <v-col v-if="message">
          <BaseStatusLabelView
            status="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>

        <v-col v-if="error">
          <BaseStatusLabelView
            status="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <div class="text-body-1">{{ labels.cardInstructions }}</div>
        </v-col>
      </v-row>

      <v-row
        v-for="(item, index) in customFieldsProp"
        :key="`${item}_${index}`"
        no-gutters
        :class="index === 0 ? 'pt-4' : 'py-1'"
      >
        <v-col class="pr-2">
          <v-text-field
            :label="labels.labelFieldName"
            :readonly="isReadOnly('fieldName')"
            :hint="readOnlyHint('fieldName')"
            :error-messages="validationErrors.customFieldsList[index].fieldName"
            :model-value="item.fieldName"
            @change="notifyChange(index, 'fieldName', $event)"
          />
        </v-col>

        <v-col class="pl-2">
          <v-text-field
            :label="labels.labelContent"
            :readonly="isReadOnly('content')"
            :hint="readOnlyHint('content')"
            :error-messages="validationErrors.customFieldsList[index].content"
            :model-value="item.content"
            @change="notifyChange(index, 'content', $event)"
          />
        </v-col>

        <v-col class="flex-grow-0 px-1">
          <BaseIconButton
            :icon="mdiClose"
            icon-color="red"
            :disabled="index >= customFieldsProp.length - 1"
            @clicked="deleteEntry(index)"
          />
        </v-col>
      </v-row>

      <v-row v-if="maxCustomFieldsReached">
        <v-col cols="12">
          <div class="text-subtitle-2">
            <span class="text-red">{{ this.maxCustomFieldsMessage }}</span>
          </div>
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

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import {
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';
import {
  deleteEmptyObject,
  isMaxLength,
  isObjectEmpty,
} from '@/factories/userEditingFactory';
import {
  getValidationMetadataEditingObject,
  isArrayContentValid,
  isFieldValid,
} from '@/factories/userEditingValidations';

import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';
import { mdiClose } from '@mdi/js';

export default {
  name: 'EditCustomFields',
  data: () => ({
    mdiClose,
    maxCustomFieldsReached: false,
    labels: {
      cardTitle: 'Custom Fields',
      cardInstructions:
        'Advanced custom data fields. These are fields for special internal use cases.',
      labelFieldName: 'Field Name',
      labelContent: 'Content',
    },
    validationErrors: {
      customFieldsList: [
        {
          fieldName: '',
          content: '',
        },
      ],
      customFieldArray: null,
    },
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
    ...mapState(['config']),
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    maxCustomFields() {
      return this.defaultUserEditMetadataConfig.customFieldsMax;
/*
      let max = this.defaultUserEditMetadataConfig.customFieldsMax;

      if (this.$store) {
        max = this.config?.userEditMetadataConfig?.customFieldsMax || max;
      }

      return max;
*/
    },
    customFieldsProp: {
      get() {
        let fields = [...this.customFields];

        if (fields.length <= 0) {
          fields = [{ ...this.emptyEntry }];
        } else {
          this.addEmptyFieldObj(fields);
        }

        // fields.sort((a, b) => a.fieldName > b.fieldName);

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

      let addCustomField = true;
      if (lastCustomFieldName === '') {
        addCustomField = false;
      }

      // If addCustomField is true and length of localFields is less than maxCustomFields then push new custom field object to customFieldsArray
      // Else if addCustomField is true and localFields is greater than or equal to maxCustomFields then assign maxCustomFieldsReached to true
      // Else if localFields is less than maxCustomFields then assign maxCustomFieldsReached to false
      if (addCustomField && localFields.length < this.maxCustomFields) {
        localFields.push({ ...this.emptyEntry });

        const sizeDiff =
          localFields.length - this.validationErrors.customFieldsList.length;

        for (let i = 0; i < sizeDiff; i++) {
          this.validationErrors.customFieldsList.push({ ...this.emptyEntry });
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
      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_CUSTOMFIELDS,
        data: { customFields: value },
      });
    },
    deleteEntry(index) {
      const localCopy = [...this.customFieldsProp];
      const errorArray = this.validationErrors.customFieldsList;

      if (localCopy.length > 1) {
        localCopy.splice(index, 1);
      }

      // the last entry is always unused, removed it before saving
      this.removeUnusedEntry(localCopy);

      const arrayIsValid = isFieldValid(
        'customFields',
        localCopy,
        this.validations,
        this.validationErrors,
        'customFieldArray',
      );

      if (arrayIsValid) {
        this.setCustomFields(localCopy);

        if (errorArray.length > 1) {
          errorArray.splice(index, 1);
        }
      }
    },
    removeUnusedEntry(localfunders) {
      const lastFunder = localfunders[localfunders.length - 1];

      // Assign isEmpty to true if all values in lastFunder are null or empty strings, else assign isEmpty to false
      const isEmpty = isObjectEmpty(lastFunder);

      // If isEmpty is true and localfunders has at least one item then remove last element of array
      if (isEmpty && localfunders.length > 0) {
        localfunders.pop();
      }
    },
    // eslint-disable-next-line no-unused-vars
    notifyChange(index, property, value) {
      const localCopy = [...this.customFieldsProp];
      const errorArray = this.validationErrors.customFieldsList;

      this.editEntry(localCopy, index, property, value);

      const deleted = deleteEmptyObject(index, localCopy);
      if (deleted) {
        // delete also from the errorArray to keep the arrays in sync
        deleteEmptyObject(index, errorArray);
      }

      this.checkEnoughEntries(localCopy);

      let arrayIsValid = false;
      if (deleted) {
        arrayIsValid = isFieldValid(
          'customFields',
          localCopy,
          this.validations,
          this.validationErrors,
          'customFieldArray',
        );
      } else {
        arrayIsValid = isArrayContentValid(
          localCopy,
          'customFields',
          index,
          property,
          this.validations,
          errorArray,
        );
      }

      if (arrayIsValid) {
        this.setCustomFields(localCopy);

        if (deleted) {
          // delete also from the errorArray to keep the arrays in sync
          if (errorArray.length > 1) {
            errorArray.splice(index, 1);
          }
        }
      }

      this.maxCustomFieldsReached = isMaxLength(
        this.maxCustomFields,
        localCopy,
      );
    },
    isReadOnly(dateProperty) {
      return isFieldReadOnly(this.$props, dateProperty);
    },
    readOnlyHint(dateProperty) {
      return readOnlyHint(this.$props, dateProperty);
    },
  },
  components: {
    BaseStatusLabelView,
    BaseIconButton,
  },
};
</script>

<style scoped></style>
