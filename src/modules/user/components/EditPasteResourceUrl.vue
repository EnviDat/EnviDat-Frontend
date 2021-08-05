<template>
  <v-card id="EditPasteResourceUrl"
            class="pa-4">

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
                          :rules="[ v => !!v || 'Link is required',
                                    v => urlRegex.test(v) || 'Please enter valid url',
                                  ]"
                          ref="urlTextField"
                          @input="checkCreateButtonDisabled"
                          />
        </v-col>
      </v-row>

      <v-row justify="end">
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
 * Last modified  : 2021-08-04 18:19:22
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
      this.createButtonDisabled = !this.urlRegex.test(this.url);
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
    urlRegex: /^(http(s)?:\/\/.)?(ftp(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{0,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
    // rulesUrl: [
    //    v => !!v || 'Link is required',
    //    v => /^(http(s)?:\/\/.)?(ftp(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{0,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(v) || 'Please enter valid url',
    //   ],
    createButtonDisabled: true,
  }),
  components: {
    BaseRectangleButton,
  },  
};
</script>

<style scoped>


</style>
