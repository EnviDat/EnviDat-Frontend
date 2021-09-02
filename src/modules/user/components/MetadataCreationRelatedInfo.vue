<template>

  <v-card id="MetadataCreationRelatedInfo"
          flat
          class="pa-4">

    <v-row>
      <v-col cols="5">
        <EditRelatedPublications :genericProps="genericProps" />          

      </v-col>

      <v-col cols="5">
        <EditImgPlaceholder :disclaimer="disclaimer"
                            :img="relatedDatasets"
                            />
      </v-col>

      <v-col cols="2">
        <EditCustomFields />
      </v-col>


    </v-row>


  </v-card>  

</template>


<script>
/**
 * EditDataInfo.vue renders the GenericPlaceholder component with a screenshot image of the Metadata Keywords mockup used in the slot
 * 
 *
 * @summary shows a screenshot placeholder of the editing the Related Info 
 * @author Dominik Haas-Artho
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-09-01 17:54:02
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import EditImgPlaceholder from '@/modules/user/components/EditImgPlaceholder';
import relatedDatasets from '@/modules/user/assets/placeholders/relatedDatasets.jpg';

import EditRelatedPublications from '@/modules/user/components/EditRelatedPublications';
import EditCustomFields from '@/modules/user/components/EditCustomFields';
import {
  eventBus,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';

export default {
  name: 'MetadataCreationRelatedInfo',
  props: {  
    genericProps: Object,
  },
  created() {
    eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  // mounted() {
  //   this.genericPropsFilled.publications.text = this.genericPropsFilled.textareaContent;
  // },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  computed: {
    disclaimer() {
      return 'Please note that the screenshot below will serve as a template for the future component.';
    },
  },
  methods: {
    editComponentsChanged(updateObj) {
      if (updateObj.object === EDITMETADATA_RELATED_PUBLICATIONS) {
        this.genericProps = updateObj.data;
        this.genericPropsFilled.publications.text = this.genericPropsFilled.textareaContent;
      }
    },
  },
  data: () => ({
    relatedDatasets,
  }),
  components: {
    EditImgPlaceholder,
    EditRelatedPublications,
    EditCustomFields,
  },
};


</script>
