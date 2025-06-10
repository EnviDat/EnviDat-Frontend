import { defineStore } from 'pinia';
import { defineAsyncComponent } from 'vue';

import { workflowSteps } from '@/modules/workflow/resources/steps';

import { DatasetViewModel } from '@/modules/workflow/viewModel/DatasetViewModel.js';
import { EditDatasetServiceLayer } from '@/modules/workflow/viewModel/EditDatasetServiceLayer.js';

/*
import axios from 'axios';
import { set } from 'date-fns';
*/

export const useDatasetWorkflowStore = defineStore({
  id: 'datasetWorkflow',
  state: () => ({
    loading: false,
    currentStep: 0,
    steps: workflowSteps,
    datasetViewModel: new DatasetViewModel(new EditDatasetServiceLayer()),
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

      const ok = await vm.validate();
      // BOTH version here, in my opinion before proceed we should validate all object
      // const ok = await vm.saveObject(newData);

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
