<template>
  <div>
    <h1>Dataset {{ data.name }}</h1>

    <div>
      {{ data.notes }}
    </div>

    <div>
      <h2>Resources</h2>
      <div v-for="(resource, index) in data.resources"
           :key="index">
      >
        <div>{{ resource.title }}</div>

        <a :href='resource.url'>{{ resource.url }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
  import { useData } from 'vike-vue/useData'
  import { DatasetDTO } from '@/types/modelTypes';

  const data = useData<DatasetDTO>()
</script>
