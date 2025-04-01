<template>
  <link rel="icon" :href="logoUrl" />

  <title>{{ data.name }}</title>
  <meta property="og:title" :content="data.name">

  <meta name="description" :content="data.notes">
  <meta property="og:description" :content="data.notes">

  <meta property="og:image" :content="logoUrl">
<!--
  <meta name="twitter:card" :content="logoUrl">
-->

<!--
  <script type="text/ld+json">
    {{ dataToString }}
  </script>
-->

</template>

<script lang="ts" setup>

import { useData } from 'vike-vue/useData';
import { DatasetDTO } from '@/types/modelTypes';
import logoUrl from '@/assets/logo/EnviDat_fav.ico'

const data = useData<DatasetDTO>()

</script>
