<template>
  <v-container class="fill-height pa-0" fluid
                >

    <v-row   >

      <v-col cols="12" offset-md="4">
        <p v-html="homeInfos.smallInfo"></p>
      </v-col>

      <v-col cols="12" sm="3">
        <stations-map @mapClick="mapStationClick" />
      </v-col>

      <v-col v-if="!visible"
              cols="12" sm="9">
        <v-row   justify="center">
          <v-col 
                  class="title shrink">
            Loading MicroCharts...
          </v-col>
        </v-row>
      </v-col>

      <v-col v-if="visible"
              cols="12" sm="9" >
        <v-row  >

          <!-- <v-flex xs12 md4 lg3>
            <micro-chart :station="stations[0]"
                          :JSONUrls="getJSONUrls(stations[0])"
                          :fileValueMapping="fileValueMapping"
                          @detailClick="(stationID) => { changeCurrentStation(stationID); }" />
          </v-flex> -->

          <v-col v-for="(station, index) in stations"
                  :key="`${station.id}_${station.alias}`"
                  cols="12" md="4" lg="3">
            <micro-chart :station="station"
                          :image="stationImg(station.alias)"
                          :fileValueMapping="fileValueMapping"
                          :delay="index * 100"
                          @detailClick="(stationID) => { changeCurrentStation(stationID); }" />
          </v-col>

                          <!-- :JSONUrls="getJSONUrls(station)" -->

        </v-row>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
// import StationsMap from '@/components/StationsMap';
// import MicroChart from '@/components/MicroChart.vue';
import homeInfos from './homeInfos';
// import * as am4core from "@amcharts/amcharts4/core";
// am4core.options.queue = true;

export default {
  name: 'StationOverviewPage',
  props: {
  },
  components: {
    // MicroChart,
    // StationsMap,
  },
  data: () => ({
    homeInfos,
    baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURLTestdata: './testdata/',
    visible: false,
    initialDelay: 1500,
    fileValueMapping: {
      // only use one single file and parameter for the microCharts
      temp: ['AirTC1'],
    },
    cardImgs: {},
  }),
  computed: {
    stations() {
      return this.$store.getters.overviewStations;
    },
  },
  beforeMount() {
    const imgs = require.context('@/assets/cards', false, /\.jpg$/);
    const imgCache = {};

    imgs.keys().forEach((key) => {
      imgCache[key] = imgs(key);
    });

    this.cardImgs = imgCache;
  },
  mounted() {
    let that = this;

    setTimeout(() => {
      that.visible = true;
      that = null;
    }, this.initialDelay);
  },
  beforeDestroy() {
    this.clearCharts();
  },
  methods: {
    clearCharts() {
      // am4core.unuseAllThemes();
      // console.log('disposeAllCharts via OverviewPage');
      // am4core.disposeAllCharts();
    },
    mapStationClick(stationUrl) {
      const splits = stationUrl.split('/');

      if (splits.length > 0) {
        const stationName = splits[splits.length - 1];
        this.changeCurrentStation(stationName);
      }
    },
    changeCurrentStation(newStation) {
      this.$router.push({ path: `/station/${newStation}` });
      this.$emit('detailClick', newStation);
    },
    getJSONUrls(station) {
      const dataURLs = []; const 
recentDataURLs = [];
      const keys = Object.keys(this.fileValueMapping);

      for (let i = 0; i < keys.length; i++) {
        const prefix = keys[i];
        const fileName = `${station.id}${prefix}.json`;
        const recentFileName = `${station.id}${prefix}_v.json`;
        const baseUrl = process.env.NODE_ENV === 'production' ? this.baseStationURL : this.baseStationURLTestdata;

        // add the timestamp to prevent server side caching
        // const url = `${baseUrl}${fileName}?t=${Date.now()}`;
        const url = `${baseUrl}${fileName}`;
        dataURLs.push({ fileType: prefix, url });

        // const recentUrl = `${baseUrl}${recentFileName}?t=${Date.now()}`;
        const recentUrl = `${baseUrl}${recentFileName}`;
        recentDataURLs.push({ fileType: prefix, url: recentUrl });
      }

      return {
        dataURLs,
        recentDataURLs,
      };
    },
    stationImg(alias) {
      return this.cardImgs[`./${alias}.jpg`];
    },
  },
};
</script>

<style scoped>

</style>
