/**
 * collection of editing functionalities
 *
 * @summary editing functions
 * @author Dominik Haas-Artho
 *
 * Created at     : 2021-09-14 14:25:52
 * Last modified  : 2021-09-14 14:25:52
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

/* eslint-disable no-underscore-dangle */

import EditMetadataHeader from '@/modules/user/components/EditMetadataHeader';
import EditDescription from '@/modules/user/components/EditDescription';

import EditKeywords from '@/modules/user/components/EditKeywords';
import EditAuthorList from '@/modules/user/components/EditAuthorList';
import MetadataCreationRelatedInfo from '@/modules/user/components/MetadataCreationRelatedInfo';
import EditDataInfo from '@/modules/user/components/EditDataInfo';
import EditDataGeo from '@/modules/user/components/EditDataGeo';
import MetadataCreationPublicationInfo from '@/modules/user/components/MetadataCreationPublicationInfo';

import MetadataGenericSubStepper from '@/modules/user/components/MetadataGenericSubStepper';

import EditDataAndResources from '@/modules/user/components/EditDataAndResources';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';

import { localIdProperty } from '@/factories/strategyFactory';
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
} from '@/factories/metadataConsts';


export function updateEditingArray(
  store,
  elementList,
  newElement,
  propertyToCompare,
) {
  for (let i = 0; i < elementList.length; i++) {
    const el = elementList[i];

    // the localIdProperty is used to identify any elements which exists local only
    // ex. a resource which isn't uploaded yet or an author which isn't saved yet
    const match = el[localIdProperty] === newElement[localIdProperty]
                || el[propertyToCompare] === newElement[propertyToCompare];
    if (match) {
      // make sure to merged the elements, because ex. an author
      // has more information attached then is editable -> not all the properties
      // are passed down ex. the EditAuthor component
      const mergedElement = {
        ...el,
        ...newElement,
      };

      // use the $set() to trigger an update change of vue
      store._vm.$set(elementList, i, mergedElement);
      return;
    }
  }

  // if the element doesn't exist, add it via unshift as the first entry in the list
  elementList.unshift(newElement);
}

export function updateResource(store, state, payload) {
  const resources = state.metadataInEditing[EDITMETADATA_DATA_RESOURCES].resources;
  const newRes = payload.data;

  updateEditingArray(store, resources, newRes, 'id');
}

export function updateAuthors(store, state, payload) {
  const authors = state.metadataInEditing[EDITMETADATA_AUTHOR_LIST].authors;
  const newAuthors = payload.data;

  updateEditingArray(store, authors, newAuthors, 'email');
}

/*
export function updateAuthors(store, state, payload) {

  const wrappedAuthors = state.metadataInEditing[EDITMETADATA_AUTHOR_LIST].authors;
  const newAuthor = payload.data;

  store.commit(`${METADATA_NAMESPACE}/${METADATA_UPDATE_AN_EXISTING_AUTHOR}`, newAuthor);

  // call metadata mutation for editing an author
  // get the reference key

  const authorsMap = store.getters[`${METADATA_NAMESPACE}/authorsMap`];

  // updated any wrapped infos if needed

}
*/

export function setSelected(
  store,
  elementList,
  id,
  propertyToCompare,
  selected,
) {
  for (let i = 0; i < elementList.length; i++) {
    const element = elementList[i];

    // check for newly created entries (local only)
    // with the localIdProperty first
    const match = element[localIdProperty] === id || element[propertyToCompare] === id;

    if (match) {
      element.isSelected = selected;
      store._vm.$set(elementList, i, element);
      return;
    }
  }
}

export function selectForEditing(
  store,
  elementList,
  id,
  previousId,
  propertyToCompare,
) {
  if (previousId !== '') {
    setSelected(store, elementList, previousId, propertyToCompare, false);
  }

  setSelected(store, elementList, id, propertyToCompare, true);
}

const emptyMetadataInEditing = {
  [EDITMETADATA_MAIN_HEADER]: {
    metadataTitle: '',
    contactEmail: '',
    contactGivenName: '',
    contactSurname: '',
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
    location: null,
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
    allOrganizations: [],
    organization: '',
    userOrganizationsList: [],
  },
  [EDITMETADATA_PUBLICATION_INFO]: {
    possiblePublicationStates: [
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
    funders: [],
  },
};

const mainDetailSteps = [
  {
    title: EDIT_STEP_TITLE_SUB_HEADER,
    completed: false,
    component: EditMetadataHeader,
    key: EDITMETADATA_MAIN_HEADER,
  },
  {
    title: EDIT_STEP_TITLE_SUB_DESC,
    completed: false,
    component: EditDescription,
    key: EDITMETADATA_MAIN_DESCRIPTION,
  },
  {
    title: EDIT_STEP_TITLE_SUB_KEYWORDS,
    completed: false,
    component: EditKeywords,
    key: EDITMETADATA_KEYWORDS,
  },
  {
    title: EDIT_STEP_TITLE_SUB_AUTHORS,
    completed: false,
    component: EditAuthorList,
    key: EDITMETADATA_AUTHOR_LIST,
  },
];

const dataDetailSteps = [
  {
    title: EDIT_STEP_TITLE_SUB_DATA,
    completed: false,
    component: EditDataAndResources,
    key: EDITMETADATA_DATA_RESOURCES,
  },
  {
    title: EDIT_STEP_TITLE_SUB_DATES,
    completed: false,
    key: EDITMETADATA_DATA_INFO,
    component: EditDataInfo,
  },
  {
    title: EDIT_STEP_TITLE_SUB_GEO,
    completed: false,
    key: EDITMETADATA_DATA_GEO,
    component: EditDataGeo,
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
  },
  {
    title: EDIT_STEP_TITLE_MAIN_RESOURCES,
    completed: false,
    component: MetadataGenericSubStepper,
    key: EDITMETADATA_DATA,
    detailSteps: dataDetailSteps,
    stepTitle: dataDetailSteps[0].title,
    color: 'white',
  },
  {
    title: EDIT_STEP_TITLE_MAIN_RELATED,
    completed: false,
    component: MetadataCreationRelatedInfo,
    key: EDITMETADATA_RELATED_PUBLICATIONS,
  },
  {
    title: EDIT_STEP_TITLE_MAIN_PUBLICATION,
    completed: false,
    component: MetadataCreationPublicationInfo,
    key: EDITMETADATA_PUBLICATION_INFO,
  },
];

export function initializeSteps(steps) {

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (step) {
      // initialize these properties here so they are reactive
      step.readOnlyFields = null;
      step.readOnlyExplanation = null;
      step.error = null;

      if (step.detailSteps) {
        step.detailSteps = initializeSteps(step.detailSteps);
      }
    }
  }

  return steps;
}

export function getStepByName(eventName, steps) {
  if (!eventName || !steps) {
    return null;
  }

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];

    if (s?.key === eventName) {
      return s;
    }

    if (s?.detailSteps) {
      const subStep = getStepByName(eventName, s.detailSteps);
      if (subStep) {
        return subStep;
      }
    }
  }

  return null;
}

export function getStepFromRoute(route) {

  const stepTitle = route?.params?.step || null;
  const currentStep = metadataCreationSteps.filter(step => step.title === stepTitle)[0];

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
  const emptyEditingObject = JSON.parse(JSON.stringify(emptyMetadataInEditing));

  // initialize every object with some basic attributes
  // for loading indication, error and success messages
  const stepKeys = Object.keys(emptyEditingObject);
  for (let i = 0; i < stepKeys.length; i++) {
    const key = stepKeys[i];

    const stepObj = emptyEditingObject[key];
    stepObj.loading = false;
    stepObj.message = null;
    stepObj.messageDetails = null;
    stepObj.error = null;
    stepObj.errorDetails = null;
  }

  return emptyEditingObject;
}

// Returns true if all values in obj are null or empty strings, else returns false
export function isObjectEmpty(obj) {
  return Object.values(obj).every(x => x === null || x === '');
}

export function deleteEmptyObject(index, localObjects) {
  // Assign currentObj to object with pased index in localObjects
  const currentObj = localObjects[index];

  if (!currentObj) {
    return false;
  }

  // Assign isEmpty to true if all values in currentObj are null or empty strings, else assign isEmpty to false
  const isEmpty = isObjectEmpty(currentObj);

  // If isEmpty is true and localObjects has more than one item then remove item at current index
  if (isEmpty && localObjects.length > 1) {
    localObjects.splice(index, 1);
    return true;
  }

  return false;
}

export function isMaxLength(maximum, localObjects) {
  return localObjects.length >= maximum;
}
