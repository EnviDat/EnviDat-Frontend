<script setup>
  import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';
  import { nextTick, onMounted, onBeforeMount, ref } from 'vue';

  import { METADATA_NAMESPACE, SET_DETAIL_PAGE_BACK_URL } from '@/store/metadataMutationsConsts';
  import {
    enhanceDatasetWithResearchUnit,
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
  import { BROWSE_PATH, METADATADETAIL_PAGENAME, ORGANIZATIONS_PAGENAME } from '@/router/routeConsts';
  import { SET_APP_BACKGROUND, SET_CURRENT_PAGE } from '@/store/mainMutationsConsts';
  import { useRouter, useRoute } from 'vue-router';
  import { useStore } from 'vuex';

  const router = useRouter();
  const route = useRoute();
  const store = useStore();
  const pageBGImage= 'app_b_browsepage';

  onBeforeMount(() => {
    store.commit(SET_CURRENT_PAGE, ORGANIZATIONS_PAGENAME);
    store.commit(SET_APP_BACKGROUND, pageBGImage);
  });

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
    const orgaDataset = orgaDatasetsMap.value.get(orgaTitle)?.datasets || [];
    listContent.value = orgaDataset;
  }

  const catchMetadataClicked = (datasetname) => {
    store.commit(`${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`, route);

    router.push({
      name: METADATADETAIL_PAGENAME,
      query: route.query,
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
        <v-card class="pa-4">
          <v-card-title class="px-0 pt-0">
            {{ `${loading ? 'Loading ' : ''}Research Unit Dataset Chart` }}
          </v-card-title>

          <v-card-text class="px-0">
            <v-row v-show="loading"
              justify="center"
              align="center"
              style="height: 600px;"
            >
              <v-col class="flex-grow-0">
                <v-progress-circular indeterminate />
              </v-col>
            </v-row>

            <BarChart
              v-if="!loading"
              id="DatasetBarChart"
              :height="600"
              :data
              :options
            />
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="pa-4">
          <v-card-title class="px-0 pt-0">
            List of Organizations in EnviDat
          </v-card-title>

          <v-card-text class="px-0">
            <OrganizationTree
              :organizationsTree
              @click="catchOrganizationClick"
              @clickAppend="catchDatasetClick"
            />
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="pa-4">
          <v-card-title class="px-0 pt-0">
            Datasets of the selected organization
          </v-card-title>

          <v-card-text class="px-0">
            <MetadataList
              ref="metadataList"
              :listContent="listContent"
              :mapFilteringPossible="false"
              @clickedCard="catchMetadataClicked"
              :searchCount="listContent.length"
              :showSearch="false"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>
