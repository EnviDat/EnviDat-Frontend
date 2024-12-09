<script setup>
import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';
import { markRaw, onMounted, ref } from 'vue';
import store from '@/store/store';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import {
  enhanceDatasetWithResearchUnit,
  getOrgaDatasetMap,
  getOrganizationMap,
  getOrganizationTree,
  getResearchUnitDatasetSeries,
  researchUnitDatasetChartOptions,
} from '@/factories/organizationFactory';

import researchUnits from '@/../public/researchUnits.json';
import BarChart from '@/components/Charts/BarChart.vue';
import OrganizationTree from '@/modules/user/components/OrganizationTree.vue';

const orgaStore = useOrganizationsStore();
  const orgas = ref();
  const orgaDatasetsMap = ref();
  const data = ref({
    labels: [],
    datasets: [],
  });

  const loading = ref(true);
  const organizationsTree = ref();

  const options = researchUnitDatasetChartOptions;

  const loadOrgaDatasets = () => {
    const allDatasets = store.getters[`${METADATA_NAMESPACE}/allMetadatas`];

    const enhancedDatasets = enhanceDatasetWithResearchUnit(markRaw(allDatasets), researchUnits);

    return getOrgaDatasetMap(enhancedDatasets, true);
  }

  onMounted(async () => {
    orgas.value = await orgaStore.loadAllOrganizations();

    // const tree = getOrganizationMap(orgas.value);
    // console.log(tree);

    orgaDatasetsMap.value = loadOrgaDatasets();

    data.value = getResearchUnitDatasetSeries(orgaDatasetsMap.value);

    const orgaMap = getOrganizationMap(orgas.value);

    organizationsTree.value = getOrganizationTree(orgaMap);
    loading.value = false;
  })

</script>

<template>
  <v-container fluid class="pa-0">

    <v-row no-gutters>
      <v-col >
        <v-card
          v-show="loading"
          title="Loading Reserach Unit Dataset Chart"
          :height="600">

          <v-row justify="center"
                 align="center"
                 class="fill-height">
            <v-col class="flex-grow-0">
              <v-progress-circular indeterminate />
            </v-col>
          </v-row>

        </v-card>

        <BarChart
          v-if="!loading"
          id="DatasetBarChart"
          :height="600"
          :data
          :options
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col>

        <OrganizationTree
          :organizationsTree
        />

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
