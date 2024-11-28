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
  });
  

</script>

<template>
  <Pie
    id="DatasetPieChart"
    :options
    :data
  />
</template>

<style scoped>

</style>
