/**
 * @summary story of BaseIconButton & BaseIconCountView for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2019-10-31 08:14:47
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import BaseStartEndDate from '@/components/BaseElements/BaseStartEndDate.vue';

export default {
  title: '1 Base / Pickers / Date picker Start End',
  component: BaseStartEndDate,
};


export const BaseStartEndDateViews = () => ({
  components: { BaseStartEndDate },
  template: `
    <v-row style="border: solid 1px;">

      <v-col cols="12">
        empty interaction, with no logic in from the parent component!
      </v-col>

      <v-col cols="12">
        <BaseStartEndDate  />
      </v-col>

      <v-col cols="12">
        prefilled interaction
      </v-col>

      <v-col cols="12">
        <BaseStartEndDate :start-date="startDate1"
                          :startDateProperty="startDateProperty"
                          :end-date="endDate1"
                          :endDateProperty="endDateProperty"
                          :clearableStartDate="true"
                          :clearableEndDate="true"
                          @dateChange="dateChange(1, ...arguments)"
                          @clearClick="catchClearClick"
                          />
      </v-col>

      <v-col cols="12">
        fields Readonly
      </v-col>

      <v-col cols="12">
        <BaseStartEndDate :start-date="startDate1"
                          :startDateProperty="startDateProperty"
                          :end-date="endDate1"
                          :endDateProperty="endDateProperty"
                          :readOnlyFields="readOnlyFields"
                          :readOnlyExplanation="readOnlyExplanation"
                          />
      </v-col>

      <v-col cols="12">
        prefilled interaction in row layout
      </v-col>

      <v-col cols="12">
        <BaseStartEndDate :start-date="startDate1"
                          :startDateProperty="startDateProperty"
                          :end-date="endDate1"
                          :endDateProperty="endDateProperty"
                          :clearableStartDate="true"
                          :clearableEndDate="true"
                          rowLayout
                          @dateChange="dateChange(1, ...arguments)"
                          @clearClick="catchClearClick"
        />
      </v-col>
    
    </v-row>
  `,
  computed: {
    readOnlyFields() {
      return [
        this.startDateProperty,
        this.endDateProperty,
      ];
    },
  },
  methods: {
    catchClearClick(dateProperty) {
/*
      console.log('Got catchClearClick');
      console.log(dateProperty);
*/

      if (dateProperty === this.startDateProperty) {
        this.startDate1 = '';
      }
      if (dateProperty === this.endDateProperty) {
        this.endDate1 = '';
      }
    },
    dateChange(index, dateProperty, newDate) {
/*
      console.log('Got new date');
      console.log(index);
      console.log(dateProperty);
      console.log(newDate);
*/

      if (dateProperty === this.startDateProperty) {
        this.startDate1 = newDate;
      }
      if (dateProperty === this.endDateProperty) {
        this.endDate1 = newDate;
      }
    },
  },
  data: () => ({
    startDateProperty: 'dateStart',
    endDateProperty: 'endDate',
    startDate1: '2022-04-11',
    endDate1: '2022-04-20',
    readOnlyExplanation: 'Fields are readonly for testing!',
  }),
});
