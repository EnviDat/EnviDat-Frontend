<template>
  <div>
    <h1>{{ data.title }}</h1>

    <a :href="`/metadata/${data.name}`" >{{ data.name }}</a>
  </div>
</template>

<script setup lang="ts">

import { useData } from 'vike-vue/useData'
import { DatasetDTO } from '@/types/modelTypes';

const data = useData<DatasetDTO>()
</script>

<style scoped>
</style>
