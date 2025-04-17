/* eslint-disable object-property-newline */
// noinspection JSUnusedGlobalSymbols,VueDuplicateTag

/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-10-19 11:19:04
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-property-newline */

import DetailChart from '@/modules/metadata/components/GC-Net/GcNetDetailChart.vue';
import { defaultSeriesSettings } from '@/factories/chartFactory';
import DetailChartsList from '@/modules/metadata/components/GC-Net/GcNetDetailChartsList.vue';

import stationParameters from './testdata/stationParameters.json';
import stationsConfig from './testdata/stationsConfig.json';


const stations = stationsConfig;
const fileObjects = stationParameters.fileObjects;
const graphStyling = stationParameters.graphStyling;


export default {
  title: '1 Base / Charts / GC-Net Detail Charts',
  component: DetailChartsList,
  decorators: [],
  parameters: {
    // disable the snapshots for the MicroCharts because they pull in recent data and
    // will change almost everytime
    chromatic: { disableSnapshot: false },
  },
};

export const DetailChartViews = () => ({
  components: { DetailChart },
  parameters: {
    // disable the snapshots for the MicroCharts because they pull in recent data and
    // will change almost everytime
    chromatic: { disableSnapshot: false },
  },
  template: `
<!--
      <script src="https://www.wsl.ch/gcnet/amcharts/amcharts.js"></script>
      <script src="https://www.wsl.ch/gcnet/amcharts/serial.js"></script>
      <script src="https://www.wsl.ch/gcnet/amcharts/plugins/responsive/responsive.min.js"></script>
-->

    <v-col class="chromatic-ignore">

      <v-row>
        Station 1 DetailChart
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <DetailChart :apiUrl="currentStation.envidatConfig.apiUrl"
                        :fallbackUrl="currentStation.envidatConfig.fallbackUrl"
                        :fallbackFilename="fileObject.fileName"
                        :stationName="currentStation.name"
                        :stationId="currentStation.id"
                        :fileObject="fileObject"
                        :chartId="chartId(fileObject.fileName)"
                        :graphs="buildGraphs(fileObject)"
                        :preload="fileObject.preload"
                        :showDisclaimer="fileObject.showDisclaimer"
                        :key="fileObject.fileName" />

        </v-col>
      </v-row>
    
    </v-col>
    `,
    computed: {
      currentStation() {
        return this.stations[0];
      },
      fileObject() {
        return this.fileObjects[1];
      },
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
          negativeLineColor: infoObj.negativeColor ? infoObj.negativeColor : infoObj.color,
          negativeFillColors: infoObj.negativeColor ? infoObj.negativeColor : infoObj.color,
          precision: infoObj.precision ? infoObj.precision : 0,
        };
      },
      chartId(fileName) {
        return `${this.stationId}_${fileName}`;
      },
      stationId() {
        return `${this.currentStation.id}_${this.currentStation.alias ? this.currentStation.alias : this.currentStation.name}`;
      },
    },
    data: () => ({
      stations,
      fileObjects,
      graphStyling,
      seriesSettings: defaultSeriesSettings,
    }),
});

export const DetailChartsListViews = () => ({
  components: { DetailChartsList },
  parameters: {
    // disable the snapshots for the MicroCharts because they pull in recent data and
    // will change almost everytime
    chromatic: { disableSnapshot: false },
  },
  template: `
    <v-col class="chromatic-ignore">

      <v-row class="py-3" >
        Station 1 DetailChartsList
      </v-row>

      <v-row style="border: solid 1px;"
              no-gutters>
        <v-col >
          <DetailChartsList :currentStation="station1"
                            :fileObjects="fileObjects"
                            :graphStyling="graphStyling" />
        </v-col>
      </v-row>

      <v-row class="py-3"
      >
        Station 4 DetailChartsList
      </v-row>

      <v-row style="border: solid 1px;"
             no-gutters>
        <v-col >
          <DetailChartsList :currentStation="station4"
                            :fileObjects="fileObjects"
                            :graphStyling="graphStyling" />
        </v-col>
      </v-row>

      <v-row class="py-3"
      >
        Station 8 DetailChartsList
      </v-row>

      <v-row style="border: solid 1px;"
             no-gutters>
        <v-col >
          <DetailChartsList :currentStation="station8"
                            :fileObjects="fileObjects"
                            :graphStyling="graphStyling" />
        </v-col>
      </v-row>
    
    </v-col>
    `,
  computed: {
    station1() {
      return this.stations[0];
    },
    station2() {
      return this.stations[1];
    },
    station4() {
      return this.stations[3];
    },
    station8() {
      return this.stations[7];
    },
  },
  // methods,
  data: () => ({
    stations,
    fileObjects,
    graphStyling,
  }),
});
