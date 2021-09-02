<template>

  <v-container id="EditDataInfo"
                fluid
                class="pa-0">

    <EditImgPlaceholder :disclaimer="disclaimer"
                        :img="dataInfo"
                        />
  </v-container>  

</template>


<script>
/**
 * EditDataInfo.vue renders the GenericPlaceholder component with a screenshot image of the Metadata Keywords mockup used in the slot
 * 
 *
 * @summary shows a screenshot placeholder of the editing the Data Info 
 * @author Dominik Haas-Artho
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-09-01 11:25:59
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import EditImgPlaceholder from '@/modules/user/components/EditImgPlaceholder';
import dataInfo from '@/modules/user/assets/placeholders/dataInfo.jpg';


export default {
  name: 'EditDataInfo',
  data: () => ({
    dataInfo,
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
