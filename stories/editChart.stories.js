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

import * as am5 from '@amcharts/amcharts5';

import { convertCSVToJSON } from '@/factories/stringFactory';
import EditChart from '@/modules/user/components/edit/EditChart.vue';

// import neadContent from '../public/testdata/00-Swiss Camp 10m.csv';
// import researchUnits from '../public/researchUnits.json';

// console.log(neadContent);

export default {
  title: '12 Chart Views / Edit Chart',
  component: EditChart,
};

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
/*
  mounted() {
    // this.loadDataInJson(this.apiUrl1);
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
*/
  data: () => ({
    parsedData: [],
    loading: false,
    // localNeadFile: `${__dirname}/../public/testdata/00-Swiss Camp 10m.csv`,
    // localNeadFile: './public/researchUnits.json',
    localNeadFile: '/testdata/00-Swiss Camp 10m.csv',
    apiUrl1: 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/airtemp2/2005-11-04T17:00:00/2007-11-10T00:00:00/',
  }),
});
