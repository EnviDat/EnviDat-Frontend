<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';
import ResourceDataViz from '@/modules/charts/components/ResourceDataViz.vue';

import { DataVizSupportedExtensions } from '@/modules/charts/middelware/chartServiceLayer.ts';
import { getResourceName } from '@/factories/metaDataFactory.ts';

const theme = useTheme();

const {resources, maxHeight} = withDefaults(
  defineProps<{
    resources: object[];
    maxHeight: number;
  }>(),
  {maxHeight: 600},
)


const selectedId = ref(0);

const selectResource = (resourceIndex: number) => {
  selectedId.value = resourceIndex;
}

const hasResources = computed(() => resources?.length > 0);

const allowedFormatText = () : string => {
  let text = 'Currently only ';

  for (let i = 0; i < DataVizSupportedExtensions.length; i++) {
    const format = DataVizSupportedExtensions[i];
    text += `${format},`;
  }

  // cut of the last ','
  text = text.substring(0, text.length - 1);
  text += ' resources are supported for visualization.';

  if (hasResources.value) {
    text += ' Select a resource and pick the parameters to visualize for the x-axis and the y-axis.'
  }

  return text;
}

const scrollbarColorFront = computed(() => theme?.themes.value?.light?.colors?.highlight || 'auto');

const scrollbarColorBack = computed(() => theme ? '#F0F0F0' : 'auto');


</script>


<template>

  <v-card :max-height="maxHeight">
    <v-card-title>
      Resource Data Visualization
    </v-card-title>

    <v-card-text>
      <v-container fluid class="pa-0">
      <v-row>
        <v-col cols="12">
          {{ allowedFormatText() }}
        </v-col>

        <v-col v-if="hasResources"
               cols="12"
        >
          <v-row>
            <v-col cols="3">
              <v-row>
                <v-list
                  :style="`max-height: ${maxHeight - 100}px; overflow: auto; scroll-behavior: smooth; scrollbar-width: thin;
                  scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack};`"
                >
                  <v-list-item
                    v-for="(resource, index) in resources"
                    :key="resource.id"
                    @click="selectResource(index)"
                    :style="`background-color: ${selectedId === index ? $vuetify.theme.themes.light.colors.highlight : 'transparent'};`"
                  >
                    {{ getResourceName(resource) }}
                  </v-list-item>
                </v-list>

              </v-row>
            </v-col>

            <v-col cols="8">
              <ResourceDataViz :resource="resources ? resources[selectedId] : undefined"
                               :flat="true"
              />
            </v-col>
          </v-row>

        </v-col>
      </v-row>

      </v-container>
    </v-card-text>

  </v-card>
</template>

<style scoped>

</style>
