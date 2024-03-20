<template>
  <v-row no-gutters>
    <v-col :cols="defaultCols"
            :md="mdCols">

      <BaseDatePicker
          :date="startDate"
          :date-property="startDateProperty"
          :date-label="labels.startDate"
          :max-date="endDate"
          :clearable="clearableStartDate"
          :read-only-fields="readOnlyFields"
          :read-only-explanation="readOnlyExplanation"
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
          :date-label="labels.endDate"
          :min-date="startDate"
          :clearable="clearableEndDate"
          :read-only-fields="readOnlyFields"
          :read-only-explanation="readOnlyExplanation"
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
      return this.rowLayout ? '' : 'pl-md-4';
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
