import { StepStatus } from '@/modules/workflow/utils/workflowEnums';
import { AbstractEditViewModel } from '@/modules/workflow/viewModel/AbstractEditViewModel.ts';

export interface WorkflowStep<T extends abstract new (...args: any[]) => AbstractEditViewModel = any> {
  id: number;
  title: string;
  description: string;
  isEditable: boolean;
  completed: boolean;
  hasError: boolean;
  key: string;
  component: unknown;
  // loader?: () => Promise<unknown>;
  viewModelKey: T;
  icon: string;
  status: StepStatus;
  readOnly?: boolean;
  dirty?: boolean;
  touched?: boolean;
  guideLines?: Array<{
    element: string;
    popover: { title: string; description: string };
  }>;
  errors: object;
}

export interface ComputeResult {
  steps: WorkflowStep[];
  freeJump: boolean;
}
