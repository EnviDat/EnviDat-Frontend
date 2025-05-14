<template>
  <div>
    <h1>Dataset {{ data.name }}</h1>

    <div>
      {{ data.notes }}
    </div>

    <div v-html="citation?.citationText" />

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
  import { DatasetDTO } from '@/types/modelTypes';
  import { createCitation } from '@/factories/citationFactory';

  const data = useData<DatasetDTO>();

  const citation = createCitation(data);

//  console.log(`dataset ${data.name} has jsonld ${!!data.jsonLd}`);

/*
  const baseCanonicalUrl = import.meta.env.PUBLIC_ENV__VIKE_BASE_CANONICAL_URL;
  const canonicalUrl = data && data.name ? `${baseCanonicalUrl}#/metadata/${data.name}` : baseCanonicalUrl;
*/

</script>
