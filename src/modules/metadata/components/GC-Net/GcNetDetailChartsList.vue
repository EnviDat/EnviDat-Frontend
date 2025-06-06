<template>
  <v-container class="pa-1" fluid id="DetailChartList">
    <v-row no-gutters>
      <v-col cols="3" class="pa-2">
        <v-row no-gutters>
          <v-col cols="12" class="py-1">
            <ButtonContentTable
              :stationName="currentStation.name"
              :buttonList="stationParams"
              :scrollPos="scrollPos"
              :title="`Detailed charts of ${currentStation.name} station`"
              :subtitle="contentTableTitle"
              @buttonClick="scrollToChart"
            />
          </v-col>

          <v-col cols="12" class="py-1">
            <ButtonContentTable
              :stationName="currentStation.name"
              :buttonList="downloadButton"
              :scrollPos="scrollPos"
              title="Download Data"
              :subtitle="downloadSubtitle"
              :downloadActive="downloadActive"
              @buttonClick="downloadData"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col v-show="currentStation && fileObjects.length > 0"
        cols="9"
        class="px-1 scrollableList"
        ref="scrollableList"
        id="scrollableList"
        v-scroll.self="onScroll"
      >
        <v-row v-for="fileObject in fileObjects"
               :key="fileObject.fileName"
               :ref="chartCardId(fileObject)"
               :id="chartCardId(fileObject)"
               no-gutters
        >
          <!-- :ref="fileObject.fileName" -->

          <v-col cols="12"
                  class="py-2"
          >
            <GcNetDetailChart
              :apiUrl="currentStation.envidatConfig.apiUrl"
              :fallbackUrl="currentStation.envidatConfig.fallbackUrl"
              :fallbackFilename="fileObject.fileName"
              :stationName="currentStation.name"
              :stationId="currentStation.id"
              :fileObject="fileObject"
              :chartId="chartId(fileObject.fileName)"
              :graphs="buildGraphs(fileObject)"
              :preload="fileObject.preload"
              :showDisclaimer="fileObject.showDisclaimer"
              :historicalEndDate="getHistoricalEndDate(fileObject.parameters)"
              :convertLocalTime="convertLocalTime"
              :key="fileObject.fileName + reRenderKey"
            />
          </v-col>
        </v-row>

        <v-row v-if="fileObjects.length <= 0">
          <v-col>{{
            `FileObject: ${fileObjects} graphStyling: ${graphStyling}`
          }}</v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import formatISO from 'date-fns/formatISO';
import isAfter from 'date-fns/isAfter';
import parseISO from 'date-fns/parseISO';

import ButtonContentTable from '@/components/Navigation/ButtonContentTable.vue';
import { defaultSeriesSettings } from '@/factories/chartFactory';

import GcNetDetailChart from './GcNetDetailChart.vue';

export default {
  name: 'DetailChartsList',
  props: {
    currentStation: Object,
    fileObjects: Array,
    graphStyling: Object,
    config: Object,
  },
  components: {
    GcNetDetailChart,
    ButtonContentTable,
  },
  created() {
    this.reRenderKey = new Date().toUTCString();
  },
  mounted() {
    this.scrollPos = 0;
  },
  methods: {
    buildGraphs(fileObject) {
      const graphs = [];

      if (!fileObject?.parameters) {
        return graphs;
      }

      for (let i = 0; i < fileObject.parameters.length; i++) {
        const param = fileObject.parameters[i];
        const paramStyle = this.graphStyling[param];

        if (paramStyle) {
          graphs.push(this.buildGraph(param, paramStyle, fileObject));
        }
      }

      // this.graphs = graphs;
      return graphs;
    },
    buildGraph(parameter, infoObj, fileObject) {
      const splits = fileObject.numberFormat.split(' ');
      const unit = splits.length > 0 ? splits[splits.length - 1] : '';

      return {
        lineColor: infoObj.color,
        bulletRadius: this.seriesSettings.bulletsRadius,
        title: infoObj.titleString,
        valueField: parameter,
        balloonText: `<b><span style='font-size:12px;'>${infoObj.titleString}: [[value]] ${unit}</span></b>`,
        hideBulletsCount: 200,
        bullet: 'round',
        bulletBorderAlpha: this.seriesSettings.bulletsStrokeOpacity,
        bulletAlpha: this.seriesSettings.bulletsfillOpacity,
        bulletSize: this.seriesSettings.bulletsRadius,
        bulletBorderThickness: this.seriesSettings.bulletsStrokeWidth,
        lineThickness: this.seriesSettings.lineStrokeWidth,
        connect: false,
        gridAboveGraphs: true,
        negativeLineColor: infoObj.negativeColor
          ? infoObj.negativeColor
          : infoObj.color,
        negativeFillColors: infoObj.negativeColor
          ? infoObj.negativeColor
          : infoObj.color,
        precision: infoObj.precision ? infoObj.precision : 0,
      };
    },
    stationRouteId() {
      return this.$route.params.id;
    },
    chartId(fileName) {
      return `${this.stationId}_${fileName}`;
    },
    chartCardId(fileObject) {
      return `${fileObject.parameters[0]}_${
        fileObject.chartTitle.includes('Recent') ? '1' : '2'
      }`;
    },
    // catchParamClick(fileName) {
    //   let scrollToChart = null;

    //   for (let i = 0; i < this.fileObjects.length; i++) {
    //     const obj = this.fileObjects[i];

    //     if (obj.fileName.includes(fileName)) {
    //       scrollToChart = obj.fileName;
    //       break;
    //     }
    //   }

    //   if (scrollToChart) {
    //     const scrollToKey = `${this.currentStation.id}${scrollToChart}`;

    //     if (this.$refs && this.$refs[scrollToKey] && this.$refs[scrollToKey].length >= 1) {
    //       const scrollToDOM = this.$refs[scrollToKey][0];
    //       const scrollY = scrollToDOM.offsetTop;
    //       window.scrollTo(0, scrollY);
    //     }
    //   }
    // },
    // catchLocalTimeClick(convertLocalTime) {
    //   this.convertLocalTime = convertLocalTime;
    //   this.reRenderKey = new Date().toUTCString();
    // },
    // backToTop() {
    //   window.scrollTo(0, 0);
    // },
    getStation(stationToFind) {
      if (stationToFind) {
        const stations = this.$store.getters.stations;

        for (let i = 0; i < stations.length; i++) {
          const station = stations[i];

          if (
            station.id === stationToFind ||
            station.alias === stationToFind ||
            station.name === stationToFind
          ) {
            return station;
          }
        }
      }

      return null;
    },
    listHasSimilarString(list, string) {
      if (!list || !string) {
        return false;
      }

      for (let i = 0; i < list.length; i++) {
        const el = list[i];
        if (el.includes(string)) {
          return true;
        }
      }

      return false;
    },
    onScroll(e) {
      this.scrollPos = e.target.scrollTop;
    },
    scrollToChart(paramName) {
      // if (!this.referenceExists(paramName)) {
      //   return;
      // }

      const target = this.$refs[`${paramName}_1`][0];

      if (target) {
        this.$refs.scrollableList.$el.scrollTop = target.offsetTop;

        // this.$vuetify.goTo(`${paramName}_1`, {
        // this.$vuetify.goTo(target, {
        // duration: this.duration,
        // offset: this.offset,
        // easing: this.easing,
        // });
      }
    },
    downloadData() {
      const downloadURL =
        this.currentStation?.envidatConfig?.downloadAllUrl ||
        `https://www.envidat.ch/data-api/gcnet/nead/${this.currentStation?.aliasApi}/end/empty/`;
      window.open(downloadURL, '_blank');
    },
    referenceExists(paramName) {
      const target = this.$refs[`${paramName}_1`];
      return target && target.length > 0;
    },
    getHistoricalEndDate(parameters) {
      if (!parameters || parameters.length <= 0) {
        return undefined;
      }

      let endDate = null;

      for (let i = 0; i < parameters.length; i++) {
        const param = parameters[i];

        const paramObj = this.getParameterDate(param);

        const isoDate = paramObj?.timestamp_iso_latest;
        if (isoDate) {
          const stringDate = isoDate.substr(0, isoDate.length - 1);
          const date = parseISO(stringDate);

          if (endDate === null || isAfter(date, endDate)) {
            endDate = date;
          }
        }
      }

      return formatISO(endDate);
    },
    getParameterDate(param) {
      if (!this.currentStation?.envidatConfig?.parameterDates) {
        return null;
      }

      const matches = this.currentStation.envidatConfig.parameterDates.filter(
        dateObj => dateObj.parameter === param,
      );
      return matches[0];
    },
  },
  computed: {
    metadataConfig() {
      return this.config?.metadataConfig || {};
    },
    downloadActive() {
      if (this.metadataConfig?.resourcesConfig) {
        return this.metadataConfig?.resourcesConfig?.downloadActive;
      }

      return true;
    },
    stationParams() {
      // just pick the first param name of the each list
      const buttons = {};
      const keys = Object.keys(this.graphStyling);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        const paramList = Object.keys(buttons);
        const stringToCheck = key.substring(0, key.length - 1);

        if (!this.paramExclusion.includes(key)) {
          const name = this.graphStyling[key].titleString.trim();
          const lastChar = name.substring(name.length - 2);
          let cutOff = false;
          try {
            const lastDigit = Number.parseInt(lastChar, 2);
            cutOff = Number.isInteger(lastDigit);
          } catch (e) {
            console.error(`lastDigit parse failed: ${e}`);
          }

          if (!this.listHasSimilarString(paramList, stringToCheck)) {
            buttons[key] = {
              buttonKey: key,
              buttonText: cutOff ? name.substring(0, name.length - 1) : name,
              color: this.graphStyling[key].color,
            };
          }
        }
      }
      return Object.values(buttons);
    },
    downloadButton() {
      return [{ buttonText: 'Download Data' }];
    },
    stationId() {
      return `${this.currentStation.id}_${
        this.currentStation.alias
          ? this.currentStation.alias
          : this.currentStation.name
      }`;
    },
    downloadSubtitle() {
      return 'Download all data from this station in the <a href="https://github.com/GEUS-Glaciology-and-Climate/NEAD" target="_blank">NEAD</a> format.';
      // return 'Download all data from this station in the <a href="https://github.com/GEUS-Glaciology-and-Climate/NEAD" target="_blank">NEAD</a> format. Data after <insert date> not quality controlled.';
    },
  },
  data: () => ({
    paramExclusion: ['swout', 'netrad'],
    contentTableTitle: 'Show specific measurement',
    loadingStation: false,
    stationImg: null,
    stationPreloadImage: null,
    expand: false,
    convertLocalTime: false,
    reRenderKey: null,
    seriesSettings: { ...defaultSeriesSettings },
    scrollPos: 0,
  }),
};
</script>

<style scoped>
.scrollableList {
  overflow: auto scroll;
  height: calc(100vh - 132px);
}
</style>
