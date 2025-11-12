import { markRaw } from 'vue';
import AuthorsInformation from '@/modules/workflow/components/steps/AuthorsInformation.vue';
import MetadataBaseInformation from '@/modules/workflow/components/steps/MetadataBaseInformation.vue';
import GeoInformation from '@/modules/workflow/components/steps/GeoInformation.vue';
import AdditionalInformation from '@/modules/workflow/components/steps/AdditionalInformation.vue';
import ResourcesInformation from '@/modules/workflow/components/steps/ResourcesInformation.vue';
import RelatedResearch from '@/modules/workflow/components/steps/RelatedResearch.vue';
import PublishingInformation from '@/modules/workflow/components/steps/PublishingInformation.vue';
import { StepStatus } from '@/modules/workflow/utils/workflowEnums';
import { WorkflowStep } from '@/types/workflow';
import { USER_ROLE_SYSTEM_ADMIN } from '@/factories/userEditingValidations';
import AdminInformation from '@/modules/workflow/components/steps/AdminInformation.vue';

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
    viewModelKey: 'MetadataBaseViewModel',
    icon: 'baseinfo',
    status: StepStatus.Active,
    errors: null,
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
    viewModelKey: 'AuthorListViewModel',
    icon: 'authorsinfo',
    status: StepStatus.Disabled,
    errors: null,
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
    viewModelKey: 'GeoInfoViewModel',
    icon: 'geoinfo',
    status: StepStatus.Disabled,
    errors: null,
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
    viewModelKey: 'AdditionalInfoViewModel',
    icon: 'additionalinfo',
    status: StepStatus.Disabled,
    errors: null,
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
    viewModelKey: 'ResourcesListViewModel',
    icon: 'uploadinfo',
    status: StepStatus.Disabled,
    errors: null,
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
    viewModelKey: 'RelatedResearchViewModel',
    icon: 'relatedinfo',
    status: StepStatus.Disabled,
    errors: null,
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
    viewModelKey: 'PublicationInfoViewModel',
    icon: 'publicationinfo',
    status: StepStatus.Disabled,
    errors: null,
  },
];

export default workflowSteps;

const adminStepTitle = 'Admin Information';

export function enhanceAdminWorkflowStep(userRole: string, steps: WorkflowStep[]): WorkflowStep[] {
  if (userRole === USER_ROLE_SYSTEM_ADMIN) {
    const alreadyContainsAdminStep = steps.filter((step) => step.title === adminStepTitle).length > 0;

    if (alreadyContainsAdminStep) {
      return steps;
    }

    return [
      ...steps,
      {
        id: steps.length + 1,
        title: adminStepTitle,
        description: 'Custom fields, Project Assignment',
        isEditable: true,
        completed: false,
        hasError: false,
        key: 'admininformation',
        component: markRaw(AdminInformation),
        viewModelKey: 'AdminViewModel',
        icon: 'publicationinfo',
        status: StepStatus.Disabled,
        errors: null,
      } satisfies WorkflowStep,
    ];
  }

  return steps;
}
