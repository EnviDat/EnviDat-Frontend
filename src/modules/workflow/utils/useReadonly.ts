import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';

const hints: Record<string, string> = {
  authors:
    'The Authors field can’t be edited because this dataset has already been published',
};

const deafultHint =
  'The field can’t be edited because this dataset has already been published.';

export function isReadOnlyField(fieldKey: string): boolean {
  const store = useDatasetWorkflowStore();
  //   if we need to build some logic we can do that here (ex if admin - if mode = create but etc - specific field)
  if (store.mode === 'create') return false;
  return store.listOfReadOnlyFields.includes(fieldKey);
}

export function getReadOnlyHint(fieldKey: string): string {
  const store = useDatasetWorkflowStore();
  if (store.mode === 'create') return '';
  if (!isReadOnlyField(fieldKey)) return '';

  return hints[fieldKey] ?? deafultHint;
}
