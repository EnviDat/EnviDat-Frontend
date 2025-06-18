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
    workflowGuide: [
      {
        element: '#mainPageRow',
        popover: {
          title: '<strong>Welcome to the Dataset-Creation Workflow</strong>',
          description: `
            This short tour walks you through the page.<br>
            Need more help? <a href="mailto:envidat@wsl.ch">Contact us</a>.
          `,
        },
      },

      {
        element: '.navigationWorkflow',
        popover: {
          title: 'Navigation Panel',
          description: `
          <div>
            Here you can see all the steps required to publish a dataset. <b>Please note</b> that each step must be completed and validated before you can proceed to the next one.
          </div>

          <div style="margin:10px 0">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
              <span style="width:20px;height:20px;background:#499df7;border-radius:50%;"></span>
              Current step
            </div>

            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
              <span style="width:20px;height:20px;background:#e38c2f;border-radius:50%;"></span>
              Errors to fix
            </div>

            <div style="display:flex;align-items:center;gap:10px;">
              <span style="width:20px;height:20px;background:#40c057;border-radius:50%;"></span>
              Validated
            </div>
          </div>
        `,
        },
      },

      {
        element: '.navigationWorkflow__actions',
        popover: {
          title: 'Action Area',
          description:
            'These icons let you reopen the guide, reserve a DOI when eligible, and check the dataset’s current status.',
        },
      },

      {
        element: '.navigationWorkflow__actions .help-icon',
        popover: {
          title: 'Guide Mode',
          description:
            'Click this icon at any time to restart the interactive help tour.',
        },
      },

      {
        element: '.navigationWorkflow__actions .doi-icon',
        popover: {
          title: 'Reserve DOI',
          description:
            '<b>After you complete the Additional Information step</b>, you can request a DOI for your dataset here.',
        },
      },

      {
        element: '.navigationWorkflow__actions .status-icon',
        popover: {
          title: 'Dataset Status',
          description:
            'This badge shows whether the dataset is still a draft, has a reserved DOI, or is already published. You can <b>see more details by clicking the icon</b>.',
        },
      },

      {
        element: '.workflow-content__wrapper',
        popover: {
          title: 'Form Area',
          description:
            'Fill in the fields for the current step. Each step covers a different aspect of your dataset and must be validated before you can move on.',
        },
      },

      {
        element: '.info-banner',
        popover: {
          title: 'Information Panel',
          description:
            'Look here for additional guidance and tips specific to the step you are working on.',
        },
      },
      {
        element: '.scrollToSave',
        popover: {
          title: 'Scroll-to-Save Button',
          description:
            'Click this button to jump straight to the Save section.',
        },
      },
    ],
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
      if (status === 'disabled') {
        return;
      }
      this.currentStep = id;
      // REMOVE after testing
      this.steps.forEach((step) => {
        if (
          step.status === 'active' ||
          step.status === 'completed' ||
          step.status === 'error'
        )
          return;
      });
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

      const dataToValidate = vm?.getModelData();

      // always validate the data of the model before navigating
      // to ensure also the initial case when the workflow was justed loaded?

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
      // REMOVE after Research Day
      if (stepId === 6) {
        window.location.reload();
        return;
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
      this.setCurrentStepAction();
      return true;
    },

    confirmSave(newData) {
      this.isStepSaveConfirmed = true;
      this.openSaveDialog = false;

      this.validateStepAction(this.isStepSave, newData);
    },

    // setCurrentGuide(step) {},
    setCurrentGuide(workflowGuide) {},
  },
});
