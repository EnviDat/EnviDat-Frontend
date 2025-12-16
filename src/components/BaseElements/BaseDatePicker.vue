<template>
  <div :id="`BaseDatePicker_${dateLabel}`">
    <v-menu
      :disabled="readonly"
      id="dateMenu"
      key="dateMenu"
      ref="dateMenu"
      v-model="datePickerOpen"
      :close-on-content-click="false"
      transition="scale-transition"
      :location="$vuetify?.display?.smAndDown ? 'left' : undefined"
      min-width="280px"
    >
      <template v-slot:activator="{ props }">
        <v-text-field
          v-bind="props"
          :label="dateLabel"
          ref="dateTextField"
          :readonly="readonly"
          hide-details="auto"
          persistent-hint
          :hint="readOnlyExplanation"
          :prepend-icon="mdiCalendarRange"
          :clearable="isClearable && !readonly"
          persistent-clear
          :model-value="formatToEnviDatDate(dateField, dateProperty)"
          @update:model-value="onTextInput(dateProperty, $event)"
          :error-messages="validationErrors[dateProperty]"
        />
      </template>

      <v-date-picker
        show-adjacent-months
        elevation="2"
        ref="datePicker"
        color="secondary"
        :next-icon="mdiSkipNext"
        :prev-icon="mdiSkipPrevious"
        :min="formatToDatePickerDate(minDate)"
        :max="formatToDatePickerDate(maxDate)"
        :model-value="formatToDatePickerDate(dateField)"
        @update:modelValue="changeDatePicker(dateProperty, $event)"
      >
      </v-date-picker>
    </v-menu>
  </div>
</template>

<script>
import { isDate, isMatch, parse, format } from 'date-fns';
import * as yup from 'yup';
import { ValidationError } from 'yup';

import { mdiCalendarRange, mdiSkipNext, mdiSkipPrevious } from '@mdi/js';
import { useDate } from 'vuetify';
import {
  ckanDateFormat,
  enviDatDateFormat,
  parseDateStringToCKANFormat,
  parseDateStringToEnviDatFormat,
} from '@/factories/mappingFactory';

import { isFieldValid } from '@/factories/userEditingValidations';
import { isFieldReadOnly } from '@/factories/globalMethods';

yup.addMethod(yup.date, 'parseDateString', function () {
  // Helper function for yup date string parsing
  return this.transform((value, originalValue) => {
    if (!originalValue) {
      return null;
    }

    return isDate(originalValue) ? originalValue : parse(originalValue, ckanDateFormat, new Date());
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
    isClearable: {
      type: Boolean,
      default: true,
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
      [this.dateProperty]: '',
    };
  },
  mounted() {
    isFieldValid(this.dateProperty, this.dateField, this.getValidation(this.dateProperty), this.validationErrors);
  },
  computed: {
    readonly() {
      return isFieldReadOnly(this.$props, this.dateProperty);
    },
    dateField: {
      get() {
        return this.previewDate || this.date;
      },
    },
  },
  methods: {
    // eslint-disable-next-line consistent-return,no-unused-vars
    getValidation(dateProperty) {
      // @ts-ignore @typescript-eslint/no-this-alias
      const component = this;
      const validation = {
        [component.dateProperty]: yup
          .date()
          // .required()
          .nullable()
          // @ts-ignore
          .parseDateString()
          .test('date-range-validation', `${component.dateLabel} can't be after ${component.maxDate}`, (value) => {
            // if is null skip the validation
            if (value === null) {
              return true;
            }

            const parsedDate = isDate(value) ? value : parse(value, ckanDateFormat, new Date());

            const maxDate = component.maxDate;
            const minDate = component.minDate;

            if (!maxDate && !minDate) {
              return true;
            }

            let valid = true;

            if (maxDate) {
              const parsedMaxDate = isDate(maxDate) ? maxDate : parse(maxDate, ckanDateFormat, new Date());
              valid = parsedMaxDate >= parsedDate;
              if (!valid) {
                return new ValidationError(`${component.dateLabel} can't be after ${maxDate}`);
              }
            }

            if (minDate) {
              const parsedMinDate = isDate(minDate) ? minDate : parse(minDate, ckanDateFormat, new Date());
              valid = parsedMinDate <= parsedDate;
              if (!valid) {
                return new ValidationError(`${component.dateLabel} can't be before ${minDate}`);
              }
            }

            return valid;
          }),
      };

      return yup.object().shape(validation);
    },
    changeDatePicker(dateProperty, value) {
      if (value == null) {
        this.validationErrors[dateProperty] = '';
        if (dateProperty === this.dateProperty) {
          this.previewDate = '';
        }
        this.changeDate(dateProperty, '');
        return;
      }

      let dateString = value;
      if (isDate(value)) {
        dateString = format(value, ckanDateFormat);
      }

      if (dateProperty === this.dateProperty) {
        this.previewDate = dateString;
      }

      if (isFieldValid(dateProperty, dateString, this.getValidation(dateProperty), this.validationErrors)) {
        this.validationErrors[dateProperty] = '';
        this.changeDate(dateProperty, dateString);
      }
    },
    onTextInput(dateProperty, value) {
      this.changedDateTextField(dateProperty, value);
    },
    changedDateTextField(dateProperty, rawInput) {
      const raw = (rawInput ?? '').trim();

      if (!raw) {
        this.validationErrors[dateProperty] = '';
        if (dateProperty === this.dateProperty) {
          this.previewDate = '';
        }
        this.changeDate(dateProperty, '');
        return;
      }
      if (raw.length !== 10) {
        return;
      }

      try {
        const dateValue = parseDateStringToCKANFormat(raw);
        if (isFieldValid(dateProperty, dateValue, this.getValidation(dateProperty), this.validationErrors)) {
          this.previewDate = dateValue;
          this.changeDate(dateProperty, dateValue);
        }
      } catch (e) {
        console.log(e);
      }
    },

    changeDate(dateProperty, newDate) {
      this.$emit('dateChange', dateProperty, newDate);
    },
    clearClick(dateProperty) {
      if (dateProperty === this.dateProperty) {
        this.previewDate = '';
        this.datePickerOpen = false;
      }

      this.$emit('clearClick', dateProperty);
    },
    formatToEnviDatDate(dateString, dateProperty) {
      if (typeof dateString !== 'string' || !isMatch(dateString, ckanDateFormat)) {
        return dateString || '';
      }
      try {
        return parseDateStringToEnviDatFormat(dateString);
      } catch {
        this.validationErrors[dateProperty] = `Invalid date format, use ${enviDatDateFormat.toUpperCase()}`;
        return '';
      }
    },
    formatToDatePickerDate(dateString) {
      if (!dateString) return undefined;
      return this.adapter.parseISO(dateString);
    },
  },
  data: () => ({
    mdiCalendarRange,
    mdiSkipNext,
    mdiSkipPrevious,
    previewDate: '',
    datePickerOpen: false,
    validationErrors: {},
    adapter: useDate(),
  }),
};
</script>
