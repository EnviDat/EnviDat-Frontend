import { defineStore } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { workflowSteps } from '@/modules/workflow/resources/steps';

import { DatasetModel } from '@/modules/workflow/viewModel/DatasetModel';
import { DatasetLocalStorageService } from '@/modules/workflow/viewModel/DatasetLocalStorageService';
import datasets from '~/stories/js/metadata.js';

let datasetVM = new DatasetModel(new DatasetLocalStorageService());
if (import.meta.env.MODE === 'development') {
  datasetVM = new DatasetModel(new DatasetLocalStorageService(datasets[2]));
}

export const useDatasetWorkflowStore = defineStore('datasetWorkflow', {
  state: () => ({
    loading: false,
    currentStep: 0,
    steps: workflowSteps,
    datasetViewModel: datasetVM,
    openSaveDialog: false,
    isStepSaveConfirmed: false,
    isStepSave: 3,
  }),
  getters: {
    currentStepObject: (state) => state.steps[state.currentStep] ?? null,
    currentAsyncComponent(state) {
      const loader = state.steps[state.currentStep]?.loader;
      return loader ? defineAsyncComponent(loader) : null;
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
    navigateItemAction(id, status) {
      // REMOVE after testing
      // if (status === 'disabled') {
      //   return;
      // }
      this.currentStep = id;
      // REMOVE after testing
      this.steps.forEach((step) => {
        step.status = 'disabled';
        step.hasError = false;
      });
      this.steps[id].status = 'active';
    },
    setCurrentStepAction() {
      // find the next element with status != completed
      const next = this.steps.find((el) => el.status !== 'completed');
      if (this.steps[next.id]) {
        this.steps[next.id].status = 'active';
        this.currentStep = next.id;
      }
    },
    async validateStepAction(stepId) {
      const vm = this.currentViewModel;
      if (!vm) return;

      const dataToValidate = vm.value?.getModelData();

      // always validate the data of the model before navigating
      // to ensure also the initial case when the workflow was justed loaded?
      
      // check with Dominik for another solution
      vm.validate(dataToValidate);

      const errorValues = Object.values(vm.validationErrors);

      const ok = errorValues.every((err) => !err);

      // const errorValues = Object.values(vm.validationErrors);
      // const vErrors = errorValues.filter((errProp) => errProp !== null);
      // const ok = vErrors.length <= 0;

      if (ok) {
        // only for the step 3, we need to ask to the user to confirm the save
        if (stepId === this.isStepSave && !this.isStepSaveConfirmed) {
          this.openSaveDialog = true;
          return;
        } else {
          Object.assign(this.steps[stepId], {
            completed: true,
            hasError: false,
            status: 'completed',
            errors: null,
          });
          this.setCurrentStepAction();
        }
      } else {
        Object.assign(this.steps[stepId], {
          hasError: true,
          status: 'error',
          errors: vm.validationErrors,
        });
      }
    },

    confirmSave(newData) {
      this.isStepSaveConfirmed = true;
      this.openSaveDialog = false;

      this.validateStepAction(this.isStepSave, newData);
    },

    // async validateStepAction(stepId, newData) {
    //   this.setCurrentStepAction();

    //   this.loading = true;
    //   // /!* prendi l’istanza del VM corrente *!/
    //   const vm = this.currentViewModel;

    //   if (!vm) {
    //     console.warn('No view‑model for this step');
    //     this.loading = false;
    //     return;
    //   }
    //   const isValid = vm.validate(newData);

    //   if (isValid) {
    //     await vm.save(newData);

    //     this.steps[stepId].completed = true;
    //     this.steps[stepId].hasError = false;
    //     this.steps[stepId].status = 'completed';
    //     this.setCurrentStepAction();
    //   } else {
    //     this.loading = false;
    //     this.steps[stepId].hasError = true;
    //     this.steps[stepId].status = 'error';
    //   }

    //   this.loading = false;
    // },

    // async fetchOrganizations(url, params = {}) {
    //   try {
    //     const requestUrl = urlRewrite(
    //       extractBodyIntoUrl(url, params),
    //       API_BASE,
    //       API_ROOT,
    //     );
    //     const response = await axios.get(requestUrl);
    //     return response.data.result;
    //   } catch (error) {
    //     this.error = error;
    //     throw error;
    //   }
    // },
    setCurrentGuide(step) {},
  },
});
