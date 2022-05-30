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

export default {
  title: 'amChart5 Tests / AmChart ',
  component: Amcharts5,
  decorators: [],
  parameters: {},
};

export const Amcharts5SingleChart = () => ({
  components: { Amcharts5 },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  template: `
    <v-col class="chromatic-ignore">

      <v-row class="py-3" >
        AmCharts5 testing with 1 chart
      </v-row>

      <v-row style="border: solid 1px;"
              no-gutters>
        <v-col >
          <Amcharts5 :apiUrl="this.apiUrl" />
        </v-col>
      </v-row>
    
    </v-col>
    `,
  computed: {
  },
  data: () => ({
    apiUrl: 'https://www.envidat.ch/data-api/gcnet/nead/swisscamp/end/empty/2020-11-03/2020-11-06/',
  }),
});


export const Amcharts5MultipleCharts = () => ({
  components: { Amcharts5 },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  template: `
    <div>
      <v-col class="chromatic-ignore">

        <v-row class="py-3" >
          AmCharts5 testing with 3 charts
        </v-row>

        <v-row style="border: solid 1px;"
               no-gutters>
          <v-col >
            <Amcharts5 :chartdivID="this.chartdiv1"
                       :apiUrl="this.apiUrl1"
                       />
          </v-col>
        </v-row>

        <v-row style="border: solid 1px;"
               no-gutters>
          <v-col >
            <Amcharts5 :chartdivID="this.chartdiv2"
                       :apiUrl="this.apiUrl2"
                       :yAxisName="this.yAxisName" />
          </v-col>
        </v-row>

        <v-row style="border: solid 1px;"
               no-gutters>
          <v-col >
            <Amcharts5 :chartdivID="this.chartdiv3"
                       :apiUrl="this.apiUrl3"
                       :yAxisName="this.yAxisName" />
          </v-col>
        </v-row>

      </v-col>
    </div>
    `,
  computed: {
  },
  data: () => ({
    chartdiv1: 'chartdiv1',
    apiUrl1: 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/airtemp2/2018-11-04T17:00:00/2020-11-10T00:00:00/',
    chartdiv2: 'chartdiv2',
    apiUrl2: 'https://www.envidat.ch/data-api/gcnet/json/neem/airtemp2/2018-11-04T17:00:00/2020-11-10T00:00:00/',
    chartdiv3: 'chartdiv3',
    apiUrl3: 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/airtemp2/2018-11-04T17:00:00/2020-11-10T00:00:00/',
    yAxisName: 'airtemp2',
  }),
});


export const Amcharts5LargeData = () => ({
  components: { Amcharts5 },
  parameters: {
    chromatic: { disableSnapshot: false },
  },
  template: `
    <div>
    <v-col class="chromatic-ignore">

      <v-row class="py-3" >
        AmCharts5 testing with large data
      </v-row>

      <v-row style="border: solid 1px;"
             no-gutters>
        <v-col >
          <Amcharts5 :chartdivID="this.chartdiv1"
                     :apiUrl="this.apiUrl1"
                     :yAxisName="this.yAxisName" />
        </v-col>
      </v-row>
      
    </v-col>
    </div>
  `,
  computed: {
  },
  data: () => ({
    chartdiv1: 'chartdiv1',
    apiUrl1: 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/airtemp2/2000-11-04T17:00:00/2020-11-10T00:00:00/',
    yAxisName: 'airtemp2',
  }),
});
