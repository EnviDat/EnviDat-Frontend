<template>
  <v-card id="EditAddExistingAuthor"
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

      <v-row >
        <v-col >
          <BaseUserPicker :users="existingEnviDatUsers"
                          :preSelected="authors"
                          :multiplePick="true"
                          :isClearable="true"
                          :instructions="labels.userPickInstructions"
                          @removedUsers="catchRemovedUsers"
                          @pickedUsers="catchPickedUsers"/>
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

import BaseUserPicker from '@/components/BaseElements/BaseUserPicker';

export default {
  name: 'EditAddExistingAuthor',
  props: {
    genericProps: Object,
  },
  mounted() {
  },
  computed: {
    existingEnviDatUsers() {
      return this.mixinMethods_getGenericProp('existingAuthors', []);
    },
    authors() {
      return this.mixinMethods_getGenericProp('authors', []);
    },
  },
  methods: {
    catchRemovedUsers(pickedUsers) {
      this.$emit('removedUsers', pickedUsers);
    },
    catchPickedUsers(pickedUsers) {
      this.$emit('pickedUsers', pickedUsers);
    },
  },
  data: () => ({
    labels: {
      title: 'Change Metadata Authors',
      instructions: 'Choose authors from any metadata entry or pick them from the list of EnviDat users.',
      userPickInstructions: 'Pick or remove EnviDat user as authors.',
    },
  }),
  components: {
    BaseUserPicker,
  },
};
</script>

<style scoped>


</style>
