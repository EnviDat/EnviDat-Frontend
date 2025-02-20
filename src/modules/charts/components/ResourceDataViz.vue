<script setup lang="ts">
import { ref } from 'vue';
import BarChart from '@/components/Charts/BarChart.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue'
import { loadResourcesData } from '@/modules/charts/middelware/chartServiceLayer.ts';
import { MetaData } from '@/types/env';

const { resource } = defineProps<{resource: object}>();

const loading = ref(true);

const chartLabels = ref();
const chartData = ref();
const dataPerParameter = ref();

const currentParameter = ref();

const defaultOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
}

const getParameter = (dataEntry: any, parameter: string = undefined) => {
  if (parameter) {
    return dataEntry[parameter];
  }

  const firstParameter = Object.keys(dataEntry)[0];

  return dataEntry[firstParameter];
}

const loadDataForParameter = (data: object[], parameter: string = undefined) => {

  const seriesData = [];
  const firstParameter = parameter || Object.keys(data[0])[0];

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const entryPerParamter = entry[firstParameter];
    seriesData.push(entryPerParamter);
  }

  return {
    datasets: {
      labels: [firstParameter],
      data: seriesData,
      // backgroundColor: barColors[0],
    },
  };
}

const loadData = () => {
  if (resource.isProtected) {
    return
  }

  loadResourcesData(
    resource.url,
    (meta: MetaData, data: Object[]) => {

      chartLabels.value = meta.hasMetaRows
        ? meta.metaRows.fields
        : null;

      // currentParameter.value = meta.hasMetaRows ? meta.metaRows.fields[0] : null

      chartData.value = data;

      dataPerParameter.value = loadDataForParameter(chartData.value);


      loading.value = false;
    },
    (e) => {
      loading.value = false;
      console.warn('error while loading resource data for preview');
      console.error(e);
    },
  )
}

const loadParameterData = (parameter: string) => {
  currentParameter.value = parameter;
  dataPerParameter.value = loadDataForParameter(chartData.value, parameter);
}

loadData();

</script>

<template>
  <v-card>
    <v-card-title>

    </v-card-title>

    <v-card-text>
      <v-row>

        <v-col cols="6">
          <div v-for="(parameter, index) in chartLabels"
               :key="index"
          >
            <BaseRectangleButton
              :button-text="parameter"
              @clicked="loadParameterData(parameter)"
            />
          </div>
        </v-col>

        <v-col cols="6">

          <BarChart
            :options="defaultOptions"
            :data="dataPerParameter" />
        </v-col>

      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>
