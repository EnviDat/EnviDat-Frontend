<template>
  <link rel="icon" :href="logoUrl" />
  <link rel="canonical" :href="canonicalUrl" />

  <script type='application/javascript' v-html="`
    document.addEventListener('DOMContentLoaded', function () {
      if (!navigator.userAgent.includes('bot')) {
        window.location.href = '${canonicalUrl}';
      }
    });
    `">
  </script>

  <title>{{ data.title }}</title>

  <meta property="og:title" :content="data.title" />

  <meta name="description" :content="data.notes" />
  <meta property="og:description" :content="data.notes" />

  <meta property="og:image" :content="logoUrl" />

<!--
  <img :src v-bind="otherAttrs" />
-->

  <script v-if="data.jsonLd"
          type='application/ld+json'
          v-html="JSON.stringify(data.jsonLd)">

  </script>

</template>

<script lang="ts" setup>
import { useData } from 'vike-vue/useData';
import { DatasetDTO } from '@/types/modelTypes';

import logoUrl from '@/assets/logo/EnviDat_fav.ico'

const data = useData<DatasetDTO>()


const baseCanonicalUrl = import.meta.env.PUBLIC_ENV__VIKE_BASE_CANONICAL_URL;
const canonicalUrl = data && data.name ? `${baseCanonicalUrl}#/metadata/${data.name}` : baseCanonicalUrl;

</script>
