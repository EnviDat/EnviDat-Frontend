import { defineStore } from 'pinia';

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

import { readOnlyFields } from '@/modules/workflow/resources/readOnlyList.ts';
import { resolveBootstrap } from '@/modules/workflow/utils/workflowBootstrap.ts';
import { computeStepsForMode } from '@/modules/workflow/utils/mode.ts';
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

/*
import datasets from '~/stories/js/metadata.js';

let datasetVM = new DatasetModel(new LocalStorageDatasetService());
if (import.meta.env.MODE === 'development') {
  daimport { dataset } from '../../../public/testdata/dataset_10-16904-1';
tasetVM = new DatasetModel(new LocalStorageDatasetService(datasets[2]));
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
    // CHECK if the value has data
    hasDtData(val: any): boolean {
      if (val == null) return false;
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'object') {
        return Object.values(val).some(this.hasDtData);
      }
      return String(val).trim().length > 0;
    },
    // LOAD the dataset from the backend service
    async loadDataset(datasetId: string) {
      return this.datasetModel.loadDataset(datasetId);
    },

    async initializeDataset(dataset: DatasetDTO, mode: WorkflowMode) {
      this.datasetModel = new DatasetModel(this);

      if (mode === WorkflowMode.Create && dataset) {
        // SEED the local storage with the provided dataset
        if (this.localStorageService?.patchDatasetChanges) {
          await this.localStorageService.patchDatasetChanges(dataset);
        } else {
          await this.localStorageService.createDataset(dataset as any);
        }
      }

      if (mode === WorkflowMode.Create) {
        const seeded = this.steps.map((s: WorkflowStep) => {
          const vm = s.viewModelKey
            ? (this.datasetModel as any).getViewModel(s.viewModelKey)
            : null;

          if (!vm) return { ...s, completed: false, hasError: false };

          const data = vm.getModelData?.();
          const filled = this.hasDtData(data);
          if (!filled)
            return {
              ...s,
              completed: false,
              hasError: false,
              status: StepStatus.Disabled,
            };
          // vm.validate?.(data);
          // const hasErrors = Object.values(vm.validationErrors || {}).some(
          //   Boolean,
          // );
          // if (hasErrors) {
          //   return {
          //     ...s,
          //     completed: false,
          //     hasError: true,
          //     status: StepStatus.Error,
          //     errors: vm.validationErrors,
          //   };
          // }
          return {
            ...s,
            completed: true,
            hasError: false,
            status: StepStatus.Completed,
            errors: null,
          };
        });

        this.steps = enhanceAdminWorkflowStep(this.userRole, seeded);

        const startIdx = this.steps.findIndex((s) => !s.completed);
        this.setActiveStep(startIdx === -1 ? 0 : startIdx);
      } else {
        this.currentStep = 0;
      }

      // SET doi
      this.doiPlaceholder = null;
      // SET the dialog for the step 4 to false
      this.openSaveDialog = false;
      // SET the step save confirmation to false
      this.isStepSaveConfirmed = false;
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
        const { dto, mode } = await resolveBootstrap<DatasetDTO>(datasetId, {
          loadBackend: (id) => this.backendStorageService.loadDataset(id),
          loadLocal: (id) => this.localStorageService.loadDataset(id),
          createLocal: (init) =>
            this.localStorageService.createDataset(init as DatasetDTO),
        });

        this.setWorkflowMode(mode);

        await this.initializeDataset(dto, mode);
      } finally {
        this.loading = false;
      }
    },

    // RETURN the dataset service to use based on the current mode.
    //  WorkflowMode.Create mode → uses localStorage service
    // WorkflowMode.Edit mode → uses backend service
    getDatasetService(): DatasetService {
      return this.mode === WorkflowMode.Create
        ? this.localStorageService
        : this.backendStorageService;
    },

    // SET the mode to WorkflowMode.Create or WorkflowMode.Edit.
    // Controls navigation flow, read-only UI state, and step editability based on the mode.
    // EXAMPLE - In WorkflowMode.Edit mode, steps become editable, allowing free navigation.
    setWorkflowMode(mode: WorkflowMode) {
      this.mode = mode;

      const { steps, freeJump } = computeStepsForMode(
        this.steps,
        this.isReadOnlyStep,
        mode,
      );

      this.steps = steps;
      this.freeJump = freeJump;
    },

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

      if (openSaveDialog) {
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
    // TODO: ticket (https://envicloud.atlassian.net/browse/EN-2431)
    markStepTouched(stepId: number, touched = true) {
      const s = this.steps[stepId];
      if (s) s.touched = touched;
    },

    // CHECK - Validate the current step.
    // CONFIRM- If confirmed, save to the backend, close the dialog, and mark the step as validated.
    confirmSaveToBackend(dataset: object) {
      this.isStepSaveConfirmed = true;
      this.openSaveDialog = false;
      const test = this.backendStorageService.createDataset(dataset);
      console.log(test);

      // if (ok) {
      //   this.isStepSaveConfirmed = true;
      //   this.openSaveDialog = false;
      //   console.log('Resource created successfully');
      // } else {
      //   this.isStepSaveConfirmed = false;
      //   this.openSaveDialog = true;
      // }

      // this.backendStorageService.createResource()

      // return this.validateStepAction(this.stepForBackendChange);
    },
    // TODO implement the real function for get the DOI
    reserveDoi() {
      this.doiPlaceholder = '10.10000/envidat.1234';
    },

    clearLocalStorage() {
      const localDataset = this.localStorageService.dataset;

      if (localDataset?.id) {
        localStorage.removeItem(localDataset.id);
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

      // const ownerOrg = firstOrg?.id ?? '';
      // dataset.owner_org = ownerOrg;
      // const organization = dataset.organization ? firstOrg : undefined;
      // dataset.organization = organization;

      // const name = dataset.title ? getMetadataUrlFromTitle(dataset.title) : '';
      // dataset.name = name;
      // dataset.private = true;
      // dataset.resource_type_general = 'dataset';
      // const setId = id;
      // dataset.id = setId !== '' ? setId : '';

      return {
        ...dataset,
        id: id || '',
        owner_org: firstOrg?.id ?? '',
        organization: dataset.organization ? firstOrg : undefined,
        name: dataset.title ? getMetadataUrlFromTitle(dataset.title) : '',
        private: true,
        resource_type_general: 'dataset',
      };
    },
  },
});
