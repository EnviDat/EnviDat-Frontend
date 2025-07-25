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

    // TEMPORARY QUERY PARAMS OPTION
    freeJump: false,
    // END TEMPORARY QUERY PARAMS OPTION
    stepForBackendChange: 3,
    doiPlaceholder: null,
    workflowGuide,
    mode: 'create' as 'create' | 'edit',
  }),
  getters: {
    currentStepObject: (state) => state.steps[state.currentStep] ?? null,
    navigationBlocked(state) {
      return state.mode === 'edit' ? 'free' : 'locked';
    },
    currentAsyncComponent(state) {
      return state.steps[state.currentStep]?.component;
      /*
      const loader = state.steps[state.currentStep]?.loader;
      return loader ? defineAsyncComponent(loader) : null;
*/
    },
    currentViewModel(state) {
      const step = state.steps[state.currentStep];
      if (!state.datasetModel || !step?.viewModelKey) return null;

      // get the viewModel
      const vmInstance = state.datasetModel.getViewModel(step.viewModelKey);

      return vmInstance;
    },

    // DOMINIK Do we need this getter? Is not used anywhere
    firstInCompleteStep(state) {
      let firstInCompleteIndex = -1;

      for (let i = 0; i < state.steps.length; i++) {
        const step: WorkflowStep = state.steps[i];
        if (!step.completed) {
          firstInCompleteIndex = i;
          break;
        }
      }

      return firstInCompleteIndex;
    },
    isDatasetCreation(): boolean {
      return this.mode === 'create';
    },
    isDatasetEditing(): boolean {
      return this.mode === 'edit';
    },
  },
  actions: {
    async bootstrapWorkflow(datasetId?: string) {
      this.loading = true;
      this.datasetModel = new DatasetModel(this);
      this.localStorageService = new LocalStorageDatasetService();

      let dto: DatasetDTO | null = null;
      let mode: 'create' | 'edit' = 'create';

      // helper locale, NON nel service
      const existsInLocalStorage = (id?: string) => {
        if (!id) return false;
        try {
          return !!window.localStorage.getItem(id);
        } catch {
          return false;
        }
      };

      try {
        // 1 try backend
        if (datasetId) {
          try {
            dto = await this.backendStorageService.loadDataset(datasetId);

            if (dto) mode = 'edit';
          } catch (e) {
            dto = null;
          }
        }

        // 2 try localstorage
        if (!dto && datasetId && existsInLocalStorage(datasetId)) {
          try {
            dto = await this.localStorageService.loadDataset(datasetId);
            mode = 'create';
          } catch {
            dto = null;
          }
        }

        // 3 create
        if (!dto) {
          dto = await this.localStorageService.createDataset({} as DatasetDTO);
          mode = 'create';
        }

        await this.initializeDataset(dto, mode);
      } finally {
        this.loading = false;
      }
    },

    getDatasetService(): DatasetService {
      return this.mode === 'create'
        ? this.localStorageService
        : this.backendStorageService;
    },

    // If the mode is edit we unblock the navigation
    setEditMode(mode: 'create' | 'edit') {
      this.mode = mode;

      if (mode === 'edit') {
        this.steps = this.steps.map((s) => {
          const readOnly = this.isReadOnlyStep.includes(s.key);
          return {
            ...s,
            isEditable: !readOnly,
            readOnly,
            status: StepStatus.Completed,
            completed: s.completed ?? false,
            hasError: s.hasError ?? false,
          };
        });
        this.freeJump = true;
      } else {
        this.steps = this.steps.map((s, idx) => ({
          ...s,
          isEditable: idx === 0,
          readOnly: false,
          status: idx === 0 ? StepStatus.Active : StepStatus.Disabled,
          completed: false,
          hasError: false,
        }));
        this.freeJump = false;
      }
    },

    async loadDataset(datasetId: string) {
      return this.datasetModel.loadDataset(datasetId);
    },
    // async initializeWorkflowfromDataset(dataset?: DatasetDTO) {
    //   let datasetDto: DatasetDTO;

    //   this.localStorageService = new LocalStorageDatasetService();

    //   if (!dataset) {
    //     datasetDto = await this.localStorageService.createDataset({});
    //   } else {
    //     datasetDto =
    //       await this.localStorageService.patchDatasetChanges(dataset);
    //   }

    //   // DOMINIK we pass datasetDto but then in the function we didn't use the arg
    //   await this.initializeDataset(datasetDto, 'edit');
    // },
    // async initializeWorkflow(datasetId: string) {
    //   // SET the status edit or create

    //   this.datasetModel = new DatasetModel(this);

    //   this.localStorageService = new LocalStorageDatasetService();
    //   // title-test-from-locahost
    //   const datasetDto = await this.backendStorageService.loadDataset(
    //     'title-test-from-locahost',
    //   );
    //   // await this.backendStorageService.loadDataset(datasetId);

    //   await this.initializeDataset(datasetDto, 'create');
    // },
    resetSteps() {
      this.steps.forEach((s: WorkflowStep) => {
        if (s.id === 0) {
          s.isEditable = true;
          s.status = StepStatus.Active;
        } else {
          s.isEditable = false;
          s.status = StepStatus.Disabled;
        }

        s.completed = false;
        s.hasError = false;
      });
    },
    // async initializeDataset() {
    async initializeDataset(dataset: DatasetDTO, mode: 'create' | 'edit') {
      this.localStorageService.dataset = dataset;

      this.datasetModel = new DatasetModel(this);
      await this.datasetModel.loadViewModels();

      this.setEditMode(mode);

      // forza lo step iniziale
      this.currentStep = 0;

      this.doiPlaceholder = null;
      this.openSaveDialog = false;
      this.isStepSaveConfirmed = false;
    },

    // TEMPORARY QUERY PARAMS OPTION
    jumpToStep(id: number) {
      this.freeJump = true;
      this.setActiveStep(id);
      this.freeJump = false;
    },
    navigateItemAction(id, status) {
      if (!this.freeJump) {
        if (status === StepStatus.Disabled) return;

        this.currentStep = id;
        return;
      }

      this.setActiveStep(id);
    },

    isFieldReadonly(fieldKey: string): boolean {
      if (this.mode === 'create') return false;
      return this.listOfReadOnlyFields.includes(fieldKey);
    },
    // setActiveStep differs for create vs edit:
    // - create: linear wizard. Current step -> Active; others keep their status (Completed/Error) or become Disabled.
    // - edit: free jump. Only mark the selected step as Active, leave the rest unchanged.
    setActiveStep(id: number) {
      if (this.mode === 'create') {
        this.steps.forEach((s: WorkflowStep) => {
          if (s.id === id) s.status = StepStatus.Active;
          else if (s.completed) s.status = StepStatus.Completed;
          else if (s.hasError) s.status = StepStatus.Error;
          else s.status = StepStatus.Disabled;
        });
      }

      // else {
      //   this.steps.forEach((s: WorkflowStep) => {
      //     // if (s.id === id) s.status = StepStatus.Active;
      //   });
      // }
      this.currentStep = id;
    },

    // END TEMPORARY QUERY PARAMS OPTION

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
    markStepDirty(stepId: number, dirty = true) {
      const s = this.steps[stepId];
      if (s && !s.readOnly) s.dirty = dirty;
    },

    // EDIT mode: use this to check if the step must be validated before leaving it.
    mustValidateOnLeave(stepId: number) {
      const s = this.steps[stepId];
      return (
        this.mode === 'edit' &&
        s &&
        !s.readOnly &&
        (s.dirty === true || s.hasError === true)
      );
    },

    validateStepAction(stepId: number): boolean {
      // if we are in create mode we don't validate each step navigation

      const step = this.steps[stepId];
      if (!step) return false;

      if (this.mode === 'edit' && (!step.dirty || step.readOnly)) {
        return true;
      }
      if (this.mode === 'create' && step.readOnly) {
        return true;
      }

      const vm = this.currentViewModel;
      if (!vm) return false;

      const dataToValidate = vm?.getModelData();

      // always validate the data of the model before navigating
      // to ensure also the initial case when the workflow was just loaded?

      // check with Dominik for another solution
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

    confirmSave() {
      this.isStepSaveConfirmed = true;
      this.openSaveDialog = false;

      return this.validateStepAction(this.stepForBackendChange);
    },

    reserveDoi() {
      this.doiPlaceholder = '10.10000/envidat.1234';
    },
  },
});
