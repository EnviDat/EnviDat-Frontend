<script setup lang="ts">
import { usePageContext } from 'vike-vue/usePageContext';

const pageContext = usePageContext();

const queryString = pageContext.urlOriginal?.split('?')[1];

const datasetUrl = queryString || '';

</script>

<template>
  <div>

    <h1>Site Not Found</h1>

    <div>Did you want to go to </div>
    <div>{{ datasetUrl }}</div>

  </div>
</template>

<style scoped>

</style>
