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

  <script v-if="jsonLd"
          type='application/ld+json'
          v-html="JSON.stringify(jsonLd)">

  </script>

</template>
<script lang="ts" setup>
import { useData } from 'vike-vue/useData';
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';

import logoUrl from '@/assets/logo/EnviDat_fav.ico'
import { getSeoSanitizedDataset } from './seoConversions.ts';

const data = useData<DatasetDTO>()
const jsonLd = data?.jsonLd;
delete data.jsonLd;

const seoData = getSeoSanitizedDataset(data);


const baseCanonicalUrl = import.meta.env.PUBLIC_ENV__VIKE_BASE_CANONICAL_URL;
const datasetName = data?.name;

let canonicalUrl = `${baseCanonicalUrl}/metadata/${datasetName}`;
let redirectUrl = `${baseCanonicalUrl}/#/metadata/${datasetName}`;

if (!datasetName) {
  canonicalUrl = `${baseCanonicalUrl}/metadata`
  redirectUrl = `${baseCanonicalUrl}/#/browse`
}

</script>
