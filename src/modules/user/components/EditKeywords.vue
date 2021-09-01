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
 * EditKeywords.vue renders the Image Placeholder component with a screenshot image of the Metadata Keywords mockup used in the slot
 * 
 *
 * @summary shows the card for editing the keywords
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-09-01 10:57:58
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
    disclaimer: `The screenshot below serves as a preview of the future component.
              Even if you can't interacte, please think about the information shown and if the grouping of the information to 
              edit would make sense in the context of the steps and substeps.`,
  }),
  props: {  
    genericProps: Object,
  },
  computed: {
  },
  methods: {
  },
  components: {
    EditImgPlaceholder,
  },
};


</script>
