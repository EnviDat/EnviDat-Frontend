<template>
  <v-container class="pa-0"
                fluid
                id="MetadataEditPage"
                tag="article"
                >

    <NavigationStepper :steps="metadataCreationSteps"
                        :initialStepTitle="steps[0].title"
                        stepColor="success" />
    
  </v-container>
</template>

<script>
/**
 * The MetadataEditPage shows a workflow to create and Edit 
 * metadata and data & resources
 *
 * @summary metadata detail page
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-06-29 13:49:30
 * Last modified  : 2021-07-28 18:02:34
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  eventBus,
} from '@/factories/eventBus';

import {
  metadataCreationSteps,
  getStepToUpdate,
} from '@/modules/user/components/MetadataCreationSteps';

// import { mapGetters } from 'vuex';
import {
  METADATAEDIT_PAGENAME,
} from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import NavigationStepper from '@/src/components/NavigationStepper';


export default {
  name: 'MetadataEditPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATAEDIT_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  created() {
    eventBus.$on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
  },
  mounted() {
  },
  computed: {
    // ...mapGetters({
    // }),
  },
  methods: {
    getStepToUpdate,
    editComponentsChanged(updateObj) {
      console.log(`got update on ${ JSON.stringify(updateObj.object)} with data ${JSON.stringify(updateObj.data)}`);
      // this.editState[updateObj.object] = updateObj.data;
      // console.log(`got update on ${this.editState}`);

      this.updateSteps(updateObj.object, updateObj.data);
    },
    updateSteps(eventName, newGenericProps) {
      const stepToUpdate = this.getStepToUpdate(eventName, this.steps);
      stepToUpdate.genericProps = newGenericProps;
    },
  },
  components: {
    NavigationStepper,
  },
  data: () => ({
    metadataCreationSteps,
  }),
};
</script>

<style>


</style>
