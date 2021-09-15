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
  CANCEL_EDITING_AUTHOR,
  CANCEL_EDITING_RESOURCE,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  SAVE_EDITING_AUTHOR,
  SAVE_EDITING_RESOURCE,
  SELECT_EDITING_AUTHOR,
  SELECT_EDITING_RESOURCE,
} from '@/factories/eventBus';

import {
  getStepByName,
  metadataCreationSteps,
} from '@/modules/user/store/MetadataCreationSteps';

import {
  mapGetters,
  mapState,
} from 'vuex';

import {
  METADATA_CANCEL_AUTHOR_EDITING,
  METADATA_CANCEL_RESOURCE_EDITING,
  METADATA_EDITING_SAVE_AUTHOR,
  METADATA_EDITING_SAVE_RESOURCE,
  METADATA_EDITING_SELECT_AUTHOR,
  METADATA_EDITING_SELECT_RESOURCE,
  UPDATE_METADATA_EDITING,
  USER_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

import { METADATAEDIT_PAGENAME } from '@/router/routeConsts';
import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import NavigationStepper from '@/components/Navigation/NavigationStepper';

import { METADATA_NAMESPACE } from '@/store/metadataMutationsConsts';

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
    eventBus.$on(CANCEL_EDITING_RESOURCE, this.cancelEditingResource);
    eventBus.$on(SELECT_EDITING_RESOURCE, this.selectResource);
    eventBus.$on(SAVE_EDITING_AUTHOR, this.saveAuthor);
    eventBus.$on(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.$on(SELECT_EDITING_AUTHOR, this.selectAuthor);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    eventBus.$off(SAVE_EDITING_RESOURCE, this.saveResource);
    eventBus.$off(CANCEL_EDITING_RESOURCE, this.cancelEditingResource);
    eventBus.$off(SELECT_EDITING_RESOURCE, this.selectResource);
    eventBus.$off(SAVE_EDITING_AUTHOR, this.saveAuthor);
    eventBus.$off(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.$off(SELECT_EDITING_AUTHOR, this.selectAuthor);
  },
  watch: {
    existingAuthors() {
      this.updateSteps(EDITMETADATA_AUTHOR_LIST);
    },
  },
  computed: {
    ...mapState(USER_NAMESPACE, [
      'metadataInEditing',
    ]),
    ...mapGetters(USER_NAMESPACE, [
      'resources',
      'authors',
    ]),
    ...mapGetters(METADATA_NAMESPACE, [
      'authorsMap',
      'existingAuthors',
      'existingKeywords',
    ]),
  },
  methods: {
    selectResource(id) {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_SELECT_RESOURCE}`, id);
    },
    selectAuthor(id) {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_SELECT_AUTHOR}`, id);
    },
    cancelEditingResource() {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_CANCEL_RESOURCE_EDITING}`);
    },
    cancelEditingAuthor() {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_CANCEL_AUTHOR_EDITING}`);
    },
    saveResource(newRes) {
      this.$store.dispatch(`${USER_NAMESPACE}/${METADATA_EDITING_SAVE_RESOURCE}`, newRes);
    },
    // eslint-disable-next-line no-unused-vars
    saveAuthor(newAuthor) {
      this.$store.dispatch(`${USER_NAMESPACE}/${METADATA_EDITING_SAVE_AUTHOR}`, newAuthor);
    },
    editComponentsChanged(updateObj) {
      // console.log(`got update on ${JSON.stringify(updateObj.object)} with data ${JSON.stringify(updateObj.data)}`);

      this.$store.commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`, updateObj);

      this.$nextTick(() => {
        this.updateSteps(updateObj.object);
        this.enhanceKeywordsStep();
        this.enhanceMetadataHeaderStep();
      });
    },
    updateSteps(objectName) {
      const steps = this.metadataCreationSteps;
      const mKeys = Object.keys(this.metadataInEditing);

      for (let i = 0; i < mKeys.length; i++) {
        const key = mKeys[i];

        if (objectName === key) {

          const stepToUpdate = getStepByName(key, steps);
          if (stepToUpdate) {
            stepToUpdate.genericProps = this.metadataInEditing[key];
            // console.log(`updated step ${JSON.stringify(stepToUpdate)}`);
            return;
          }
        }
      }
    },
    enhanceKeywordsStep() {
      const keywordStep = getStepByName(EDITMETADATA_KEYWORDS, this.metadataCreationSteps);
      const headerStep = getStepByName(EDITMETADATA_MAIN_HEADER, this.metadataCreationSteps);
      const descStep = getStepByName(EDITMETADATA_MAIN_DESCRIPTION, this.metadataCreationSteps);

      keywordStep.genericProps = {
        ...keywordStep.genericProps,
        metadataCardTitle: headerStep.genericProps.metadataTitle,
        metadataCardSubtitle: descStep.genericProps.description,
      };
    },
    enhanceMetadataHeaderStep() {
      const keywordStep = getStepByName(EDITMETADATA_KEYWORDS, this.metadataCreationSteps);
      const headerStep = getStepByName(EDITMETADATA_MAIN_HEADER, this.metadataCreationSteps);
      const authorStep = getStepByName(EDITMETADATA_AUTHOR_LIST, this.metadataCreationSteps);

      headerStep.genericProps = {
        ...headerStep.genericProps,
        keywords: keywordStep.genericProps.keywords,
        authors: authorStep.genericProps.authors,
      };
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
