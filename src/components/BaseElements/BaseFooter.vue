<template>
    <v-footer class="bg-grey-lighten-1 pa-6">
      <v-row justify="center" no-gutters>
        <span
          v-for="link in links"
          :key="link"
          class="mx-2"
          color="white"
          rounded="xl"
          variant="text"
        >
          {{ link }}
        </span>
        <v-col class="text-center mt-4" cols="12">
          {{ currentYear }} — <strong>Footer text</strong>
        </v-col>
      </v-row>
    </v-footer>
  </template>

  <script setup>
  import { ref } from 'vue';

  const links = ref(['Cookie Policy', 'Impressum', 'Blog']);
  const currentYear = new Date().getFullYear();
  </script>

  <style>
  .footer {
    height: auto;
    min-height: 150px;
  }
  </style>
