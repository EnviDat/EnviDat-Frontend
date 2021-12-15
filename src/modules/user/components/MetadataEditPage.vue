<template>
  <v-container
    class="pa-0 fill-height"
    fluid
    id="MetadataEditPage"
    tag="article"
  >
    <!-- prettier-ignore -->
    <NavigationStepper :steps="creationSteps"
                       :step="routeStep"
                       :subStep="routeSubStep"
                       stepColor="highlight"
                       :loading="loading"
                       @clickedClose="catchBackClicked" />


    <v-snackbar id="NotificationSnack"
                top
                elevation="0"
                color="transparent"
                timeout="10000"
                v-model="showSnack"
                >

      <NotificationCard v-if="editingError"
                        :notification="editingError"
                        :showCloseButton="true"
                        @clickedClose="showSnack = false" />

    </v-snackbar>

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
  EDITMETADATA_NETWORK_ERROR,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  eventBus,
  SAVE_EDITING_AUTHOR,
  SAVE_EDITING_RESOURCE,
  SELECT_EDITING_AUTHOR,
  SELECT_EDITING_RESOURCE,
} from '@/factories/eventBus';

import {
  getStepByName,
  getValidationMetadataEditingObject,
  initializeSteps,
  metadataCreationSteps,
} from '@/factories/userEditingFactory';

import { mapGetters, mapState } from 'vuex';

import {
  METADATA_CANCEL_AUTHOR_EDITING,
  METADATA_CANCEL_RESOURCE_EDITING,
  METADATA_EDITING_LAST_DATASET,
  METADATA_EDITING_LOAD_DATASET,
  METADATA_EDITING_PATCH_DATASET_OBJECT,
  METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
  METADATA_EDITING_SAVE_AUTHOR,
  METADATA_EDITING_SAVE_RESOURCE,
  METADATA_EDITING_SELECT_AUTHOR,
  METADATA_EDITING_SELECT_RESOURCE,
  USER_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

import {
  METADATAEDIT_PAGENAME,
  USER_DASHBOARD_PATH,
} from '@/router/routeConsts';

import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import {
  METADATA_NAMESPACE,
  METADATA_UPDATE_AN_EXISTING_AUTHOR,
} from '@/store/metadataMutationsConsts';

import { getReadOnlyFieldsObject } from '@/factories/mappingFactory';
import NavigationStepper from '@/components/Navigation/NavigationStepper';
import NotificationCard from '@/components/Cards/NotificationCard';
import { errorMessage } from '@/factories/notificationFactory';

const creationSteps = initializeSteps(metadataCreationSteps);


export default {
  name: 'MetadataEditPage',
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATAEDIT_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);

      // vm.updateLastEditingDataset(to.params.metadataid, to.fullPath);
    });
  },
  beforeRouteUpdate(to, from, next) {
    // react to route changes...
    next((vm) => {
      // vm.updateLastEditingDataset(to.params.metadataid, to.fullPath);
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
    eventBus.$on(EDITMETADATA_NETWORK_ERROR, this.showSnackMessage);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    eventBus.$off(SAVE_EDITING_RESOURCE, this.saveResource);
    eventBus.$off(CANCEL_EDITING_RESOURCE, this.cancelEditingResource);
    eventBus.$off(SELECT_EDITING_RESOURCE, this.selectResource);
    eventBus.$off(SAVE_EDITING_AUTHOR, this.saveAuthor);
    eventBus.$off(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.$off(SELECT_EDITING_AUTHOR, this.selectAuthor);
    eventBus.$off(EDITMETADATA_NETWORK_ERROR, this.showSnackMessage);
  },
  beforeMount() {
    this.initializeStepsInUrl();
  },
  mounted() {
    // reset the scrolling to the top
    window.scrollTo(0, 0);

    if (this.metadataId) {
      this.initMetadataUsingId(this.metadataId);
    }

  },
  computed: {
    ...mapState(USER_NAMESPACE, [
      'lastEditedBackPath',
      'currentEditingContent',
      'loadingCurrentEditingContent',
    ]),
    ...mapState(METADATA_NAMESPACE,[
      'authorsMap',
    ]),
    ...mapGetters(USER_NAMESPACE, ['resources', 'authors']),
    ...mapGetters(METADATA_NAMESPACE, [
      'existingAuthors',
      'existingKeywords',
    ]),
    /**
     * @returns {String} the metadataId from the route
     */
    metadataId() {
      return this.$route.params.metadataid;
    },
    loading() {
      return this.loadingCurrentEditingContent && !this.currentEditingContent;
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
    editingError() {
      if (!this.errorMessage && !this.errorTitle) {
        return null;
      }
      return errorMessage(this.errorTitle, this.errorMessage);
    },
  },
  methods: {
    async initMetadataUsingId(id) {
      if (id !== this.currentEditingContent?.name) {
        await this.$store.dispatch(`${USER_NAMESPACE}/${METADATA_EDITING_LOAD_DATASET}`, id);
      }

      this.updateLastEditingDataset(this.$route.params.metadataid, this.$route.path, this.$route.query.backPath);

      const publicationData = this.getGenericPropsForStep(EDITMETADATA_PUBLICATION_INFO)
      const publicationState = publicationData.publicationState;
      const readOnlyObj = getReadOnlyFieldsObject(publicationState);

      if (readOnlyObj) {
        this.updateStepsWithReadOnlyFields(this.creationSteps, readOnlyObj);
      }
    },
    updateLastEditingDataset(name, path, backPath) {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_LAST_DATASET}`, { name, path, backPath });
    },
    initializeStepsInUrl() {
      const initialStep = this.creationSteps[0]?.title || '';
      const initialSubStep = this.creationSteps[0]?.detailSteps[0]?.title || '';

      const currentStep = this.routeStep
      const currentSubStep = this.routeSubStep
      const params = {}

      if (!currentStep && !currentSubStep) {
        // when no parameter are given in the url, fallback the first ones
        // but add them to the url
        params.step = initialStep;
        params.substep = initialSubStep;

        this.$router.push({
          params,
          query: this.$route.query,
        });
      }
    },
    updateStepsWithReadOnlyFields(steps, readOnlyObj) {

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        if (step.detailSteps) {
          this.updateStepsWithReadOnlyFields(step.detailSteps, readOnlyObj);
        } else {
          step.readOnlyFields = readOnlyObj.readOnlyFields;
          step.readOnlyExplanation = readOnlyObj.explanation;
        }
      }
    },
    catchBackClicked() {
      const path = this.lastEditedBackPath || USER_DASHBOARD_PATH;
      this.$router.push({ path });
    },
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

      // save the data in the (frontend) vuex store
/*
      this.$store.commit(
        `${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`,
        updateObj,
      );
*/

      let action = METADATA_EDITING_PATCH_DATASET_OBJECT;
      const payload = {
        stepKey: updateObj.object,
        data: updateObj.data,
        id: this.$route.params.metadataid,
      }

      if (updateObj.object === EDITMETADATA_ORGANIZATION) {
        // overwrite the action and the payload to fit the specific
        // backend call to change the ownership of a dataset
        action = METADATA_EDITING_PATCH_DATASET_ORGANIZATION;
      }

      // save the full dataObject it in the backend
      this.$store.dispatch(`${USER_NAMESPACE}/${action}`, payload);

      this.$nextTick(() => {
        // if (updateObj.object === EDITMETADATA_AUTHOR) {
        //  this.updateExistingAuthors(updateObj.data);
        // }

        this.updateStepStatus(updateObj.object);
      });

    },
    getGenericPropsForStep(key) {
      return this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](key);
    },
    updateExistingAuthors(data) {
      this.$store.commit(`${METADATA_NAMESPACE}/${METADATA_UPDATE_AN_EXISTING_AUTHOR}`, data);
    },
    updateStepStatus(stepKey) {
      const step = getStepByName(stepKey, this.creationSteps);

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
    showSnackMessage(status, statusMessage, message) {

      const id = this.currentEditingContent?.id || null;
      const name = this.currentEditingContent?.name || null;

      if (id && name) {
        statusMessage = statusMessage.replace(id, `"${name}"`);
        message = message.replace(id, `"${name}"`);
      }

      const predefinedErrors =this.backendErrorList[status];
      this.errorTitle = predefinedErrors?.message || 'Fatal Error';
      this.errorMessage = `${message} ${predefinedErrors?.details || ''}`;

      this.showSnack = true;
    },
  },
  watch: {
    $route(){
      this.updateLastEditingDataset(this.$route.params.metadataid, this.$route.path, this.$route.query.backPath);
    },
  },
  components: {
    NavigationStepper,
    // NotificationSnack,
    // BaseRectangleButton,
    NotificationCard,
  },
  data: () => ({
    creationSteps,
    errorTitle: null,
    errorMessage: null,
    errorColor: 'error',
    backendErrorList: {
      403: {
        message: 'You are not authorized to make these changes',
      },
      408: {
        message: 'Server timeout happened.',
        details: 'This can have many reasons, please try your action / changes again after a while. If it problem persists please contact us via envidat@wsl.ch.',
      },
      409: {
        message: 'You are not authorized to make these changes',
      },
    },
    showSnack: false,
  }),
};
</script>

<style></style>
