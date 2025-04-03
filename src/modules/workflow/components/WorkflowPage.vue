<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height">
      <v-col cols="3">
        <NavigationWorkflow />
      </v-col>

      <v-col cols="9">
        <div>Content</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import NavigationWorkflow from '@/components/Navigation/NavigationWorkflow.vue';
</script>
