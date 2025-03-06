<script setup lang="ts">
import { computed, ref } from 'vue';
import LineChart from '@/components/Charts/LineChart.vue';

import { loadResourcesData } from '@/modules/charts/middelware/chartServiceLayer.ts';
import { MetaData } from '@/types/env';

const { resource } = defineProps<{
  resource: object;
}>();

const loading = ref(true);

const chartLabels = ref([]);
const chartData = ref();
const dataPerParameter = ref();

const xParameter = ref();
const yParameter = ref();

const warning = ref();
const error = ref();

const defaultOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
      text: 'Resource Visualization',
    },
    decimate: {
      enabled: true,
      algorithm: 'lltb',
    },
  },
};

const title = computed(() =>
  resource
    ? `Data Visualization of "${resource.name}"`
    : 'Data Visualization of "Unnamed" resource',
);

const instructions = 'Pick which parameters you would like to visualize. Time or timestamp would auto assigned to the x-axis.';

const getTimeParameter = (parameterList: string[]) : string | null => {
  for (let i = 0; i < parameterList.length; i++) {
    const param = parameterList[i];
    const compare = param.toLowerCase();
    if (compare.includes('time') || compare.includes('date')) {
      return param;
    }
  }

  return null;
};

const getNextParameter = (parameterList: string[], positionParameter: string) : string | null => {

  const index = positionParameter.indexOf(positionParameter);
  if (index >= 0) {
    const next = index + 1;

    if (next < positionParameter.length) {
      return parameterList[next];
    }

    if (index !== 0) {
      return parameterList[0];
    }
  }

  return null;
}

const loadDataForParameter = (
  data: object[],
  xParam: string,
  yParam: string,
) => {
  warning.value = undefined;
  error.value = undefined;

  const seriesData = [];

  const labels = [];

  for (let i = 0; i < data.length; i++) {
    const entry = data[i];
    const entryPerParameter = entry[yParam];

    const xValue = entry[xParam];
    if (xValue) {
      labels.push(xValue);
    }
    seriesData.push(entryPerParameter);
  }

  //  labels: [firstParameter],

  return {
    labels,
    datasets: [
      {
        label: yParam,
        data: seriesData,
        // backgroundColor: barColors[0],
      },
    ],
  };
};

const loadData = () => {

  error.value = undefined;
  warning.value = undefined;
  loading.value = true;

  if (!resource || resource?.isProtected) {
    error.value = 'Resource is undefined or protected';
    loading.value = false;
    return;
  }

  loadResourcesData(
    resource.url,
    (meta: MetaData, data: Object[]) => {
      chartLabels.value = meta.hasMetaRows ? meta.metaRows.fields : null;

      chartData.value = data;

      const parameterList = Object.keys(data[0]);
      xParameter.value = getTimeParameter(parameterList);
      yParameter.value = getNextParameter(parameterList, xParameter.value)

      if (!xParameter.value) {
        warning.value =
          'Auto pick a "time" parameter for X-axis did not work. Please choose a parameter for the X-Axis';
      } else {
        dataPerParameter.value = loadDataForParameter(
          chartData.value,
          xParameter.value,
          yParameter.value,
        );
      }

      loading.value = false;
    },
    (e) => {
      loading.value = false;
      console.error(e);
      error.value = e;
    },
  );
};

const assignXParameter = (parameter: string) => {
  xParameter.value = parameter;

  dataPerParameter.value = loadDataForParameter(
    chartData.value,
    xParameter.value,
    yParameter.value,
  );
};

const assignYParameter = (parameter: string) => {
  yParameter.value = parameter;

  dataPerParameter.value = loadDataForParameter(
    chartData.value,
    xParameter.value,
    yParameter.value,
  );
};

loadData();

</script>

<template>
  <v-card :loading>
    <v-card-title>
      {{ title }}
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col>
        {{ instructions }}
        </v-col>
      </v-row>

      <v-row>
        <v-col v-if="warning"
               cols="12">
          <v-alert type="warning">
            {{ warning }}
          </v-alert>
        </v-col>

        <v-col v-if="error"
               cols="12">
          <v-alert type="error">
            {{ error }}
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-autocomplete
            label="X Parameter"
            :items="chartLabels"
            :model-value="xParameter"
            @update:model-value="assignXParameter"
          />
        </v-col>
        <v-col>
          <v-autocomplete
            label="Y Parameter"
            :items="chartLabels"
            :model-value="yParameter"
            @update:model-value="assignYParameter"
          />
        </v-col>

      </v-row>

    </v-card-text>

    <v-card-text>
      <LineChart
        v-if="dataPerParameter"
        :options="defaultOptions"
        :data="dataPerParameter"
      />
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
