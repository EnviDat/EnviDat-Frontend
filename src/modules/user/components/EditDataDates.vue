<template>
  <v-card id="EditDataDates"
          class="pa-0"
          :loading="loadingColor">

    <v-container fluid class="pa-4">
      <v-row>
        <v-col cols="8" class="text-h5">
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
        <v-col>
          <div class="text-body-1" v-html="labels.instructions" />
        </v-col>
      </v-row>

      <v-row dense class="pt-4">
        <v-col
          v-for="(item, index) in datesField"
          :key="`${item}_${index}`"
          cols="12"
          md="6"
          sm="4"
          :class="(index + 1) % 2 === 0 ? 'pr-0' : 'px-0'"
        >
          <v-row class="d-flex flex-column" no-gutters dense>
            <v-col cols="11" class="pt-2 px-sm-2 flex-grow-0 mb-3">
              <div class="text-body-1 font-weight-bold text-capitalize">
                {{ item.dateType }}
              </div>
              <div class="text-body-1 text-caption">
                {{ item.dateExplanation }}
              </div>
            </v-col>

            <v-col cols="11">
              <BaseStartEndDate
                :startDate="item.dateStart"
                :startDateLabel="`${item.dateType} start date`"
                :startDateProperty="startDateProperty"
                :endDate="item.dateEnd"
                :endDateLabel="`${item.dateType} end date`"
                :endDateProperty="endDateProperty"
                :clearableEndDate="false"
                :clearableStartDate="false"
                rowLayout
                @dateChange="(property, value) => dateChanged(index, property, value)"
                @clearClick="(property) => clearDate(index, property)"
                :readOnlyFields="readOnlyFields"
                :readOnlyExplanation="readOnlyExplanation"
              />
            </v-col>
          </v-row>
        </v-col>

      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * EditDataDates.vue shows the datasets collection and creation dates
 *
 *
 * @summary additional data information (creation & collection dates)
 * @author Rebecca Kurup Buchholz, Sam Woodcock, Dominik Haas-Artho
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-11-08
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseStartEndDate from '@/components/BaseElements/BaseStartEndDate.vue';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';
import { renderMarkdown } from '@/factories/stringFactory';
import { getValidationMetadataEditingObject } from '@/factories/userEditingValidations';
import {
  DATE_PROPERTY_COLLECTED_TYPE,
  DATE_PROPERTY_COLLECTED_TYPE_EXPLANATION,
  DATE_PROPERTY_CREATED_TYPE,
  DATE_PROPERTY_CREATED_TYPE_EXPLANATION,
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
} from '@/factories/metadataConsts';

export default {
  name: 'EditDataDates',
  props: {
    dates: {
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
    datesField: {
      get() {
        const dates =
          this.previewDates?.length > 0 ? this.previewDates : [...this.dates];

        const createdType = DATE_PROPERTY_CREATED_TYPE;
        const createdExplanation = DATE_PROPERTY_CREATED_TYPE_EXPLANATION;

        let createdDateObj = dates.find(dObj => dObj.dateType === createdType);

        if (!createdDateObj) {
          createdDateObj = {
            [DATE_PROPERTY_DATE_TYPE]: createdType,
            [DATE_PROPERTY_START_DATE]: '',
            [DATE_PROPERTY_END_DATE]: '',
            dateExplanation: createdExplanation,
          };
          dates.push(createdDateObj);
        } else {
          createdDateObj.dateExplanation = createdExplanation;
        }

        const collectedType = DATE_PROPERTY_COLLECTED_TYPE;
        const collectedExplanation = DATE_PROPERTY_COLLECTED_TYPE_EXPLANATION;

        let collectedDateObj = dates.find(dObj => dObj.dateType === collectedType);

        if (!collectedDateObj) {
          collectedDateObj = {
            [DATE_PROPERTY_DATE_TYPE]: collectedType,
            [DATE_PROPERTY_START_DATE]: '',
            [DATE_PROPERTY_END_DATE]: '',
            dateExplanation: collectedExplanation,
          };
          dates.push(collectedDateObj);
        } else {
          collectedDateObj.dateExplanation = collectedExplanation;
        }

        dates.sort((a, b) => {
          const order = [createdType, collectedType];
          return order.indexOf(a.dateType) - order.indexOf(b.dateType);
        });

        return dates;
      },
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_INFO);
    },
  },
  methods: {
    clearPreviews() {
      this.previewDates = [];
    },
    getIsoDate(index, property) {
      if (this.isoDates?.length > 0) {
        return this.isoDates[index][property] || null;
      }

      return null;
    },
    markdownText(mdText) {
      return renderMarkdown(mdText);
    },
    setDataInfo(property, value) {
      const newDataInfo = {
        ...this.$props,
        [property]: value,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_INFO,
        data: newDataInfo,
      });
    },
    dateChanged(index, property, value) {
      // Update indexed object in array, with updated dates

      const localCopy = [...this.datesField];
      const newDates = this.updateDatesArray(localCopy, index, property, value);

      this.previewDates = newDates;

      this.setDataInfo('dates', newDates);

      /*
      const errorArray = this.validationErrors.dates;

      if (isArrayContentValid(newDates, 'dates', index, property, this.validations, errorArray)) {
        console.log('valid');
        this.setDataInfo('dates', newDates);
      }
*/
    },
    updateDatesArray(array, index, property, value) {
      const currentEntry = array[index];

      array[index] = {
        ...currentEntry,
        [property]: value,
      };

      const cleanCopy = [];

      for (let i = 0; i < array.length; i++) {
        const entry = array[i];
        if (
          !!entry[DATE_PROPERTY_START_DATE] ||
          !!entry[DATE_PROPERTY_END_DATE]
        ) {
          cleanCopy.push(entry);
        }
      }

      return cleanCopy;
    },
    clearDate(index, property) {
      this.dateChanged(index, property, '');
    },
  },
  components: {
    BaseStartEndDate,
    BaseStatusLabelView,
  },
  data: () => ({
    validationErrors: {
      dates: [
        {
          dateType: null,
          dateExplanation: null,
          [DATE_PROPERTY_START_DATE]: null,
          [DATE_PROPERTY_END_DATE]: null,
        },
        {
          dateType: null,
          dateExplanation: null,
          [DATE_PROPERTY_START_DATE]: null,
          [DATE_PROPERTY_END_DATE]: null,
        },
      ],
    },
    labels: {
      cardTitle: 'Time information about the research data',
      instructions:
        'Select a date range for the collection and / or the creation of your research data.' +
        ' This helps researcher better to categorize your data. ' +
        ' (Dates are in <b>"DD-MM-YYYY"</b> format).',
      instructionsCollection:
        '"Collection Date" should be used for data collected from the field.',
      instructionsCreation:
        '"Creation Date" should be used for data created from models or other sources.',
      dateType: 'Date Type',
      creationDate: 'Creation Date',
      collectionDate: 'Collection Date',
    },
    startDateProperty: DATE_PROPERTY_START_DATE,
    endDateProperty: DATE_PROPERTY_END_DATE,
    previewDates: [],
  }),
};
</script>

<style scoped>
.heightAndScroll {
  max-height: 160px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
}
</style>
