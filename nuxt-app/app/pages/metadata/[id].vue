<template>
  <div>
    <h1>Environmental Data: {{ seoData.title }}</h1>

    <div>
      <h2>Description</h2>
      <div>{{ seoData.notes }}</div>
    </div>

    <div>
      <h2>Citation</h2>

      <div v-html="citation?.citationText" />
    </div>

    <div>
      <h2>Resources</h2>
      <div v-for="(resource, index) in data.resources"
           :key="index">
      >
        <div>{{ resource.name }}</div>
        <div>{{ resource.description }}</div>

        <a :href='resource.url'>{{ resource.name }}</a>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
  const config = useRuntimeConfig();
  import { useRoute } from 'vue-router';
  import { createCitation, loadCachedDatasetMap, getSeoSanitizedDataset } from '@/utils';

  const route = useRoute();
  const id = route.params.id as string;
  console.log('get data for', id);
  
  const datasetMap = await loadCachedDatasetMap();

  console.log('datasetMap', datasetMap?.size);

  const dataset = datasetMap?.get(id);
  const seoData = dataset ? getSeoSanitizedDataset(dataset) : {};

  const citation = dataset ? createCitation(dataset) : {};

//  console.log(`dataset ${data.name} has jsonld ${!!data.jsonLd}`);

  // console.log('config', config);

  const baseCanonicalUrl = config.public.seoBaseCanonicalUrl;

/*
  const baseCanonicalUrl = import.meta.env.PUBLIC_ENV__VIKE_BASE_CANONICAL_URL;
  const canonicalUrl = data && data.name ? `${baseCanonicalUrl}/#/metadata/${data.name}` : baseCanonicalUrl;
*/

</script>
