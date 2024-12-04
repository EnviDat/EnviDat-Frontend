<script setup>
  import { Bar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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
  })

</script>

<template>
  <Bar
    id="DatasetBarChart"
    :options
    :data
  />
</template>

<style scoped>

</style>
