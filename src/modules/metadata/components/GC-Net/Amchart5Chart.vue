<template>

  <v-card>

    <v-container class="pa-4" fluid>

      <div v-if="!jsonDataAvailable && !csvDataAvailable && !dataLoadParseError">
        <h1>Data loading...</h1>
      </div>

      <div v-if="dataLoadParseError">
        <h1>Data not available</h1>
      </div>

      <div v-if="jsonDataAvailable">
        <div class="chart"
             :id="jsonChartDivID" >
          {{ jsonDataYAxisName }}
        </div>
      </div>

      <div v-if="csvDataAvailable" >
        <div class="chart my-4"
             v-for="yAxis in csvDataYAxesArray"
             :id=yAxis
             :key="yAxis">
          {{ yAxis }}
        </div>
      </div>

    </v-container>

  </v-card>


</template>

<script>
import * as am5 from '@amcharts/amcharts5';

import { convertCSVToJSON } from '@/factories/stringFactory';
import { createChart } from '@/factories/chartFactory';


export default {
  name: 'Amcharts5',
  props: {
    jsonChartDivID: {
      type: String,
      default: 'chartdiv',
    },
    apiUrl: {
      type: String,
      default: '',
    },
    xAxisName: {
      type: String,
      default: 'timestamp_iso',
    },
    xAxisFormat: {
      type: String,
      default: "yyyy-MM-dd H:m:s'+00:00'",
    },
    timestampArray: {
      type: Array,
      default: () => ['timestamp_iso', 'timestamp'],
    },
  },
  mounted() {
    // Load and parse data from API call (JSON or NEAD)
    this.loadParseData();
  },
  beforeDestroy() {
    if (this.root) {
      this.root.dispose();
    }
  },
  updated() {

    if (this.csvDataAvailable) {
      // Create multiple charts: one chart per yAxis (element) in csvDataYAxesArray for CSV data
      this.csvDataYAxesArray.map(yAxis => createChart(yAxis, this.xAxisName, yAxis, this.parsedData, this.xAxisFormat));
    }

    if (this.jsonDataAvailable) {
      // Create chart for JSON data
      createChart(this.jsonChartDivID, this.xAxisName, this.yAxisName, this.parsedData, this.xAxisFormat);
    }

  },
  methods: {
    // Return responseType 'type' from result object (only string parsed to first comma)
    getResponseType(resultType) {
      return resultType.split(',')[0];
    },
    // Assign parsedData to loaded and parsed external data
    loadParseData() {

      am5.net.load(this.apiUrl).then((result) => {

        // Get responseType 'type' from response header, this indicates if external data is in JSON or CSV format
        const responseType = this.getResponseType(result.type);

        // Parse JSON data
        if (responseType === 'application/json') {

          this.parsedData = am5.JSONParser.parse(result.response);

          // Assign jsonDataYAxis name from parsedData key (excluding timestamp keys)
          // NOTE: this block assumes that the API JSON call will return data for only one non-timestamp parameter!
          const firstElementKeys = Object.keys(this.parsedData[0]);
          this.jsonDataYAxisName = (firstElementKeys.filter(item => !this.timestampArray.includes(item))).shift();

          this.jsonDataAvailable = true;

        }

        // Parse CSV data
        else if (responseType === 'text/csv') {

          // TODO dynamically assign nullValue in call below, will need to parse nodata value from NEAD
          const jsonConvert = convertCSVToJSON(result.response, '');

          this.csvDataYAxesArray = jsonConvert.parameters;
          this.parsedData = jsonConvert.data;
          this.csvDataAvailable = true;

        }

        else {
          this.dataLoadParseError = true;
          console.log(`Error loading ${this.apiUrl}, response type ${responseType} is not compatible with application.`);
        }

      }).catch((error) => {
          this.dataLoadParseError = true;
          console.log(`Error loading data: ${error} for ${this.apiUrl}`);
         },
      );
    },
  },
  data() {
    return {
      dataLoadParseError: false,
      parsedData: [],
      jsonDataAvailable: false,
      jsonDataYAxisName: '',
      csvDataAvailable: false,
      csvDataYAxesArray : [],
    };
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

.chart {
  width: 100%;
  height: 350px;
}

</style>
