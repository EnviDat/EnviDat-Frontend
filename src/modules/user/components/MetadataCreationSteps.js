import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader';
import EditDescription from '@/modules/user/components/EditDescription';
import EditCustomFields from '@/modules/user/components/EditCustomFields';

import MetadataCreationMainInfo from '@/modules/user/components/MetadataCreationMainInfo';

import {
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
} from '@/factories/eventBus';

export const mainDetailSteps = [
  {
    title: 'Basic Info',
    completed: false,
    component: EditMetadataHeader,
  },
  {
    title: 'Description',
    completed: false,
    component: EditDescription,
  },
  {
    title: 'Keywords',
    completed: false,
    component: EditCustomFields,
  },
  {
    title: 'Authors',
    completed: false,
    component: EditDescription,
  },
];

export const metadataCreationSteps = [
  {
    title: 'Main Info',
    completed: false,
    color: 'secondary',
    component: MetadataCreationMainInfo,
    detailSteps: mainDetailSteps,
  },
  {
    title: 'Data Info',
    completed: false,
    color: 'red',
    component: EditDescription,
  },
  {
    title: 'Related Info',
    completed: false,
    color: 'green',
    component: EditCustomFields,
  },
  {
    title: 'Publication Info',
    completed: false,
    color: 'orange',
    component: EditDescription,
  },
];

const componentToStateMapping = {
  [EDITMETADATA_MAIN_HEADER]: EditMetadataHeader,
  [EDITMETADATA_MAIN_DESCRIPTION]: EditDescription,
  [EDITMETADATA_CUSTOMFIELDS]: EditCustomFields,
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
        return getStepToUpdate(eventName, s.detailSteps);
      }
    }
  }

  return null;
};