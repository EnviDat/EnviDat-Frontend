import { defineStore } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { workflowSteps } from '@/modules/workflow/resources/steps.ts';

import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';
import { LocalStorageDatasetService } from '@/modules/workflow/LocalStorageDatasetService.ts';
import { DatasetDTO } from '@/types/dataTransferObjectsTypes';
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
    datasetViewModel: new DatasetModel(new LocalStorageDatasetService()),
    openSaveDialog: false,
    isStepSaveConfirmed: false,
    // TEMPORARY QUERY PARAMS OPTION
    freeJump: false,
    // END TEMPORARY QUERY PARAMS OPTION
    isStepSave: 3,
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
      const vmInstance = state.datasetViewModel.getViewModel(step.viewModelKey);

      return vmInstance;
    },
  },
  actions: {
    async loadDataset(datasetId: string) {
      return this.datasetViewModel.loadDataset(datasetId);
    },
    async initializeDataset(dataset: DatasetDTO) {
      this.datasetViewModel = new DatasetModel(
        new LocalStorageDatasetService(dataset),
      );

      this.steps.forEach((s) => {
        if (s.id === 0){
          s.status = 'active';
        } else {
          s.status = 'disabled';
        }

        s.isEditable = true;
        s.completed = false;
        s.hasError = false;
      });

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
        if (status === 'disabled') return;
        this.currentStep = id;
        return;
      }

      this.setActiveStep(id);
    },
    setActiveStep(id: number) {
      this.steps.forEach((s) => {
        if (s.id === id) s.status = 'active';
        else if (s.completed) s.status = 'completed';
        else if (s.hasError) s.status = 'error';
        else s.status = 'disabled';
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
      const next = this.steps.find((el) => el.status !== 'completed');
      if (this.steps[next.id]) {
        this.steps[next.id].status = 'active';
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
          status: 'error',
          errors: vm.validationErrors,
        });

        return false;
      }

      if (stepId === this.isStepSave && !this.isStepSaveConfirmed) {
        this.openSaveDialog = true;
        return false;
      }

      Object.assign(this.steps[stepId], {
        completed: true,
        hasError: false,
        status: 'completed',
        errors: null,
      });

      // this.setCurrentStepAction();

      return true;
    },

    confirmSave() {
      this.isStepSaveConfirmed = true;
      this.openSaveDialog = false;


      return this.validateStepAction(this.isStepSave);
    },

    reserveDoi() {
      this.doiPlaceholder = '10.10000/envidat.1234';
    },

    // setCurrentGuide(step) {},
    setCurrentGuide(workflowGuide) {},
  },
});
