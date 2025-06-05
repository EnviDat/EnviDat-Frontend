export type StepStatus = 'active' | 'disabled' | 'completed';

export interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  isEditable: boolean;
  completed: boolean;
  hasError: boolean;
  key: string;
  loader?: () => Promise<unknown>;
  viewModelKey: string;
  genericProps: Record<string, unknown>;
  icon: string;
  status: StepStatus;
  guideLines?: Array<{
    element: string;
    popover: { title: string; description: string };
  }>;
}

export const workflowSteps: WorkflowStep[] = [
  {
    id: 0,
    title: 'Base Information',
    description: 'Title, Description and keywords',
    isEditable: true,
    completed: false,
    hasError: false,
    key: 'MetadataBaseInformation',
    loader: () =>
      import('@/modules/workflow/components/steps/MetadataBaseInformation.vue'),
    viewModelKey: 'ModelMetaDataHeader',
    genericProps: {},
    icon: 'baseinfo',
    status: 'active',
    guideLines: [
      {
        element: '.navigationWorkflow',
        popover: { title: 'Title', description: 'Description' },
      },
      {
        element: '.navigationWorkflow__actions',
        popover: { title: 'Title', description: 'Description' },
      },
    ],
  },
  {
    id: 1,
    title: 'Authors',
    description: 'Authors details',
    isEditable: true,
    completed: false,
    hasError: false,
    key: 'AuthorsInformation',
    loader: () =>
      import('@/modules/workflow/components/steps/AuthorsInformation.vue'),
    viewModelKey: 'EditAuthorListViewModel',
    genericProps: {},
    icon: 'authorsinfo',
    status: 'disabled',
    guideLines: [
      {
        element: '.navigationWorkflow__actions',
        popover: { title: 'Title', description: 'Description' },
      },
      {
        element: '.navigationWorkflow',
        popover: { title: 'Title', description: 'Description' },
      },
    ],
  },
  {
    id: 2,
    title: 'Geo Information',
    description: 'Data location and dates',
    isEditable: true,
    completed: false,
    hasError: false,
    key: 'GeoInformation',
    loader: () =>
      import('@/modules/workflow/components/steps/GeoInformation.vue'),
    viewModelKey: 'ModelGeoInfo',
    genericProps: {},
    icon: 'geoinfo',
    status: 'disabled',
  },
  {
    id: 3,
    title: 'Additional Information',
    description: 'Funding and License',
    isEditable: true,
    completed: false,
    hasError: false,
    key: 'additionalinformation',
    loader: () =>
      import('@/modules/workflow/components/steps/AdditionalInformation.vue'),
    viewModelKey: 'ModelMetaDataHeader',
    genericProps: {},
    icon: 'additionalinfo',
    status: 'disabled',
  },
  {
    id: 4,
    title: 'Upload',
    description: 'Upload your resources',
    isEditable: true,
    completed: false,
    hasError: false,
    key: 'uploadinformation',
    loader: () =>
      import('@/modules/workflow/components/steps/AdditionalInformation.vue'),
    viewModelKey: 'ModelMetaDataHeader',
    genericProps: {},
    icon: 'uploadinfo',
    status: 'disabled',
  },
  {
    id: 5,
    title: 'Related Research',
    description: 'Related and interconnected research',
    isEditable: true,
    completed: false,
    hasError: false,
    key: 'relatedinformation',
    loader: () =>
      import('@/modules/workflow/components/steps/AdditionalInformation.vue'),
    viewModelKey: 'ModelMetaDataHeader',
    genericProps: {},
    icon: 'relatedinfo',
    status: 'disabled',
  },
  {
    id: 6,
    title: 'Publishing Information',
    description: 'Dataset Contact and Information',
    isEditable: true,
    completed: false,
    hasError: false,
    key: 'publicationinformation',
    loader: () =>
      import('@/modules/workflow/components/steps/AdditionalInformation.vue'),
    viewModelKey: 'ModelMetaDataHeader',
    genericProps: {},
    icon: 'publicationinfo',
    status: 'disabled',
  },
];

export default workflowSteps;
