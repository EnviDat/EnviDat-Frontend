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
): ComputeResult {
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
  return { steps: next, freeJump: false };
}

// SET the step based on the data available in the datasetModel
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
    if (!vm) {
      return {
        ...s,
        completed: false,
        hasError: false,
        status: idx === 0 ? StepStatus.Active : StepStatus.Disabled,
      };
    }
    const data = vm.getModelData?.();
    const filled = hasDtData(data);
    return filled
      ? {
          ...s,
          completed: true,
          hasError: false,
          status: StepStatus.Completed,
          errors: null,
        }
      : {
          ...s,
          completed: false,
          hasError: false,
          status: idx === 0 ? StepStatus.Active : StepStatus.Disabled,
        };
  });
  const startIdx = next.findIndex((s) => !s.completed);
  return { steps: next, startIdx: startIdx === -1 ? 0 : startIdx };
}
