<template>
  <v-row no-gutters>
    <v-col cols="6">
      <v-text-field
        v-if="isReadonly(startDateProperty)"
        :label="labels.startDate"
        dense
        outlined
        readonly
        prepend-icon="date_range"
        :hint="readonlyHint(startDateProperty)"
        :value="formatToEnviDatDate(startDateField, startDateProperty)"
        :error-messages="validationErrors[startDateProperty]"
      />

      <v-menu
        v-else
        id="startDateMenu"
        key="startDateMenu"
        v-model="dateStartPickerOpen"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            :label="labels.startDate"
            dense
            outlined
            prepend-icon="date_range"
            v-on="on"
            :value="formatToEnviDatDate(startDateField, startDateProperty)"
            @change="changedDateTextField(startDateProperty, $event)"
            :error-messages="validationErrors[startDateProperty]"
          />
        </template>

        <v-date-picker
          locale="en-in"
          @input="changeDatePicker(startDateProperty, $event)"
          scrollable
          :max="formatToDatePickerDate(endDateField)"
          :value="formatToDatePickerDate(startDateField)"
          next-icon="skip_next"
          prev-icon="skip_previous"
        >
          <v-row
            v-if="clearableStartDate"
            no-gutters
            class="px-4"
            style="align-items: center;"
          >
            <v-col>
              <div @click="clearClick(startDateProperty)">
                {{ labels.clearStartDate }}
              </div>
            </v-col>

            <v-col class="shrink">
              <BaseIconButton
                materialIconName="clear"
                iconColor="red"
                :tooltipText="labels.clearStartDate"
                @clicked="clearClick(startDateProperty)"
              />
            </v-col>
          </v-row>
        </v-date-picker>
      </v-menu>
    </v-col>

    <v-col cols="6" class="pl-4">
      <v-text-field
        v-if="isReadonly(endDateProperty)"
        :label="labels.endDate"
        dense
        outlined
        readonly
        prepend-icon="date_range"
        :hint="readonlyHint(endDateProperty)"
        :value="formatToEnviDatDate(endDateField, endDateProperty)"
        :error-messages="validationErrors[endDateProperty]"
      />

      <v-menu
        v-else
        id="endDateMenu"
        key="endDateMenu"
        v-model="dateEndPickerOpen"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            :label="labels.endDate"
            dense
            outlined
            prepend-icon="date_range"
            :value="formatToEnviDatDate(endDateField, endDateProperty)"
            @change="changedDateTextField(endDateProperty, $event)"
            v-on="on"
            :error-messages="validationErrors[endDateProperty]"
          />
        </template>

        <v-date-picker
          locale="en-in"
          @input="changeDatePicker(endDateProperty, $event)"
          scrollable
          :min="formatToDatePickerDate(startDateField)"
          :value="formatToDatePickerDate(endDateField)"
          next-icon="skip_next"
          prev-icon="skip_previous"
        >
          <v-row
            v-if="clearableEndDate"
            no-gutters
            class="px-4"
            style="align-items: center;"
          >
            <v-col>
              <div @click="clearClick(endDateProperty)">
                {{ labels.clearEndDate }}
              </div>
            </v-col>

            <v-col class="shrink">
              <BaseIconButton
                materialIconName="clear"
                iconColor="red"
                :tooltipText="labels.clearEndDate"
                @clicked="clearClick(endDateProperty)"
              />
            </v-col>
          </v-row>
        </v-date-picker>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import { isDate, isMatch, parse } from 'date-fns';
import * as yup from 'yup';

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
  name: 'BaseStartEndDate',
  props: {
    startDate: {
      type: String,
      default: '',
    },
    startDateProperty: {
      type: String,
      default: 'startDate',
    },
    endDate: {
      type: String,
      default: '',
    },
    endDateProperty: {
      type: String,
      default: 'endDate',
    },
    clearableStartDate: {
      type: Boolean,
      default: false,
    },
    clearableEndDate: {
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
      [this.startDateProperty]: '',
      [this.endDateProperty]: '',
    };
  },
  computed: {
    startDateField: {
      get() {
        return this.previewStartDate || this.startDate;
      },
    },
    endDateField: {
      get() {
        return this.previewEndDate || this.endDate;
      },
    },
  },
  methods: {
    // eslint-disable-next-line consistent-return,no-unused-vars
    getValidation(dateProperty) {
      const component = this;

      if (dateProperty === this.startDateProperty) {
        return yup.object().shape({
          [component.startDateProperty]: yup
            .date('Start date must be a valid date.')
            .required()
            .parseDateString()
            .test(
              'date-range-validation',
              `${component.labels.startDate} can't be after ${component.labels.endDate}`,
              value => {
                const dateStart = value;

                const parsedStart = isDate(dateStart)
                  ? dateStart
                  : parse(dateStart, ckanDateFormat, new Date());

                const dateEnd = component.endDateField;
                if (!dateEnd) {
                  return true;
                }

                const parsedEnd = isDate(dateEnd)
                  ? dateEnd
                  : parse(dateEnd, ckanDateFormat, new Date());

                return parsedEnd >= parsedStart;
              },
            ),
        });
      }

      if (dateProperty === this.endDateProperty) {
        return yup.object().shape({
          [component.endDateProperty]: yup
            .date('End date must be a valid date.')
            .parseDateString()
            .test(
              'date-range-validation',
              `${component.labels.endDate} can't be before ${component.labels.startDate}`,
              value => {
                const dateEnd = value;

                const parsedEnd = isDate(dateEnd)
                  ? dateEnd
                  : parse(dateEnd, ckanDateFormat, new Date());

                const dateStart = component.startDateField;
                if (!dateStart) {
                  return true;
                }

                const parsedStart = isDate(dateStart)
                  ? dateStart
                  : parse(dateStart, ckanDateFormat, new Date());

                return parsedEnd >= parsedStart;
              },
            ),
        });
      }
    },
    isReadonly(dateProperty) {
      return this.mixinMethods_isFieldReadOnly(dateProperty);
    },
    readonlyHint(dateProperty) {
      return this.mixinMethods_readOnlyHint(dateProperty);
    },
    changeDatePicker(dateProperty, value) {
      if (dateProperty === this.startDateProperty) {
        this.previewStartDate = value;
      }
      if (dateProperty === this.endDateProperty) {
        this.previewEndDate = value;
      }

      if (
        isFieldValid(
          dateProperty,
          value,
          this.getValidation(dateProperty),
          this.validationErrors,
        )
      ) {
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
        this.validationErrors[
          dateProperty
        ] = `Invalid date format, use ${enviDatDateFormat.toUpperCase()}`;
      }
    },
    changeDate(dateProperty, newDate) {
      this.$emit('dateChange', dateProperty, newDate);
    },
    clearClick(dateProperty) {
      if (dateProperty === this.startDateProperty) {
        this.previewStartDate = '';
      }
      if (dateProperty === this.endDateProperty) {
        this.previewEndDate = '';
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
    previewStartDate: '',
    previewEndDate: '',
    dateStartPickerOpen: false,
    dateEndPickerOpen: false,
    validationErrors: {},
    labels: {
      startDate: 'Start Date',
      endDate: 'End Date',
      clearStartDate: 'Clear the Start Date',
      clearEndDate: 'Clear the End Date',
    },
  }),
};
</script>
