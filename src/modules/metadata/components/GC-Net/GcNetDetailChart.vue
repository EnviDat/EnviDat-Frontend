<template>
  <v-card>
    <v-container class="pa-4" fluid>
      <v-row no-gutters justify="space-between">
        <v-col :class="$vuetify.display.xs ? 'title' : 'text-h4'">
          {{ fileObject.chartTitle }}
        </v-col>
        <v-col class="text-h6 text-right">
          {{ stationName }}
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col
          v-if="chartIsLoading && preloading"
          :style="`height: ${$vuetify.display.xs ? 300 : 350}px;`"
        >
          <v-row class="fill-height" justify="center" align="center">
            <v-col class="flex-grow-0">
              <v-progress-circular :size="50" color="primary" indeterminate />
            </v-col>
          </v-row>
        </v-col>

        <v-col
          v-if="!chartIsLoading && !dataAvailable && !dataError"
          class="text-h6 pt-2 pb-1"
          :style="`color: ${$vuetify.theme.error};`"
        >
          {{ noDataText }}
        </v-col>

        <v-col
          v-if="dataError"
          class="text-h6"
          :style="`color: ${$vuetify.theme.error};`"
        >
          {{ dataError }}
        </v-col>

        <v-col
          v-if="!preloading"
          :style="`height: ${$vuetify.display.xs ? 300 : 350}px;`"
        >
          <!-- <v-row class="fill-height" column
                    justify="center" align="center"> -->
          <v-row class="fill-height" justify="center" align="center">
            <v-col class="flex-grow-0">
              Historical datasets can be very large and take a while to load,
              therefore aren't loaded by default.
            </v-col>
            <v-col class="flex-grow-0 pt-3">
              <BaseRectangleButton
                buttonText="Load historical data"
                :icon="mdiRefresh"
                @clicked="
                  preloading = true;
                  intersected = true;
                  chartIsLoading = true;
                  loadChart();
                "
                iconColor="white"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col
          v-if="showDisclaimer && showChart"
          class="text-h6"
          style="color: red;"
        >
          {{ disclaimerText }}
        </v-col>

        <v-col v-show="showChart">
          <div
            :id="chartId"
            :style="`height: ${$vuetify.display.xs ? 300 : 350}px;`"
          ></div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import axios from 'axios';

import { mdiRefresh } from '@mdi/js';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import {
  addStartEndDateUrl,
  createSerialChart,
  defaultSeriesSettings,
  hasData,
} from '@/factories/chartFactory';

/* eslint-disable no-tabs */

export default {
  name: 'DetailChart',
  props: {
    apiUrl: {
      type: String,
      default: './testdata/1temp_v.json',
    },
    fallbackUrl: {
      type: String,
      default: './testdata/1temp_v.json',
    },
    fallbackFilename: String,
    stationName: {
      type: String,
      default: 'SwissCamp default',
    },
    stationId: Number,
    chartId: {
      type: String,
      default: '1temp_v.json',
    },
    graphs: {
      type: Array,
      default: () => [],
    },
    fileObject: {
      type: Object,
      default: () => ({
        fileName: 'temp_v.json',
        chartTitle: 'Air Temperatures Recent Days',
        numberFormat: '##  °C',
        dateFormatTime: true,
        preload: true,
        showDisclaimer: false,
      }),
    },
    delay: {
      type: Number,
      default: 0,
    },
    valueFieldMapping: {
      type: Object,
      default: () => ({
        temp: [
          {
            parameter: 'AirTC1',
            color: '#D48E00',
            negativeColor: '#00CED4',
            titleString: 'Thermocouple 1',
            precision: 1,
          },
        ],
      }),
    },
    preload: Boolean,
    showDisclaimer: Boolean,
    historicalEndDate: {
      type: String,
      default: undefined,
    },
    convertLocalTime: Boolean,
  },
  mounted() {
    this.preloading = this.preload;

    if (this.preloading) {
      this.registeryIntersectionObserver();
    }
  },
  beforeUnmount() {
    // console.log('DetailChart: beforeUnmount method ' + this.chartId);
    this.clearChart();
  },
  computed: {
    showChart() {
      return (
        this.intersected &&
        !this.chartIsLoading &&
        this.dataAvailable &&
        !this.dataError
      );
    },
    isRecentDataChart() {
      return this.chartId.includes('_v');
    },
  },
  watch: {
    records() {
      if (this.dataAvailable) {
        this.createChart();
      }
    },
    stationId() {
      // reloadChart once the stations changes
      this.loadChart();
      // console.log(`got ${this.stationId}`);
    },
  },
  methods: {
    loadChart() {
      this.clearChart();
      this.chartIsLoading = true;
      this.dataAvailable = false;
      this.dataError = '';

      // clear and then new loading on the next tick is needed for the disposing to finish
      this.$nextTick(() => {
        this.loadJsonFiles();
      });
    },
    loadJsonFiles(fallback = false) {
      const baseUrl = this.apiUrl ? this.apiUrl : this.fallbackUrl;
      const cutOffSplit = this.apiUrl ? 2 : 1;

      const splits = baseUrl.split('/');
      const urlSplits = splits.slice(0, splits.length - cutOffSplit);
      const url = urlSplits.join('/');

      let urlParam = `${url}/${this.fileObject.parameters.join(',')}/`;

      // 2 weeks for the recent data, 2 years for historical
      let dayRange = this.isRecentDataChart ? 14 : 730;

      if (this.isRecentDataChart) {
        if (fallback) {
          // use a 1.5 month for recent data as fallback
          dayRange = 45;
        }

        urlParam = addStartEndDateUrl(
          urlParam,
          dayRange,
          undefined,
        );

      } else {
        urlParam = `${urlParam}/1995-01-01T00:00:00/2021-12-31T00:00:00/`;
      }


      axios
        .get(urlParam)
        .then(response => {
          // createChart() gets called due to the watch on the records
          this.records = response.data;

          this.dataAvailable = hasData(
            this.records,
            this.fileObject.parameters[0],
          );
          if (!this.dataAvailable && this.fileObject.parameters.length > 1) {
            this.dataAvailable = hasData(
              this.records,
              this.fileObject.parameters[1],
            );
          }

          this.chartIsLoading = this.dataAvailable;

          if (fallback && !this.dataAvailable) {
            // this.dataError = `${this.noDataText} on the fallback for ${urlParam}`;
            this.dataError = `${this.noDataText} for ${this.fileObject.chartTitle}`;
          } else if (!fallback && !this.dataAvailable) {
            this.loadJsonFiles(true);
          }
        })
        .catch(error => {
          if (fallback) {
            this.chartIsLoading = false;
            this.dataError = `Error loading data: ${error} for ${urlParam}`;
          } else {
            this.loadJsonFiles(true);
          }
        });
    },
    createChart() {
      // const dateFormatingInfos = {
      //   dateFormat: this.dateFormat,
      //   dateFormatNoTime: this.dateFormatNoTime,
      //   inputFormat: 'x',
      // };

      // this.$vuetify.display.smAndDown ? this.seriesSettings.lineStrokeWidth = 4 : this.seriesSettings.lineStrokeWidth = 3;
      this.seriesSettings.showLegend = this.$vuetify.display.smAndUp;
      this.seriesSettings.numberFormat = this.fileObject.seriesNumberFormat
        ? this.fileObject.seriesNumberFormat
        : this.seriesSettings.numberFormat;

      const splits = this.fileObject.numberFormat.split(' ');
      const unit = splits.length > 0 ? splits[splits.length - 1] : '';

      try {
        // this.detailChart = createLineChart(this.chartId, 'timestamp', this.records, this.graphs,
        //                             !this.chartId.includes('_v'), undefined, this.seriesSettings, dateFormatingInfos,
        //                              undefined, this.fileObject.numberFormat, this.fileObject.dateFormatTime,
        //                              this.chartDone, this.chartError);
        this.detailChart = createSerialChart(
          this.chartId,
          ` ${unit}`,
          this.graphs,
          this.records,
          this.delay,
          this.chartDone,
          this.chartError,
          this.isRecentDataChart,
          this.convertLocalTime,
        );

        this.chartIsLoading = false;
      } catch (error) {
        this.chartIsLoading = false;
        this.dataError = `Error creating chart: ${error}`;
      }
    },
    chartError(error) {
      this.chartIsLoading = false;
      this.dataError = error.message;

      this.dataAvailable = false;
      this.clearChart();
    },
    chartDone(doneResponse) {
      this.chartIsLoading = false;
      this.dataError = '';

      this.dataAvailable = hasData(doneResponse, this.fileObject.parameters[0]);

      if (!this.dataAvailable) {
        this.clearChart();
      }
    },
    registeryIntersectionObserver() {
      this.ISObserver = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!this.intersected) {
            this.intersected = true;
            this.loadChart();
          }
        }
      });

      this.ISObserver.observe(this.$el);
    },
    clearChart() {
      if (this.detailChart) {
        // console.log('dispose via DetailChart');
        // this.detailChart.dispose();
        // console.log('delete via DetailChart');
        this.detailChart = null;
        // delete this.detailChart;
      }

      this.records = [];
    },
  },
  data() {
    return {
      mdiRefresh,
      dateFormat: 'MMM dd, YYYY HH:mm UTC',
      dateFormatNoTime: 'MMM dd, YYYY',
      detailChart: null,
      visible: false,
      chartIsLoading: true,
      dataAvailable: false,
      dataError: '',
      preloading: true,
      ISObserver: null,
      intersected: false,
      noDataText: 'No data available',
      disclaimerText:
        'Please note: this data is a daily average for visualisation purposes.',
      records: [],
      seriesSettings: { ...defaultSeriesSettings },
    };
  },
  components: {
    BaseRectangleButton,
  },
};
</script>

<style scoped></style>
