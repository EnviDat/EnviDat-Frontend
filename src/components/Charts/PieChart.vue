<script setup>
  import { Pie } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

  const { data, options } = defineProps({
    id: {
      type: String,
      default: 'PieChart',
      required: false,
    },
    height: {
      type: Number,
      default: 500,
      required: false,
    },
    data: {
      type: Object,
      default: undefined,
      required: true,
    },
    options: {
      type: Object,
      default: undefined,
      required: true,
    },
    plugins: {
      type: Array,
      default: undefined,
      required: false,
    },
  });
  

</script>

<template>
  <v-card :height >
    <Pie
      :id
      :options
      :data
      :plugins
    />
  </v-card>
</template>

<style scoped>

</style>
