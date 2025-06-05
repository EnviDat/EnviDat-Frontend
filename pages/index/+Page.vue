<template>
  <div>
    <h1>EnviDat Environmental Data Portal of WSL</h1>

    <h2>Datasets</h2>

    <a v-for="dataset in datasets"
          :key='dataset.id'
          :href="`${baseCanonicalUrl}metadata/${dataset.name}`" >
      {{ dataset.title }}
    </a>

  </div>
</template>

<script setup lang="ts">

import { useData } from 'vike-vue/useData'
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';

const data = useData<DatasetDTO>()
const datasets = Object.values(data);

const baseCanonicalUrl = import.meta.env.PUBLIC_ENV__VIKE_BASE_CANONICAL_URL;
// const canonicalUrl = data && data.name ? `${baseCanonicalUrl}#/metadata/${data.name}` : baseCanonicalUrl;

</script>

<style scoped>
</style>
