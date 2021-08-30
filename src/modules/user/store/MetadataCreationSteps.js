import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader';
import EditDescription from '@/modules/user/components/EditDescription';
import EditCustomFields from '@/modules/user/components/EditCustomFields';
import EditRelatedPublications from '@/modules/user/components/EditRelatedPublications';

// eslint-disable-next-line no-unused-vars
import MetadataCreationMainInfo from '@/modules/user/components/MetadataCreationMainInfo';
import EditDataAndResources from '@/modules/user/components/EditDataAndResources';

import {
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';

export const mainDetailSteps = [
  {
    title: 'Basic Info',
    completed: false,
    component: EditMetadataHeader,
    genericProps: {
      metadataTitle: '',
      contactEmail: '',
      contactGivenName: '',
      contactSurname: '',
    },
  },
  {
    title: 'Description',
    completed: false,
    component: EditDescription,
    genericProps: {
      description: '',
    },
  },
  {
    title: 'Keywords',
    completed: false,
    component: EditCustomFields,
  },
  {
    title: 'Authors',
    completed: false,
    // component: EditDescription,
  },
];

export const dataDetailSteps = [
  {
    title: 'Data & Resources',
    completed: false,
    component: EditDataAndResources,
    genericProps: {
      resources: [],
      selectionId: -1,
      resourcesConfig: {
        downloadActive: false,
      },
    },
  },
  {
    title: 'Data Info',
    completed: false,
    // component: EditDescription,
  },
];

export const metadataCreationSteps = [
  {
    title: 'Main Info',
    completed: false,
    color: 'secondary',
    component: MetadataCreationMainInfo,
    detailSteps: mainDetailSteps,
    initialStepTitle: mainDetailSteps[0].title,
  },
  {
    title: 'Data Info',
    completed: false,
    color: 'secondary',
    component: MetadataCreationMainInfo,
    detailSteps: dataDetailSteps,
    initialStepTitle: dataDetailSteps[0].title,
  },
  {
    title: 'Related Info',
    completed: false,
    color: 'green',
    component: EditRelatedPublications,
    genericProps: {
      labelTextarea: 'Related Publications',
      textareaContent: '',
      subtitlePreview: 'Preview',
      publications: {
        text: '',
      },
    },
  },
  {
    title: 'Publication Info',
    completed: false,
    color: 'orange',
    // component: EditDescription,
  },
];

const componentToStateMapping = {
  [EDITMETADATA_MAIN_HEADER]: EditMetadataHeader,
  [EDITMETADATA_MAIN_DESCRIPTION]: EditDescription,
  [EDITMETADATA_CUSTOMFIELDS]: EditCustomFields,
  [EDITMETADATA_DATA_RESOURCES]: EditDataAndResources,
  [EDITMETADATA_RELATED_PUBLICATIONS]: EditRelatedPublications,
};

export function getStepToUpdate(eventName, steps) {
  if (!steps) {
    return null;
  }

  const cKeys = Object.keys(componentToStateMapping);
  const filteredKeys = cKeys.filter(k => k === eventName);
  const compKey = filteredKeys[0] || null;

  if (compKey) {

    const comp = componentToStateMapping[compKey];

    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      if (s?.component?.name === comp?.name) {
        return s;
      }
      
      if (s?.detailSteps) {
        const subStep = getStepToUpdate(eventName, s.detailSteps);
        if (subStep) {
          return subStep;
        }
      }
    }
  }

  return null;
}
