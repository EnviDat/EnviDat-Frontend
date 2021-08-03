<template>
  <v-container class="pa-0 fill-height"
                fluid
                id="MetadataEditPage"
                tag="article"
                >

    <NavigationStepper :steps="metadataCreationSteps"
                        :initialStepTitle="metadataCreationSteps[0].title"
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
 * Last modified  : 2021-08-03 15:12:35
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import {
  metadataCreationSteps,
  getStepToUpdate,
} from '@/modules/user/components/MetadataCreationSteps';

import { mapState } from 'vuex';
import {
  USER_NAMESPACE,
  UPDATE_METADATA_EDITING,
} from '@/modules/user/store/userMutationsConsts';
import { METADATAEDIT_PAGENAME } from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import NavigationStepper from '@/components/Navigation/NavigationStepper';


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
    ...mapState(USER_NAMESPACE, [
      'metadataInEditing',
    ]),
  },
  methods: {
    editComponentsChanged(updateObj) {
      // console.log(`got update on ${JSON.stringify(updateObj.object)} with data ${JSON.stringify(updateObj.data)}`);

      this.$store.commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`, updateObj);

      this.updateSteps(updateObj.object);
    },
    updateSteps(objectName) {
      const steps = this.metadataCreationSteps;
      const mKeys = Object.keys(this.metadataInEditing);

      for (let i = 0; i < mKeys.length; i++) {
        const key = mKeys[i];

        if (objectName === key) {

          const stepToUpdate = getStepToUpdate(key, steps);
          if (stepToUpdate) {
            stepToUpdate.genericProps = this.metadataInEditing[key];
            // console.log(`updated step ${JSON.stringify(stepToUpdate)}`);
            return;
          }
        }
      }
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
