<template>
  <v-card rounded="xl" class="fill-height" :elevation="elevation">
    <v-card-text>
      <v-row class="w-100" no-gutters align="center">
        <v-col v-if="title" cols="auto" class="d-flex align-center">
          <span class="text-h6 font-weight-bold mr-2">{{ title }}</span>
        </v-col>
        <v-col v-if="showLogo" class="d-flex justify-end">
          <v-img style="flex: none" :src="EnviDatLogo" height="32" width="32" alt="envidat_logo" />
        </v-col>
      </v-row>
    </v-card-text>
    <div v-for="i in numberOfLoader" :key="i">
      <v-skeleton-loader :type="typeOfLoader" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import EnviDatLogo from '@/assets/logo/EnviDat_logo_32.png';

const props = defineProps({
  elevation: { type: Number, default: 2 },
  numberOfLoader: { type: Number, default: 2 },
  title: { type: String, default: null },
  typeOfLoader: { type: String, default: 'article' },
  showLogo: { type: Boolean, default: false },
});
</script>
