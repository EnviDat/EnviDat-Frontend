<script setup>
  import { Bar } from 'vue-chartjs';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

  const { data, options } = defineProps({
    id: {
      type: String,
      default: 'BarChart',
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
    isFlat: {
      type: Boolean,
      default: true,
    },
  })

  const plugins = [ChartDataLabels];

</script>

<template>
  <v-card :height
          :flat="isFlat"
  >
    <Bar
      :id
      :options
      :data
      :plugins
    />
  </v-card>
</template>

<style scoped>

</style>
