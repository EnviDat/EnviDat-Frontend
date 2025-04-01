<template>
  <link rel="icon" :href="logoUrl" />
  <link v-if="canonicalUrl" rel="canonical" :href="canonicalUrl" />

  <title>{{ data.name }}</title>
  <meta property="og:title" :content="data.name">

  <meta name="description" :content="data.notes">
  <meta property="og:description" :content="data.notes">

  <meta property="og:image" :content="logoUrl">

</template>

<script lang="ts" setup>
import { useData } from 'vike-vue/useData';
import { usePageContext } from 'vike-vue/usePageContext'
import { PageContext } from 'vike/types'
import { DatasetDTO } from '@/types/modelTypes';

import logoUrl from '@/assets/logo/EnviDat_fav.ico'


const data = useData<DatasetDTO>()
const pageContext : PageContext = usePageContext()

function getCanonicalUrl(): null | string {
  // In general a canonical URL on an error page doesn't make much sense.
  // On the other hand, in the future we might want to support setting a canonical URL on a 404
  // page for handling link deprecation.
  //
  // See also https://vike.dev/render
  if (pageContext.is404 || pageContext.abortStatusCode || pageContext.abortReason) {
    return null
  }

  return new URL(pageContext.urlPathname, import.meta.env.VIKE_CANONICAL_URL).toString()
}

const canonicalUrl = getCanonicalUrl()

</script>
