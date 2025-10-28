<template>
  <v-row >
    <v-col :cols="defaultCols"
            :md="mdCols">

      <BaseDatePicker
          :date="startDate"
          :date-property="startDateProperty"
          :date-label="startDateLabel || labels.startDate"
          :max-date="endDate"
          :isClearable="clearableStartDate"
          :readOnlyFields="readOnlyFields"
          :readOnlyExplanation="readOnlyExplanation"
          @dateChange="changeDate"
          @clearClick="$emit('clearClick', $event)"
      />

    </v-col>

    <v-col :cols="defaultCols"
           :md="mdCols"
           :class="paddingSecondCol">
      <BaseDatePicker
          :date="endDate"
          :date-property="endDateProperty"
          :date-label="endDateLabel || labels.endDate"
          :min-date="startDate"
          :isClearable="clearableEndDate"
          :readOnlyFields="readOnlyFields"
          :readOnlyExplanation="readOnlyExplanation"
          @dateChange="changeDate"
          @clearClick="$emit('clearClick', $event)"
      />

    </v-col>
  </v-row>
</template>

<script>

import BaseDatePicker from './BaseDatePicker.vue';

export default {
  name: 'BaseStartEndDate',
  props: {
    startDate: {
      type: String,
      default: '',
    },
    startDateLabel: {
      type: String,
      default: undefined,
    },
    startDateProperty: {
      type: String,
      default: 'startDate',
    },
    endDate: {
      type: String,
      default: '',
    },
    endDateLabel: {
      type: String,
      default: undefined,
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
    rowLayout: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    defaultCols() {
      return this.rowLayout ? 12 : 6;
    },
    mdCols() {
      return this.rowLayout ? 0 : 6;
    },
    paddingSecondCol() {
      return this.rowLayout ? undefined : 'pl-sm-4';
    },
  },
  methods: {
    changeDate(dateProperty, newDate) {
      this.$emit('dateChange', dateProperty, newDate);
    },
    clearClick(dateProperty) {
      this.$emit('clearClick', dateProperty);
    },
  },
  components: {
    BaseDatePicker,
  },
  data: () => ({
    labels: {
      startDate: 'Start Date',
      endDate: 'End Date',
      clearStartDate: 'Clear the Start Date',
      clearEndDate: 'Clear the End Date',
    },
  }),
};
</script>
