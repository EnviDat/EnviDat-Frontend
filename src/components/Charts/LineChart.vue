<script setup>
  import { Line } from 'vue-chartjs';
  // import ChartDataLabels from 'chartjs-plugin-datalabels';
  import {
    Chart as ChartJS, Title, Tooltip,
    Legend, LineElement, PointElement,
    CategoryScale, LinearScale, TimeScale, Colors,
  } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, TimeScale, Colors);

  const { data, options } = defineProps({
    id: {
      type: String,
      default: 'LineChart',
      required: false,
    },
    height: {
      type: Number,
      default: 500,
      required: false,
    },
    data: {
      type: Object,
      default: () => {},
      required: true,
    },
    options: {
      type: Object,
      default: () => {},
      required: true,
    },
  })

  const plugins = []; // [ChartDataLabels];

</script>

<template>
  <v-card :height flat>
    <Line
      :id
      :options
      :data
      :plugins
    />
  </v-card>
</template>

<style scoped>

</style>
