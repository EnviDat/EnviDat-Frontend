<script setup lang="ts">
import { mdiEarth } from '@mdi/js';
import { useRoute, useRouter } from 'vue-router';
import { computed, ComputedRef, nextTick, onMounted, ref, watch } from 'vue';
import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';

import {
  METADATA_NAMESPACE,
  SET_DETAIL_PAGE_BACK_URL,
} from '@/store/metadataMutationsConsts';
import {
  enhanceDatasetWithResearchUnit,
  getOrgaDatasetsMap,
  getOrganizationFromRelationMap,
  getOrganizationRelationMap,
  getOrganizationTree,
  getResearchUnitDatasetSeries,
  getTopOrganizations,
  organizationDatasetHistoryOptions,
  researchUnitDatasetChartOptions,
} from '@/factories/organizationFactory';

import BarChart from '@/components/Charts/BarChart.vue';
import MetadataList from '@/components/MetadataList.vue';
import BaseIconCountView from '@/components/BaseElements/BaseIconCountView.vue';
import OrganizationTree from '@/modules/user/components/OrganizationTree.vue';

import researchUnits from '@/../public/researchUnits.json';

import {
  METADATADETAIL_PAGENAME,
  ORGANIZATIONS_PAGENAME,
} from '@/router/routeConsts';
import store from '@/store/store';
import { DatasetOrganizationMapEntry } from '@/types/modelTypes';

const router = useRouter();
const route = useRoute();

const orgaStore = useOrganizationsStore();
const orgaDatasetsMap = ref<Map<string, DatasetOrganizationMapEntry>>();
const orgaRelationMap = ref();

const ruDataSeries = ref({
  labels: [],
  datasets: [],
});
const orgaDataseries = ref({
  labels: [],
  datasets: [],
});
const researchUnitChartOptions = researchUnitDatasetChartOptions;

const loading = ref(true);
const organizationsTree = ref();

const enhancedResearchUnitDatasets = () => {
  // const allDatasets = metadatas.result;
  const allDatasets = store.getters[`${METADATA_NAMESPACE}/allMetadatas`];

  return enhanceDatasetWithResearchUnit(allDatasets, researchUnits);
};

const catchOrganizationClick = (orgaName : string) => {
  router.push({
    name: ORGANIZATIONS_PAGENAME,
    query: route.query,
    params: {
      organization: orgaName,
    },
  });
};

const catchMetadataClicked = (datasetName: string) => {
  store.commit(`${METADATA_NAMESPACE}/${SET_DETAIL_PAGE_BACK_URL}`, route);

  router.push({
    name: METADATADETAIL_PAGENAME,
    query: route.query,
    params: {
      metadataid: datasetName,
    },
  });
};

const selectedOrgaName : ComputedRef<string> = computed(() => route?.params?.organization) as ComputedRef<string>;

const selectedOrganization = computed(() => getOrganizationFromRelationMap(selectedOrgaName.value, orgaRelationMap.value));

const datasetListTitle = computed(() => {
  const organEntry = selectedOrganization.value;
  return `Datasets of ${organEntry ? organEntry.title : 'the "selected organization"'}`;
});

const listContent = computed(() => {
  const orgaName = selectedOrgaName.value;

  if (!orgaName || !orgaDatasetsMap.value) {
    return [];
  }

  return orgaDatasetsMap.value.get(orgaName)?.datasets || [];
});

/*
const orgaHistoryOptions = computed(() => {
  const defaultOptions = organizationDatasetHistoryOptions;
/!*
  const currentOrga = selectedOrganization.value;

  defaultOptions.plugins.title.text = `Dataset Publication History ${currentOrga ? `of ${currentOrga.title}` : ''}`;
*!/
  return defaultOptions;
})
*/


const getPredefinedSearch = () : string => {
  const orgFromUrl = route?.params?.organization as string;

  if (!orgFromUrl) {
    return undefined;
  }

  return orgFromUrl.replaceAll('-', ' ');
};

const loadOrganizationDatasetSeries = (orgaName : string) => {
  if (!orgaDatasetsMap.value) {
    return;
  }

  const datasetEntry = orgaDatasetsMap.value.get(orgaName);

  if (!orgaName || !datasetEntry || datasetEntry.count <= 0) {
    orgaDataseries.value = undefined;
    return;
  }

  orgaDataseries.value = getResearchUnitDatasetSeries(new Map([[orgaName, datasetEntry]]))
}


onMounted(async () => {
  // const orgas = organizations.result;
  let orgas = orgaStore.organizations;

  if (orgaStore.organizations?.length <= 0) {
    orgas = await orgaStore.loadAllOrganizations();
    orgaRelationMap.value = getOrganizationRelationMap(orgas);
  }

  const datasets = enhancedResearchUnitDatasets();
  const ruDatasetsMap = getOrgaDatasetsMap(datasets, true);
  ruDataSeries.value = getResearchUnitDatasetSeries(ruDatasetsMap);

  await nextTick(() => {
    const topOrgas = getTopOrganizations(orgas);

    orgaDatasetsMap.value = getOrgaDatasetsMap(datasets);
    organizationsTree.value = getOrganizationTree(
      topOrgas,
      orgaRelationMap.value,
      orgaDatasetsMap.value,
    );
  });

  loading.value = false;

  loadOrganizationDatasetSeries(selectedOrgaName.value)
});


watch(() => route,
  () => {
    loadOrganizationDatasetSeries(selectedOrgaName.value)
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <v-container
    fluid
    class="pa-0"
    style="scroll-behavior: auto; scrollbar-width: thin"
  >
    <v-row >
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
              :data="ruDataSeries"
              :options="researchUnitChartOptions"
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

          <v-card-text>
            <v-row >
              <v-col cols="8">
                <OrganizationTree
                  :predefinedSearch="getPredefinedSearch()"
                  :organizationsTree
                  @click="catchOrganizationClick"
                >
                  <template v-slot:append="{ item }">
                    <v-col> Datasets published </v-col>
                    <v-col class="flex-grow-0">
                      <BaseIconCountView
                        class="ma-0"
                        :icon="mdiEarth"
                        :count="
                          item?.datasetCount + item?.childDatasetsCount || 0
                        "
                      />
                    </v-col>
                  </template>
                </OrganizationTree>
              </v-col>

              <v-col cols="4">
                <BarChart
                  id="DatasetBarChart"
                  :height="600"
                  :data="orgaDataseries"
                  :options="organizationDatasetHistoryOptions"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="pa-4">
          <v-card-title class="px-0 pt-0">
            {{ datasetListTitle }}
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
