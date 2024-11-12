<template>
  <v-container fluid class="px-0 py-1">
    <v-row no-gutters align="start">
      <v-col class='pr-4 flex-grow-0'>
        <v-row no-gutters>
            <v-col cols="12"
                   class='pl-1 pb-2'
            >
            <v-menu
                :open-on-hover='true'
                :open-on-click='true'
                :close-on-click="false"
                :close-on-content-click="false"
                :disabled="!abstract"
                offset-y
                z-index="2"
            >
              <template v-slot:activator="{ props }">
                <BaseIcon
                  v-bind="props"
                  :icon="mdiInformation"
                  :color="abstract ? 'primary' : 'grey'"
                />
              </template>

              <div class="pa-4"
                   style="background-color: white;"
                   v-html="abstract" />

            </v-menu>
          </v-col>

          <v-col cols="12"
                  class="pl-1 pt-2">
            <BaseIconButton 
              :icon="mdiFingerprint"
              :disabled="!doi"
              :icon-color="doi ? 'primary' : 'gray'"
              :tooltip-text="`doi: ${doi}`"
              :url="doiUrl"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col class='flex-grow-1' >
        <div v-html="citation"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>/**
 * BaseCitationView.vue base element for citations, show the abstract when hovering over the info icon
 *
 * @summary citation base element
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {mdiInformation, mdiFingerprint} from '@mdi/js';
import BaseIcon from '@/components/BaseElements/BaseIcon.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

export default {
  name: 'BaseCitationView',
  props: {
    abstract: {
      type: String,
      default: undefined,
    },
    citation: {
      type: String,
      default: 'No citation found',
    },
    doi: {
      type: String,
      default: undefined,
    },
    doiUrl: {
      type: String,
      default: undefined,
    },
  },
  computed: {
  },
  data: () => ({
    mdiInformation,
    mdiFingerprint,
  }),
  components: {
    BaseIcon,
    BaseIconButton,
  },
};
</script>

<style></style>
