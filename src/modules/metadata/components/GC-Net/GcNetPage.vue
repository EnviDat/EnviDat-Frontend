<template>
  <v-container class="pa-0" fluid tag="article" id="GcNetPage">
    <v-row>
      <v-col>
        <DetailChartsList />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <!-- <GcNetMicroChart :station="station"
                      :image="stationImg(station.alias)"
                      :fileValueMapping="fileValueMapping"
                      :delay="index * 100"
                      @detailClick="(stationID) => { changeCurrentStation(stationID); }" /> -->

        <GcNetMicroChart />
      </v-col>

      <v-col>
        <DetailChart />
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

import DetailChart from '@/modules/metadata/components/GC-Net/GcNetDetailChart.vue';
import DetailChartsList from '@/modules/metadata/components/GC-Net/GcNetDetailChartsList.vue';
import GcNetMicroChart from '@/modules/metadata/components/GC-Net/GcNetMicroChart.vue';

export default {
  name: 'GcNetPage',
  beforeMount() {},
  mounted() {},
  beforeUnmount() {},
  computed: {
    // ...mapGetters({
    //   metadatasContent: `${METADATA_NAMESPACE}/metadatasContent`,
    //   metadatasContentSize: `${METADATA_NAMESPACE}/metadatasContentSize`,
    // }),
  },
  methods: {},
  components: {
    DetailChart,
    GcNetMicroChart,
    DetailChartsList,
  },
  data: () => ({}),
};
</script>

<style></style>
