<template>
  <v-container fluid
                class="fill-height pa-0"
                id="MicroChartList" >

    <v-row no-gutters >

      <v-col v-for="station in stations"
              :key="`${station.id}_${station.alias}`"
              class="pa-2"
              cols="12"
              sm="6" >

        <MicroChart :station="station"
                    :image="station.envidatConfig.previewImageUrl"
                    :apiUrl="station.envidatConfig.apiUrl"
                    :fallbackUrl="station.envidatConfig.fallbackUrl"
                    :parameter="station.envidatConfig.graphParameter"
                    :chartHeight="45"
                    @detailClick="(stationID) => { changeCurrentStation(stationID); }" />
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import MicroChart from '@/modules/metadata/components/GC-Net/MicroChart';

export default {
  name: 'MicroChartList',
  props: {
    config: Array,
  },
  components: {
    MicroChart,
  },
  computed: {
    stations() {
      const stations = [];

      if (this.config) {
        for (let i = 0; i < this.config.length; i++) {
          const station = this.config[i];
          stations.push(station);
        }
      }

      return stations;
    },
  },
  // beforeMount() {
  //   const imgs = require.context('@/assets/stations/small', false, /\.jpg$/);
  //   const imgCache = {};

  //   imgs.keys().forEach((key) => {
  //     imgCache[key] = imgs(key);
  //   });

  //   this.cardImgs = imgCache;
  // },
  mounted() {
  },
  methods: {
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
  },
  data: () => ({
    cardImgs: {},
  }),
};
</script>

<style scoped>

</style>
