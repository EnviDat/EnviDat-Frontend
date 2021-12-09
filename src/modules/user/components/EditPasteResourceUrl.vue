<template>
  <v-card id="EditPasteResourceUrl"
            class="pa-4"
            flat>


    <v-container fluid
                  class="pa-0">

      <v-row>
        <v-col cols="12"> 
          <div class="text-h5">{{ labels.title }}</div>
        </v-col>
      </v-row>  

      <v-row>
        <v-col cols="12"> 
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-text-field :label="labels.textFieldLabel"
                          v-model="url"
                          ref="urlTextField"
                          prepend-icon="link"
                          clearable
                          clear-icon="close"
                          @input="checkCreateButtonDisabled"
                          />
        </v-col>
      </v-row>

      <v-row no-gutters
              justify="end">
        <v-col class="shrink"> 
          <BaseRectangleButton :disabled="createButtonDisabled"
                                :buttonText="labels.buttonText"
                                @clicked="createButtonClick" />
        </v-col>
      </v-row>

    </v-container>
  </v-card>  
</template>

<script>
/**
 * @summary Shows a textfield to enter a url for a resource
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-28 15:55:22
 * Last modified  : 2021-08-18 13:23:35
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  name: 'EditPasteResourceUrl',
  props: {  
    genericProps: Object,
  },
  computed: {
  },
  methods: {
    checkCreateButtonDisabled() {
      // this.createButtonDisabled = !this.urlRegex.test(this.url);
    },
    createButtonClick() {
      this.$emit('createResources', this.url);
    },
  },
  data: () => ({
    url: '',
    labels: {
      title: 'Create Resource From Link',
      instructions: 'Paste a link to create a new resource.',
      buttonText: 'Create Resource',
      textFieldLabel: 'Link',
    },
    createButtonDisabled: true,
  }),
  components: {
    BaseRectangleButton,
  },  
};
</script>

<style scoped>


</style>
