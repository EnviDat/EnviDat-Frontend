<script setup lang="ts">
import { ref } from 'vue';
import ResourceDataViz from '@/modules/charts/components/ResourceDataViz.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { DataVizSupportedExtensions } from '@/modules/charts/middelware/chartServiceLayer.ts';

const { resources } = defineProps<{
  resources: object[];
}>();

const selectedId = ref(0);

const selectResource = (resourceIndex: number) => {
  selectedId.value = resourceIndex;
}

const resourceName = (resource: object) : string => resource?.name || 'Unnamed resource';

const allowedFormatText = () : string => {
  let text = 'Currently only ';

  for (let i = 0; i < DataVizSupportedExtensions.length; i++) {
    const format = DataVizSupportedExtensions[i];
    text += `${format},`;
  }

  // cut of the last ','
  text = text.substring(0, text.length - 1);
  text += ' resources are supported for visualization';

  return text;
}

</script>

<template>

  <v-card>
    <v-card-title>
      Resource Data Visualization
    </v-card-title>


    <v-card-text>
      <v-row>
        <v-col v-if="!resources"
               cols="3">
          {{ allowedFormatText() }}
        </v-col>

        <v-col v-if="resources"
               cols="8">

          <v-row>
            <v-col>
              Select a resource for Visualization
            </v-col>
          </v-row>

          <v-row >
            <v-col
              v-for="(resource, index) in resources"
              :key="resource.id"
            >
              <BaseRectangleButton
                :button-text="resourceName(resource)"
                :color="selectedId === index ? 'highlight' : ''"
                :is-outlined="selectedId !== index"
                @clicked="selectResource(index)"
              />

            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col >
          <ResourceDataViz :resource="resources ? resources[selectedId] : undefined"/>
        </v-col>
      </v-row>
    </v-card-text>

  </v-card>
</template>

<style scoped>

</style>
