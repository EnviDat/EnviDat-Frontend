<template>
  <v-container class="pa-0"
                fluid
                tag="article"
                id="GcNetPage" >

    <v-row>
      <v-col>
        <DetailChartsList />
      </v-col>
    </v-row>

    <v-row >
      <v-col >

        <!-- <MicroChart :station="station"
                      :image="stationImg(station.alias)"
                      :fileValueMapping="fileValueMapping"
                      :delay="index * 100"
                      @detailClick="(stationID) => { changeCurrentStation(stationID); }" /> -->

        <MicroChart />

      </v-col>

      <v-col >

        <DetailChart  />
                    <!-- :stationName="currentStation.name"
                    :chartId="chartId(fileObject.fileName)"
                    :valueFieldMapping="valueFieldMapping"
                    :preload="fileObject.preload"
                    :showDisclaimer="fileObject.showDisclaimer"
                    :convertLocalTime="convertLocalTime"
                    :key="fileObject.fileName + reRenderKey" -->

      </v-col>

    </v-row>


  </v-container>
</template>

<script>
/**
 * The GcNetPage shows the charts for testing
 *
 * @summary gc net page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:12:30
 * Last modified  : 2020-12-08 12:22:40
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */


import MicroChart from '@/modules/metadata/components/GC-Net/MicroChart';
import DetailChart from '@/modules/metadata/components/GC-Net/DetailChart';
import DetailChartsList from '@/modules/metadata/components/GC-Net/DetailChartsList';


export default {
  name: 'GcNetPage',
  beforeMount() {
  },
  mounted() {
  },
  beforeDestroy() {
  },
  computed: {
    // ...mapState([
    //   'config',
    // ]),
    // ...mapState(METADATA_NAMESPACE, [
    //   'extractingIds',
    //   'idsToResolve',
    //   'publicationsResolvingIds',
    //   'publicationsResolvedIds',
    // ]),
    // ...mapGetters({
    //   metadatasContent: `${METADATA_NAMESPACE}/metadatasContent`,
    //   metadatasContentSize: `${METADATA_NAMESPACE}/metadatasContentSize`,
    // }),
  },
  methods: {
  },
  components: {
    DetailChart,
    MicroChart,
    DetailChartsList,
  },
  data: () => ({
  }),
};
</script>

<style>

</style>
