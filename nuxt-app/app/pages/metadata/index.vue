<template>
  <div>
    <h1>Datasets</h1>

    <div v-for="dataset in datasets"
         :key='dataset.id'
          >

      <h2>{{ dataset.title }}</h2>

      <a :href="`${baseCanonicalUrl}/metadata/${dataset.name}`">
        {{ dataset.title }}
      </a>
    </div>

  </div>
</template>

<script setup lang="ts">
  const config = useRuntimeConfig();
  import { loadCachedDatasetMap } from '@/utils';

  const datasetMap = await loadCachedDatasetMap();
  const datasets = datasetMap ? Array.from(datasetMap.values()) : [];
  const baseCanonicalUrl = config.public.seoBaseCanonicalUrl;

  // const canonicalUrl = data && data.name ? `${baseCanonicalUrl}/#/metadata/${data.name}` : baseCanonicalUrl;

</script>

<style scoped>
</style>
