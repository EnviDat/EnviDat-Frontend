<script setup>
  import { Bar } from 'vue-chartjs';
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
    plugins: {
      type: Array,
      default: undefined,
      required: false,
    },
  })

</script>

<template>
  <v-card :height >
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
