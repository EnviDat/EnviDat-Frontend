<script setup>
import { mdiEarth } from '@mdi/js';
import { useRoute, useRouter } from 'vue-router';
import { computed, nextTick, onBeforeMount, onMounted, ref } from 'vue';
import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';

import {
  METADATA_NAMESPACE,
  SET_DETAIL_PAGE_BACK_URL,
} from '@/store/metadataMutationsConsts';
import {
  enhanceDatasetWithResearchUnit,
  getOrgaDatasetsMap,
  getOrganizationRelationMap,
  getOrganizationTree,
  getResearchUnitDatasetSeries,
  getTopOraganizations,
  researchUnitDatasetChartOptions,
} from '@/factories/organizationFactory';

import BarChart from '@/components/Charts/BarChart.vue';
import MetadataList from '@/components/MetadataList.vue';
import BaseIconCountView from '@/components/BaseElements/BaseIconCountView.vue';
import OrganizationTree from '@/modules/user/components/OrganizationTree.vue';

// import organizations from '@/../public/testdata/organization_show.json';
import researchUnits from '@/../public/researchUnits.json';
// import metadatas from '@/../public/packagelist.json';
import {
  METADATADETAIL_PAGENAME,
  ORGANIZATIONS_PAGENAME,
} from '@/router/routeConsts';
import { SET_CURRENT_PAGE } from '@/store/mainMutationsConsts';
import store from '@/store/store';

const router = useRouter();
const route = useRoute();

onBeforeMount(() => {
  store.commit(SET_CURRENT_PAGE, ORGANIZATIONS_PAGENAME);
});

const orgaStore = useOrganizationsStore();
const orgaDatasetsMap = ref();
const data = ref(getResearchUnitDatasetSeries(undefined));
const options = researchUnitDatasetChartOptions;

const loading = ref(true);
const organizationsTree = ref();

const enhancedResearchUnitDatasets = () => {
  // const allDatasets = metadatas.result;
  const allDatasets = store.getters[`${METADATA_NAMESPACE}/allMetadatas`];

  return enhanceDatasetWithResearchUnit(allDatasets, researchUnits);
};

const catchOrganizationClick = (orgaName) => {
  router.push({
    name: ORGANIZATIONS_PAGENAME,
    query: route.query,
    params: {
      organization: orgaName,
    },
  });
};

const catchMetadataClicked = (datasetname) => {
  store.commit(`${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`, route);

  router.push({
    name: METADATADETAIL_PAGENAME,
    query: route.query,
    params: {
      metadataid: datasetname,
    },
  });
};

const listContent = computed(() => {
  const orgaName = route?.params?.organization;

  if (!orgaName || !orgaDatasetsMap.value) {
    return [];
  }

  return orgaDatasetsMap.value.get(orgaName)?.datasets || [];
});

onMounted(async () => {
  // const orgas = organizations.result;
  let orgas = orgaStore.organizations;

  if (orgaStore.organizations?.length <= 0) {
    orgas = await orgaStore.loadAllOrganizations();
  }

  const datasets = enhancedResearchUnitDatasets();
  const ruDatasetsMap = getOrgaDatasetsMap(datasets, true);
  data.value = getResearchUnitDatasetSeries(ruDatasetsMap);

  nextTick(() => {
    const orgaMap = getOrganizationRelationMap(orgas);
    const topOrgas = getTopOraganizations(orgas);
    orgaDatasetsMap.value = getOrgaDatasetsMap(datasets);
    organizationsTree.value = getOrganizationTree(
      topOrgas,
      orgaMap,
      orgaDatasetsMap.value,
    );
  });

  loading.value = false;
});
</script>

<template>
  <v-container
    fluid
    class="pa-0"
    style="scroll-behavior: auto; scrollbar-width: thin"
  >
    <v-row no-gutters>
      <v-col>
        <v-card class="pa-4">
          <v-card-title class="px-0 pt-0">
            {{ `${loading ? 'Loading ' : ''}Research Unit Dataset Chart` }}
          </v-card-title>

          <v-card-text class="pa-0">
            <v-row
              v-show="loading"
              justify="center"
              align="center"
              style="height: 600px"
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
            >
              <template v-slot:append="{ item }">
                <v-col> Datasets published </v-col>
                <v-col class="flex-grow-0">
                  <BaseIconCountView
                    class="ma-0"
                    :icon="mdiEarth"
                    :count="item.datasetCount"
                  />
                </v-col>
              </template>
            </OrganizationTree>
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

<style scoped></style>
