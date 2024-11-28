<script setup>
import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';
import { computed, onMounted, ref } from 'vue';
import store from '@/store/store';
import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';
import { getOrgaDatasetMap } from '@/factories/organizationFactory';

const orgaStore = useOrganizationsStore();
  const orgas = ref();

  const orgaDatasetsMap = ref();


  const loadOrgaDatasets = async () => {
    const allDatasets = store.getters[`${METADATA_NAMESPACE}/allMetadatas`];
    orgaDatasetsMap.value = getOrgaDatasetMap(allDatasets);
  }

  onMounted(async () => {
    orgas.value = await orgaStore.loadAllOrganizations();

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
