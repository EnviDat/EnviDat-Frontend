/* eslint-disable no-unused-vars */

import { StepStatus } from '@/modules/workflow/resources/steps.ts';

export enum WorkflowMode {
  Create = 'create',
  Edit = 'edit',
}

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  isEditable: boolean;
  completed: boolean;
  hasError: boolean;
  key: string;
  component: unknown;
  // loader?: () => Promise<unknown>;
  viewModelKey: string;
  icon: string;
  status: StepStatus;
  readOnly?: boolean;
  dirty?: boolean;
  touched?: false;
  guideLines?: Array<{
    element: string;
    popover: { title: string; description: string };
  }>;
}

export interface ComputeResult {
  steps: WorkflowStep[];
  freeJump: boolean;
}
