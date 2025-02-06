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
                       :saving="metadataCreationLoading"
                       :showSaveButton="canSaveInBackend"
                       :isCreationWorkflow="true"
                       :showProgress="true"
                       :loading="isLoadingUserOrganizations"
                       :dataset-title="currentDatasetTitle"
                       @clickedSaveDataset="catchSaveNewDataset"
                       @clickedClose="catchBackClicked" />


    <v-snackbar id="NotificationSnack"
                top
                elevation="0"
                color="transparent"
                timeout="10000"
                v-model="showSnack"
                >

      <NotificationCard v-if="creationError"
                        :notification="creationError"
                        :showCloseButton="true"
                        @clickedClose="showSnack = false" />

    </v-snackbar>

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
import { mapState } from 'vuex';
import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';

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
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_DATA,
  EDITMETADATA_PUBLICATION_INFO,
} from '@/factories/eventBus';

import {
  getSelectedElement,
} from '@/factories/userEditingFactory';

import {
  METADATA_CREATION_DATASET,
  METADATA_EDITING_LAST_DATASET,
  USER_NAMESPACE,
  USER_SIGNIN_NAMESPACE,
  FETCH_USER_DATA,
  ACTION_USER_SHOW,
  USER_GET_DATASETS,
} from '@/modules/user/store/userMutationsConsts';

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

import { METADATA_TITLE_PROPERTY } from '@/factories/metadataConsts';

import NavigationStepper from '@/components/Navigation/NavigationStepper.vue';

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
  readDataFromLocalStorage,
} from '@/factories/userCreationFactory';

import {
  getStepByName,
  getStepFromRoute,
  initializeSteps,
} from '@/factories/workflowFactory';

import {metadataCreationSteps} from '@/factories/workflowCreation';
import { getReadOnlyFieldsObject } from '@/factories/mappingFactory';
import { replaceAuthorDeadAscii } from '@/factories/authorFactory';


export default {
  name: 'MetadataCreationPage',
  beforeRouteEnter(to, from, next) {

    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATA_CREATION_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.pageBGImage);
    });
  },
  created() {
    this.organizationsStore = useOrganizationsStore();

    this.creationSteps = initializeSteps(metadataCreationSteps);

    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.componentChanged);
    eventBus.on(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.on(SELECT_EDITING_AUTHOR, this.selectAuthor);
    eventBus.on(EDITMETADATA_NETWORK_ERROR, this.showSnackMessage);
    eventBus.on(METADATA_EDITING_FINISH_CLICK, this.catchLastStepButtonClick);

    eventBus.on(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);
  },
  beforeUnmount() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.componentChanged);
    eventBus.off(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.off(SELECT_EDITING_AUTHOR, this.selectAuthor);
    eventBus.off(EDITMETADATA_NETWORK_ERROR, this.showSnackMessage);
    eventBus.off(METADATA_EDITING_FINISH_CLICK, this.catchLastStepButtonClick);

    eventBus.off(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);
  },
  beforeMount() {
    initializeStepsInUrl(this.creationSteps, this.routeStep, this.routeSubStep, this);

    const prefilledOrganizationId = this.organizationsStore.userOrganizationIds?.length === 1 ? this.organizationsStore.userOrganizationIds[0] : undefined;
    initStepDataOnLocalStorage(this.creationSteps, this.user, prefilledOrganizationId);

    this.setReadOnlyBasedOnVisibility(this.creationSteps);
  },
  mounted() {
    // reset the scrolling to the top
    window.scrollTo(0, 0);


    if (this.user) {
      this.initializeMetadata();
    } else if (!this.userLoading) {
      this.showDialogSignInNeeded();
    }
  },
  computed: {
    ...mapState(['config']),
    ...mapState(USER_SIGNIN_NAMESPACE,[
      'user',
      'userLoading',
    ]),
    ...mapState(USER_NAMESPACE, [
      'newMetadatasetName',
      'metadataCreationError',
      'metadataCreationLoading',
    ]),
    currentDatasetTitle() {
      const step = getStepByName(EDITMETADATA_MAIN_HEADER, this.creationSteps);
      return step?.genericProps[METADATA_TITLE_PROPERTY];
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
    creationError() {
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
    setReadOnlyBasedOnVisibility(steps) {
      const publicationStep = getStepByName(EDITMETADATA_PUBLICATION_INFO, steps);
      const readOnlyObj = getReadOnlyFieldsObject(publicationStep?.genericProps?.publicationState);

      if (readOnlyObj) {
        updateStepsWithReadOnlyFields(steps, readOnlyObj);
      }

    },
    async loadUserOrganizations() {
      this.isLoadingUserOrganizations = true;
      try {
        if (!this.organizationsStore.userOrganizations || this.organizationsStore.userOrganizations.length === 0) {
          await this.organizationsStore.UserGetOrgIds(this.user?.id);

          const userId = this.user?.id;
          if (!userId) {
            return;
          }

          await this.$store.dispatch(`${USER_NAMESPACE}/${FETCH_USER_DATA}`, {
            action: ACTION_USER_SHOW,
            body: {
              id: userId,
              include_datasets: true,
            },
            commit: true,
            mutation: USER_GET_DATASETS,
          });
        }

        this.updateStepsOrganizations(this.organizationsStore.userOrganizations);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.isLoadingUserOrganizations = false;
      }
    },
    updateStepsOrganizations(userOrganizations) {
      // Get any already existing information from the local storage
      // to make sure not to overwrite anything!
      const existingOrganizationData = readDataFromLocalStorage(EDITMETADATA_ORGANIZATION);

      const data = {
        ...existingOrganizationData,
        userOrganizations,
      }

      storeCreationStepsData(EDITMETADATA_ORGANIZATION, data, this.creationSteps, true, false)
    },
    updateLastEditingDataset(name, path, backPath) {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_LAST_DATASET}`, { name, path, backPath });
    },
    catchBackClicked() {
      const path = USER_DASHBOARD_PATH;
      this.$router.push({ path });
    },
    catchLastStepButtonClick() {
      this.catchSaveNewDataset();
    },
    loadDatasetInEditingWorkflow(metadataId) {

      const resourceStep = getStepByName(EDITMETADATA_DATA, this.creationSteps);
      const title = resourceStep?.title || undefined;

      this.$router.push({
        name: METADATAEDIT_PAGENAME,
        params: {
          metadataid: metadataId,
          step: title,
        },
      });
    },
    initializeMetadata() {
      this.loadUserOrganizations();

      this.$nextTick(() => {
        updateAllStepsForCompletion(this.creationSteps);

        this.canSaveInBackend = canLocalDatasetBeStoredInBackend(this.creationSteps);
      });
    },
    showDialogSignInNeeded() {
      eventBus.emit(SHOW_DIALOG, {
        title: 'Please Sign in!',
        message: 'For dataset creation you need to be signed in.',
        callback: () => {
          this.navigateToSignPage();
        },
      });
    },
    navigateToSignPage() {
      this.$router.push({ name: USER_SIGNIN_PAGENAME });
    },
    async catchSaveNewDataset() {

      const data = createNewDatasetFromSteps(this.creationSteps, this.userEditMetadataConfig);
      const metadataId = data.name;

      await this.$store.dispatch(`${USER_NAMESPACE}/${METADATA_CREATION_DATASET}`, data);

      if (this.newMetadatasetName) {
        eventBus.emit(SHOW_DIALOG, {
          title: 'Dataset Saved!',
          message: `Your datasets ${ this.newMetadatasetName } has been saved successfully and it's now part of your dashboard! <br /> <br />
          Would you like to continue editing the dataset to upload resources and add additional metadata?`,
          callback: () => {
            localStorage.clear();
            this.loadDatasetInEditingWorkflow(metadataId);
          },
          cancelCallback: () => {
            localStorage.clear();
            this.catchBackClicked();
          },
          confirmText: 'Upload Resources',
          cancelText: 'Go to Dashboard',
        });
      } else {
        this.showSnackMessage({
          status: 'Creation Failed',
          statusMessage: this.metadataCreationError.message,
          details: this.metadataCreationError.details,
        });
      }

    },
    catchAuthorCardAuthorSearch(fullName) {
      const cleanFullName = replaceAuthorDeadAscii(fullName);

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
        updateAllStepsForCompletion(this.creationSteps);
        this.canSaveInBackend = canLocalDatasetBeStoredInBackend(this.creationSteps);
      });

    },
    validateCurrentStep() {
      const step = getStepFromRoute(this.$route, this.creationSteps);
      updateStepValidation(step, this.creationSteps);
      return step.key;
    },
    showSnackMessage({ status, statusMessage, details }) {

      this.errorTitle = status;
      this.errorMessage = `${statusMessage} ${details}`;

      this.showSnack = true;
    },
  },
  watch: {
    $route(){
      updateAllStepsForCompletion(this.creationSteps);
    },
    userLoading() {
      if(!this.userLoading) {
        if (this.user) {
          this.initializeMetadata();
        } else {
          this.showDialogSignInNeeded();
        }
      }
    },
  },
  components: {
    NavigationStepper,
  },
  data: () => ({
    isLoadingUserOrganizations: false,
    organizationsStore: null,
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
