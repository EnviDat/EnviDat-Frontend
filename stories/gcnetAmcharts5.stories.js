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

import { convertCSVToJSON, getChartSeries } from '@/factories/stringFactory';
import axios from 'axios';
import Amcharts5 from '@/modules/metadata/components/GC-Net/Amchart5Chart.vue';
import EditChart from '@/modules/user/components/edit/EditChart.vue';
import { createChart } from '@/factories/chartFactory';
import * as am5 from '@amcharts/amcharts5';
import { CHART_VIEWS } from './storybookFolder';

// import neadContent from '../public/testdata/00-Swiss Camp 10m.csv';
// import researchUnits from '../public/researchUnits.json';

// console.log(neadContent);

export default {
  title: `${CHART_VIEWS} / AmChart5 Tests`,
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
          <Amcharts5 :apiUrl="apiUrl" />
        </v-col>
      </v-row>
    
    </v-col>
    `,
  computed: {
  },
  data: () => ({
    // apiUrl: 'https://www.envidat.ch/data-api/gcnet/nead/swisscamp/end/empty/2020-11-03/2020-11-06/',
    apiUrl: 'https://os.zhdk.cloud.switch.ch/envicloud/gcnet/data/wsl-geus-cooperation/L1/00-Swiss Camp 10m.csv',
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
            <Amcharts5 :jsonChartDivID="chartdiv1"
                       :apiUrl="apiUrl1"
                       />
          </v-col>
        </v-row>

        <v-row style="border: solid 1px;"
               no-gutters>
          <v-col >
            <Amcharts5 :jsonChartDivID="chartdiv2"
                       :apiUrl="apiUrl2"
                       />
          </v-col>
        </v-row>

        <v-row style="border: solid 1px;"
               no-gutters>
          <v-col >
            <Amcharts5 :jsonChartDivID="chartdiv3"
                       :apiUrl="apiUrl3"
                        />
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
    apiUrl2: 'https://www.envidat.ch/data-api/gcnet/json/neem/swin/2018-11-04T17:00:00/2020-11-10T00:00:00/',
    chartdiv3: 'chartdiv3',
    apiUrl3: 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/airtemp1/2018-11-04T17:00:00/2020-11-10T00:00:00/',
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
          <Amcharts5 :apiUrl="apiUrl1"  />
        </v-col>
      </v-row>
      
    </v-col>
    </div>
  `,
  computed: {
  },
  data: () => ({
    apiUrl1: 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/airtemp2/2000-11-04T17:00:00/2020-11-10T00:00:00/',
  }),
});


export const NEADAutoChart = () => ({
  components: { Amcharts5 },
  template: `
    <v-col >

      <v-row class="py-3" >
        
      </v-row>

      <v-row v-if="!loading"
             style="border: solid 1px;"
              no-gutters>
        <v-col v-for="(param, index) in params" 
                :key="index"
                class="px-2">
          {{ param }}
        </v-col>
      </v-row>

      <v-row class="py-3"
             style="border: solid 1px;"
             no-gutters
             v-for="(param, index) in params"
             :key="param" >
        
        <v-col cols="12">

          <div :id="getChartId(index)"
               style="height: 300px;" >

          </div>
        </v-col>
          
      </v-row>
      
      <v-row v-if="loading"
             style="border: solid 1px;"
             no-gutters>
        <v-col >
          loading
        </v-col>
      </v-row>
    
    </v-col>
  `,
  async mounted() {
    this.neadJSON = await this.loadDataInJson(this.dataUrl);

    this.$nextTick(() => {

      for (let i = 0; i < this.params.length; i++) {
        this.loadChart(i);
      }

    });

    // this.neadJSON2 = await this.loadDataInJson(this.dataUrl2);
  },
  computed: {
    params() {
      return this.neadJSON?.parameters.slice(0, 5) || [];
    },
/*
    series1() {
      return getChartSeries(this.neadJSON?.parameters[0], this.neadJSON?.data);
    },
    series2() {
      return getChartSeries(this.neadJSON2?.parameters, this.neadJSON2?.data);
    },
*/
  },
  methods: {
    getChartId(index) {
      return `neadAutoChart_${index}`;
    },
    async loadDataInJson(url) {
      this.loading = true;
      const neadContent = await axios.get(url);
      this.loading = false;

      return convertCSVToJSON(neadContent.data, '-999.0');
    },
    loadChart(chartNumber = 0) {
      const series = getChartSeries([this.neadJSON?.parameters[chartNumber]], this.neadJSON?.data);

      createChart(`neadAutoChart_${chartNumber}`, this.xAxisName, this.neadJSON?.parameters[chartNumber], series, this.xAxisFormat);
    },
  },
  data: () => ({
    dataUrl: 'https://os.zhdk.cloud.switch.ch/envicloud/gcnet/data/wsl-geus-cooperation/L1/00-Swiss Camp 10m.csv',
    neadJSON: null,
    dataUrl2: 'https://os.zhdk.cloud.switch.ch/envicloud/gcnet/data/wsl-geus-cooperation/L1/03-NASA-U.csv',
    neadJSON2: null,
    loading: false,
    xAxisName: 'timestamp_iso',
    xAxisFormat: "yyyy-MM-dd H:m:s'+00:00'",
  }),
});

export const EditingParameterViews = () => ({
  components: { EditChart },
  template: `
    <v-col >
    
      <v-row class="py-3" >
        EditChart
      </v-row>

      <v-row style="border: solid 1px;"
             no-gutters>
        <v-col >
          <EditChart  />
        </v-col>
      </v-row>
    
    </v-col >
  `,
  mounted() {
    // this.loadDataInJson(this.localNeadFile);
    this.parseCSV(this.localNeadFile);
  },
  computed: {
  },
  methods: {
    async loadDataInJson(url) {
      this.loading = true;
      // const neadContent = await axios.get(url);
      const neadContent = await import(url);
      this.loading = false;

      const jsonData = convertCSVToJSON(neadContent.data, '-999.0');

      return jsonData;
    },
    parseCSV(url) {
      am5.net.load(url).then((result) => {

        // Get responseType 'type' from response header, this indicates if external data is in JSON or CSV format
        const responseType = result.type.split(',')[0];

        // Parse JSON data
        if (responseType === 'application/json') {
          this.parsedData = am5.JSONParser.parse(result.response);
        } else if (responseType === 'text/csv') {

          // TODO dynamically assign nullValue in call below, will need to parse nodata value from NEAD
          const jsonConvert = convertCSVToJSON(result.response, '');
          this.parsedData = jsonConvert.data;
        } else {
          console.log(`Error loading ${url}, response type ${responseType} is not compatible with application.`);
        }

      }).catch((error) => {
        console.log(`Error loading data: ${error} for ${url}`);
        console.log(error);
      });
    },
  },
  data: () => ({
    parsedData: [],
    loading: false,
    // localNeadFile: `${__dirname}/../public/testdata/00-Swiss Camp 10m.csv`,
    // localNeadFile: './public/researchUnits.json',
    localNeadFile: 'public/testdata/00-Swiss Camp 10m.csv',
    apiUrl1: 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/airtemp2/2000-11-04T17:00:00/2020-11-10T00:00:00/',
  }),
});
