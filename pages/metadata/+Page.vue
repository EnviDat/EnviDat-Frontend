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
  import { useData } from 'vike-vue/useData'
  import { DatasetDTO } from '@/types/modelTypes';

  const data = useData<DatasetDTO>();
  const datasets = Object.values(data);

  const baseCanonicalUrl = import.meta.env.PUBLIC_ENV__VIKE_BASE_CANONICAL_URL;

  // const canonicalUrl = data && data.name ? `${baseCanonicalUrl}/#/metadata/${data.name}` : baseCanonicalUrl;

</script>

<style scoped>
</style>
