<template>
  <v-container fluid class="fill-height pa-0" id="MicroChartList">
    <v-row no-gutters>
      <v-col
        v-for="station in stations"
        :key="`${station.id}_${station.alias}`"
        class="pa-2"
        cols="12"
        sm="6"
      >
        <GcNetMicroChart
          :station="station"
          :image="station.envidatConfig.previewImageUrl"
          :apiUrl="station.envidatConfig.apiUrl"
          :fallbackUrl="station.envidatConfig.fallbackUrl"
          :downloadAllUrl="downloadAllUrl(station)"
          :parameter="station.envidatConfig.graphParameter"
          :chartHeight="45"
          @detailClick="
            stationID => {
              changeCurrentStation(stationID);
            }
          "
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

import GcNetMicroChart from '@/modules/metadata/components/GC-Net/GcNetMicroChart.vue';

export default {
  name: 'MicroChartList',
  props: {
    stationConfig: Array,
  },
  components: {
    GcNetMicroChart,
  },
  computed: {
    ...mapState(['config']),
    stations() {
      const stations = [];

      if (this.stationConfig) {
        for (let i = 0; i < this.stationConfig.length; i++) {
          const station = this.stationConfig[i];
          stations.push(station);
        }
      }

      return stations;
    },
    metadataConfig() {
      return this.config?.metadataConfig || {};
    },
  },
  // beforeMount() {
  // },
  mounted() {},
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
    downloadAllUrl(currentStation) {
      if (this.metadataConfig?.resourcesConfig?.downloadActive === false) {
        return '';
      }

      return (
        currentStation?.envidatConfig?.downloadAllUrl ||
        `https://www.envidat.ch/data-api/gcnet/nead/${currentStation?.aliasApi}/end/empty/`
      );
    },
  },
  data: () => ({
    cardImgs: {},
  }),
};
</script>

<style scoped></style>
