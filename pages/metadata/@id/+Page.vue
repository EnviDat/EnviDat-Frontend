<template>
  <div>
    <h1>Environmental Data: {{ seoData.title }}</h1>

    <div>
      <strong>Keywords:</strong>

      <div v-for="(keyword, index) in data.tags" :key="`${index}_keyword`">
        {{ keyword.name }}
      </div>
    </div>

    <div>
      <strong>Keywords:</strong>

      <div v-for="(keyword, index) in data.tags" :key="`${index}_keyword`">
        {{ keyword.name }}
      </div>
    </div>

    <div>
      <h2>Description</h2>
      <p>{{ seoData.notes }}</p>
    </div>

    <div>
      <h2>Citation</h2>

      <p v-html="citation?.citationText" />
    </div>

    <div>
      <h2>Resources</h2>
      <ul>
        <li v-for="(resource, index) in data.resources" :key="`${index}_resource`">
          <h3>{{ resource.name }}</h3>

          <p>{{ resource.description }}</p>

          <a :href="resource.url">{{ resource.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vike-vue/useData';
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
