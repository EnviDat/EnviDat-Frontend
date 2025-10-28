/**
 * @summary story of all the MetadataDetailViews for sandbox testing
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2021-02-18 16:10:39
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import GcNetMicroChart from '@/modules/metadata/components/GC-Net/GcNetMicroChart.vue';

const stations = [
  {
    id: 1,
    name: 'Swiss Camp',
    latitude: '69.56833',
    longitude: '49.31582',
    elevation: 1176,
    startdate: '1990.30',
    active: true,
    alias: 'swisscamp',
    data: 1,
    envidatConfig: {
      apiUrl: 'https://www.envidat.ch/data-api/gcnet/json/swisscamp/airtemp1/',
      graphParameter: 'airtemp1',
      fallbackUrl: 'https://www.envidat.ch/data-files/1temp.json',
      fallbackParameter: 'airtemp1',
      previewImageUrl: 'https://www.envidat.ch/gcnet/assets/stations/small/swisscamp.jpg',
    },
  },
  {
    id: 3,
    name: 'NASA-U',
    latitude: '73.84189',
    longitude: '49.49831',
    elevation: 2369,
    startdate: '1995.41',
    active: true,
    alias: 'nasau',
    data: 0,
    envidatConfig: {
      apiUrl: 'https://www.envidat.ch/data-api/gcnet/json/nasa_u/airtemp1/',
      graphParameter: 'airtemp1',
      fallbackUrl: 'https://www.envidat.ch/data-files/3temp.json',
      fallbackParameter: 'airtemp1',
      previewImageUrl: 'https://www.envidat.ch/gcnet/assets/stations/small/nasau.jpg',
    },
  },
  {
    id: 4,
    name: 'GITS',
    latitude: '77.13781',
    longitude: '61.04113',
    elevation: 1887,
    startdate: '1995.43',
    active: true,
    alias: 'gits',
    data: 0,
    envidatConfig: {
      apiUrl: 'https://www.envidat.ch/data-api/gcnet/json/gits/airtemp1/',
      graphParameter: 'airtemp1',
      fallbackUrl: 'https://www.envidat.ch/data-files/4temp.json',
      fallbackParameter: 'airtemp1',
      previewImageUrl: 'https://www.envidat.ch/gcnet/assets/stations/small/gits.jpg',
    },
  },
];

export default {
  title: '17 GC-Net Views / Micro Charts',
  component: GcNetMicroChart,
  parameters: {
    // disable the snapshots for the MicroCharts because they pull in recent data and
    // will change almost everytime
    chromatic: { disableSnapshot: false },
  },
};

export const GcNetMicroChartWithImage = {
  args: {
    station: stations[0],
    apiUrl: stations[0].envidatConfig.apiUrl,
    fallbackUrl: stations[0].envidatConfig.fallbackUrl,
    parameter: stations[0].envidatConfig.graphParameter,
    image: stations[0].envidatConfig.previewImageUrl,
  },
};

export const GcNetMicroChartWithout = {
  args: {
    station: stations[1],
    apiUrl: stations[1].envidatConfig.apiUrl,
    fallbackUrl: stations[1].envidatConfig.fallbackUrl,
    parameter: stations[1].envidatConfig.graphParameter,
    // image: stations[1].envidatConfig.previewImageUrl,
  },
};

/*
export const GcNetMicroChartViews = () => ({
  components: { GcNetMicroChart },
  parameters: {
    // disable the snapshots for the GcNetMicroCharts because they pull in recent data and
    // will change almost everytime
    chromatic: { disableSnapshot: false },
  },
  template: `
    <v-col class="chromatic-ignore">
      <v-row>
        Station 1 GcNetMicroChart with test image
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GcNetMicroChart :station="station1"
                      :apiUrl="station1.envidatConfig.apiUrl"
                      :fallbackUrl="station1.envidatConfig.fallbackUrl"
                      :parameter="station1.envidatConfig.graphParameter"
                      :image="station1.envidatConfig.previewImageUrl"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 1 GcNetMicroChart without image
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GcNetMicroChart :station="station1"
                      :apiUrl="station1.envidatConfig.apiUrl"
                      :fallbackUrl="station1.envidatConfig.fallbackUrl"
                      :parameter="station1.envidatConfig.graphParameter"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 2 GcNetMicroChart with only fallback url
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GcNetMicroChart :station="station2"
                      :apiUrl="station2.envidatConfig.wrongProperty"
                      :fallbackUrl="station2.envidatConfig.fallbackUrl"
                      :parameter="station2.envidatConfig.graphParameter"
                      :image="station2.envidatConfig.previewImageUrl"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 1 GcNetMicroChart with a wrong image url
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GcNetMicroChart :station="station1"
                      :apiUrl="station1.envidatConfig.apiUrl"
                      :fallbackUrl="station1.envidatConfig.fallbackUrl"
                      :parameter="station1.envidatConfig.graphParameter"
                      image="somewrongurl"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 2 GcNetMicroChart with errors
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GcNetMicroChart :station="station2"
                      :apiUrl="station2.envidatConfig.wrongProperty"
                      :fallbackUrl="station2.envidatConfig.wrongProperty"
                      :parameter="station2.envidatConfig.graphParameter"
                      :image="station2.envidatConfig.previewImageUrl"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 2 GcNetMicroChart api url
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GcNetMicroChart :station="station2"
                      :apiUrl="station2.envidatConfig.apiUrl"
                      :fallbackUrl="station2.envidatConfig.fallbackUrl"
                      :parameter="station2.envidatConfig.graphParameter"
                      :image="station2.envidatConfig.previewImageUrl"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 3 GcNetMicroChart
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <GcNetMicroChart :station="station3"
                      :apiUrl="station3.envidatConfig.apiUrl"
                      :fallbackUrl="station3.envidatConfig.fallbackUrl"
                      :parameter="station3.envidatConfig.graphParameter"
                      :image="station3.envidatConfig.previewImageUrl"
                      />
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
    station3() {
      return this.stations[2];
    },
  },
  methods: {
    // stationImg(alias) {
    //   return this.cardImgs[`./${alias}.jpg`];
    // },
  },
  data: () => ({
    stations,
  }),
});
*/
