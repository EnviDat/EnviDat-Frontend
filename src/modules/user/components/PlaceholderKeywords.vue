<template>

<v-card id="PlaceholderKeywords" class="pa-4">

  <v-container fluid 
                class="pa-0 fill-height" >  


    <v-row>

      <v-col :cols="columns">     
        <generic-placeholder :genericProps="genericProps" >
           <v-img :src="keywordsScreenshot"
                max-height="500"
                style="border-bottom-left-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 0px;" />      
        </generic-placeholder>
      </v-col>

    </v-row>


 </v-container>
</v-card>  

</template>


<script>
/**
 * PlaceholderKeywords.vue renders the GenericPlaceholder component with a screenshot image of the Metadata Keywords mockup used in the slot
 * 
 *
 * @summary shows a screenshot placeholder of the Metadata Keyworkds component
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-08-31
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import GenericPlaceholder from '@/modules/user/components/GenericPlaceholder';

import keywordsScreenshot from '@/modules/user/assets/placeholders/keywords.png';


export default {
  name: 'PlaceholderKeywords',
  data: () => ({
    keywordsScreenshot,
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
  },
  methods: {
  },
  components: {
    GenericPlaceholder,
  },
};


</script>
