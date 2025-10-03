// src/modules/workflow/utils/workflowValidation.ts

import type { WorkflowStep } from '@/types/workflow';
import {
  StepStatus,
  WorkflowMode,
} from '@/modules/workflow/utils/workflowEnums';

export interface ValidatableVM {
  getModelData(): any;
  validate(data: any): void;
  validationErrors: Record<string, unknown>;
}

export interface ValidateStepInput {
  mode: WorkflowMode;
  stepId: number;
  step: WorkflowStep | undefined;
  vm: ValidatableVM | null;
  stepForBackendChange: number;
  isStepSaveConfirmed: boolean;
}

export interface ValidateStepResult {
  ok: boolean;
  diff?: Partial<WorkflowStep>;
  openSaveDialog?: boolean;
}

export function validateStepPure({
  mode,
  stepId,
  step,
  vm,
  stepForBackendChange,
  isStepSaveConfirmed,
}: ValidateStepInput): ValidateStepResult {
  if (!step) return { ok: false };

  if (mode === WorkflowMode.Edit && (!step.dirty || step.readOnly)) {
    return { ok: true };
  }

  // if we are in create mode we don't validate each step navigation click, TODO: ticket (https://envicloud.atlassian.net/browse/EN-2431) ONLY if the touched is true. TOUCHED means that the user has changed something in the step.
  if (mode === WorkflowMode.Create && (step.readOnly || !step.touched)) {
    // if (mode === WorkflowMode.Create && step.readOnly) {
    return { ok: true };
  }

  if (!vm) return { ok: false };

  const data = vm.getModelData?.() ?? undefined;
  // always validate the data of the model before navigating
  vm.validate?.(data);

  const hasErrors = Object.values(vm.validationErrors || {}).some(Boolean);

  if (hasErrors) {
    return {
      ok: false,
      diff: {
        hasError: true,
        status: StepStatus.Error,
        errors: vm.validationErrors,
      },
    };
  }

  if (
    mode === WorkflowMode.Create &&
    stepId === stepForBackendChange &&
    !isStepSaveConfirmed
  ) {
    return { ok: false, openSaveDialog: true };
  }

  return {
    ok: true,
    diff: {
      completed: true,
      hasError: false,
      status: StepStatus.Completed,
      errors: null,
      dirty: false,
    },
  };
}
