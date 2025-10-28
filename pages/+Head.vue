<template>
  <link rel="icon" :href="logoUrl" />
  <link rel="canonical" :href="canonicalUrl" />

  <script type='application/javascript' v-if="isErrorPage"
    v-html="`
    document.addEventListener('DOMContentLoaded', function () {

      const queryString = window.location.href.split('?')[1];
      const baseUrl = '${baseCanonicalUrl}/#';

      if (queryString) {
        const urlQueryString = queryString.split('url=')[1];

        if (urlQueryString) {
          const url = urlQueryString.split('&')[0];
          if (url) {
            window.location.href = baseUrl + url;
            return;
          }
        } else {
          const firstQueryParameter = queryString.split('=')[1];

          if (firstQueryParameter) {
            window.location.href = '${baseCanonicalUrl}/#/browse?search=' + firstQueryParameter;
            return;
          }
        }
      }

      window.location.href = '${baseCanonicalUrl}/#/browse'
    });
    `">
  </script>

  <script type='application/javascript' v-if="!isErrorPage"
          v-html="`
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
import { usePageContext } from 'vike-vue/usePageContext';
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';

import logoUrl from '@/assets/logo/EnviDat_fav.ico'
import { getSeoSanitizedDataset } from './seoConversions.ts';

const data = useData<DatasetDTO | { jsonLd: object }>()
const jsonLd = data?.jsonLd;
delete data.jsonLd;

const seoData = getSeoSanitizedDataset(data);
const pageContext = usePageContext();

const isErrorPage = pageContext.is404

const baseCanonicalUrl = import.meta.env.PUBLIC_ENV__VIKE_BASE_CANONICAL_URL;
const datasetName = data?.name;

let canonicalUrl = `${baseCanonicalUrl}/metadata/${datasetName}`;
let redirectUrl = `${baseCanonicalUrl}/#/metadata/${datasetName}`;

if (jsonLd) {
  // overwrite for testing if the matching the jsonLd url with the canonical
  // to make sure google uses it to index the page. By now the jsonLd.url is still using /#/metadata/[dataset-id]
  jsonLd.url = canonicalUrl;
}

if (!datasetName) {
  canonicalUrl = `${baseCanonicalUrl}/metadata`
  redirectUrl = `${baseCanonicalUrl}/#/browse`
}

</script>
