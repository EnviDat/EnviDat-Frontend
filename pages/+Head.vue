<template>
  <link rel="icon" :href="logoUrl" />
  <link rel="canonical" :href="canonicalUrl" />

  <script type='application/javascript' v-html="`
    document.addEventListener('DOMContentLoaded', function () {
      if (!navigator.userAgent.includes('bot')) {
        window.location.href = '${redirectUrl}';
      }
    });
    `">
  </script>

  <title>{{ data.title }}</title>

  <meta property="og:title" :content="seoData.title" />

  <meta name="description" :content="seoData.notes" />
  <meta property="og:description" :content="seoData.notes" />

  <meta property="og:image" :content="logoUrl" />

  <script v-if="data.jsonLd"
          type='application/ld+json'
          v-html="JSON.stringify(data.jsonLd)">

  </script>

</template>
<script lang="ts" setup>
import { useData } from 'vike-vue/useData';
import { DatasetDTO } from '@/types/modelTypes';

import logoUrl from '@/assets/logo/EnviDat_fav.ico'
import { getSeoSanitizedDataset } from './seoConversions.ts';

const data = useData<DatasetDTO>()
const seoData = getSeoSanitizedDataset(data);


const baseCanonicalUrl = import.meta.env.PUBLIC_ENV__VIKE_BASE_CANONICAL_URL;
const datasetName = data?.name;
const canonicalUrl = datasetName ? `${baseCanonicalUrl}/metadata/${datasetName}` : baseCanonicalUrl;
const redirectUrl = datasetName ? `${baseCanonicalUrl}/#/metadata/${datasetName}` : baseCanonicalUrl;

</script>
