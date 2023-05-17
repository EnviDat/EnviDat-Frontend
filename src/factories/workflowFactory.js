import {
  EDIT_STEP_TITLE_MAIN_METADATA,
  EDIT_STEP_TITLE_MAIN_PUBLICATION,
  EDIT_STEP_TITLE_MAIN_RELATED,
  EDIT_STEP_TITLE_MAIN_RESOURCES,
  EDIT_STEP_TITLE_SUB_AUTHORS,
  EDIT_STEP_TITLE_SUB_DATA,
  EDIT_STEP_TITLE_SUB_DATES,
  EDIT_STEP_TITLE_SUB_DESC,
  EDIT_STEP_TITLE_SUB_GEO,
  EDIT_STEP_TITLE_SUB_HEADER,
  EDIT_STEP_TITLE_SUB_KEYWORDS,
  METADATA_TITLE_PROPERTY,
  METADATA_URL_PROPERTY,
} from '@/factories/metadataConsts';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_FUNDING_INFO,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';

const EditMetadataHeader = () => import('@/modules/user/components/EditMetadataHeader.vue');
const EditDescription = () => import('@/modules/user/components/EditDescription.vue');
const EditKeywords = () => import('@/modules/user/components/EditKeywords.vue');
const EditAuthorList = () => import('@/modules/user/components/edit/EditAuthorList.vue');

const EditDataAndResources = () => import('@/modules/user/components/EditDataAndResources.vue');
const EditDataInfo = () => import('@/modules/user/components/EditDataInfo.vue');
const EditDataGeo = () => import('@/modules/user/components/EditDataGeo.vue');

const CreateDataAndResources = () => import('@/modules/user/components/create/CreateDataAndResources.vue');


const MetadataGenericSubStepper = () => import('@/modules/user/components/MetadataGenericSubStepper.vue');
const MetadataCreationRelatedInfo = () => import('@/modules/user/components/MetadataCreationRelatedInfo.vue');
const MetadataCreationPublicationInfo = () => import('@/modules/user/components/MetadataCreationPublicationInfo.vue');

const MetadataEditingPublicationInfo = () => import('@/modules/user/components/MetadataEditingPublicationInfo.vue');


export const defaultSwissLocation = {
  type: 'GeometryCollection',
  geometries: [{
    type: 'Polygon',
    coordinates: [
      [
        [5.95587, 45.81802],
        [5.95587, 47.80838],
        [10.49203, 47.80838],
        [10.49203, 45.81802],
        [5.95587, 45.81802],
      ],
    ],
  }],
};

export const defaultWorldLocation = {
  type: 'GeometryCollection',
  geometries: [{
    type: 'Polygon',
    coordinates: [
      [
        [-175, -85],
        [-175, 85],
        [175, 85],
        [175, -85],
        [-175, -85],
      ],
    ],
  }],
}

/**
 * don't use any defaults on the emptyMetadataInEditing because it will be stored in the localstorage and therefore needs to be empty
 * defauls have to be added later on!
 *
 * @type {{'[EDITMETADATA_KEYWORDS]': {keywords: *[]}, '[EDITMETADATA_FUNDING_INFO]': {funders: *[]}, '[EDITMETADATA_AUTHOR_LIST]': {authors: *[]}, '[EDITMETADATA_MAIN_DESCRIPTION]': {description: string}, '[EDITMETADATA_PUBLICATION_INFO]': {possiblePublicationStates: string[], visibilityState: string, publicationState: string, publisher: string, publicationYear: string, doi: string}, '[EDITMETADATA_DATA_INFO]': {dataLicenseId: string, dates: *[]}, '[EDITMETADATA_RELATED_PUBLICATIONS]': {relatedPublicationsText: string}, '[EDITMETADATA_CUSTOMFIELDS]': {customFields: *[]}, '[EDITMETADATA_RELATED_DATASETS]': {relatedDatasetsText: string}, '[EDITMETADATA_MAIN_HEADER]': {metadataTitle: string, contactEmail: string, contactGivenName: string, contactSurname: string}, '[EDITMETADATA_ORGANIZATION]': {userOrganizations: *[], organization: string}, '[EDITMETADATA_DATA_RESOURCES]': {resources: *[]}, '[EDITMETADATA_DATA_GEO]': {location: {geoJSON: {}}}}}
 */
const emptyMetadataInEditing = {
  [EDITMETADATA_MAIN_HEADER]: {
    [METADATA_TITLE_PROPERTY]: '',
    contactEmail: '',
    contactGivenName: '',
    contactSurname: '',
    [METADATA_URL_PROPERTY]: '',
  },
  [EDITMETADATA_MAIN_DESCRIPTION]: {
    description: '',
  },
  [EDITMETADATA_KEYWORDS]: {
    keywords: [],
  },
  [EDITMETADATA_AUTHOR_LIST]: {
    authors: [],
  },
  [EDITMETADATA_DATA_RESOURCES]: {
    resources: [],
  },
  [EDITMETADATA_DATA_INFO]: {
    dates: [],
    dataLicenseId: '',
  },
  [EDITMETADATA_DATA_GEO]: {
    location: {
      geoJSON: defaultSwissLocation,
    },
  },
  [EDITMETADATA_RELATED_PUBLICATIONS]: {
    relatedPublicationsText: '',
  },
  [EDITMETADATA_RELATED_DATASETS]: {
    relatedDatasetsText: '',
  },
  [EDITMETADATA_CUSTOMFIELDS]: {
    customFields: [],
  },
  [EDITMETADATA_ORGANIZATION]: {
    // allOrganizations: [],
    organizationId: '',
    userOrganizations: [],
  },
  [EDITMETADATA_PUBLICATION_INFO]: {
    possiblePublicationStates: [
      // does an empty entry make any sense? it's like that in ckan
      // maybe better use something like 'unpublished' / 'unstarted'
      '',
      'reserved',
      'publication requested',
      'publication pending',
      'approved',
      'published',
    ],
    publicationState: '',
    visibilityState: '',
    doi: '',
    publisher: '',
    publicationYear: '',
  },
  [EDITMETADATA_FUNDING_INFO]: {
    funders: [],
  },
};

const mainDetailSteps = [
  {
    title: EDIT_STEP_TITLE_SUB_HEADER,
    completed: false,
    // component: () => import('@/modules/user/components/EditMetadataHeader.vue'),
    component: EditMetadataHeader,
    key: EDITMETADATA_MAIN_HEADER,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_SUB_DESC,
    completed: false,
    component: EditDescription,
    key: EDITMETADATA_MAIN_DESCRIPTION,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_SUB_KEYWORDS,
    completed: false,
    component: EditKeywords,
    key: EDITMETADATA_KEYWORDS,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_SUB_AUTHORS,
    completed: false,
    component: EditAuthorList,
    key: EDITMETADATA_AUTHOR_LIST,
    genericProps: {},
  },
];

const creationDataDetailSteps = [
  {
    title: EDIT_STEP_TITLE_SUB_DATA,
    completed: false,
    component: CreateDataAndResources,
    key: EDITMETADATA_DATA_RESOURCES,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_SUB_DATES,
    completed: false,
    key: EDITMETADATA_DATA_INFO,
    component: EditDataInfo,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_SUB_GEO,
    completed: false,
    key: EDITMETADATA_DATA_GEO,
    component: EditDataGeo,
    genericProps: {},
  },
];

const editingDataDetailSteps = [
  {
    title: EDIT_STEP_TITLE_SUB_DATA,
    completed: false,
    component: EditDataAndResources,
    key: EDITMETADATA_DATA_RESOURCES,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_SUB_DATES,
    completed: false,
    key: EDITMETADATA_DATA_INFO,
    component: EditDataInfo,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_SUB_GEO,
    completed: false,
    key: EDITMETADATA_DATA_GEO,
    component: EditDataGeo,
    genericProps: {},
  },
];

export const metadataCreationSteps = [
  {
    title: EDIT_STEP_TITLE_MAIN_METADATA,
    completed: false,
    component: MetadataGenericSubStepper,
    key: EDITMETADATA_MAIN,
    detailSteps: mainDetailSteps,
    stepTitle: mainDetailSteps[0].title,
    color: 'white',
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_MAIN_RESOURCES,
    completed: false,
    component: MetadataGenericSubStepper,
    key: EDITMETADATA_DATA,
    detailSteps: creationDataDetailSteps,
    stepTitle: creationDataDetailSteps[0].title,
    color: 'white',
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_MAIN_PUBLICATION,
    completed: false,
    component: MetadataCreationPublicationInfo,
    key: EDITMETADATA_PUBLICATION_INFO,
    genericProps: {},
  },
];

export const metadataEditingSteps = [
  {
    title: EDIT_STEP_TITLE_MAIN_METADATA,
    completed: false,
    component: MetadataGenericSubStepper,
    key: EDITMETADATA_MAIN,
    detailSteps: mainDetailSteps,
    stepTitle: mainDetailSteps[0].title,
    color: 'white',
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_MAIN_RESOURCES,
    completed: false,
    component: MetadataGenericSubStepper,
    key: EDITMETADATA_DATA,
    detailSteps: editingDataDetailSteps,
    stepTitle: editingDataDetailSteps[0].title,
    color: 'white',
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_MAIN_RELATED,
    completed: false,
    component: MetadataCreationRelatedInfo,
    key: EDITMETADATA_RELATED_PUBLICATIONS,
    genericProps: {},
  },
  {
    title: EDIT_STEP_TITLE_MAIN_PUBLICATION,
    completed: false,
    component: MetadataEditingPublicationInfo,
    key: EDITMETADATA_PUBLICATION_INFO,
    genericProps: {},
  },
];

export function initializeSteps(steps) {

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (step) {
      // initialize these properties here so they are reactive
      step.readOnlyFields = null;
      step.readOnlyExplanation = null;
      step.loading = false;
      step.message = null;
      step.messageDetails = null;
      step.error = null;
      step.errorDetails = null;

      if (step.detailSteps) {
        step.detailSteps = initializeSteps(step.detailSteps);
      }
    }
  }

  return steps;
}

/**
 *
 * @param stepKey {string}
 * @param steps {array<object>}
 * @returns {object | null}
 */
export function getStepByName(stepKey, steps) {
  if (!stepKey || !steps) {
    return null;
  }

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];

    if (s?.key === stepKey) {
      return s;
    }

    if (s?.detailSteps) {
      const subStep = getStepByName(stepKey, s.detailSteps);
      if (subStep) {
        return subStep;
      }
    }
  }

  return null;
}

export function getStepFromRoute(route, steps) {

  const stepTitle = route?.params?.step || null;
  const currentStep = steps?.filter(step => step.title === stepTitle)[0];

  const detailSteps = currentStep?.detailSteps || null;
  const subStepTitle = route?.params?.substep || null;

  if (detailSteps && subStepTitle) {

    const currentSubstep = detailSteps.filter(subStep => subStep.title === subStepTitle)[0];
    return currentSubstep?.key || null;
  }

  return currentStep?.key || null;
}

export function getEmptyMetadataInEditingObject() {
  // use the JSON.parse and JSON.stringify to disconnect it from this file
  // meaning it won't connect with the reactivity of vue.js
  // aka. a deep copy without references

  return JSON.parse(JSON.stringify(emptyMetadataInEditing));
}
