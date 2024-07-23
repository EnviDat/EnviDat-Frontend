<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters align="start">
      <v-col cols="2" sm="auto">
        <v-row no-gutters>
          <v-col cols="12">
            <v-menu
              open-on-hover
              open-on-click
              :close-on-click="false"
              :close-on-content-click="false"
              offset-y
              z-index="2"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  style="width: 36px; height: 36px;"
                  :color="abstract ? 'primary' : 'gray'"
                  v-bind="attrs"
                  v-on="on"
                >
                  info
                </v-icon>
              </template>

              <div
                class="pa-4"
                style="background-color: white;"
                v-html="abstract"
              ></div>
            </v-menu>
          </v-col>

          <v-col cols="12">
            <BaseIconButton
              material-icon-name="fingerprint"
              :disabled="!doi"
              :tooltipText="`doi: ${doi}`"
              :url="doiUrl"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="10" md="11">
        <div v-html="citation"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * BaseCitationView.vue base element for citations, show the abstract when hovering over the info icon
 *
 * @summary citation base element
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

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
  computed: {},
  data: () => ({}),
  components: {},
};
</script>

<style></style>
