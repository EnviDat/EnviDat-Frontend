<script setup>
  import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';
  import { nextTick, onMounted, ref } from 'vue';
  import store from '@/store/store';
  import { METADATA_NAMESPACE, SET_DETAIL_PAGE_BACK_URL } from '@/store/metadataMutationsConsts';
  import {
    enhanceDatasetWithResearchUnit, getOraganizationsFromMap,
    getOrgaDatasetsMap,
    getOrganizationMap,
    getOrganizationTree,
    getResearchUnitDatasetSeries,
    researchUnitDatasetChartOptions,
  } from '@/factories/organizationFactory';
  
  import researchUnits from '@/../public/researchUnits.json';
  import BarChart from '@/components/Charts/BarChart.vue';
  import MetadataList from '@/components/MetadataList.vue';

  import OrganizationTree from '@/modules/user/components/OrganizationTree.vue';
  import organizations from '@/../public/testdata/organization_show.json';
  import { BROWSE_PATH, METADATADETAIL_PAGENAME } from '@/router/routeConsts';
  import { useRouter, useRoute } from 'vue-router';

  const router = useRouter();
  const route = useRoute();

  const orgaStore = useOrganizationsStore();
  const orgas = ref();
  const ruDatasetsMap = ref();
  const orgaDatasetsMap = ref();
  const data = ref(getResearchUnitDatasetSeries(undefined));
  const options = researchUnitDatasetChartOptions;

  const loading = ref(true);
  const organizationsTree = ref();

  const listContent = ref([]);

  const loadOrgaDatasets = () => {
    const allDatasets = store.getters[`${METADATA_NAMESPACE}/allMetadatas`];

    return enhanceDatasetWithResearchUnit(allDatasets, researchUnits);
  }

  const catchDatasetClick = (orgaTitle) => {
    router.options.additiveChangeRoute(route, router, BROWSE_PATH, orgaTitle,
      undefined, undefined, undefined, undefined);
  }

  const catchOrganizationClick = (orgaTitle) => {
    const orgaDataset = orgaDatasetsMap.value.get(orgaTitle).datasets;
    listContent.value = orgaDataset;
  }

  const catchMetadataClicked = (datasetname) => {
    this.$store.commit(`${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`, this.$route);

    this.$router.push({
      name: METADATADETAIL_PAGENAME,
      query: this.$route.query,
      params: {
        metadataid: datasetname,
      },
    });
  }

  onMounted(async () => {
    orgas.value = await orgaStore.loadAllOrganizations();

    // const tree = getOrganizationMap(orgas.value);
    // console.log(tree);

    const datasets = loadOrgaDatasets();
    ruDatasetsMap.value = getOrgaDatasetsMap(datasets, true);

    data.value = getResearchUnitDatasetSeries(ruDatasetsMap.value);

    nextTick(() => {
      const orgaMap = getOrganizationMap(orgas.value);

      // for local testing
      // const orgaMap = getOrganizationMap(organizations.result);

      orgaDatasetsMap.value = getOrgaDatasetsMap(datasets);

      organizationsTree.value = getOrganizationTree(orgaMap, orgaDatasetsMap.value);
    })

    loading.value = false;
  })

</script>

<template>
  <v-container fluid class="pa-0" style="scroll-behavior: auto; scrollbar-width: thin;">

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
          @click="catchOrganizationClick"
          @clickAppend="catchDatasetClick"
        />

      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <MetadataList
          ref="metadataList"
          :listContent="listContent"
          :mapFilteringPossible="false"
          @clickedCard="catchMetadataClicked"
          :searchCount="listContent.length"
          :showSearch="false"
          @setScroll="$emit('setScroll', $event)"
        />

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
