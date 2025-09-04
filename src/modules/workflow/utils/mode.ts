// src/modules/workflow/utils/mode.ts

import type { ComputeResult, WorkflowStep } from '@/types/workflow';
import { StepStatus, WorkflowMode } from '@/modules/workflow/utils/workflowEnums';

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
        // TODO: ticket (https://envicloud.atlassian.net/browse/EN-2431)
        // touched: false,
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
    // TODO: ticket (https://envicloud.atlassian.net/browse/EN-2431)
    // touched: false,
  }));
  // SET block navigation in create mode
  return { steps: next, freeJump: false };
}
