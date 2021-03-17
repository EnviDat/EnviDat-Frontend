/* eslint-disable object-property-newline */
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

/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue';
// import { action } from '@storybook/addon-actions';

import MicroChart from '@/modules/metadata/components/GC-Net/MicroChart';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

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
      previewImageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/95/Test_image.jpg',
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
      previewImageUrl: 'https://www.gstatic.com/webp/gallery/1.jpg',
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
      previewImageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/95/Test_image.jpg',
    },
  },
];

// export const methods = {
//   onCardClick: action('clicked on card'),
//   onTagClick: action('clicked on tag'),
// };

storiesOf('7 GC-Net Views / Charts', module)
.add('BaseStatusLabelView', () => ({
  components: { BaseStatusLabelView },
  template: `
  <v-col>

    <v-row>
      Empty BaseStatusLabelView
    </v-row>

    <v-row no-gutters class="py-1">
      <v-col style="border: solid 1px;" >
        <BaseStatusLabelView />
      </v-col>
    </v-row>
    
    <v-row>
      Loading BaseStatusLabelView
    </v-row>

    <v-row no-gutters class="py-1">
      <v-col style="border: solid 1px;" >
        <BaseStatusLabelView :loading="true" />
      </v-col>
    </v-row>

    <v-row>
      Info BaseStatusLabelView
    </v-row>

    <v-row no-gutters class="py-1">
      <v-col style="border: solid 1px;" >
        <BaseStatusLabelView :loading="false"
                              statusIcon="info"
                              statusColor="info"
                              statusText="Here you see a info title"
                              expandedText="Here you see more details about the info" />
      </v-col>
    </v-row>

    <v-row>
      Warning BaseStatusLabelView
    </v-row>

    <v-row no-gutters class="py-1">
      <v-col style="border: solid 1px;" >
        <BaseStatusLabelView :loading="false"
                              statusIcon="warning"
                              statusColor="warning"
                              statusText="Warning Title Here"
                              expandedText="Some longer text about the details of the warning" />
      </v-col>
    </v-row>

    <v-row>
      Error BaseStatusLabelView
    </v-row>

    <v-row no-gutters class="py-1">
      <v-col style="border: solid 1px;" >
        <BaseStatusLabelView :loading="false"
                              statusIcon="error"
                              statusColor="error"
                              statusText="Error title message"
                              expandedText="Details about the error probably with a stack of the coder and it will be very long and not meant to be seen be the users that's why you need to catch the error and return a meaningfull text for the users" />
      </v-col>
    </v-row>

  </v-col>
  `,
  computed: {
  },
  methods: {
  },
  data: () => ({
  }),
}))
.add('MicroChart', () => ({
    components: { MicroChart },
    template: `
    <v-col>
    <!--
      <v-row>
        Empty MicroChart
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <MicroChart />
        </v-col>
      </v-row>
      -->

      <v-row>
        Station 1 MicroChart with test image
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <MicroChart :station="station1"
                      :apiUrl="station1.envidatConfig.apiUrl"
                      :fallbackUrl="station1.envidatConfig.fallbackUrl"
                      :parameter="station1.envidatConfig.graphParameter"
                      :image="station1.envidatConfig.previewImageUrl"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 1 MicroChart without image
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <MicroChart :station="station1"
                      :apiUrl="station1.envidatConfig.apiUrl"
                      :fallbackUrl="station1.envidatConfig.fallbackUrl"
                      :parameter="station1.envidatConfig.graphParameter"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 2 MicroChart with only fallback url
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <MicroChart :station="station2"
                      :apiUrl="station2.envidatConfig.wrongProperty"
                      :fallbackUrl="station2.envidatConfig.fallbackUrl"
                      :parameter="station2.envidatConfig.graphParameter"
                      :image="station2.envidatConfig.previewImageUrl"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 1 MicroChart with a wrong image url
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <MicroChart :station="station1"
                      :apiUrl="station1.envidatConfig.apiUrl"
                      :fallbackUrl="station1.envidatConfig.fallbackUrl"
                      :parameter="station1.envidatConfig.graphParameter"
                      image="somewrongurl"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 2 MicroChart with errors
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <MicroChart :station="station2"
                      :apiUrl="station2.envidatConfig.wrongProperty"
                      :fallbackUrl="station2.envidatConfig.wrongProperty"
                      :parameter="station2.envidatConfig.graphParameter"
                      :image="station2.envidatConfig.previewImageUrl"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 2 MicroChart api url
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <MicroChart :station="station2"
                      :apiUrl="station2.envidatConfig.apiUrl"
                      :fallbackUrl="station2.envidatConfig.fallbackUrl"
                      :parameter="station2.envidatConfig.graphParameter"
                      :image="station2.envidatConfig.previewImageUrl"
                      />
        </v-col>
      </v-row>

      <v-row>
        Station 3 MicroChart
      </v-row>

      <v-row class="py-3" >
        <v-col >
          <MicroChart :station="station3"
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
    beforeMount() {
      // const imgs = require.context('@/assets/stations/small', false, /\.jpg$/);
      // const imgCache = {};
  
      // imgs.keys().forEach((key) => {
      //   imgCache[key] = imgs(key);
      // });
  
      // this.cardImgs = imgCache;
    },
    methods: {
      // stationImg(alias) {
      //   return this.cardImgs[`./${alias}.jpg`];
      // },
    },
    data: () => ({
      stations,
    }),
  }));
