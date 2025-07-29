/* The above code is a TypeScript file that defines a Pinia store called `useDatasetWorkflowStore`.
This store manages the state and actions related to a dataset workflow. Here is a summary of what
the code is doing: */
import { defineStore } from 'pinia';

import {
  StepStatus,
  WorkflowStep,
  workflowSteps,
} from '@/modules/workflow/resources/steps.ts';

import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { LocalStorageDatasetService } from '@/modules/workflow/LocalStorageDatasetService.ts';
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';
import { DatasetService } from '@/types/modelTypes';
import { BackendDatasetService } from '@/modules/workflow/BackendDatasetService.ts';
import { workflowGuide } from '@/modules/workflow/resources/workflowGuides.ts';

/*
import datasets from '~/stories/js/metadata.js';

let datasetVM = new DatasetModel(new LocalStorageDatasetService());
if (import.meta.env.MODE === 'development') {
  datasetVM = new DatasetModel(new LocalStorageDatasetService(datasets[2]));
}
*/

export const useDatasetWorkflowStore = defineStore('datasetWorkflow', {
  state: () => ({
    loading: false,
    currentStep: 0,
    steps: workflowSteps,
    datasetModel: undefined,
    localStorageService: new LocalStorageDatasetService(),
    backendStorageService: new BackendDatasetService(),
    openSaveDialog: false,
    isStepSaveConfirmed: false,
    // list of readOnlyFields
    // if you need to find those items in the code just paste this isReadOnly('visibility')
    listOfReadOnlyFields: [
      'authors',
      'authorsWrapper',
      'license',
      'institution',
      'grantNumber',
      'institutionUrl',
      'organizationId',
      'publicationsInfo',
      'contactEmail',
      'contactFirstName',
      'contactLastName',
      'visibility',
      'dateYear',
    ],
    // define readOnly steps to mange the navigation (UI only)
    isReadOnlyStep: [
      'AuthorsInformation',
      'additionalinformation',
      'publicationinformation',
    ],

    freeJump: false,
    stepForBackendChange: 3,
    doiPlaceholder: null,
    workflowGuide,
    mode: 'create' as 'create' | 'edit',
  }),
  getters: {
    // currentStepObject: (state) => state.steps[state.currentStep] ?? null,
    // navigationBlocked(state) {
    //   return state.mode === 'edit' ? 'free' : 'locked';
    // },

    // GET the current step component
    currentAsyncComponent(state) {
      return state.steps[state.currentStep]?.component;
    },

    // GET the current step viewModel
    currentViewModel(state) {
      const step = state.steps[state.currentStep];
      if (!state.datasetModel || !step?.viewModelKey) return null;

      // get the viewModel
      const vmInstance = state.datasetModel.getViewModel(step.viewModelKey);

      return vmInstance;
    },

    // DOMINIK Do we need this getter? Is not used anywhere
    // firstInCompleteStep(state) {
    //   let firstInCompleteIndex = -1;

    //   for (let i = 0; i < state.steps.length; i++) {
    //     const step: WorkflowStep = state.steps[i];
    //     if (!step.completed) {
    //       firstInCompleteIndex = i;
    //       break;
    //     }
    //   }

    //   return firstInCompleteIndex;
    // },
    // isDatasetCreation(): boolean {
    //   return this.mode === 'create';
    // },
    // GET if the dataset is in edit mode - used in TheWorkflowNavigation and WorkFlowPage. We build the logic on it to define which UI we need to use
    isDatasetEditing(): boolean {
      return this.mode === 'edit';
    },
  },
  actions: {
    // LOAD the dataset from the backend service
    async loadDataset(datasetId: string) {
      return this.datasetModel.loadDataset(datasetId);
    },

    // INIT dataset workflow with the dataset DTO and mode.
    async initializeDataset(dataset: DatasetDTO, mode: 'create' | 'edit') {
      this.localStorageService.dataset = dataset;

      this.datasetModel = new DatasetModel(this);
      await this.datasetModel.loadViewModels();

      this.setEditMode(mode);

      // SET currentStep to the first step
      this.currentStep = 0;
      // SET doi to null
      this.doiPlaceholder = null;
      // SET the dialog for the step 4 to false
      this.openSaveDialog = false;
      // SET the step save confirmation to false
      this.isStepSaveConfirmed = false;
    },

    // CHECK if the field is readonly based on the mode and the list of readOnlyFields.
    // IMPORTANT - This function is used in all components that where we need to check if the field is readonly or not.
    isFieldReadonly(fieldKey: string): boolean {
      if (this.mode === 'create') return false;
      return this.listOfReadOnlyFields.includes(fieldKey);
    },

    // MAIN LOGIC – We define the environment to be used.
    // This function is the page initializer and is called on mounted by bootstrapWorkflow.
    // PLEASE NOTE – We are currently in the development phase, and an exception is present to make Storybook work.
    // We need to fine-tune this logic.
    async bootstrapWorkflow(datasetId?: string) {
      this.loading = true;
      this.datasetModel = new DatasetModel(this);
      this.localStorageService = new LocalStorageDatasetService();

      let dto: DatasetDTO | null = null;
      let mode: 'create' | 'edit' = 'create';

      // CHECK if the dataset is present in localStorage
      // TODO: this logic needs to be properly implemented

      const existsInLocalStorage = (id?: string) => {
        if (!id) return false;
        try {
          return !!window.localStorage.getItem(id);
        } catch {
          return false;
        }
      };

      try {
        // CHECK if the dataset is present in the backend - SET the mode to edit
        if (datasetId) {
          try {
            dto = await this.backendStorageService.loadDataset(datasetId);

            if (dto) mode = 'edit';
          } catch (e) {
            dto = null;
          }
        }

        // CHECK if the dataset is present in the localstorage - SET the mode to create
        if (!dto && datasetId && existsInLocalStorage(datasetId)) {
          try {
            dto = await this.localStorageService.loadDataset(datasetId);
            mode = 'create';
          } catch {
            dto = null;
          }
        }

        // CHECK if the nothing, it means NEW dataset - SET the mode to create
        if (!dto) {
          dto = await this.localStorageService.createDataset({} as DatasetDTO);
          mode = 'create';
        }

        await this.initializeDataset(dto, mode);
      } finally {
        this.loading = false;
      }
    },

    // RETURN the dataset service to use based on the current mode.
    //  'create' mode → uses localStorage service
    // 'edit' mode → uses backend service

    getDatasetService(): DatasetService {
      return this.mode === 'create'
        ? this.localStorageService
        : this.backendStorageService;
    },

    // SET the mode to 'create' or 'edit'.
    // Controls navigation flow, read-only UI state, and step editability based on the mode.
    // EXAMPLE - In 'edit' mode, steps become editable, allowing free navigation.
    setEditMode(mode: 'create' | 'edit') {
      this.mode = mode;

      if (mode === 'edit') {
        this.steps = this.steps.map((s) => {
          // CHECK if the step is readOnly based on the list
          const readOnly = this.isReadOnlyStep.includes(s.key);
          return {
            ...s,
            isEditable: !readOnly,
            readOnly,
            status: StepStatus.Completed,
            completed: s.completed ?? false,
            hasError: s.hasError ?? false,
            // IMPORTANT for step validation in edit mode:
            // if the step has not been modified, we can skip validation, otherwise, we must validate it.
            // TODO: ticket (https://envicloud.atlassian.net/browse/EN-2431)
            // touched: false,
          };
        });
        // SET allow navigation in edit mode
        this.freeJump = true;
      } else {
        this.steps = this.steps.map((s, idx) => ({
          ...s,
          isEditable: idx === 0,
          readOnly: false,
          status: idx === 0 ? StepStatus.Active : StepStatus.Disabled,
          completed: false,
          hasError: false,
          // TODO: ticket (https://envicloud.atlassian.net/browse/EN-2431)
          // touched: false,
        }));
        // SET block navigation in create mode
        this.freeJump = false;
      }
    },

    // STORYBOOK
    // PLEASE NOTE – We are currently in the development phase, and an exception is present to make Storybook work.
    async initializeWorkflowfromDataset(dataset?: DatasetDTO) {
      let datasetDto: DatasetDTO;

      this.localStorageService = new LocalStorageDatasetService();

      if (!dataset) {
        datasetDto = await this.localStorageService.createDataset({});
      } else {
        datasetDto =
          await this.localStorageService.patchDatasetChanges(dataset);
      }

      await this.initializeDataset(datasetDto, 'edit');
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
      if (this.mode === 'create') {
        this.steps.forEach((s: WorkflowStep) => {
          if (s.id === id) s.status = StepStatus.Active;
          else if (s.completed) s.status = StepStatus.Completed;
          else if (s.hasError) s.status = StepStatus.Error;
          else s.status = StepStatus.Disabled;
        });
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
      // find the next element with status != completed
      for (let i = fromId + 1; i < this.steps.length; i++) {
        const s = this.steps[i];
        if (!s.completed) return i;
      }
      // all valid steps are completed, return the last step
      return Math.min(fromId + 1, this.steps.length - 1);
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
      return (
        this.mode === 'edit' &&
        s &&
        !s.readOnly &&
        (s.dirty === true || s.hasError === true)
      );
    },

    // SET the step as completed and validate the data.
    validateStepAction(stepId: number): boolean {
      const step = this.steps[stepId];
      if (!step) return false;

      if (this.mode === 'edit' && (!step.dirty || step.readOnly)) {
        return true;
      }

      // if we are in create mode we don't validate each step navigation click, TODO: ticket (https://envicloud.atlassian.net/browse/EN-2431) ONLY if the touched is true. TOUCHED means that the user has changed something in the step.
      // if (this.mode === 'create' && (step.readOnly || step.touched !== true)) {
      if (this.mode === 'create' && step.readOnly) {
        return true;
      }

      const vm = this.currentViewModel;
      if (!vm) return false;

      const dataToValidate = vm?.getModelData();

      // always validate the data of the model before navigating
      vm.validate(dataToValidate);

      const hasErrors = Object.values(vm.validationErrors).some(Boolean);

      if (hasErrors) {
        Object.assign(this.steps[stepId], {
          hasError: true,
          status: StepStatus.Error,
          errors: vm.validationErrors,
        });

        return false;
      }

      if (
        this.mode === 'create' &&
        stepId === this.stepForBackendChange &&
        !this.isStepSaveConfirmed
      ) {
        this.openSaveDialog = true;
        return false;
      }

      Object.assign(this.steps[stepId], {
        completed: true,
        hasError: false,
        status: StepStatus.Completed,
        errors: null,
        dirty: false,
      });

      // this.setCurrentStepAction();

      return true;
    },

    // SET the step as touched.
    // TODO: ticket (https://envicloud.atlassian.net/browse/EN-2431)
    // markStepTouched(stepId: number, touched = true) {
    //   const s = this.steps[stepId];
    //   if (s) s.touched = touched;
    // },

    // CHECK - Validate the current step.
    // CONFIRM- If confirmed, save to the backend, close the dialog, and mark the step as validated.
    confirmSaveToBackend() {
      this.isStepSaveConfirmed = true;
      this.openSaveDialog = false;

      return this.validateStepAction(this.stepForBackendChange);
    },
    // TODO implement the real function for get the DOI
    reserveDoi() {
      this.doiPlaceholder = '10.10000/envidat.1234';
    },
  },
});
