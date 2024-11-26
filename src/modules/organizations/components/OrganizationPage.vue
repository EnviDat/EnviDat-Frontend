<script setup>
  import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';
  import { computed, onMounted, ref } from 'vue';
  import store from '@/store/store';
  import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

  const orgaStore = useOrganizationsStore();
  const orgas = ref();

  const orgaDatasetsMap = ref();

  const getYearDatasetMap = (datasets) => {

    const yearMap = new Map();

    for (const dSet of datasets) {

      let year = JSON.parse(dSet.publication).publication_year;
      if (typeof year === 'number') {
        year = year.toString()
      }

      if (yearMap.has(year)) {
        const dList = yearMap.get(year);
        dList.push(dSet);
      } else {
        yearMap.set(year, [dSet]);
      }
    }

    return yearMap;
  }

  const loadOrgaDatasets = async () => {
    const datasetMap = new Map();
    const allDatasets = store.getters[`${METADATA_NAMESPACE}/allMetadatas`];

    for (let i = 0; i < allDatasets.length; i++) {
      const dataset = allDatasets[i];

      // const key = dataset?.owner_org || dataset?.organization.id;
      const key = dataset.organization.title;

      if (key) {
        const orgaDatasets = datasetMap.get(key);
        if (orgaDatasets) {

          orgaDatasets.count += 1
          orgaDatasets.datasets.push(dataset);
        } else {
          datasetMap.set(key, {
            count: 1,
            datasets: [dataset],
          });
        }
      }
    }

    const keys = datasetMap.keys();

    for (const k of keys) {
      const orga = datasetMap.get(k);
      const orgaDatasets = orga.datasets;
      orga.yearMap = getYearDatasetMap(orgaDatasets);
    }

    orgaDatasetsMap.value = datasetMap;
  }

  onMounted(async () => {
    const organizations = await orgaStore.loadAllOrganizations();
    orgas.value = organizations;

    await loadOrgaDatasets();
  })
  
  const orgaKeys = computed(() => orgaDatasetsMap.value?.keys());

</script>

<template>
  <v-container fluid>

    <v-row no-gutters>
      <v-col>
        organization Page content
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
  </v-container>
</template>

<style scoped>

</style>
