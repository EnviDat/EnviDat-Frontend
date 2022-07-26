<template>
  <v-card id="EditAddAuthor"
          class="pa-4" >

<!--  disabled for now to link to the legacy website  -->
<!--
      <v-row>
        <v-col cols="12">
          <div class="text-h5">{{ labels.title }}</div>
        </v-col>

        <v-col cols="12">
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row justify="end">
        <v-col class="shrink">
          <BaseRectangleButton :buttonText="labels.createButtonText"
                                @clicked="createAuthorClick" />
        </v-col>
      </v-row>
-->


      <!-- TEMPORARY PLACEHOLDER START -->
      <v-row>
        <v-col cols="12">
          <div class="text-h5">Create New Author</div>
        </v-col>
      </v-row>

      <v-row no-gutters align="center" class="pt-6">
        <v-col cols="1">
          <v-icon color="secondary" style="animation: progress-circular-rotate 3s linear infinite" x-large>settings</v-icon>
        </v-col>

        <v-col class="text-h5" cols="11">
          Coming Soon!
        </v-col>

        <v-col class="pt-2 text-body-1">
          Creating new author is under construction.
          <br>
          Please create and add authors which aren't in any other dataset yet via the legacy website by clicking on the button below.
        </v-col>
      </v-row>

      <v-row no-gutters
             class="pt-6"
             justify="end">

        <BaseRectangleButton buttonText="Create New Author"
                             color="secondary"
                             :url="linkAddNewAuthorCKAN" />

      </v-row>
      <!-- TEMPORARY PLACEHOLDER END -->

    <v-row justify="end">
      <v-col class="shrink">
        <BaseRectangleButton
          :buttonText="labels.createButtonText"
          @clicked="createAuthorClick"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
/**
 * @summary Show a title, instructions and a button to create a new author
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-18 16:09:39
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

export default {
  name: 'EditAddAuthor',
  props: {
    metadataId: {
      type: String,
      default: '',
    },
  },
  mounted() {
  },
  computed: {
    linkAddNewAuthorCKAN() {
      return `${this.envidatDomain}/dataset/edit/${this.metadataId}`;
    },
  },
  methods: {
    createAuthorClick() {
      this.$emit('createAuthor');
    },
  },
  data: () => ({
    labels: {
      title: 'Create A New Author',
      instructions:
        'Create a new author which is not a on any Metadata entry and is not EnviDat users.',
      createButtonText: 'Create Author',
    },
    envidatDomain: process.env.VITE_ENVIDAT_PROXY,
  }),
  components: {
    BaseRectangleButton,
  },
};
</script>

<style scoped></style>
