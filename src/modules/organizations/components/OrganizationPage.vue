<script setup>
import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';
import { markRaw, onMounted, ref } from 'vue';
import store from '@/store/store';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import {
  enhanceDatasetWithResearchUnit,
  getOrgaDatasetMap,
  getOrganizationTree,
  organizationSeries,
} from '@/factories/organizationFactory';

import researchUnits from '@/../public/researchUnits.json';
import orgaMapProd from '@/../stories/testdata/orgaMapProd.json';

const orgaStore = useOrganizationsStore();
  const orgas = ref();
  const orgaDatasetsMap = ref();
  const ruChartDatasets = ref({
    labels: [],
    datasets: [],
  });

  const organiztionTree = ref();
  const search = ref(null);
  
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

    // const tree = getOrganizationMap(orgas.value);
    // console.log(tree);

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

    const organiztionMap = new Map();
    const orgaEntries = Object.values(orgaMapProd);
    orgaEntries.map((entry) => organiztionMap.set(entry.key, entry.value));
    
    organiztionTree.value = getOrganizationTree(organiztionMap);
  })

</script>

<template>
  <v-container fluid>

<!--
    <v-row no-gutters>
      <v-col >
        <DatasetBarChart
          :height="600"
          :data="ruChartDatasets"
          :options="ruChartOptions"
        />
      </v-col>
    </v-row>
-->

    <v-row>
      <v-col>

        <v-card>
          <v-sheet class="pa-4 bg-primary">
            <v-text-field
                v-model="search"
                label="Search Company Directory"
                clearable
                dark
                flat
                hide-details
                solo-inverted
            ></v-text-field>
<!--
            <v-checkbox
                v-model="caseSensitive"
                label="Case sensitive search"
                dark
                hide-details
            ></v-checkbox>
-->
          </v-sheet>

          <v-card-text>
            <v-treeview
                :items="organiztionTree"
                item-value="id"
                activatable
                color="secondary"
                open-on-click
                :search
            >
            </v-treeview>

          </v-card-text>
        </v-card>

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
