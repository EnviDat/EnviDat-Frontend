<script setup>
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';
  import { computed, markRaw, onMounted, ref } from 'vue';
  import store from '@/store/store';
  import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
  import {
    enhanceDatasetWithResearchUnit,
    getOrgaDatasetMap, getOrganizationMap,
    organizationSeries,
  } from '@/factories/organizationFactory';
  import DatasetBarChart from '@/components/Charts/DatasetBarChart.vue';

  import researchUnits from '@/../public/researchUnits.json';

  const orgaStore = useOrganizationsStore();
  const orgas = ref();
  const orgaDatasetsMap = ref();
  const ruChartDatasets = ref({
    labels: [],
    datasets: [],
  });

  const ruChartOptions = {
    plugins: {
      title: {
        display: true,
        text: 'Dataset Publication per Research Unit History',
      },
      legend: {
        position: 'bottom',
      },
      datalabels: {
        color: '#d9f3f3',
        textStrokeColor: '#222222',
        textStrokeWidth: 2,
      },
    },
    animations: {
      colors: 'show',
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  }

  const loadOrgaDatasets = () => {
    const allDatasets = store.getters[`${METADATA_NAMESPACE}/allMetadatas`];

    const enhancedDatasets = enhanceDatasetWithResearchUnit(markRaw(allDatasets), researchUnits);

    return getOrgaDatasetMap(enhancedDatasets, true);
  }

  onMounted(async () => {
    orgas.value = await orgaStore.loadAllOrganizations();

    const tree = getOrganizationMap(orgas.value);
    console.log(tree);

    orgaDatasetsMap.value = loadOrgaDatasets();

    const yearLables = new Set();
    for (const [orgaName, value] of orgaDatasetsMap.value) {
      const yearMap = value.yearMap;

      for (const year of yearMap.keys()) {
        yearLables.add(year);
      }
    }

    const yearsSorted = Array.from(yearLables).sort();

    const series = organizationSeries(orgaDatasetsMap.value, yearsSorted);

    ruChartDatasets.value = {
      labels: yearsSorted,
      datasets: series,
    };
  })

  const orgaKeys = computed(() => orgaDatasetsMap.value?.keys());

</script>

<template>
  <v-container fluid>

    <v-row no-gutters>
      <v-col >
        <DatasetBarChart
          :height="600"
          :data="ruChartDatasets"
          :options="ruChartOptions"
          :plugins="[ChartDataLabels]"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="(title, index) in orgaKeys"
        :key="index"
      >
        {{ title }} {{ orgaDatasetsMap?.get(title).count }}
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-treeview >

        </v-treeview>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
