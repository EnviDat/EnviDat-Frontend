import { defineStore } from 'pinia';

import { StepStatus, WorkflowStep, workflowSteps } from '@/modules/workflow/resources/steps.ts';

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
    // TEMPORARY QUERY PARAMS OPTION
    freeJump: false,
    // END TEMPORARY QUERY PARAMS OPTION
    stepForBackendChange: 3,
    doiPlaceholder: null,
    workflowGuide,
  }),
  getters: {
    currentStepObject: (state) => state.steps[state.currentStep] ?? null,
    currentAsyncComponent(state) {
      return state.steps[state.currentStep]?.component;
/*
      const loader = state.steps[state.currentStep]?.loader;
      return loader ? defineAsyncComponent(loader) : null;
*/
    },
    currentViewModel(state) {
      const step = state.steps[state.currentStep];

      if (!step?.viewModelKey) return null;

      // get the viewModel
      const vmInstance = state.datasetModel.getViewModel(step.viewModelKey);

      return vmInstance;
    },
    firstInCompleteStep(state) {
      let firstInCompleteIndex = -1;

      for (let i = 0; i < state.steps.length; i++) {
        const step : WorkflowStep = state.steps[i];
        if (!step.completed) {
          firstInCompleteIndex = i;
          break;
        }
      }

      return firstInCompleteIndex;
    },
    isDatasetCreation() {
      return this.firstInCompleteStep < this.stepForBackendChange;
    },
    isDatasetEditing() {
      return this.firstInCompleteStep >= this.stepForBackendChange;
    },
  },
  actions: {
    getDatasetService() : DatasetService {
      if (this.isDatasetCreation) {
        return this.localStorageService;
      }

      return this.backendStorageService;
    },
    async loadDataset(datasetId: string) {
      return this.datasetModel.loadDataset(datasetId);
    },
    async initializeWorkflowNewDataset(dataset?: DatasetDTO) {

      let datasetDto : DatasetDTO;

      if (dataset === undefined) {
        // fresh new dataset
        this.LocalStorageDatasetService = new LocalStorageDatasetService();
        datasetDto = await this.LocalStorageDatasetService.createDataset();

      // } else if (LocalStorageDatasetService.isLocalId(dataset?.id)) {
      } else if (dataset.id) {
        // existing local dataset
        this.LocalStorageDatasetService = new LocalStorageDatasetService();
        datasetDto = await this.LocalStorageDatasetService.patchDatasetChanges(dataset);
      }

      await this.initializeDataset(datasetDto);
    },
    async initializeWorkflow(datasetId: string) {
      this.datasetModel = new DatasetModel(this);

      const datasetDto = await this.backendStorageService.loadDataset(datasetId);

      await this.initializeDataset(datasetDto);
    },
    resetSteps(){
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
    async initializeDataset() {
      this.datasetModel = new DatasetModel(this);

      this.resetSteps();

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
    setActiveStep(id: number) {
      this.steps.forEach((s: WorkflowStep) => {
        if (s.id === id) s.status = StepStatus.Active;
        else if (s.completed) s.status = StepStatus.Completed;
        else if (s.hasError) s.status = StepStatus.Error;
        else s.status = StepStatus.Disabled;
      });

      this.currentStep = id;
    },

    // END TEMPORARY QUERY PARAMS OPTION

    // navigateItemAction(id, status) {
    //   // REMOVE after testing
    //   if (status === 'disabled') {
    //     return;
    //   }
    //   this.currentStep = id;
    //   // REMOVE after testing
    //   this.steps.forEach((step) => {
    //     if (
    //       step.status === 'active' ||
    //       step.status === 'completed' ||
    //       step.status === 'error'
    //     )
    //       // eslint-disable-next-line no-useless-return
    //       return;
    //   });
    // },
    setCurrentStepAction() {
      // find the next element with status != completed
      const next = this.steps.find((el) => el.status !== StepStatus.Completed);
      if (this.steps[next.id]) {
        this.steps[next.id].status = StepStatus.Active;
        this.currentStep = next.id;
      }
    },
    validateStepAction(stepId: number): boolean {
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

      if (stepId === this.stepForBackendChange && !this.isStepSaveConfirmed) {
        this.openSaveDialog = true;
        return false;
      }

      Object.assign(this.steps[stepId], {
        completed: true,
        hasError: false,
        status: StepStatus.Completed,
        errors: null,
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
