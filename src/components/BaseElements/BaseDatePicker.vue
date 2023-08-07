<template>
  <div :id="`BaseDatePicker_${dateLabel}`">
      <v-text-field
        v-if="isReadonly(dateProperty)"
        :label="dateLabel"
        dense
        outlined
        readonly
        prepend-icon="date_range"
        :hint="readonlyHint(dateProperty)"
        :value="formatToEnviDatDate(dateField, dateProperty)"
        :error-messages="validationErrors[dateProperty]"
      />

      <v-menu
        v-else
        id="dateMenu"
        key="dateMenu"
        v-model="datePickerOpen"
        :close-on-content-click="false"
        transition="scale-transition"
        :left="$vuetify?.breakpoint?.smAndDown"
        :offset-y="$vuetify?.breakpoint?.mdAndUp"
        min-width="280px"
      >
<!--
        max-width="290px"
        min-width="auto"
-->

        <template v-slot:activator="{ on }">
          <v-text-field
            :label="dateLabel"
            dense
            outlined
            prepend-icon="date_range"
            v-on="on"
            :value="formatToEnviDatDate(dateField, dateProperty)"
            @change="changedDateTextField(dateProperty, $event)"
            :error-messages="validationErrors[dateProperty]"
          />
        </template>

        <v-date-picker
          locale="en-in"
          @input="changeDatePicker(dateProperty, $event)"
          scrollable
          :min="formatToDatePickerDate(minDate)"
          :max="formatToDatePickerDate(maxDate)"
          :value="formatToDatePickerDate(dateField)"
          next-icon="skip_next"
          prev-icon="skip_previous"
        >
          <v-row v-if="clearable"
                  no-gutters
                  class="px-4"
                  style="align-items: center;"
          >
            <v-col>
              <div @click="clearClick(dateProperty)">
                {{ `Clear the ${dateLabel}` }}
              </div>
            </v-col>

            <v-col class="shrink">
              <BaseIconButton
                materialIconName="clear"
                iconColor="red"
                :tooltipText="`Clear the ${dateLabel}`"
                @clicked="clearClick(dateProperty)"
              />
            </v-col>
          </v-row>
        </v-date-picker>
      </v-menu>
  </div>
</template>

<script>
import { isDate, isMatch, parse } from 'date-fns';
import * as yup from 'yup';
import { ValidationError } from 'yup';

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import {
  ckanDateFormat,
  enviDatDateFormat,
  parseDateStringToCKANFormat,
  parseDateStringToEnviDatFormat,
} from '@/factories/mappingFactory';
import { isFieldValid } from '@/factories/userEditingValidations';

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
  name: 'BaseDatePicker',
  props: {
    date: {
      type: String,
      default: '',
    },
    dateLabel: {
      type: String,
      default: 'Date',
    },
    dateProperty: {
      type: String,
      default: 'date',
    },
    minDate: {
      type: String,
      default: undefined,
    },
    maxDate: {
      type: String,
      default: undefined,
    },
    clearable: {
      type: Boolean,
      default: false,
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
  beforeMount() {
    this.validationErrors = {
      [this.dateProperty]: '',
    };
  },
    mounted() {

    isFieldValid(
        this.dateProperty,
        this.dateField,
        this.getValidation(this.dateProperty),
        this.validationErrors,
    );
  },
  computed: {
    dateField: {
      get() {
        return this.previewDate || this.date;
      },
    },
  },
  methods: {
    // eslint-disable-next-line consistent-return,no-unused-vars
    getValidation(dateProperty) {
      const component = this;

      const validation = {
        [component.dateProperty]: yup
          .date('Date must be a valid date.')
          // .required()
          .nullable()
          .parseDateString()
          .test('date-range-validation',
            `${component.dateLabel} can't be after ${component.maxDate}`,
            value => {
              const date = value;

              const parsedDate = isDate(date)
                  ? date
                  : parse(date, ckanDateFormat, new Date());

              const maxDate = component.maxDate;
              const minDate = component.minDate;

              if (!maxDate && !minDate) {
                return true;
              }

              let valid = true;

              if (maxDate) {

                const parsedMaxDate = isDate(maxDate)
                    ? maxDate
                    : parse(maxDate, ckanDateFormat, new Date());

                valid = parsedMaxDate >= parsedDate;

                if (!valid) {
                  return new ValidationError(`${component.dateLabel} can't be after ${maxDate}`);
                }
              }

              if (minDate) {

                const parsedminDate = isDate(minDate)
                    ? minDate
                    : parse(minDate, ckanDateFormat, new Date());

                valid = parsedminDate <= parsedDate;

                if (!valid) {
                  return new ValidationError(`${component.dateLabel} can't be before ${minDate}`);
                }
              }

              return valid;
            },
          ),
      }

      return yup.object().shape(validation);
    },
    isReadonly(dateProperty) {
      return this.mixinMethods_isFieldReadOnly(dateProperty);
    },
    readonlyHint(dateProperty) {
      return this.mixinMethods_readOnlyHint(dateProperty);
    },
    changeDatePicker(dateProperty, value) {
      if (dateProperty === this.dateProperty) {
        this.previewDate = value;
      }

      if (isFieldValid(
            dateProperty,
            value,
            this.getValidation(dateProperty),
            this.validationErrors,
          )) {
        this.changeDate(dateProperty, value);
      }
    },
    changedDateTextField(dateProperty, dateString) {
      try {
        const dateValue = parseDateStringToCKANFormat(dateString);
        if (
          isFieldValid(
            dateProperty,
            dateValue,
            this.getValidation(dateProperty),
            this.validationErrors,
          )
        ) {
          this.changeDate(dateProperty, dateValue);
        }
      } catch (e) {
        this.validationErrors[dateProperty] = `Invalid date format, use ${enviDatDateFormat.toUpperCase()}`;
      }
    },
    changeDate(dateProperty, newDate) {
      this.$emit('dateChange', dateProperty, newDate);
    },
    clearClick(dateProperty) {
      if (dateProperty === this.dateProperty) {
        this.previewDate = '';
      }


      this.$emit('clearClick', dateProperty);
    },
    formatToEnviDatDate(dateString, dateProperty) {
      if (!isMatch(dateString, ckanDateFormat)) {
        return dateString;
      }

      try {
        return parseDateStringToEnviDatFormat(dateString);
      } catch (e) {
        console.log(e);
        this.validationErrors[
          dateProperty
        ] = `Invalid date format, use ${enviDatDateFormat.toUpperCase()}`;
      }

      return '';
    },
    formatToDatePickerDate(dateString) {
      if (!dateString) {
        return '';
      }

      const dateTime = parse(dateString, ckanDateFormat, new Date());

      if (dateTime instanceof Date && !!dateTime.getTime()) {
        return new Date(dateTime - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10);
      }

      return '';
    },
  },
  components: {
    BaseIconButton,
  },
  data: () => ({
    previewDate: '',
    datePickerOpen: false,
    validationErrors: {},
  }),
};
</script>
