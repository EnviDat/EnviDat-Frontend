// src/modules/workflow/utils/workflowNavigation.ts
import { StepStatus } from '@/modules/workflow/resources/steps';

import { WorkflowMode, WorkflowStep } from '@/types/workflow';


export function setActiveStepForCreate(
  steps: WorkflowStep[],
  activeId: number,
): WorkflowStep[] {
  return steps.map((s) => {
    if (s.id === activeId) return { ...s, status: StepStatus.Active };
    if (s.completed) return { ...s, status: StepStatus.Completed };
    if (s.hasError) return { ...s, status: StepStatus.Error };
    return { ...s, status: StepStatus.Disabled };
  });
}

// CHECK edit mode and force validation if we leave the step
export function mustValidateOnLeave(
  mode: WorkflowMode,
  step?: WorkflowStep,
): boolean {
  return (
    mode === WorkflowMode.Edit &&
    !!step &&
    !step.readOnly &&
    (step.dirty === true || step.hasError === true)
  );
}

export function getNextUncompletedStep(
  steps: WorkflowStep[],
  fromId: number,
): number {
  // find the next element with status != completed
  for (let i = fromId + 1; i < steps.length; i++) {
    if (!steps[i].completed) return i;
  }
  // all valid steps are completed, return the last step
  return Math.min(fromId + 1, steps.length - 1);
}
