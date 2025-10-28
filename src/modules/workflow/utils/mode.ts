// src/modules/workflow/utils/mode.ts

import type { ComputeResult, WorkflowStep } from '@/types/workflow';
import { StepStatus, WorkflowMode } from '@/modules/workflow/utils/workflowEnums';
import { DatasetModel } from '@/modules/workflow/DatasetModel.ts';

export function computeStepsForMode(
  steps: WorkflowStep[],
  isReadOnlyStepKeys: string[],
  mode: WorkflowMode,
  dataSource: 'local' | 'backend',
): ComputeResult {
  const isBackendSource = dataSource === 'backend';
  if (mode === WorkflowMode.Edit) {
    const next = steps.map((s) => {
      // CHECK if the step is readOnly based on the list listOfReadOnlyFields - src/modules/workflow/resources/readOnlyFields.ts

      const readOnly = isReadOnlyStepKeys.includes(s.key);
      return {
        ...s,
        isEditable: !readOnly,
        readOnly,
        status: StepStatus.Completed,
        completed: s.completed ?? false,
        hasError: s.hasError ?? false,
        // IMPORTANT for step validation in edit mode:
        // if the step has not been modified, we can skip validation, otherwise, we must validate it.
        touched: false,
      };
    });

    // SET allow navigation in edit mode
    return { steps: next, freeJump: true };
  }
  // Those step are always disable if the source is from local, this is IMPORTANT if we have some error in the save the backend the step 4,5,6 should not be active
  const DISABLED_IN_CREATE_LOCAL_BY_ID = new Set([4, 5, 6]);

  const next = steps.map((s, idx) => {
    const isFirst = idx === 0;
    const forceDisabled = !isBackendSource && DISABLED_IN_CREATE_LOCAL_BY_ID.has(s.id);

    const canBeActive = (isBackendSource || isFirst) && !forceDisabled;

    return {
      ...s,
      isEditable: canBeActive,
      readOnly: false,
      status: canBeActive ? StepStatus.Active : StepStatus.Disabled,
      completed: false,
      hasError: false,
      touched: false,
    };
  });

  // SET block navigation in create mode
  // IF backend source, we allow free navigation
  return { steps: next, freeJump: isBackendSource };
}

function updateStepStatusAndErrors(
  existingStep: WorkflowStep,
  viewModelKey: string,
  datasetModel: DatasetModel,
  hasDtData: (v: any) => boolean,
  dataSource: 'local' | 'backend',
): WorkflowStep {
  const isBackend = dataSource === 'backend';
  const vm = datasetModel.getViewModel(viewModelKey);

  const newStep = existingStep
    ? existingStep
    : {
        completed: false,
        component: undefined,
        description: '',
        dirty: false,
        guideLines: undefined,
        hasError: false,
        icon: '',
        id: 0,
        isEditable: false,
        key: viewModelKey,
        readOnly: false,
        status: undefined,
        title: '',
        touched: false,
        viewModelKey: '',
        errors: null,
      };

  const dataForInit = vm?.getModelDataForInit ? vm?.getModelDataForInit() : vm?.getModelData();
  const hasAnything = hasDtData(dataForInit);

  if (!vm || !hasAnything) {
    newStep.completed = false;
    newStep.hasError = false;
    newStep.status = isBackend ? StepStatus.Active : StepStatus.Disabled;
    newStep.errors = null;
  }

  if (vm) {
    // Validate the VM data
    vm.validate?.(dataForInit);
    const hasErrors = Object.values(vm.validationErrors || {}).some(Boolean);

    newStep.completed = !hasErrors;
    newStep.hasError = hasErrors;
    newStep.status = hasErrors ? StepStatus.Error : StepStatus.Completed;
    newStep.errors = hasErrors ? vm.validationErrors : null;
  }

  return newStep;
}

// SET the step based on the data available in the datasetModel
// src/modules/workflow/utils/mode.ts
export function enhanceStepsFromData(
  steps: WorkflowStep[],
  datasetModel: any,
  hasDtData: (v: any) => boolean,
  mode: WorkflowMode,
  dataSource: 'local' | 'backend',
) {
  if (mode === WorkflowMode.Edit) {
    return { steps, startIdx: 0 };
  }

  const next = steps.map((step, idx) =>
    updateStepStatusAndErrors(step, step.viewModelKey, datasetModel, hasDtData, dataSource),
  );

  const startIdx = next.findIndex((step) => !step.completed);
  return { steps: next, startIdx: startIdx === -1 ? 0 : startIdx };
}
