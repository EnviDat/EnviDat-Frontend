<template>
  <h1>Dataset {{ data.name }}</h1>

  <div>
    {{ data.notes }}
  </div>
</template>

<script setup lang='ts'>
  import { useData } from 'vike-vue/useData'
  import { DatasetDTO } from '@/types/modelTypes';

  const data = useData<DatasetDTO>()
</script>
