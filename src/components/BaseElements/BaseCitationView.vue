<template>
  <v-container fluid class="px-0 py-1">
    <v-row no-gutters align="start">
      <v-col class='pr-3 flex-grow-0'>
        <v-row no-gutters>
            <v-col cols="12"
                   class='pl-1 pb-2'
            >
            <v-menu
                :open-on-hover="true"
                :open-on-click="true"
                :disabled="!abstract"
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
                   style="position: relative; left: 70px; background-color: white; max-width: 90%;"
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
        <div v-html="markdownCitation"></div>
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
import { renderMarkdown } from '@/factories/stringFactory.js';

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
    markdownCitation() {
      return renderMarkdown(this.citation, false);
    },
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
