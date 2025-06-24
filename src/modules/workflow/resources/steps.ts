import { markRaw } from 'vue';
import AuthorsInformation from '@/modules/workflow/components/steps/AuthorsInformation.vue';
import MetadataBaseInformation from '@/modules/workflow/components/steps/MetadataBaseInformation.vue';
import GeoInformation from '@/modules/workflow/components/steps/GeoInformation.vue';
import AdditionalInformation from '@/modules/workflow/components/steps/AdditionalInformation.vue';
import ResourcesInformation from '@/modules/workflow/components/steps/ResourcesInformation.vue';
import RelatedResearch from '@/modules/workflow/components/steps/RelatedResearch.vue';
import PublishingInformation from '@/modules/workflow/components/steps/PublishingInformation.vue';

export type StepStatus = 'active' | 'disabled' | 'completed';

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
  // genericProps: Record<string, unknown>;
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
    component: markRaw(MetadataBaseInformation),
/*
    loader: () =>
      import('@/modules/workflow/components/steps/MetadataBaseInformation.vue'),
*/
    viewModelKey: 'ModelMetaDataHeader',
    // genericProps: {},
    icon: 'baseinfo',
    status: 'active',
    // guideLines: [
    //   {
    //     element: '.navigationWorkflow',
    //     popover: { title: 'Title', description: 'Description' },
    //   },
    //   {
    //     element: '.navigationWorkflow__actions',
    //     popover: { title: 'Title', description: 'Description' },
    //   },
    // ],
  },
  {
    id: 1,
    title: 'Authors',
    description: 'Authors details',
    isEditable: true,
    completed: false,
    hasError: false,
    key: 'AuthorsInformation',
    component: markRaw(AuthorsInformation),
/*
    loader: () =>
      import('@/modules/workflow/components/steps/AuthorsInformation.vue'),
*/
    viewModelKey: 'AuthorListViewModel',
    // genericProps: {},
    icon: 'authorsinfo',
    status: 'disabled',
    // guideLines: [
    //   {
    //     element: '.navigationWorkflow__actions',
    //     popover: { title: 'Title', description: 'Description' },
    //   },
    //   {
    //     element: '.navigationWorkflow',
    //     popover: { title: 'Title', description: 'Description' },
    //   },
    // ],
  },
  {
    id: 2,
    title: 'Geo Information',
    description: 'Data location and dates',
    isEditable: true,
    completed: false,
    hasError: false,
    key: 'GeoInformation',
    component: markRaw(GeoInformation),
/*
    loader: () =>
      import('@/modules/workflow/components/steps/GeoInformation.vue'),
*/
    viewModelKey: 'ModelGeoInfo',
    // genericProps: {},
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
    component: markRaw(AdditionalInformation),
/*
    loader: () =>
      import('@/modules/workflow/components/steps/AdditionalInformation.vue'),
*/
    viewModelKey: 'ModelAdditionalInformation',
    // genericProps: {},
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
    component: markRaw(ResourcesInformation),
/*
    loader: () =>
      import('@/modules/workflow/components/steps/ResourcesInformation.vue'),
*/
    viewModelKey: 'ResourcesListModel',
    // genericProps: {},
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
    key: 'relatedresearch',
    component: markRaw(RelatedResearch),
/*
    loader: () =>
      import('@/modules/workflow/components/steps/RelatedResearch.vue'),
*/
    viewModelKey: 'ModelRelatedResearch',
    // genericProps: {},
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
    component: markRaw(PublishingInformation),
/*
    loader: () =>
      import('@/modules/workflow/components/steps/PublishingInformation.vue'),
*/
    viewModelKey: 'ModelPublicationInformation',
    // genericProps: {},
    icon: 'publicationinfo',
    status: 'disabled',
  },
];

export default workflowSteps;
