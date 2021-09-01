<template>

<v-card id="EditKeywords"
        class="pa-4">

  <!-- <v-container fluid 
                class="pa-0 fill-height" >  


    <v-row>

      <v-col :cols="columns">      -->
        <EditImgPlaceholder title="Edit Keywords"
                            :disclaimer="disclaimer"
                            :img="keywordsScreenshot"
                            />
      <!-- </v-col>

    </v-row>


 </v-container> -->
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
 * Last modified  : 2021-09-01 10:44:52
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import EditImgPlaceholder from '@/modules/user/components/EditImgPlaceholder';
import keywordsScreenshot from '@/modules/user/assets/placeholders/keywords.jpg';


export default {
  name: 'EditKeywords',
  data: () => ({
    keywordsScreenshot,
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
    disclaimer() {
      return 'Please note that the screenshot below will serve as a template for the future component.';
    },
  },
  methods: {
  },
  components: {
    EditImgPlaceholder,
  },
};


</script>
