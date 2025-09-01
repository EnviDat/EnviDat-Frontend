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
  import { useData } from 'vike-vue/useData'
  import { DatasetDTO } from '@/types/dataTransferObjectsTypes';
  import { createCitation } from '@/factories/citationFactory';
  import { getSeoSanitizedDataset } from '../../seoConversions.ts';

  const data = useData<DatasetDTO>();
  const seoData = getSeoSanitizedDataset(data);

  const citation = createCitation(data);

//  console.log(`dataset ${data.name} has jsonld ${!!data.jsonLd}`);

/*
  const baseCanonicalUrl = import.meta.env.PUBLIC_ENV__VIKE_BASE_CANONICAL_URL;
  const canonicalUrl = data && data.name ? `${baseCanonicalUrl}/#/metadata/${data.name}` : baseCanonicalUrl;
*/

</script>
