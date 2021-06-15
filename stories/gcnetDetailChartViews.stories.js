/* eslint-disable object-property-newline */
/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-02-24 10:58:19
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';
// import { defaultSeriesSettings } from '@/factories/chartFactory';
// const seriesSettings = defaultSeriesSettings;

import stationParameters from '@/../public/testdata/stationParameters.json';
import stationsConfig from '@/../public/testdata/stationsConfig.json';

// import DetailChart from '@/modules/metadata/components/GC-Net/DetailChart';
import DetailChartsList from '@/modules/metadata/components/GC-Net/DetailChartsList';

const stations = stationsConfig;
const fileObjects = stationParameters.fileObjects;
const graphStyling = stationParameters.graphStyling;


// export const methods = {
//   onCardClick: action('clicked on card'),
//   onTagClick: action('clicked on tag'),
// };

storiesOf('7 GC-Net Views / Charts', module)
  // .add('DetailChart', () => ({
  //   components: { DetailChart },
  //   template: `
  //   <v-col>
     
  //     <v-row>
  //       Station 1 DetailChart
  //     </v-row>

  //     <v-row class="py-3" >
  //       <v-col >
  //         <DetailChart :apiUrl="currentStation.envidatConfig.apiUrl"
  //                       :fallbackUrl="currentStation.envidatConfig.fallbackUrl"
  //                       :fallbackFilename="fileObject.fileName"
  //                       :stationName="currentStation.name"
  //                       :stationId="currentStation.id"
  //                       :fileObject="fileObject"
  //                       :chartId="chartId(fileObject.fileName)"
  //                       :graphs="buildGraphs(fileObject)"
  //                       :preload="fileObject.preload"
  //                       :showDisclaimer="fileObject.showDisclaimer"
  //                       :key="fileObject.fileName" />

  //       </v-col>
  //     </v-row>

  //   </v-col>
  //   `,
  //   computed: {
  //     currentStation() {
  //       return this.stations[0];
  //     },
  //     fileObject() {
  //       return this.fileObjects[0];
  //     },
  //   },
  //   methods: {
  //     buildGraphs(fileObject) {
  //       const graphs = [];

  //       if(!fileObject?.parameters) {
  //         return graphs;
  //       }

  //       for(let i = 0; i<fileObject.parameters.length; i++) {
  //         const param = fileObject.parameters[i];
  //         const paramStyle = this.graphStyling[param];

  //         if (paramStyle) {
  //           graphs.push(this.buildGraph(param, paramStyle, fileObject));
  //         }
  //       }

  //       // this.graphs = graphs;
  //       return graphs;
  //     },
  //     buildGraph(parameter, infoObj, fileObject) {
  //       const splits = fileObject.numberFormat.split(' ');
  //       const unit = splits.length > 0 ? splits[splits.length - 1] : '';

  //       return {
  //         lineColor: infoObj.color,
  //         bulletRadius: this.seriesSettings.bulletsRadius,
  //         title: infoObj.titleString,
  //         valueField: parameter,
  //         balloonText: `<b><span style='font-size:12px;'>${infoObj.titleString}: [[value]] ${unit}</span></b>`,
  //         hideBulletsCount: 200,
  //         bullet: 'round',
  //         bulletBorderAlpha: this.seriesSettings.bulletsStrokeOpacity,
  //         bulletAlpha: this.seriesSettings.bulletsfillOpacity,
  //         bulletSize: this.seriesSettings.bulletsRadius,
  //         bulletBorderThickness: this.seriesSettings.bulletsStrokeWidth,
  //         lineThickness: this.seriesSettings.lineStrokeWidth,
  //         connect: false,
  //         gridAboveGraphs: true,
  //         negativeLineColor: infoObj.negativeColor ? infoObj.negativeColor : infoObj.color,
  //         negativeFillColors: infoObj.negativeColor ? infoObj.negativeColor : infoObj.color,
  //         precision: infoObj.precision ? infoObj.precision : 0,
  //       };
  //     },
  //     chartId(fileName) {
  //       return `${this.stationId}_${fileName}`;
  //     },
  //     stationId() {
  //       return `${this.currentStation.id}_${this.currentStation.alias ? this.currentStation.alias : this.currentStation.name}`;
  //     },      
  //   },
  //   data: () => ({
  //     stations,
  //     fileObjects,
  //     graphStyling,
  //     seriesSettings,
  //   }),
  // }))
  .add('DetailChartsList', () => ({
    components: { DetailChartsList },
    template: `
    <v-col>
      
      <v-row class="py-3"
              >
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

    </v-col>
    `,
    computed: {
      station1() {
        return this.stations[0];
      },
      station2() {
        return this.stations[1];
      },
    },
    // methods,
    data: () => ({
      stations,
      fileObjects,
      graphStyling,
    }),
  }));
