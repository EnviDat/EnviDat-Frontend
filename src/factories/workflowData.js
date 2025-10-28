import {
  EDIT_STEP_TITLE_SUB_AUTHORS,
  EDIT_STEP_TITLE_SUB_DESC,
  EDIT_STEP_TITLE_SUB_HEADER,
  EDIT_STEP_TITLE_SUB_KEYWORDS,
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
  METADATA_TITLE_PROPERTY,
  METADATA_URL_PROPERTY,
} from '@/factories/metadataConsts';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_LICENSE,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_FUNDING_INFO,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS, EDITMETADATA_REVIEW_INFO,
} from '@/factories/eventBus';

import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader.vue';
import EditDescription from '@/modules/user/components/EditDescription.vue';
import EditKeywords from '@/modules/user/components/EditKeywords.vue';
import EditAuthorList from '@/modules/user/components/edit/EditAuthorList.vue';

import { defaultSwissLocation } from '@/factories/geoFactory';

/**
 * don't use any defaults on the emptyMetadataInEditing because it will be stored in the localstorage and therefore needs to be empty
 * defauls have to be added later on!
 *
 * @type {{'[EDITMETADATA_KEYWORDS]': {keywords: *[]}, '[EDITMETADATA_FUNDING_INFO]': {funders: *[]}, '[EDITMETADATA_AUTHOR_LIST]': {authors: *[]}, '[EDITMETADATA_MAIN_DESCRIPTION]': {description: string}, '[EDITMETADATA_PUBLICATION_INFO]': {possiblePublicationStates: string[], visibilityState: string, publicationState: string, publisher: string, publicationYear: string, doi: string}, '[EDITMETADATA_DATA_INFO]': {dataLicenseId: string, dates: *[]}, '[EDITMETADATA_RELATED_PUBLICATIONS]': {relatedPublicationsText: string}, '[EDITMETADATA_CUSTOMFIELDS]': {customFields: *[]}, '[EDITMETADATA_RELATED_DATASETS]': {relatedDatasetsText: string}, '[EDITMETADATA_MAIN_HEADER]': {metadataTitle: string, contactEmail: string, contactGivenName: string, contactSurname: string}, '[EDITMETADATA_ORGANIZATION]': {userOrganizations: *[], organization: string}, '[EDITMETADATA_DATA_RESOURCES]': {resources: *[]}, '[EDITMETADATA_DATA_GEO]': {location: {geoJSON: {}}}}}
 */
export const emptyMetadataInEditing = {
  [EDITMETADATA_MAIN_HEADER]: {
    [METADATA_TITLE_PROPERTY]: '',
    [METADATA_CONTACT_EMAIL]: '',
    [METADATA_CONTACT_FIRSTNAME]: '',
    [METADATA_CONTACT_LASTNAME]: '',
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
    publicationState: '',
    visibilityState: '',
    doi: '',
    publisher: '',
    publicationYear: '',
  },
  [EDITMETADATA_REVIEW_INFO]: {
    version: '',
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
export const mainDetailSteps = [
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
