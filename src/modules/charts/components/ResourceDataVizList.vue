<script setup lang="ts">
import { ref } from 'vue';
import ResourceDataViz from '@/modules/charts/components/ResourceDataViz.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

const { resources } = defineProps<{
  resources: object[];
}>();

const selectedId = ref(0);

const selectResource = (resourceIndex: number) => {
  selectedId.value = resourceIndex;
}

const resourceName = (resource: object) : string => resource?.name || 'Unnamed resource';

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
          Currently only CSV resources are supported for preview
        </v-col>

        <v-col v-if="resources"
               cols="3">

          <v-row>
            <v-col>
              Select a resource for Visualization
            </v-col>
          </v-row>

          <v-row >
            <v-col
              v-for="(resource, index) in resources"
              cols="12"
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

        <v-col cols="8">
          <ResourceDataViz :resource="resources ? resources[selectedId] : undefined"/>
        </v-col>
      </v-row>
    </v-card-text>

  </v-card>
</template>

<style scoped>

</style>
