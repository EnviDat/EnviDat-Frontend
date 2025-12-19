<script setup lang="ts">
import { computed, ref, watch, defineProps } from 'vue';
import LineChart from '@/components/Charts/LineChart.vue';

import { loadResourcesData } from '@/modules/charts/middelware/chartServiceLayer.ts';
import { MetaData } from '@/types/dataVizTypes';
import { getResourceName } from '@/factories/resourceHelpers';
import { ResourceDTO } from '@/types/dataTransferObjectsTypes';
import { Resource } from '@/types/modelTypes';

const props = defineProps<{
  resource: object;
  flat: boolean;
}>();

const loading = ref(true);

const chartLabels = ref([]);
const chartData = ref();
const dataPerParameter = ref();

const xParameter = ref<string>();
const yParameter = ref<string[]>();

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
    colors: {
      enabled: true,
      forceOverride: true,
    },
  },
};

const title = computed(() =>
  props.resource
    ? `Data Visualization of "${getResourceName(props.resource as ResourceDTO)}"`
    : 'Data Visualization of "Unnamed" resource',
);

const instructions =
  'Pick which parameters you would like to visualize. Time or timestamp would auto assigned to the x-axis.';

const getTimeParameter = (parameterList: string[]): string | null => {
  for (let i = 0; i < parameterList.length; i++) {
    const param = parameterList[i];
    const compare = param.toLowerCase();

    if (compare.includes('time') || compare.includes('date')) {
      return param;
    }
  }

  return null;
};

const getNextParameter = (parameterList: string[], positionParameter: string): string | null => {
  const index = parameterList.indexOf(positionParameter);
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
};

const loadDataForParameter = (data: object[], xParam: string, yParam: string) => {
  warning.value = undefined;
  error.value = undefined;

  const datasets = [];
  const labels = [];

  for (let i = 0; i < yParam.length; i++) {
    const paramY = yParam[i];
    labels.push(paramY);

    const seriesData = [];

    for (let j = 0; j < data.length; j++) {
      const entry = data[j];

      seriesData.push({
        x: entry[xParam],
        y: entry[paramY],
      });
    }

    datasets.push({
      label: paramY,
      data: seriesData,
      // backgroundColor: barColors[0],
    });
  }

  return {
    labels,
    datasets,
  };
};

const maxChartData = 5000;

const loadData = (res: Resource) => {
  error.value = undefined;
  warning.value = undefined;
  dataPerParameter.value = undefined;
  loading.value = true;

  if (!res || res?.isProtected) {
    error.value = 'Resource is undefined or protected';
    loading.value = false;
    return;
  }

  loadResourcesData(
    res.url,
    (meta: MetaData, data: object[]) => {
      if (data.length >= maxChartData) {
        warning.value = `The file contains a lot of data (> ${maxChartData}), which is not yet supported.`;
        loading.value = false;
        return;
      }

      chartLabels.value = meta.hasMetaRows ? meta.metaRows.fields : null;

      chartData.value = data;

      const parameterList = Object.keys(data[0]);
      xParameter.value = getTimeParameter(parameterList);
      const nextYParam = getNextParameter(parameterList, xParameter.value);
      yParameter.value = [nextYParam];

      if (!xParameter.value) {
        warning.value =
          'Auto pick a "time" parameter for X-axis did not work. Please choose a parameter for the X-Axis';
      } else {
        dataPerParameter.value = loadDataForParameter(chartData.value, xParameter.value, yParameter.value);
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

  dataPerParameter.value = loadDataForParameter(chartData.value, xParameter.value, yParameter.value);
};

const assignYParameter = (parameter: string | string[]) => {
  let newParm = parameter;
  if (typeof newParm === 'string') {
    newParm = [parameter];
  }

  yParameter.value = newParm;

  dataPerParameter.value = loadDataForParameter(chartData.value, xParameter.value, yParameter.value);
};

watch(
  () => props.resource,
  (newResource) => {
    loadData(newResource);
  },
  { immediate: true },
);
</script>

<template>
  <v-card :loading :flat>
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
        <v-col v-if="warning" cols="12">
          <v-alert type="warning">
            {{ warning }}
          </v-alert>
        </v-col>

        <v-col v-if="error" cols="12">
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
            hide-details
          />
        </v-col>

        <v-col>
          <v-autocomplete
            label="Y Parameter"
            :items="chartLabels"
            :model-value="yParameter"
            multiple
            @update:model-value="assignYParameter"
            hide-details
          />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text class="pa-0">
      <LineChart v-if="dataPerParameter" height="auto" ref="chart" :options="defaultOptions" :data="dataPerParameter" />
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
