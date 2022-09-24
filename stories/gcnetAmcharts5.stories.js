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
import * as am5 from '@amcharts/amcharts5';
import am5themesAnimated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { CHART_VIEWS } from './storybookFolder';
import Amcharts5 from '../src/modules/metadata/components/GC-Net/Amchart5Chart';

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
            <Amcharts5 :jsonChartDivID="this.chartdiv1"
                       :apiUrl="this.apiUrl1"
                       />
          </v-col>
        </v-row>

        <v-row style="border: solid 1px;"
               no-gutters>
          <v-col >
            <Amcharts5 :jsonChartDivID="this.chartdiv2"
                       :apiUrl="this.apiUrl2"
                       />
          </v-col>
        </v-row>

        <v-row style="border: solid 1px;"
               no-gutters>
          <v-col >
            <Amcharts5 :jsonChartDivID="this.chartdiv3"
                       :apiUrl="this.apiUrl3"
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
          <Amcharts5 :apiUrl="this.apiUrl1"  />
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

      this.createChart(`neadAutoChart_${chartNumber}`, this.neadJSON?.parameters[chartNumber], series);
    },
    createChart(yAxisDivID, yAxisName, data) {

      const root = am5.Root.new(yAxisDivID);

      // Set all dates in root to UTC
      // NOTE: It is critical to set the root to UTC, otherwise timestamps will be rendered in local time!!!!
      root.utc = true;

      root.setThemes([am5themesAnimated.new(root)]);

      // Create chart
      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          focusable: true,
          panX: true,
          panY: true,
          wheelX: 'panX',
          wheelY: 'zoomX',
        }),
      );

      // const easing = am5.ease.linear;

      // Create axes
      const xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
          maxDeviation: 0.1,
          groupData: true,
          groupCount: 500,
          baseInterval: {
            timeUnit: 'hour',
            count: 1,
          },
          renderer: am5xy.AxisRendererX.new(root, {
            // minGridDistance: 50,
          }),
          tooltip: am5.Tooltip.new(root, {}),
        }),
      );

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0.1,
          renderer: am5xy.AxisRendererY.new(root, {}),
          tooltip: am5.Tooltip.new(root, {}),
        }),
      );

      // Set cursor
      chart.set('cursor', am5xy.XYCursor.new(root, {
        behavior: 'zoomX',
        xAxis,
      }));
      // cursor.lineY.set('visible', false);

      // Add scrollbar
      chart.set('scrollbarX', am5.Scrollbar.new(root, {
        orientation: 'horizontal',
      }));

/*
      chart.appear(1000, 100);
*/


      // Add series
      const series = chart.series.push(
        am5xy.LineSeries.new(root, {
          minBulletDistance: 10,
          connect: false,
          xAxis,
          yAxis,
          valueYField: yAxisName,
          valueXField: this.xAxisName,
          tooltip: am5.Tooltip.new(root, {}),
        }),
      );

      series.get('tooltip').label.set('text', '{valueYField}: {valueY}');

      series.strokes.template.setAll({
        strokeWidth: 3,
        templateField: 'strokeSettings',
      });

      // Make stuff animate on load
/*
      series.appear(1000, 100);
      chart.appear(1000, 100);
*/


      // Process data
      const processor = am5.DataProcessor.new(root, {
        dateFields: [this.xAxisName],
        dateFormat: this.xAxisFormat,
        numericFields: [yAxisName],
      });

      processor.processMany(data);

      // Assign parsed/processed data to series
      series.data.setAll(data);

      return () => root.dispose();
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
