<template>
  <v-container
    class="pa-0 fill-height"
    fluid
    id="MetadataEditPage"
    tag="article"
  >
    <!-- prettier-ignore -->
    <NavigationStepper :steps="metadataCreationSteps"
                       :step="routeStep"
                       :subStep="routeSubStep"
                       stepColor="highlight" />

  </v-container>
</template>

<script>
/**
 * The MetadataEditPage shows a workflow to create and Edit
 * metadata and data & resources
 *
 * @summary metadata detail page
 * @author Dominik Haas-Artho & Sam Woodcock
 *
 * Created at     : 2021-06-29 13:49:30
 * Last modified  : 2021-10-26 13:06:27
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
  getValidationMetadataEditingObject,
  metadataCreationSteps,
} from '@/factories/userEditingFactory';

import { mapGetters, mapState } from 'vuex';

import {
  METADATA_CANCEL_AUTHOR_EDITING,
  METADATA_CANCEL_RESOURCE_EDITING,
  METADATA_EDITING_LOAD_DATASET,
  METADATA_EDITING_PATCH_DATASET_OBJECT,
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

import {
  METADATA_NAMESPACE,
  METADATA_UPDATE_AN_EXISTING_AUTHOR,
} from '@/store/metadataMutationsConsts';

export default {
  name: 'MetadataEditPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATAEDIT_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
/*  async beforeRouteUpdate(to, from) {
    // react to route changes...
    this.userData = await fetchUser(to.params.id)
  },
    */
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
  beforeMount() {
    const initialStep = this.metadataCreationSteps[0]?.title || '';
    const initialSubStep = this.metadataCreationSteps[0]?.detailSteps[0]?.title || '';

    const currentStep = this.routeStep
    const currentSubStep = this.routeSubStep
    const params = {}

    if (!currentStep && !currentSubStep) {
      // when no parameter are given in the url, fallback the first ones
      // but add them to the url
      params.step = initialStep;
      params.substep = initialSubStep;

      this.$router.push({ params });
    }
  },
  mounted() {
    if (this.metadataId) {
      this.initMetadataUsingId(this.metadataId);
    }
    
    // reset the scrolling to the top
    window.scrollTo(0, 0);
  },
  computed: {
    ...mapState(USER_NAMESPACE, ['metadataInEditing']),
    ...mapState(METADATA_NAMESPACE,[
      'authorsMap',
      'currentMetadataContent',
    ]),
    ...mapGetters(USER_NAMESPACE, ['resources', 'authors']),
    ...mapGetters(METADATA_NAMESPACE, [
      'currentMetadataContent',
      'existingAuthors',
      'existingKeywords',
    ]),
    /**
     * @returns {String} the metadataId from the route
     */
    metadataId() {
      return this.$route.params.metadataid;
    },
    routeStep() {
      let stepFromRoute = this.$route?.params?.step;

      if (stepFromRoute instanceof Array) {
        stepFromRoute = stepFromRoute[0];
      }
      
      return stepFromRoute || '';
    },
    routeSubStep() {
      const subStep = this.$route?.params?.substep;

      return subStep || '';
    },
  },
  watch: {
    authorsMap() {

/*
      const backendJson = convertJSON(this.currentMetadataContent, false);

      const backendAuthors = getFrontendJSON(EDITMETADATA_AUTHOR_LIST, backendJson, false)
      const authors = getFullAuthorsFromDataset(this.authorsMap,{ author: backendAuthors.authors })
*/

/*      this.editComponentsChanged({
        object: EDITMETADATA_AUTHOR_LIST,
        data: authors,
      })
      */

/*
      this.$store.commit(
        `${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`,
        {
          object: EDITMETADATA_AUTHOR_LIST,
          data: authors,
        },
      );

      this.enhanceMetadataHeaderStep(EDITMETADATA_AUTHOR_LIST)
*/
    },
  },
  methods: {
    async initMetadataUsingId() {
      await this.$store.dispatch(
        `${USER_NAMESPACE}/${METADATA_EDITING_LOAD_DATASET}`,
        this.metadataId,
      );

    },
    selectResource(id) {
      this.$store.commit(
        `${USER_NAMESPACE}/${METADATA_EDITING_SELECT_RESOURCE}`,
        id,
      );
    },
    selectAuthor(id) {
      this.$store.commit(
        `${USER_NAMESPACE}/${METADATA_EDITING_SELECT_AUTHOR}`,
        id,
      );
    },
    cancelEditingResource() {
      this.$store.commit(
        `${USER_NAMESPACE}/${METADATA_CANCEL_RESOURCE_EDITING}`,
      );
    },
    cancelEditingAuthor() {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_CANCEL_AUTHOR_EDITING}`);
    },
    saveResource(newRes) {
      this.$store.dispatch(
        `${USER_NAMESPACE}/${METADATA_EDITING_SAVE_RESOURCE}`,
        newRes,
      );
    },
    // eslint-disable-next-line no-unused-vars
    saveAuthor(newAuthor) {
      this.$store.dispatch(
        `${USER_NAMESPACE}/${METADATA_EDITING_SAVE_AUTHOR}`,
        newAuthor,
      );
    },
    editComponentsChanged(updateObj) {

      // save the data in the (frontend) vuex store
/*
      this.$store.commit(
        `${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`,
        updateObj,
      );
*/

      // save the full dataObject it in the backend
      this.$store.dispatch(
        `${USER_NAMESPACE}/${METADATA_EDITING_PATCH_DATASET_OBJECT}`,
        {
          stepKey: updateObj.object,
          data: updateObj.data,
          id: this.$route.params.metadataid,
        }
      );

/*
      this.$store.dispatch(
        `${USER_NAMESPACE}/${METADATA_EDITING_PATCH_DATASET_PROPERTY}`,
        {
          stepKey: updateObj.object,
          id: this.$route.params.metadataid,
          property: updateObj.property,
          value: updateObj.data[updateObj.property],
        }
      );
*/

/*
      this.$nextTick(() => {
        this.enhanceKeywordsStep(updateObj.object);
        this.enhanceMetadataHeaderStep(updateObj.object);

        // if (updateObj.object === EDITMETADATA_AUTHOR) {
        //  this.updateExistingAuthors(updateObj.data);
        // }

        this.updateStepStatus(updateObj.object);
      });
*/

    },
    getGenericPropsForStep(key) {
      return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](
        key,
      );
    },
    updateExistingAuthors(data) {
      this.$store.commit(
        `${METADATA_NAMESPACE}/${METADATA_UPDATE_AN_EXISTING_AUTHOR}`,
        data,
      );
    },
    enhanceKeywordsStep(updatedKey) {
      if (updatedKey === EDITMETADATA_MAIN_HEADER || updatedKey === EDITMETADATA_MAIN_DESCRIPTION) {

        const keywordProps = this.getGenericPropsForStep(EDITMETADATA_KEYWORDS);
        const headerProps = this.getGenericPropsForStep(
          EDITMETADATA_MAIN_HEADER,
        );
        const descProps = this.getGenericPropsForStep(
          EDITMETADATA_MAIN_DESCRIPTION,
        );

        const newKeywordProps = {
          ...keywordProps,
          metadataCardTitle: headerProps.metadataTitle,
          metadataCardSubtitle: descProps.description,
        };

        // directly call the mutation and NOT the eventBus to avoid a loop!
        this.$store.commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`, {
          object: EDITMETADATA_KEYWORDS,
          data: newKeywordProps,
        });
      }
    },
    enhanceMetadataHeaderStep(updatedKey) {
      if (updatedKey === EDITMETADATA_KEYWORDS || updatedKey === EDITMETADATA_AUTHOR_LIST) {

        const keywordProps = this.getGenericPropsForStep(EDITMETADATA_KEYWORDS);
        const headerProps = this.getGenericPropsForStep(
          EDITMETADATA_MAIN_HEADER,
        );
        const authorProps = this.getGenericPropsForStep(
          EDITMETADATA_AUTHOR_LIST,
        );

        const newHeaderProps = {
          ...headerProps,
          keywords: keywordProps.keywords,
          authors: authorProps.authors,
        };

        // directly call the mutation and NOT the eventBus to avoid a loop!
        this.$store.commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`, {
          object: EDITMETADATA_MAIN_HEADER,
          data: newHeaderProps,
        });
      }
    },
    updateStepStatus(stepKey) {
      const step = getStepByName(stepKey, this.metadataCreationSteps);

      if (!step) {
        return;
      }

      const stepData = this.getGenericPropsForStep(step.key);

      if (this.updateStepValidation(step, stepData)) {
        this.updateStepCompleted(step, stepData);
      }
    },
    updateStepCompleted(step, stepData) {
      const values = Object.values(stepData);

      let isComplete = true;
      for (let i = 0; i < values.length; i++) {
        const value = values[i];

        if (value === undefined || value === null || value === '') {
          isComplete = false;
          break;
        }
      }

      step.completed = isComplete;
    },
    updateStepValidation(step, stepData) {
      const stepValidation = getValidationMetadataEditingObject(step.key);
      if (!stepValidation) {
        return true;
      }

      try {
        stepValidation.validateSync(stepData);
      } catch (e) {
        console.error(`updateStepValidation validation Error ${e}`);

        step.error = e.message;
        return false;
      }

      step.error = null;
      return true;
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

<style></style>
