<template>
  <v-container
    class="pa-0 fill-height"
    fluid
    id="MetadataCreationPage"
    tag="article"
  >
    <!-- prettier-ignore -->
    <NavigationStepper :steps="creationSteps"
                       :step="routeStep"
                       :subStep="routeSubStep"
                       stepColor="highlight"
                       :loading="loading"
                       :showSaveButton="canSaveInBackend"
                       :isCreationWorkflow="true"
                       @clickedSaveDataset="catchSaveNewDataset"
                       @clickedClose="catchBackClicked" />


<!--
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
-->

  </v-container>

</template>

<script>
/**
 * The MetadataCreationPage shows a workflow to create and Edit
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
  eventBus,
  CANCEL_EDITING_AUTHOR,
  EDITMETADATA_NETWORK_ERROR,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  METADATA_EDITING_FINISH_CLICK,
  SELECT_EDITING_AUTHOR,
  EDITMETADATA_AUTHOR,
  AUTHOR_SEARCH_CLICK,
  EDITMETADATA_AUTHOR_LIST,
  SHOW_DIALOG,
} from '@/factories/eventBus';

import {
  getSelectedElement,
} from '@/factories/userEditingFactory';


import {
  METADATA_CREATION_DATASET,
  METADATA_EDITING_LAST_DATASET,
  USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
} from '@/modules/user/store/userMutationsConsts';

import {
  ORGANIZATIONS_NAMESPACE,
  USER_GET_ORGANIZATION_IDS,
  USER_GET_ORGANIZATIONS,
} from '@/modules/organizations/store/organizationsMutationsConsts';

import {
  BROWSE_PATH,
  METADATA_CREATION_PAGENAME,
  METADATAEDIT_PAGENAME,
  USER_DASHBOARD_PATH,
  USER_SIGNIN_PAGENAME,
} from '@/router/routeConsts';

import {
  SET_APP_BACKGROUND,
  SET_CURRENT_PAGE,
} from '@/store/mainMutationsConsts';

import {
  METADATA_NAMESPACE,
  METADATA_UPDATE_AN_EXISTING_AUTHOR,
} from '@/store/metadataMutationsConsts';


import NavigationStepper from '@/components/Navigation/NavigationStepper.vue';
// import NotificationCard from '@/components/Cards/NotificationCard.vue';
import { errorMessage } from '@/factories/notificationFactory';
import {
  canLocalDatasetBeStoredInBackend,
  createNewDatasetFromSteps,
  initializeStepsInUrl,
  initStepDataOnLocalStorage,
  storeCreationStepsData,
  updateAllStepsForCompletion,
  updateStepValidation,
  updateStepsWithReadOnlyFields,
} from '@/factories/userCreationFactory';

import { mapState } from 'vuex';
import {
  getStepByName,
  getStepFromRoute,
  initializeSteps,
  metadataCreationSteps,
} from '@/factories/workflowFactory';
import { getMetadataVisibilityState } from '@/factories/metaDataFactory';
import { getReadOnlyFieldsObject } from '@/factories/mappingFactory';


export default {
  name: 'MetadataCreationPage',
  beforeRouteEnter(to, from, next) {

    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATA_CREATION_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);
    });
  },
  created() {
    this.creationSteps = initializeSteps(metadataCreationSteps);

    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.componentChanged);
    eventBus.on(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.on(SELECT_EDITING_AUTHOR, this.selectAuthor);
    eventBus.on(EDITMETADATA_NETWORK_ERROR, this.showSnackMessage);
    eventBus.on(METADATA_EDITING_FINISH_CLICK, this.catchBackClicked);

    eventBus.on(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.componentChanged);
    eventBus.off(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.off(SELECT_EDITING_AUTHOR, this.selectAuthor);
    eventBus.off(EDITMETADATA_NETWORK_ERROR, this.showSnackMessage);
    eventBus.off(METADATA_EDITING_FINISH_CLICK, this.catchBackClicked);

    eventBus.off(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);
  },
  beforeMount() {
    initializeStepsInUrl(this.creationSteps, this.routeStep, this.routeSubStep, this);

    const prefilledOrganizationId = this.userOrganizationIds?.length === 1 ? this.userOrganizationIds[0] : undefined;
    initStepDataOnLocalStorage(this.creationSteps, this.user, prefilledOrganizationId);

    this.setReadOnlyBasedOnVisibilty(this.creationSteps);
  },
  mounted() {
    // reset the scrolling to the top
    window.scrollTo(0, 0);

/*
    if (this.metadataId) {
      this.initMetadataUsingId(this.metadataId);
    }
*/

    if (this.user) {
      this.loadUserOrganizations();

      this.$nextTick(() => {

        const stepKey = this.validateCurrentStep();
        updateAllStepsForCompletion(this.creationSteps, stepKey);

        this.canSaveInBackend = canLocalDatasetBeStoredInBackend(this.creationSteps);
      });
    } else {
      eventBus.emit(SHOW_DIALOG, {
        title: 'Please Sign in!',
        message: 'For dataset creation you need to be signed in.',
        callback: () => {
          this.navigateToSignPage();
        },
      });
    }
  },
  computed: {
    ...mapState(['config']),
    ...mapState(USER_SIGNIN_NAMESPACE,[
      'user',
    ]),
    ...mapState(ORGANIZATIONS_NAMESPACE,[
      'userOrganizationIds',
    ]),
    ...mapState(USER_NAMESPACE, [
      'newMetadataset',
    ]),
/*
    ...mapState(USER_NAMESPACE, [
      'lastEditedBackPath',
      'currentEditingContent',
      'loadingCurrentEditingContent',
    ]),
    ...mapState(METADATA_NAMESPACE,[
      'authorsMap',
      'asciiDead',
    ]),
    ...mapGetters(USER_NAMESPACE, ['authors']),
    ...mapGetters(METADATA_NAMESPACE, [
      'existingAuthors',
      'existingKeywords',
    ]),
*/
    /**
     * @returns {String} the metadataId from the route
     */
    metadataId() {
      return '';
      // return this.$route.params.metadataid;
    },
    loading() {
      return false;
      // return this.loadingCurrentEditingContent || !this.currentEditingContent || this.authorsMapLoading;
    },
/*
    authorsMapLoading() {
      const map = this.authorsMap;

      return !map || Object.keys(map).length <= 0;
    },
*/
/*
    currentComponentLoading() {
      const step = getStepFromRoute(this.$route);
      return step?.genericProps?.loading || false;
    },
*/
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
    userEditMetadataConfig() {
      return this.config?.userEditMetadataConfig;
    },
  },
  methods: {
    setReadOnlyBasedOnVisibilty(steps) {
      const publicationState = getMetadataVisibilityState();
      const readOnlyObj = getReadOnlyFieldsObject(publicationState);

      if (readOnlyObj) {
        updateStepsWithReadOnlyFields(steps, readOnlyObj);
      }

    },
    async loadUserOrganizations() {
      await this.$store.dispatch(`${ORGANIZATIONS_NAMESPACE}/${USER_GET_ORGANIZATION_IDS}`, this.user?.id);

      // always call the USER_GET_ORGANIZATIONS action because it resolves the store & state also when userOrganizationIds is empty
      await this.$store.dispatch(`${ORGANIZATIONS_NAMESPACE}/${USER_GET_ORGANIZATIONS}`, this.userOrganizationIds);

      this.updateStepsOrganizations();
    },
    updateStepsOrganizations() {
      const userOrganizations = this.$store.state.organizations.userOrganizations

      storeCreationStepsData(EDITMETADATA_ORGANIZATION, { userOrganizations }, this.creationSteps)
    },
    /*
    async initMetadataUsingId(id) {
      if (id !== this.currentEditingContent?.name) {
        await this.$store.dispatch(`${USER_NAMESPACE}/${METADATA_EDITING_LOAD_DATASET}`, id);
      }

      this.updateLastEditingDataset(this.$route.params.metadataid, this.$route.path, this.$route.query.backPath);

      const publicationState = getMetadataVisibilityState(this.currentEditingContent);
      const readOnlyObj = getReadOnlyFieldsObject(publicationState);

      if (readOnlyObj) {
        updateStepsWithReadOnlyFields(this.creationSteps, readOnlyObj);
      }

      const stepKey = getStepFromRoute(this.$route, this.creationSteps);
      updateStepStatus(stepKey, this.creationSteps);
    },
    */
    updateLastEditingDataset(name, path, backPath) {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_LAST_DATASET}`, { name, path, backPath });
    },
    catchBackClicked() {
      const path = this.lastEditedBackPath || USER_DASHBOARD_PATH;
      this.$router.push({ path });
    },
    loadDatasetInEditingWorkflow(metadataId) {
      this.$router.push({
        name: METADATAEDIT_PAGENAME,
        params: {
          metadataid: metadataId,
        },
/*
        query: {
          backPath: this.$route.fullPath,
        },
*/
      });
    },
    navigateToSignPage() {
      this.$router.push({ name: USER_SIGNIN_PAGENAME });
    },
    async catchSaveNewDataset() {

      const data = createNewDatasetFromSteps(this.creationSteps, this.userEditMetadataConfig);
      const metadataId = data.name;

      await this.$store.dispatch(`${USER_NAMESPACE}/${METADATA_CREATION_DATASET}`, data);

      if (this.newMetadataset) {
        eventBus.emit(SHOW_DIALOG, {
          title: 'Dataset Saved!',
          message: 'Your datasets has been saved',
          callback: () => {
            this.loadDatasetInEditingWorkflow(metadataId);
            // localStorage.clear();
          },
        });
      }

    },
    catchAuthorCardAuthorSearch(fullName) {
      const cleanFullName = fullName.replace(`(${this.asciiDead})`, '').trim();

      const routeData = this.$router.resolve({ path:`${BROWSE_PATH}?search=${cleanFullName}&isAuthorSearch=true`});
      window.open(routeData.href, '_blank');
    },
    selectAuthor(email) {

      const step = getStepByName(EDITMETADATA_AUTHOR_LIST, this.creationSteps);
      const authors = step.genericProps.authors;

      const previousSelected = getSelectedElement(authors);

      if (previousSelected) {
        previousSelected.isSelected = false;

        this.componentChanged({
            object: EDITMETADATA_AUTHOR,
            data: previousSelected,
          },
          false);
      }

      const selectedAuthor = authors.filter(a => a.email === email)[0];

      selectedAuthor.isSelected = true;

      this.componentChanged({
          object: EDITMETADATA_AUTHOR,
          data: selectedAuthor,
        },
        false);
    },
    cancelEditingAuthor() {

      // don't use the the gene
      const authorStep = getStepByName(EDITMETADATA_AUTHOR_LIST, this.creationSteps);
      const authors = authorStep.genericProps.authors;

      const previousSelected = getSelectedElement(authors);

      if (previousSelected) {
        previousSelected.isSelected = false;

        this.componentChanged({
            object: EDITMETADATA_AUTHOR,
            data: previousSelected,
          },
          false);
      }
    },
    componentChanged(updateObj, resetMessages = true) {

      const dataKey = updateObj.object;
      const data = updateObj.data;

      storeCreationStepsData(dataKey, data, this.creationSteps, resetMessages);

      this.$nextTick(() => {
        this.canSaveInBackend = canLocalDatasetBeStoredInBackend(this.creationSteps);

        // updateStepValidation(dataKey, this.creationSteps);
        const stepKey = this.validateCurrentStep();
        updateAllStepsForCompletion(this.creationSteps, stepKey);
      });

    },
    validateCurrentStep() {
      const step = getStepFromRoute(this.$route, this.creationSteps);
      updateStepValidation(step.key, this.creationSteps);
      return step.key;
    },
    updateExistingAuthors(data) {
      this.$store.commit(`${METADATA_NAMESPACE}/${METADATA_UPDATE_AN_EXISTING_AUTHOR}`, data);
    },
    showSnackMessage({ status, statusMessage, details }) {

      const id = this.currentEditingContent?.id || null;
      const name = this.currentEditingContent?.name || null;

      if (id && name) {
        statusMessage = statusMessage.replace(id, `"${name}"`);
        details = details.replace(id, `"${name}"`);
      }

      const predefinedErrors = this.backendErrorList[status];
      this.errorTitle = predefinedErrors?.message || 'Fatal Error';
      this.errorMessage = `${statusMessage} ${details} ${predefinedErrors?.details || ''}`;

      this.showSnack = true;
    },
  },
  watch: {
/*
    currentComponentLoading() {
      if (!this.currentComponentLoading) {
        this.validateCurrentStep();
      }
    },
*/
    $route(){
/*
      this.updateLastEditingDataset(this.$route.params.metadataid, this.$route.path, this.$route.query.backPath);
*/

      const stepKey = this.validateCurrentStep();
      updateAllStepsForCompletion(this.creationSteps, stepKey);
    },
/*
    authorsMap() {

      if (this.currentEditingContent
        && this.authorsMap && Object.keys(this.authorsMap).length > 0) {

        const { categoryCards } = this.$store.getters;

        // re-trigger the populate of the data when the authorsMap is loaded for author enhancement
        populateEditingComponents(this.$store.commit, this.currentEditingContent, categoryCards, this.authorsMap);
      }
    },
*/
  },
  components: {
    NavigationStepper,
    // NotificationSnack,
    // BaseRectangleButton,
    // NotificationCard,
  },
  data: () => ({
    domain: process.env.VUE_APP_ENVIDAT_DOMAIN,
    creationSteps: null,
    canSaveInBackend: false,
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
