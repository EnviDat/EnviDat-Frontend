/* eslint-disable object-property-newline */
// noinspection JSUnusedGlobalSymbols,VueDuplicateTag

/**
 * @summary story of amCharts 5 for sandbox testing
 * @author Rebecca Buchholz and Dominik Haas
 *
 * Created at     : 2021-03-22
 * Last modified  :  2021-03-22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable object-property-newline */

import Amcharts5 from '../src/modules/metadata/components/GC-Net/Amchart5Chart';


// import stationParameters from '../public/testdata/stationParameters.json';
// import stationsConfig from '../public/testdata/stationsConfig.json';
// import DetailChartsList from '../src/modules/metadata/components/GC-Net/DetailChartsList';
//
// const stations = stationsConfig;
// const fileObjects = stationParameters.fileObjects;
// const graphStyling = stationParameters.graphStyling;


export default {
  title: 'amChart5 Tests / AmChart ',
  component: Amcharts5,
  decorators: [],
  parameters: {},
};

export const Amcharts5Views = () => ({
  components: { Amcharts5 },
  parameters: {
    // disable the snapshots for the MicroCharts because they pull in recent data and
    // will change almost everytime
    chromatic: { disableSnapshot: false },
  },
  template: `
    <v-col class="chromatic-ignore">

      <v-row class="py-3" >
        AmCharts5 Testing
      </v-row>

      <v-row style="border: solid 1px;"
              no-gutters>
        <v-col >
          <Amcharts5 />
        </v-col>
      </v-row>

    </v-col>
    `,
  computed: {
  },
  data: () => ({
  }),
});

// export const DetailChartsListViews = () => ({
//   components: { DetailChartsList },
//   parameters: {
//     // disable the snapshots for the MicroCharts because they pull in recent data and
//     // will change almost everytime
//     chromatic: { disableSnapshot: false },
//   },
//   template: `
//     <v-col class="chromatic-ignore">
//
//       <v-row class="py-3" >
//         Station 1 DetailChartsList
//       </v-row>
//
//       <v-row style="border: solid 1px;"
//               no-gutters>
//         <v-col >
//           <DetailChartsList :currentStation="station1"
//                             :fileObjects="fileObjects"
//                             :graphStyling="graphStyling" />
//         </v-col>
//       </v-row>
//
//     </v-col>
//     `,
//   computed: {
//     station1() {
//       return this.stations[0];
//     },
//     station2() {
//       return this.stations[1];
//     },
//   },
//   // methods,
//   data: () => ({
//     stations,
//     fileObjects,
//     graphStyling,
//   }),
// });
