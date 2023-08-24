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
  EDITMETADATA_DATA_LICENSE,
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

import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader.vue';
import EditDescription from '@/modules/user/components/EditDescription.vue';
import EditKeywords from '@/modules/user/components/EditKeywords.vue';
import EditAuthorList from '@/modules/user/components/edit/EditAuthorList.vue';

import EditDataAndResources from '@/modules/user/components/EditDataAndResources.vue';
import EditDataInfo from '@/modules/user/components/EditDataInfo.vue';
import EditDataGeo from '@/modules/user/components/EditDataGeo.vue';

import CreateDataAndResources from '@/modules/user/components/create/CreateDataAndResources.vue';

import MetadataGenericSubStepper from '@/modules/user/components/MetadataGenericSubStepper.vue';
import MetadataCreationRelatedInfo from '@/modules/user/components/MetadataCreationRelatedInfo.vue';
import MetadataCreationPublicationInfo from '@/modules/user/components/MetadataCreationPublicationInfo.vue';
import MetadataEditingPublicationInfo from '@/modules/user/components/MetadataEditingPublicationInfo.vue';

import { defaultSwissLocation } from '@/factories/metaDataFactory';

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
  },
  [EDITMETADATA_DATA_LICENSE]: {
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
      'pub_pending',
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

/**
 * @typedef {Object} step
 * @property {string} title - step title to show in the workflow
 * @property {boolean} completed - shows the user if all the input is valid in this step
 * @property {string} key - the step key to identify the step and it's data keys / structure
 * @property {object} genericProps - the data structure for this specific step or the combination of multiple data structures
 * @property {step[] | undefined} detailSteps - the substeps for this major step
 */

/**
 * detail steps for the "main" major step
 * @type {step[]}
 */
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

/**
 * detail steps for the "data and resources" major step only for the creation workflow
 * @type {step[]}
 */
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

/**
 * detail steps for the "data and resources" major step only for the editing workflow
 * inclues resource upload components
 * @type {step[]}
 */
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

/**
 * The major steps for the creation workflow
 * @type {step[]}
 */
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

/**
 * The major steps for the editing workflow
 * @type {step[]}
 */
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

/**
 * A mapping use to combine flat data structure elements with the hierarchy of the steps structure
 *
 * Object key -> stepKey, object value -> list of data keys
 * @type {{EDITMETADATA_PUBLICATION_INFO: (string)[], EDITMETADATA_RELATED_PUBLICATIONS: (string)[], EDITMETADATA_AUTHOR_LIST: (string)[]}}
 */
export const stepKeyToDataKeyMap = {
  /*
    EDITMETADATA_AUTHOR_LIST: [
      EDITMETADATA_AUTHOR,
      EDITMETADATA_AUTHOR_DATACREDIT,
      REMOVE_EDITING_AUTHOR,
    ],
  */
  EDITMETADATA_RELATED_PUBLICATIONS: [
    EDITMETADATA_RELATED_DATASETS,
    EDITMETADATA_CUSTOMFIELDS,
  ],
  EDITMETADATA_PUBLICATION_INFO: [
    EDITMETADATA_FUNDING_INFO,
    EDITMETADATA_ORGANIZATION,
  ],
  EDITMETADATA_DATA_INFO: [
    EDITMETADATA_DATA_LICENSE,
  ],
};


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
 * @param steps {step[]}
 * @returns {step | null}
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

    return detailSteps.filter(subStep => subStep.title === subStepTitle)[0] || null;
  }

  return currentStep || null;
}

export function getEmptyMetadataInEditingObject() {
  // use the JSON.parse and JSON.stringify to disconnect it from this file
  // meaning it won't connect with the reactivity of vue.js
  // aka. a deep copy without references

  return JSON.parse(JSON.stringify(emptyMetadataInEditing));
}

/**
 * return all the dataKeys for a step key
 *
 * @param stepKey
 * @returns {[]}
 */
export function getDataKeysToStepKey(stepKey) {

  const stepKeys = Object.keys(stepKeyToDataKeyMap);

  for (let i = 0; i < stepKeys.length; i++) {
    const key = stepKeys[i];
    const dataKeys = stepKeyToDataKeyMap[key];

    if (key === stepKey) {
      return [...dataKeys];
    }
  }

  return [];
}

/**
 * returns the main key (step key) if the given key is part of a data key list
 *
 * @param dataKey {string}
 * @returns {string}
 */
export function getStepKeyToDataKey(dataKey) {
  // merged the data from these localstorage objects
  // on to a single step object because it's one step with multiple components
  // not sub steps aka. details steps

  const stepKeys = Object.keys(stepKeyToDataKeyMap);

  for (let i = 0; i < stepKeys.length; i++) {
    const stepKey = stepKeys[i];
    const dataKeys = stepKeyToDataKeyMap[stepKey];

    if (dataKeys.includes(dataKey)) {
      return stepKey;
    }
  }

  return dataKey;
}
