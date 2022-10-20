<template>
  <v-card id="EditChart"
          class="pa-0"
          :height="height"
          :loading="loading || loadingData">

    <v-container fluid
                 class="pa-4">

      <template slot="progress">
        <v-progress-linear color="primary"
                           indeterminate />
      </template>

      <v-row>
        <v-col class="text-h5">
          {{ labels.cardTitle }}
        </v-col>

        <v-col v-if="message" >
          <BaseStatusLabelView statusIcon="check"
                               statusColor="success"
                               :statusText="message"
                               :expandedText="messageDetails" />
        </v-col>
        <v-col v-if="error"  >
          <BaseStatusLabelView statusIcon="error"
                               statusColor="error"
                               :statusText="error"
                               :expandedText="errorDetails" />
        </v-col>

      </v-row>

      <v-row>
        <v-col >
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <FilterKeywordsView :selectedTagNames="pickedParams"
                              :allTags="fileParameters"
                              @clickedTag="catchPickClicked"
                              @clickedTagClose="catchCloseClicked"
                              />

        </v-col>
      </v-row>

      <v-row >
        <v-col>
<!--          <div style="height: 500px; background-color: indianred;"></div>-->
          <div :id="chartId"
               style="height: 300px;">
            Chart is loading here, once a parameter is selected
          </div>

        </v-col>

<!--        <v-col v-for="(param, index) in pickedParams"
               :key="index"
                cols="12">

          <div :id="`chart_${param}`"
                style="height: 300px;">
            Chart {{param}}
          </div>
        </v-col>
-->
      </v-row>

    </v-container>
  </v-card>

</template>

<script>/**
 * EditChart.vue
 *
 * @summary component for changing the users information
 * @author Haas-Artho
 *
 * Created at     : 2022-04-28
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';
import FilterKeywordsView from '@/components/Filtering/FilterKeywordsView';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
  isObjectValid,
} from '@/factories/userEditingValidations';
import {
  USER_PROFILE,
  EDIT_USER_PROFILE,
  EDIT_USER_PROFILE_EVENT,
  EDITMETADATA_CLEAR_PREVIEW,
  eventBus,
} from '@/factories/eventBus';
import { convertCSVToJSON, getChartSeries } from '@/factories/stringFactory';
import {
  createChart,
  createDateAxis,
  createDynamicChart,
  createScrollbar,
  createValueAxis,
  createXYCursor,
  getLineSeriesFromJSON,
} from '@/factories/chartFactory';
import axios from 'axios';
import { createTag } from '@/factories/metadataFilterMethods';
import * as am5 from '@amcharts/amcharts5';


export default {
  name: 'EditChart',
  props: {
    parameters: {
      type: Array,
      default: () => [
        'shortwave_incoming_radiation',
        'shortwave_outgoing_radiation',
        'net_radiation',
        'air_temperature_1',
        'air_temperature_1_max',
      ],
    },
    height: {
      type: Number,
      default: undefined,
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
    eventBus.$on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
    this.disponseChart();
  },
  async mounted() {
    this.loadingData = false;

    this.neadJSON = await this.loadDataInJson(this.dataUrl);
  },
  computed: {
    validations () {
      return getValidationMetadataEditingObject(EDIT_USER_PROFILE);
    },
    pickedParams() {
      if (this.pickedParameters instanceof Array) {
        return this.pickedParameters;
      }

      return [this.pickedParameters];
    },
    fileParameters() {
/*
      const selecteds = [];

      ['param1', 'param2', 'param3'].every(element => selecteds.push(createTag(element)));

      return selecteds;
*/
      const params = this.neadJSON?.parameters || [];
      const paramTags = [];

      params.every(element => paramTags.push(createTag(element)));

      return paramTags;
    },
  },
  methods: {
    checkReadOnly(property) {
      if (!this.$store) {
        return false;
      }

      return this.mixinMethods_isFieldReadOnly(property);
    },
    checkReadOnlyHint(property) {
      if (!this.$store) {
        return '';
      }

      return this.mixinMethods_readOnlyHint(property);
    },
/*
    previewChange(property, value) {
      this.previews[property] = value;
      this.validateProperty(property, value);
    },
    validateProperty(property, value) {
      return isFieldValid(property, value, this.validations, this.validationErrors);
    },
    notifyChange() {
      if (this.anyUserElementsActive) {
        return;
      }

      if (!this.anyPreviewsChanged) {
        return;
      }

      const userObject = {
        firstName: this.firstNameField,
        lastName: this.lastNameField,
        email: this.emailField,
      }

      if (isObjectValid(this.validationProperties, userObject, this.validations, this.validationErrors)) {

        const userInfo = {
          ...this.$props,
          ...userObject,
        };

        eventBus.$emit(EDIT_USER_PROFILE_EVENT, {
          object: USER_PROFILE,
          data: userInfo,
        });
      }
    },
    clearPreviews() {
      this.previews.firstName = null;
      this.previews.lastName = null;
      this.previews.email = null;
    },
*/
    catchCloseClicked(param) {
      if (this.readonly) {
        return;
      }

      const remains = this.pickedParameters.filter(value => value !== param);

      if (remains?.length > 0) {
        this.pickedParameters = remains;
      } else {
        this.pickedParameters = [];
      }

      this.$emit('removedParameters', this.pickedParameters);
    },
    catchPickClicked(param) {

      // if (Array.isArray(this.pickedUsers)) {
      if (!this.pickedParameters.includes(param)) {
        this.pickedParameters.push(param);
        /*
                  } else {
                    const index = this.pickedUsers.indexOf(pickedItem);
                    this.pickedUsers.splice(index, 1);
        */
      }
      // }

      this.$emit('pickedParameters', this.pickedParameters);
    },
    loadChart(params, data) {
      if (!params || params.length <= 0 || !data || data.length <= 0) {
        return;
      }

      if (params.length <= 2) {
        return;
      }

      if (this.chart) {
        this.disponseChart();
      }

      if (!this.chartRoot) {
        this.chartRoot = am5.Root.new(this.chartId);
      }

      if (!this.chart) {

        this.chart = createDynamicChart(this.chartId, this.chartRoot);

        this.yAxis = this.chart.yAxes.push(createValueAxis(this.chartRoot));
        this.xAxis = this.chart.xAxes.push(createDateAxis(this.chartRoot));

        // Set cursor
        this.chart.set('cursor', createXYCursor(this.chartRoot, this.xAxis));
        this.chart.set('scrollbarX', createScrollbar(this.chartRoot));

        for (let i = 0; i < params.length; i++) {
          const param = params[i];

          const series = getLineSeriesFromJSON(this.chartRoot,
            data,
            {
              xAxis: this.xAxis,
              yAxis: this.yAxis,
              valueXField: 'timestamp_iso',
              valueYField: param,
              // dateFormat: xAxisFormat,
            });

          this.chart.series.push(series);
        }
      }

    },
    disponseChart() {
      if (this.chart) {

        this.chart.dispose();
        console.log('chart isDisposed');
        console.log(this.chart.isDisposed());

        this.chartRoot.dispose();
        console.log('chartRoot isDisposed');
        console.log(this.chartRoot.isDisposed());

        this.chart = null
        this.chartRoot = null;
      }
    },
    async loadDataInJson(url) {
      this.loadingData = true;
      const neadContent = await axios.get(url);

      this.loadingData = false;

      return convertCSVToJSON(neadContent.data, '-999.0');
    },
  },
  watch: {
    pickedParameters() {
      this.$nextTick(() => {
        this.loadChart(this.pickedParameters, this.neadJSON?.data);
      });
    },
  },
  data: () => ({
    chartId: 'multiparam_chart',
    chart: null,
    chartRoot: null,
    yAxis: null,
    xAxis: null,
    dataUrl: 'https://os.zhdk.cloud.switch.ch/envicloud/gcnet/data/wsl-geus-cooperation/L1/00-Swiss Camp 10m.csv',
    neadJSON: null,
    previews: {
      parameters: null,
    },
    loadingData: false,
    pickedParameters: [],
    search: '',
    labels: {
      cardTitle: 'Edit Data Preview Chart',
      instructions: 'Pick parameters to be used in the chart to preview your research data.',
    },
/*
    validationProperties: [
      'firstName',
      'lastName',
      'email',
    ],
    validationErrors: {
      firstName: null,
      lastName: null,
      email: null,
    },
    activeElements: {
      firstName: false,
      lastName: false,
      email: false,
    },
*/
  }),
  components: {
    BaseStatusLabelView,
    FilterKeywordsView,
  },
};
</script>

<style scoped>

</style>
