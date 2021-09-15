import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader';
import EditDescription from '@/modules/user/components/EditDescription';

import EditKeywords from '@/modules/user/components/EditKeywords';
import EditAuthorList from '@/modules/user/components/EditAuthorList';
import MetadataCreationRelatedInfo from '@/modules/user/components/MetadataCreationRelatedInfo';
import EditDataInfo from '@/modules/user/components/EditDataInfo';
import MetadataCreationPublicationInfo from '@/modules/user/components/MetadataCreationPublicationInfo';

// eslint-disable-next-line no-unused-vars
import MetadataCreationMainInfo from '@/modules/user/components/MetadataCreationMainInfo';
import EditDataAndResources from '@/modules/user/components/EditDataAndResources';

import {
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_RELATED_PUBLICATIONS,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_KEYWORDS,
} from '@/factories/eventBus';

import { getOrganizationMap } from '@/factories/metaDataFactory';
import testOrganizations from '@/../stories/js/organizations';

const allOrganizations = getOrganizationMap(testOrganizations);

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
      labelTextarea: 'Metadata Description',
      descriptionInstructions: 'Please enter a description for the research data.',
      subtitlePreview: 'Description Preview',
      description: '',
    },
  },
  {
    title: 'Keywords',
    completed: false,
    component: EditKeywords,
    genericProps: {
      keywordsSource: [],
      keywords: [],
    },
  },
  {
    title: 'Authors',
    completed: false,
    component: EditAuthorList,
    genericProps: {
      authors: [],
      existingAuthors: [],
      authorDetailsConfig: {
        showDatasetCount: true,
        showAuthorInfos: true,
        showDataCredits: true,
        showDataCreditScore: false,
      },
    },
  },
];

export const dataDetailSteps = [
  {
    title: 'Data & Resources',
    completed: false,
    component: EditDataAndResources,
    genericProps: {
      resources: [],
      resourcesConfig: {
        downloadActive: false,
      },
    },
  },
  {
    title: 'Data Info',
    completed: false,
    component: EditDataInfo,
  },
];

export const metadataCreationSteps = [
  {
    title: 'Main Info',
    completed: false,
    component: MetadataCreationMainInfo,
    detailSteps: mainDetailSteps,
    initialStepTitle: mainDetailSteps[0].title,
  },
  {
    title: 'Data Info',
    completed: false,
    component: MetadataCreationMainInfo,
    detailSteps: dataDetailSteps,
    initialStepTitle: dataDetailSteps[0].title,
  },
  {
    title: 'Related Info',
    completed: false,
    component: MetadataCreationRelatedInfo,
    genericProps: {
      labelTextarea: 'Related Publications',
      relatedPublicationsInstructions: 'Add references to related publications to dataset(s)',
      relatedPublicationsText: '',
      subtitlePreview: 'Related Publications Preview',
      customFields: [],
    },
  },
  {
    title: 'Publication Info',
    completed: false,
    component: MetadataCreationPublicationInfo,
    genericProps: {
      organizationsMap: allOrganizations,
      organization: '',
      publicationState: '',
      doi: '',
      publisher: '',
      publicationYear: '',
      funders: [],
    },

  },
];

const componentToStateMapping = {
  [EDITMETADATA_MAIN_HEADER]: EditMetadataHeader,
  [EDITMETADATA_MAIN_DESCRIPTION]: EditDescription,
  [EDITMETADATA_DATA_RESOURCES]: EditDataAndResources,
  [EDITMETADATA_RELATED_PUBLICATIONS]: MetadataCreationRelatedInfo,
  [EDITMETADATA_CUSTOMFIELDS]: MetadataCreationRelatedInfo,
  [EDITMETADATA_PUBLICATION_INFO]: MetadataCreationPublicationInfo,
  [EDITMETADATA_ORGANIZATION]: MetadataCreationPublicationInfo,
  [EDITMETADATA_AUTHOR_LIST]: EditAuthorList,
  [EDITMETADATA_KEYWORDS]: EditKeywords,
};

export function getStepByName(eventName, steps) {
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
        const subStep = getStepByName(eventName, s.detailSteps);
        if (subStep) {
          return subStep;
        }
      }
    }
  }

  return null;
}
