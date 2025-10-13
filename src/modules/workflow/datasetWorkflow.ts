import { defineStore } from 'pinia';

import {
  USER_ROLE_MEMBER,
  USER_ROLE_EDITOR,
  USER_ROLE_SYSTEM_ADMIN,
} from '@/factories/userEditingValidations';

import {
  enhanceAdminWorkflowStep,
  workflowSteps,
} from '@/modules/workflow/resources/steps';

import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { LocalStorageDatasetService } from '@/modules/workflow/LocalStorageDatasetService.ts';
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { DatasetService, User } from '@/types/modelTypes';
import { BackendDatasetService } from '@/modules/workflow/BackendDatasetService.ts';
import { workflowGuide } from '@/modules/workflow/resources/workflowGuides.ts';
import { getYear } from 'date-fns';

import { readOnlyFields } from '@/modules/workflow/resources/readOnlyList.ts';
import { resolveBootstrap } from '@/modules/workflow/utils/workflowBootstrap.ts';
import {
  computeStepsForMode,
  enhanceStepsFromData,
} from '@/modules/workflow/utils/mode.ts';
import {
  mustValidateOnLeave as mustValidateOnLeaveUtil,
  setActiveStepForCreate,
  getNextUncompletedStep as getNextUncompletedStepUtil,
} from '@/modules/workflow/utils/workflowNavigation';

import { validateStepPure } from '@/modules/workflow/utils/workflowValidation';
import type { WorkflowStep } from '@/types/workflow';
import {
  StepStatus,
  WorkflowMode,
} from '@/modules/workflow/utils/workflowEnums';

import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';
import { getMetadataUrlFromTitle } from '@/factories/mappingFactory';

import { makeMaintainerFromUser } from '@/modules/workflow/utils/formatPostData';
import { LOCAL_DATASET_KEY } from '@/factories/metadataConsts';

/*
import datasets from '~/stories/js/metadata.js';

let datasetVM = new DatasetModel(new LocalStorageDatasetService());
if (import.meta.env.MODE === 'development') {
  daimport { dataset } from '../../../public/testdata/dataset_10-16904-1';
taseimport { user } from '../user/store/userStore';
tVM = new DatasetModel(new LocalStorageDatasetService(datasets[2]));
}
*/

export interface DatasetWorkflowState {
  loading: boolean;
  currentStep: number;
  steps: WorkflowStep[];
  datasetModel: DatasetModel;
  isStepSaveConfirmed: boolean;
  freeJump: boolean;
  stepForBackendChange: number;
  mode: WorkflowMode;
  isReadOnlyStep: string[];
  backendStorageService: BackendDatasetService;
  doiPlaceholder: null;
  listOfReadOnlyFields: string[];
  openSaveDialog: boolean;
  localStorageService: LocalStorageDatasetService;
  userRole?: string;
  uploadingResourceId?: string;
  saveErrorMessage?: string;
  readyToSaveToBackend?: boolean;
  workflowGuide?: any[];
  currentDatasetId?: string;
  dataSource: 'local' | 'backend';
  currentUser?: any;

  /*
  workflowGuide: ({ popover: { description: string; title: string }; element: string } | {
    popover: { description: string; title: string };
    element: string
  } | { popover: { description: string; title: string }; element: string } | {
    popover: { description: string; title: string };
    element: string
  } | { popover: { description: string; title: string }; element: string } | {
    popover: { description: string; title: string };
    element: string
  } | { popover: { description: string; title: string }; element: string } | {
    popover: { description: string; title: string };
    element: string
  })[];
*/
}

export const useDatasetWorkflowStore = defineStore('datasetWorkflow', {
  state: (): DatasetWorkflowState => ({
    loading: false,
    currentStep: 0,
    steps: workflowSteps,
    datasetModel: undefined, // needs to be initialized during runtime, because it needs a reference to the store
    localStorageService: new LocalStorageDatasetService(),
    backendStorageService: new BackendDatasetService(),
    openSaveDialog: false,
    isStepSaveConfirmed: false,
    // list of readOnlyFields
    // if you need to find those items in the code just search for this isReadOnly('visibility')
    listOfReadOnlyFields: [...readOnlyFields],
    // define readOnly steps to manage the navigation (UI only)
    isReadOnlyStep: [
      'AuthorsInformation',
      'additionalinformation',
      'publicationinformation',
    ],

    freeJump: false,
    stepForBackendChange: 3,
    doiPlaceholder: null,
    workflowGuide,
    mode: WorkflowMode.Create,
    userRole: undefined,
    uploadingResourceId: undefined,
    dataSource: 'local' as const,
    currentUser: undefined,
  }),
  getters: {
    // GET the current step component
    currentAsyncComponent(state) {
      return state.steps[state.currentStep]?.component;
    },

    // GET the current step viewModel
    currentViewModel(state) {
      const step = state.steps[state.currentStep] as WorkflowStep;
      if (!state.datasetModel || !step?.viewModelKey) return null;

      // get the viewModel
      const vmInstance = state.datasetModel.getViewModel(step.viewModelKey);

      return vmInstance;
    },

    // GET if the dataset is in edit mode - used in TheWorkflowNavigation and WorkFlowPage. We build the logic on it to define which UI we need to use
    isDatasetEditing(): boolean {
      return this.mode === WorkflowMode.Edit;
    },
  },
  actions: {
    // SET the current user
    setCurrentUser(u: any) {
      this.currentUser = u ?? undefined;
    },
    // SET the user role
    setUserRole(role?: string) {
      debugger;
      this.userRole = role;
    },
    // CHECK if the value has data
    hasDtData(val: any): boolean {
      if (val == null) return false;
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'object') {
        return Object.values(val).some(this.hasDtData);
      }
      return String(val).trim().length > 0;
    },
    // RESET status of the workflow
    resetStatus() {
      this.doiPlaceholder = null;
      this.openSaveDialog = false;
      this.isStepSaveConfirmed = false;
    },
    // LOAD the dataset from the backend service
    async loadDataset(datasetId: string) {
      return this.datasetModel.loadDataset(datasetId);
    },

    async initializeDataset(dataset: DatasetDTO, mode: WorkflowMode) {
      this.mode = mode;
      this.datasetModel = new DatasetModel(this);

      // SET default values for the dataset
      // if (mode === WorkflowMode.Create && dataset) {
      //   if (this.localStorageService?.patchDatasetChanges) {
      //     await this.localStorageService.patchDatasetChanges(dataset);
      //   } else {
      //     await this.localStorageService.createDataset(dataset as any);
      //   }
      // }

      // SET Admin role if the user is admin
      const baseSteps = enhanceAdminWorkflowStep(this.userRole, this.steps);

      // SET the navigation based on the mode
      const { steps: shapedByMode, freeJump } = computeStepsForMode(
        baseSteps,
        this.isReadOnlyStep,
        mode,
        this.dataSource,
      );

      // SET navigation based on the data available in the datasetModel
      const { steps: evaluated, startIdx } = enhanceStepsFromData(
        shapedByMode,
        this.datasetModel,
        this.hasDtData,
        mode,
      );

      this.steps = evaluated;
      this.freeJump = freeJump;

      if (mode === WorkflowMode.Create) {
        this.setActiveStep(startIdx);
      } else {
        this.currentStep = 0;
      }

      // RESET
      this.resetStatus();
    },

    // CHECK if the field is readonly based on the mode and the list of readOnlyFields.
    // IMPORTANT - This function is used in all components that where we need to check if the field is readonly or not.
    isFieldReadonly(fieldKey: string): boolean {
      if (this.mode === WorkflowMode.Create) return false;
      return this.listOfReadOnlyFields.includes(fieldKey);
    },

    // MAIN LOGIC – We define the environment to be used.
    // This function is the page initializer and is called on mounted by bootstrapWorkflow.
    // PLEASE NOTE – We are currently in the development phase, and an exception is present to make Storybook work.
    // We need to fine-tune this logic.
    async bootstrapWorkflow(datasetId?: string) {
      this.loading = true;

      try {
        const { dto, mode, source } = await resolveBootstrap<DatasetDTO>(
          datasetId,
          {
            loadBackend: (id) => this.backendStorageService.loadDataset(id),
            loadLocal: (id) => this.localStorageService.loadDataset(id),
            createLocal: (init) =>
              this.localStorageService.createDataset(init as DatasetDTO),
          },
        );
        // this.setWorkflowMode(mode);
        this.dataSource = source;
        await this.initializeDataset(dto, mode);
        return { id: dto.id, mode };
      } finally {
        this.loading = false;
      }
    },

    // RETURN the dataset service to use based on the current mode.
    // Based on the dataSource we will use the local or the backend service.
    // The source is defined in the bootstrapWorkflow function -> resolveBootstrap()
    getDatasetService(): DatasetService {
      return this.dataSource === 'backend'
        ? this.backendStorageService
        : this.localStorageService;
    },

    // // SET the mode to WorkflowMode.Create or WorkflowMode.Edit.
    // // Controls navigation flow, read-only UI state, and step editability based on the mode.
    // // EXAMPLE - In WorkflowMode.Edit mode, steps become editable, allowing free navigation.
    // setWorkflowMode(mode: WorkflowMode) {
    //   this.mode = mode;

    //   const { steps, freeJump } = computeStepsForMode(
    //     this.steps,
    //     this.isReadOnlyStep,
    //     mode,
    //   );

    //   this.steps = steps;
    //   this.freeJump = freeJump;
    // },

    // STORYBOOK
    // PLEASE NOTE – We are currently in the development phase, and an exception is present to make Storybook work.
    // initializeWorkflowfromDataset is used on WorkflowPage.vue
    async initializeWorkflowfromDataset(dataset?: DatasetDTO) {
      this.localStorageService = new LocalStorageDatasetService();

      if (!dataset) {
        await this.localStorageService.createDataset({});
      } else {
        await this.localStorageService.patchDatasetChanges(dataset);
      }

      this.setWorkflowMode(WorkflowMode.Edit);
    },

    // resetSteps() {
    //   this.steps.forEach((s: WorkflowStep) => {
    //     if (s.id === 0) {
    //       s.isEditable = true;
    //       s.status = StepStatus.Active;
    //     } else {
    //       s.isEditable = false;
    //       s.status = StepStatus.Disabled;
    //     }

    //     s.completed = false;
    //     s.hasError = false;
    //   });
    // },

    // SET the current step to the given id.
    jumpToStep(id: number) {
      this.freeJump = true;
      this.setActiveStep(id);
      this.freeJump = false;
    },
    // SET the current step to the given id and navigate to it.
    navigateItemAction(id, status) {
      if (!this.freeJump) {
        if (status === StepStatus.Disabled) return;

        this.currentStep = id;
        return;
      }

      this.setActiveStep(id);
    },

    // SET setActiveStep differs for create vs edit:
    // CREATE linear wizard. Current step -> Active; others keep their status (Completed/Error) or become Disabled.
    // EDIT free jump. Only mark the selected step as Active, leave the rest unchanged.
    setActiveStep(id: number) {
      if (this.mode === WorkflowMode.Create) {
        this.steps = setActiveStepForCreate(this.steps, id);
      }
      this.currentStep = id;
    },

    // setCurrentStepAction() {
    //   // find the next element with status != completed
    //   const next = this.steps.find((el) => el.status !== StepStatus.Completed);
    //   console.log(next);
    //   if (this.steps[next.id]) {
    //     this.steps[next.id].status = StepStatus.Active;
    //     this.currentStep = next.id;
    //   }
    // },

    getNextUncompletedStep(fromId: number) {
      return getNextUncompletedStepUtil(this.steps, fromId);
    },

    // EDIT mode: if the user changes something in this step, mark it as "dirty".
    // We will force a validation before allowing navigation away from this step.
    // ONLY UI/UX logic
    markStepDirty(stepId: number, dirty = true) {
      const s = this.steps[stepId];
      if (s && !s.readOnly) s.dirty = dirty;
    },

    // EDIT mode: use this to check if the step must be validated before leaving it.
    // ONLY UI/UX logic
    mustValidateOnLeave(stepId: number) {
      const s = this.steps[stepId];
      return mustValidateOnLeaveUtil(this.mode, s);
    },

    // SET the step as completed and validate the data.
    validateStepAction(stepId: number): boolean {
      const step = this.steps[stepId];
      const vm = this.currentViewModel as any;

      const { ok, diff, openSaveDialog } = validateStepPure({
        mode: this.mode,
        stepId,
        step,
        vm,
        stepForBackendChange: this.stepForBackendChange,
        isStepSaveConfirmed: this.isStepSaveConfirmed,
      });

      if (openSaveDialog && this.dataSource === 'local') {
        this.openSaveDialog = true;
        return false;
      }

      if (diff) {
        Object.assign(this.steps[stepId], diff);
      }

      // this.setCurrentStepAction();
      return ok;
    },

    // SET the step as touched.
    markStepTouched(stepId: number, touched = true) {
      const s = this.steps[stepId];
      if (s) s.touched = touched;
    },

    // TODO implement the real function for get the DOI
    reserveDoi(datasetId: string) {
      this.backendStorageService.requestDoi(datasetId);
      // this.doiPlaceholder = '10.10000/envidat.1234';
    },

    // TODO remove only the dataset with the ID
    clearLocalStorage() {
      const localDataset = this.localStorageService;
      if (localDataset) {
        localStorage.removeItem(LOCAL_DATASET_KEY);
      } else {
        localStorage.clear();
      }

      this.localStorageService = new LocalStorageDatasetService();
    },
    setUploadResource(resourceId: string | undefined) {
      this.uploadingResourceId = resourceId;
    },
    // Ehnance the default properties of the dataset
    applyDatasetDefaults(dataset: DatasetDTO, id: string) {
      const orgStore = useOrganizationsStore();

      const firstOrg = orgStore.userOrganizations?.[0];

      const publicationObj = {
        publisher: 'EnviDat',
        publication_year: String(getYear(new Date())),
      };
      const publication = JSON.stringify(publicationObj);
      const maintainer = this.currentUser
        ? makeMaintainerFromUser(this.currentUser)
        : ((dataset as any)?.maintainer ?? '');

      // '{"email":"enrico.peruselli@wsl.ch","given_name":"Enrico","name":"Peruselli"}',
      return {
        ...dataset,
        id: id || '',
        // owner_org: dataset.owner_org,
        // organization: dataset.organization ? organizations : undefined,
        name: dataset.title ? getMetadataUrlFromTitle(dataset.title) : '',
        private: true,
        resource_type_general: 'dataset',
        publication,
        maintainer,
      };
    },
    computeUserRole(args: {
      user?: any;
      userOrganizations?: Array<{ id: string; name?: string }>;
      userDatasets?: Array<{ id: string }>;
    }) {
      const { user, userOrganizations = [], userDatasets = [] } = args || {};
      const ds = this.datasetModel?.dataset;

      if (!user || !ds) {
        this.userRole = USER_ROLE_MEMBER;
        return this.userRole;
      }

      if (user.sysadmin === true) {
        this.userRole = USER_ROLE_SYSTEM_ADMIN;
        return this.userRole;
      }

      const inOrg = userOrganizations.some(
        (o) => o.id === ds?.organization?.id,
      );
      const isOwner = userDatasets.some((d) => d.id === ds?.id);

      this.userRole = inOrg && isOwner ? USER_ROLE_EDITOR : USER_ROLE_MEMBER;
      return this.userRole;
    },
  },
});
