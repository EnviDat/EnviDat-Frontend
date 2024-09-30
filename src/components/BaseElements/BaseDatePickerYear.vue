<template>
  <div :id="`BaseDatePickerYear_${yearLabel}`">
    <v-menu
      id="dateMenu"
      key="dateMenu"
      :disabled="readonly"
      :close-on-content-click="true"
      transition="scale-transition"
      :left="$vuetify?.display?.smAndDown"
      :offset-y="$vuetify?.display?.mdAndUp"
      min-width="280px"
    >

      <template v-slot:activator="{ props }">
        <v-text-field
          v-bind="props"
          :label="yearLabel"
          ref="dateTextField"
          :prepend-icon="mdiCalendarRange"
          :readonly="readonly"
          persistent-hint
          :hint="readOnlyExplanation"
          :model-value="yearField"
        />
      </template>

      <v-date-picker
        ref="yearPicker"
        view-mode="year"
        color="secondary"
        no-title
        :next-icon="mdiSkipNext"
        :prev-icon="mdiSkipPrevious"
        :year='yearField'
        @update:year="saveYear"
      >
        <template #title
                  v-if="yearField">
          {{ yearField }}
        </template>
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import { isDate, parse } from 'date-fns';
import * as yup from 'yup';

import {
  ckanDateFormat,
} from '@/factories/mappingFactory';

import { isFieldReadOnly } from '@/factories/globalMethods';
import { mdiCalendarRange, mdiSkipNext, mdiSkipPrevious } from '@mdi/js';

// eslint-disable-next-line func-names
yup.addMethod(yup.date, 'parseDateString', function() {
  // Helper function for yup date string parsing
  // eslint-disable-next-line func-names

  return this.transform((value, originalValue) => {
    if (!originalValue) {
      return null;
    }

    return isDate(originalValue)
      ? originalValue
      : parse(originalValue, ckanDateFormat, new Date());
  });
});

export default {
  name: 'BaseDatePickerYear',
  props: {
    year: {
      type: String,
      default: undefined,
    },
    yearLabel: {
      type: String,
      default: 'Year',
    },
    yearProperty: {
      type: String,
      default: 'year',
    },
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: undefined,
    },
  },
  beforeMount() {
    this.validationErrors = {
      [this.yearProperty]: '',
    };
  },
  mounted() {
    if (this.year) {
      this.previewYear = this.year;
    } else {
      this.previewYear = null;
    }
  },
  computed: {
    yearField: {
      get() {
        const yearString = this.previewYear !== null ? this.previewYear : this.year;
        if (yearString) {
          // vuetify component needs the year to be a number
          return Number.parseInt(yearString, 10);
        }

        return undefined
      },
      set(value) {
/*
        console.log('yearField set', typeof value);
*/
        this.$emit('yearChange', value);
      },
    },
    readonly() {
      return isFieldReadOnly(this.$props, this.yearProperty);
    },
  },
  methods: {
    saveYear(year) {
      console.log('saveYear', typeof year);
      const yearString = year.toString();
      this.previewYear = yearString;
      this.yearField = yearString;
    },
  },
  data: () => ({
    mdiCalendarRange,
    mdiSkipNext,
    mdiSkipPrevious,
    previewYear: null,
  }),
};
</script>
