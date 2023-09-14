<template>
  <v-container
    class="pa-0 fill-height"
    fluid
    id="MetadataEditPage"
    tag="article"
  >
    <!-- prettier-ignore -->
    <NavigationStepper :steps="editingSteps"
                       :step="routeStep"
                       :subStep="routeSubStep"
                       stepColor="highlight"
                       :loading="loading"
                       :saving="loadingEditingData"
                       showPreviewButton
                       :dataset-title="currentEditingContent?.title"
                       @clickedPreview="catchPreviewClicked"
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
import { mapGetters, mapState } from 'vuex';

import {
  eventBus,
  CANCEL_EDITING_AUTHOR,
  CANCEL_EDITING_RESOURCE,
  EDITMETADATA_NETWORK_ERROR,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_ORGANIZATION,
  METADATA_EDITING_FINISH_CLICK,
  SAVE_EDITING_RESOURCE,
  SELECT_EDITING_AUTHOR,
  SELECT_EDITING_RESOURCE,
  EDITMETADATA_AUTHOR,
  REMOVE_EDITING_AUTHOR,
  AUTHOR_SEARCH_CLICK,
  EDITMETADATA_DATA_RESOURCE,
  SHOW_DIALOG,
  EDITMETADATA_DATA,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_PUBLICATION_STATE,
  EDITMETADATA_PUBLICATION_INFO,
} from '@/factories/eventBus';

import {
  componentChangedEvent,
} from '@/factories/userEditingFactory';

import {
  METADATA_CANCEL_AUTHOR_EDITING,
  METADATA_CANCEL_RESOURCE_EDITING,
  METADATA_EDITING_LAST_DATASET,
  METADATA_EDITING_LOAD_DATASET,
  METADATA_EDITING_PATCH_DATASET_OBJECT,
  METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
  METADATA_EDITING_PATCH_RESOURCE,
  METADATA_EDITING_REMOVE_AUTHOR,
  METADATA_EDITING_SAVE_AUTHOR,
  METADATA_EDITING_SELECT_AUTHOR,
  METADATA_EDITING_SELECT_RESOURCE,
  UPDATE_METADATA_EDITING,
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
  METADATADETAIL_PATH,
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

import { getReadOnlyFieldsObject, populateEditingComponents } from '@/factories/mappingFactory';
import NavigationStepper from '@/components/Navigation/NavigationStepper.vue';
import NotificationCard from '@/components/Cards/NotificationCard.vue';
import { errorMessage } from '@/factories/notificationFactory';
import { getMetadataVisibilityState } from '@/factories/metaDataFactory';

import {
  initializeStepsInUrl,
  updateStepValidation,
  updateStepsWithReadOnlyFields,
  updateAllStepsForCompletion,
} from '@/factories/userCreationFactory';

import {
  getDataKeysToStepKey,
  getStepByName,
  getStepFromRoute,
  initializeSteps,
  metadataEditingSteps,
} from '@/factories/workflowFactory';

import { DOI_API_ACTIONS, DOI_RESERVE } from '@/modules/user/store/doiMutationsConsts';
import {
  getUserOrganizationRoleMap,
  USER_ROLE_EDITOR,
  USER_ROLE_MEMBER,
} from '@/factories/userEditingValidations';


export default {
  name: 'MetadataEditPage',
  beforeRouteEnter(to, from, next) {

    next((vm) => {
      vm.$store.commit(SET_CURRENT_PAGE, METADATAEDIT_PAGENAME);
      vm.$store.commit(SET_APP_BACKGROUND, vm.PageBGImage);

      // vm.updateLastEditingDataset(to.params.metadataid, to.fullPath);
    });
  },
  created() {
    this.editingSteps = initializeSteps(metadataEditingSteps);

    eventBus.on(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    eventBus.on(SAVE_EDITING_RESOURCE, this.saveResource);
    eventBus.on(CANCEL_EDITING_RESOURCE, this.cancelEditingResource);
    eventBus.on(SELECT_EDITING_RESOURCE, this.selectResource);
    eventBus.on(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.on(SELECT_EDITING_AUTHOR, this.selectAuthor);
    eventBus.on(EDITMETADATA_NETWORK_ERROR, this.showSnackMessage);
    eventBus.on(METADATA_EDITING_FINISH_CLICK, this.catchBackClicked);

    eventBus.on(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_OBJECT_UPDATE, this.editComponentsChanged);
    eventBus.off(SAVE_EDITING_RESOURCE, this.saveResource);
    eventBus.off(CANCEL_EDITING_RESOURCE, this.cancelEditingResource);
    eventBus.off(SELECT_EDITING_RESOURCE, this.selectResource);
    eventBus.off(CANCEL_EDITING_AUTHOR, this.cancelEditingAuthor);
    eventBus.off(SELECT_EDITING_AUTHOR, this.selectAuthor);
    eventBus.off(EDITMETADATA_NETWORK_ERROR, this.showSnackMessage);
    eventBus.off(METADATA_EDITING_FINISH_CLICK, this.catchBackClicked);

    eventBus.off(AUTHOR_SEARCH_CLICK, this.catchAuthorCardAuthorSearch);
  },
  beforeMount() {
    initializeStepsInUrl(this.editingSteps, this.routeStep, this.routeSubStep, this);
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
    ...mapState(USER_SIGNIN_NAMESPACE,[
      'user',
      'userLoading',
    ]),
    ...mapState(ORGANIZATIONS_NAMESPACE,[
      'userOrganizationIds',
    ]),
    ...mapState(USER_NAMESPACE, [
      'lastEditedBackPath',
      'currentEditingContent',
      'loadingCurrentEditingContent',
      'loadingEditingData',
      'uploadLoading',
      'uploadNewResourceLoading',
      'userDatasets',
    ]),
    ...mapState(METADATA_NAMESPACE,[
      'authorsMap',
      'asciiDead',
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
      return this.loadingCurrentEditingContent || !this.currentEditingContent || this.authorsMapLoading;
    },
    authorsMapLoading() {
      const map = this.authorsMap;

      return !map || Object.keys(map).length <= 0;
    },
    currentComponentLoading() {
      const step = getStepFromRoute(this.$route, this.editingSteps);
      return step?.genericProps?.loading || false;
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
    initStepDataFromStore(steps) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        const dataKeys = getDataKeysToStepKey(step.key);
        // use the stepKey itself aswell, for merged step data and flat stored
        dataKeys.push(step.key);

        let mergedData = {};

        for (let j = 0; j < dataKeys.length; j++) {
          const dataKey = dataKeys[j];
          const data = this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](dataKey);

          if (data) {
            mergedData = {
              ...mergedData,
              ...data,
            }
          }
        }

        step.genericProps = mergedData;

        if (step.detailSteps) {
          this.initStepDataFromStore(step.detailSteps)
        }
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

      const editOrgaData = this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_ORGANIZATION);
      const currentOrgaId = editOrgaData.organizationId;

      this.$store.commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`,
        {
          object: EDITMETADATA_ORGANIZATION,
          data: {
            ...editOrgaData,
            userOrganizations,
          },
        },
      );


      const roleMap = getUserOrganizationRoleMap(this.user.id, this.userOrganizations);
      let userRole = roleMap[currentOrgaId];

      if (userRole === USER_ROLE_EDITOR) {
        const userIsOwner = this.userDatasets?.length > 0 ? this.userDatasets.filter((d) => d.id === this.currentEditingContent?.id)[0] : false;
        if (!userIsOwner) {
          userRole = USER_ROLE_MEMBER;
        }
      }

      const editPublicationInfo = this.$store.getters[`${USER_NAMESPACE}/getMetadataEditingObject`](EDITMETADATA_PUBLICATION_INFO);

      this.$store.commit(`${USER_NAMESPACE}/${UPDATE_METADATA_EDITING}`,
        {
          object: EDITMETADATA_PUBLICATION_INFO,
          data: {
            ...editPublicationInfo,
            userRole,
          },
        },
      );

    },
    async initMetadataUsingId(id) {
      if (id !== this.currentEditingContent?.name) {

        if (!this.currentEditingContent?.doi) {
          // always call the doi reserve on dataset without a doi so one get reserved
          // automatically for any datasets opened in the editing workflow
          await this.$store.dispatch(`${USER_NAMESPACE}/${DOI_RESERVE}`, id);
        }

        // load the metadata from the backend for editing
        await this.$store.dispatch(`${USER_NAMESPACE}/${METADATA_EDITING_LOAD_DATASET}`, id);
      }

      this.initStepDataFromStore(this.editingSteps);

      this.updateLastEditingDataset(this.$route.params.metadataid, this.$route.path, this.$route.query.backPath);

      const publicationState = getMetadataVisibilityState(this.currentEditingContent);
      const readOnlyObj = getReadOnlyFieldsObject(publicationState);

      if (readOnlyObj) {
        updateStepsWithReadOnlyFields(this.editingSteps, readOnlyObj);
      }

      this.validateCurrentStep();

      updateAllStepsForCompletion(this.editingSteps);
    },
    updateLastEditingDataset(name, path, backPath) {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_LAST_DATASET}`, { name, path, backPath });
    },
    catchBackClicked() {
      const path = this.lastEditedBackPath || USER_DASHBOARD_PATH;
      this.$router.push({ path });
    },
    catchPreviewClicked() {
      const routeData = this.$router.resolve({ path:`${METADATADETAIL_PATH}/${this.metadataId}`});
      window.open(routeData.href, '_blank');
    },
    catchAuthorCardAuthorSearch(fullName) {
      const cleanFullName = fullName.replace(`(${this.asciiDead})`, '').trim();

      const routeData = this.$router.resolve({ path:`${BROWSE_PATH}?search=${cleanFullName}&isAuthorSearch=true`});
      window.open(routeData.href, '_blank');
    },
    selectResource(id) {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_SELECT_RESOURCE}`, id);
      this.updateResourceStepFromStore();
    },
    selectAuthor(id) {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_EDITING_SELECT_AUTHOR}`, id);
    },
    cancelEditingResource() {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_CANCEL_RESOURCE_EDITING}`);
      this.updateResourceStepFromStore();
    },
    cancelEditingAuthor() {
      this.$store.commit(`${USER_NAMESPACE}/${METADATA_CANCEL_AUTHOR_EDITING}`);
    },
    saveResource(newRes) {

      this.editComponentsChanged({
        object: EDITMETADATA_DATA_RESOURCE,
        data: newRes,
      });
    },
    updateResourceStepFromStore() {
      const dataStep = getStepByName(EDITMETADATA_DATA, this.editingSteps);
      const resourceStep = getStepByName(EDITMETADATA_DATA_RESOURCES, dataStep.detailSteps);
      this.initStepDataFromStore([resourceStep]);
    },
    editComponentsChanged(updateObj) {

      const dataKey = updateObj.object;
      const editPayload = componentChangedEvent(updateObj, this);

      // overwrite the action and the payload to fit the specific
      // backend call to change the ownership of a dataset
      const action = this.getUserAction(dataKey);

      // save the full dataObject it in the backend
      this.$store.dispatch(`${USER_NAMESPACE}/${action}`, editPayload);


      this.$nextTick(() => {
        // if (updateObj.object === EDITMETADATA_AUTHOR) {
        //  this.updateExistingAuthors(updateObj.data);
        // }
        const step = getStepByName(dataKey, this.editingSteps);
        updateStepValidation(step, this.editingSteps);
      });

    },
    validateCurrentStep() {
      const step = getStepFromRoute(this.$route, this.editingSteps);
      updateStepValidation(step, this.editingSteps);
    },
    getUserAction(stepKey) {
      return this.userActions[stepKey] || METADATA_EDITING_PATCH_DATASET_OBJECT;
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
    initializeMetadata() {
      if (this.metadataId) {
        this.$nextTick(() => {
          this.initMetadataUsingId(this.metadataId);
        });
      }

      this.$nextTick(() => {
        this.loadUserOrganizations();
      });
    },
    showDialogSignInNeeded() {
      eventBus.emit(SHOW_DIALOG, {
        title: 'Please Sign in!',
        message: 'For dataset editing you need to be signed in.',
        callback: () => {
          this.navigateToSignPage();
        },
      });
    },
    navigateToSignPage() {
      this.$router.push({ name: USER_SIGNIN_PAGENAME });
    },
  },
  watch: {
    uploadLoading() {
      if (!this.uploadLoading) {
        // this.initStepDataFromStore(this.editingSteps);
        this.updateResourceStepFromStore();
      }
    },
    uploadNewResourceLoading() {
      if (!this.uploadNewResourceLoading) {
        this.updateResourceStepFromStore();
      }
    },
    loadingEditingData() {
      if (!this.loadingEditingData) {
        this.initStepDataFromStore(this.editingSteps);
      }
    },
    currentComponentLoading() {
      if (!this.currentComponentLoading) {
        this.validateCurrentStep();
      }
    },
    $route(){
      this.updateLastEditingDataset(this.$route.params.metadataid, this.$route.path, this.$route.query.backPath);

      this.validateCurrentStep();

      updateAllStepsForCompletion(this.editingSteps);
    },
    authorsMap() {

      if (this.currentEditingContent
        && this.authorsMap && Object.keys(this.authorsMap).length > 0) {

        const { categoryCards } = this.$store.getters;

        // re-trigger the populate of the data when the authorsMap is loaded for author enhancement
        populateEditingComponents(this.$store.commit, this.currentEditingContent, categoryCards);
      }
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
    // NotificationSnack,
    // BaseRectangleButton,
    NotificationCard,
  },
  data: () => ({
    editingSteps: null,
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
    userActions: {
      [EDITMETADATA_ORGANIZATION]: METADATA_EDITING_PATCH_DATASET_ORGANIZATION,
      [EDITMETADATA_AUTHOR]: METADATA_EDITING_SAVE_AUTHOR,
      [REMOVE_EDITING_AUTHOR]: METADATA_EDITING_REMOVE_AUTHOR,
      [EDITMETADATA_DATA_RESOURCE]: METADATA_EDITING_PATCH_RESOURCE,
      [EDITMETADATA_PUBLICATION_STATE]: DOI_API_ACTIONS,
    },
  }),
};
</script>

<style></style>
