<template>
<v-row no-gutters>
  <v-col cols="6">
<!--
    <v-text-field v-if="mixinMethods_isFieldReadOnly(startDateProperty)"
                  :label="labels.dateStart"
                  dense
                  outlined
                  readonly
                  prepend-icon="date_range"
                  :hint="mixinMethods_readOnlyHint(startDateProperty)"
                  :value="formatToEnviDatDate(startDate)"
                  :error-messages="validationErrors.dateStart"
                  />
-->

    <v-menu v-model="dateStartPickerOpen"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="auto">

      <template v-slot:activator="{ on }">
        <v-text-field
            :label="labels.startDate"
            dense
            outlined
            prepend-icon="date_range"
            :value="formatToEnviDatDate(startDate)"
            @change="dateChangedTextField(startDateProperty, $event)"
            v-on="on"
            :error-messages="validationErrors.startDate"
        />
      </template>

      <v-date-picker
          locale="en-in"
          @input="dateChanged(startDateProperty, $event)"
          scrollable
          :max="formatToDatePickerDate(endDate)"
          :value="formatToDatePickerDate(startDate)"
          next-icon="skip_next"
          prev-icon="skip_previous"
          >
        <div v-if="clearableStartDate" >
          <div class="px-4"
               style="cursor: pointer;"
               @click="clearClick(startDateProperty)">
            {{ labels.clearStartDate }}
          </div>
          <BaseIconButton materialIconName="clear"
                          iconColor="red"
                          :tooltipText="labels.clearStartDate"
                          @clicked="clearClick(startDateProperty)"
          />
        </div>
      </v-date-picker>

  </v-menu>
  </v-col>

  <v-col cols="6">

  </v-col>
</v-row>
</template>

<script>
import {
  ckanDateFormat,
  parseDateStringToCKANFormat,
  parseDateStringToEnviDatFormat,
} from '@/factories/mappingFactory';
import { parse } from 'date-fns';

import BaseIconButton from '@/components/BaseElements/BaseIconButton';

export default {
  name: 'BaseStartEndDate',
  props: {
    startDate: {
      type: String,
      default: '',
    },
    startDateProperty: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    endDateProperty: {
      type: String,
      default: '',
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
  methods: {
    dateChangedTextField(property, value) {
      const dateValue = this.formatToCKANDate(value);
      this.dateChanged(property, dateValue);
    },
    dateChanged(dateProperty, newDate) {
      this.$emit('dateChange', dateProperty, newDate);
    },
    clearClick(dateProperty) {
      this.$emit('clearClick', dateProperty);
    },
    formatToEnviDatDate(dateString) {
      return parseDateStringToEnviDatFormat(dateString);
    },
    formatToCKANDate(dateString) {
      return parseDateStringToCKANFormat(dateString);
    },
    formatToDatePickerDate(dateString) {
      if (!dateString) {
        return '';
      }

      const dateTime = parse(dateString, ckanDateFormat, new Date());

      if (dateTime instanceof Date && !!dateTime.getTime()) {
        return (new Date(dateTime - (new Date()).getTimezoneOffset() * 60000)).toISOString()
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
    validationErrors: {
      dateStart: null,
      dateEnd: null,
    },
    labels: {
      startDate: 'Start Date',
      endDate: 'End Date',
      clearStartDate: 'Clear the Start Date',
      clearEndDate: 'Clear the End Date',
    },
  }),
};
</script>
