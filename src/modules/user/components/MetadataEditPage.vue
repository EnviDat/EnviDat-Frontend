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
 * Last modified  : 2021-08-18 13:06:27
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  EDITMETADATA_OBJECT_UPDATE,
  SELECT_EDITING_RESOURCE,
  SAVE_EDITING_RESOURCE,
  CANCEL_EDITING_RESOURCE,
  EDITMETADATA_DATA_RESOURCES,
  eventBus,
} from '@/factories/eventBus';

import {
  metadataCreationSteps,
  getStepToUpdate,
} from '@/modules/user/store/MetadataCreationSteps';

import { mapState } from 'vuex';
import {
  USER_NAMESPACE,
  UPDATE_METADATA_EDITING,
  METADATA_EDITING_SAVE_RESOURCE,
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
    eventBus.$on(SAVE_EDITING_RESOURCE, this.saveResource);
    eventBus.$on(CANCEL_EDITING_RESOURCE, this.cancelEditing);
    eventBus.$on(SELECT_EDITING_RESOURCE, this.selectResource);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    eventBus.$off(SAVE_EDITING_RESOURCE, this.saveResource);
    eventBus.$off(CANCEL_EDITING_RESOURCE, this.cancelEditing);
    eventBus.$off(SELECT_EDITING_RESOURCE, this.selectResource);
  },
  mounted() {
  },
  computed: {
    ...mapState(USER_NAMESPACE, [
      'metadataInEditing',
    ]),
    resources() {
      return this.metadataInEditing[EDITMETADATA_DATA_RESOURCES].resources;
    },
  },
  methods: {
    selectResource(id) {
      if (this.selectionId !== -1) {
        this.cancelEditing();
      }
      
      this.selectionId = id;
      this.setSelected(this.selectionId, true);
    },
    cancelEditing() {
      this.setSelected(this.selectionId, false);
      this.selectionId = -1;
    },
    setSelected(id, selected) {
      const res = this.resources;

      for (let i = 0; i < res.length; i++) {
        const r = res[i];
        if (r.id === id) {
          r.isSelected = selected;
          this.$set(res, i, r);
          break;
        }
      }

    },
    saveResource(newRes) {
      this.$store.dispatch(`${USER_NAMESPACE}/${METADATA_EDITING_SAVE_RESOURCE}`, newRes);

      // this.cancelEditing();
    },
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
    selectionId: -1,
  }),
};
</script>

<style>


</style>
