<template>
  <v-card id="EditAddAuthor"
          flat
          class="pa-4" >

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

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  name: 'EditAddAuthor',
  props: {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
    createAuthorClick() {
      this.$emit('createAuthor');
    },
  },
  data: () => ({
    labels: {
      title: 'Create A New Author',
      instructions: 'Create a new author which is not a on any Metadata entry and is not EnviDat users.',
      createButtonText: 'Create Author',
    },
  }),
  components: {
    BaseRectangleButton,
  },
};
</script>

<style scoped>


</style>
