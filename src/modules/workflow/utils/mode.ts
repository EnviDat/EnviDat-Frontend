// src/modules/workflow/utils/mode.ts

import type { ComputeResult, WorkflowStep } from '@/types/workflow';
import {
  StepStatus,
  WorkflowMode,
} from '@/modules/workflow/utils/workflowEnums';

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
      // Those step are always disable if the source is from local, this is IMPORTANT if we have some error in the save the backend the step 4,5,6 should not be active
      const DISABLED_IN_EDIT_LOCAL_BY_ID = new Set([4, 5, 6]);
      const forceDisabled =
        !isBackendSource && DISABLED_IN_EDIT_LOCAL_BY_ID.has(s.id);
      const readOnly = isReadOnlyStepKeys.includes(s.key);
      return {
        ...s,
        isEditable: !readOnly,
        readOnly,
        status: forceDisabled ? StepStatus.Disabled : StepStatus.Completed,
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

  const next = steps.map((s, idx) => ({
    ...s,
    isEditable: idx === 0,
    readOnly: false,
    status: idx === 0 ? StepStatus.Active : StepStatus.Disabled,
    completed: false,
    hasError: false,
    touched: false,
  }));

  // SET block navigation in create mode
  // IF backend source, we allow free navigation
  return { steps: next, freeJump: isBackendSource };
}

// SET the step based on the data available in the datasetModel
// src/modules/workflow/utils/mode.ts
export function enhanceStepsFromData(
  steps: WorkflowStep[],
  datasetModel: any,
  hasDtData: (v: any) => boolean,
  mode: WorkflowMode,
) {
  if (mode === WorkflowMode.Edit) {
    return { steps, startIdx: 0 };
  }

  const next = steps.map((s, idx) => {
    const vm = s.viewModelKey
      ? datasetModel.getViewModel(s.viewModelKey)
      : null;

    // No VM
    if (!vm) {
      return {
        ...s,
        completed: false,
        hasError: false,
        status: idx === 0 ? StepStatus.Active : StepStatus.Disabled,
        errors: null,
      };
    }

    // Get the data from the VM, check if we have some exclusion getModelDataForInit
    const dataForInit = vm.getModelDataForInit
      ? vm.getModelDataForInit()
      : vm.getModelData?.();
    const hasAnything = hasDtData(dataForInit);

    // VM - but incomplete
    if (!hasAnything) {
      return {
        ...s,
        completed: false,
        hasError: false,
        status: idx === 0 ? StepStatus.Active : StepStatus.Disabled,
        errors: null,
      };
    }

    // Validate the VM data
    vm.validate?.(dataForInit);
    const hasErrors = Object.values(vm.validationErrors || {}).some(Boolean);

    if (hasErrors) {
      return {
        ...s,
        completed: false,
        hasError: true,
        status: StepStatus.Error,
        errors: vm.validationErrors,
      };
    }

    return {
      ...s,
      completed: true,
      hasError: false,
      status: StepStatus.Completed,
      errors: null,
    };
  });

  const startIdx = next.findIndex((s) => !s.completed);
  return { steps: next, startIdx: startIdx === -1 ? 0 : startIdx };
}
