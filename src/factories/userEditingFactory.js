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

import {
  EDITMETADATA_AUTHOR_DATACREDIT,
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

import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import { getValidationMetadataEditingObject } from '@/factories/userEditingValidations';
import { combineAuthorLists, mergeAuthorsDataCredit } from '@/factories/authorFactory';


const EditMetadataHeader = () => import('@/modules/user/components/EditMetadataHeader.vue');
const EditDescription = () => import('@/modules/user/components/EditDescription.vue');
const EditKeywords = () => import('@/modules/user/components/EditKeywords.vue');
const EditAuthorList = () => import('@/modules/user/components/EditAuthorList.vue');

const EditDataAndResources = () => import('@/modules/user/components/EditDataAndResources.vue');
const EditDataInfo = () => import('@/modules/user/components/EditDataInfo.vue');
const EditDataGeo = () => import('@/modules/user/components/EditDataGeo.vue');

const MetadataGenericSubStepper = () => import('@/modules/user/components/MetadataGenericSubStepper.vue');
const MetadataCreationRelatedInfo = () => import('@/modules/user/components/MetadataCreationRelatedInfo.vue');
const MetadataCreationPublicationInfo = () => import('@/modules/user/components/MetadataCreationPublicationInfo.vue');


export const ACCESS_LEVEL_PUBLIC_VALUE = 'public';
export const ACCESS_LEVEL_SAMEORGANIZATION_VALUE = 'same_organization';


export function updateEditingArray(
  store,
  elementList,
  newElement,
  propertyToCompare,
) {
  // use a localcopy of the array because it might come directly
  // from the vuex store
  const localCopy = [...elementList];

  for (let i = 0; i < elementList.length; i++) {
    const el = elementList[i];

    // the localIdProperty is used to identify any elements which exists local only
    // ex. a resource which isn't uploaded yet or an author which isn't saved yet
    const match = el[propertyToCompare] === newElement[propertyToCompare];
    if (match) {
      // make sure to merged the elements, because ex. an author
      // has more information attached then is editable -> not all the properties
      // are passed down ex. the EditAuthor component

      localCopy[i] = {
        ...el,
        ...newElement,
      };

      break;
    }
  }

  // if the element doesn't exist, add it via unshift as the first entry in the list
  localCopy.unshift(newElement);

  return localCopy;
}

export function updateResource(store, state, newRes) {
  const resources = store.getters[`${USER_NAMESPACE}/resources`];

  updateEditingArray(store, resources, newRes, 'id');
}

export function updateAuthors(store, state, newAuthors) {
  const authors = state.metadataInEditing[EDITMETADATA_AUTHOR_LIST].authors;

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
    const match = element[propertyToCompare] === id;

    if (match) {
      element.isSelected = selected;
      store._vm.$set(elementList, i, element);
      return element;
    }
  }

  return null;
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

  return setSelected(store, elementList, id, propertyToCompare, true);
}

export function getSelectedElement(elementList) {
  let selectedRes = null;
  const res = elementList;

  if (res?.length > 0) {
    const selected = res.filter(r => r.isSelected);

    if (selected.length > 0) {
      selectedRes = selected[0];
    }
  }

  return selectedRes;
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
/*
  {
    title: EDIT_STEP_TITLE_MAIN_RESOURCES,
    completed: false,
    component: MetadataCreationRelatedInfo,
    key: EDITMETADATA_DATA,
    stepTitle: EDIT_STEP_TITLE_SUB_DATA,
    color: 'white',
  },
*/
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

export const metadataEditingSteps = [
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
  // const emptyEditingObject = JSON.parse(JSON.stringify(emptyMetadataInEditing));
  const emptyEditingObject = { ...emptyMetadataInEditing };

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
// const exludeRegEx = /(?:\d+\w+\S\-\w+)/gm
// eslint-disable-next-line no-useless-escape
const exludeRegEx = /(\d+\w+\S\-\w+)|(\d+\S*\d+)/gm
export function getUserAutocompleteList(userList) {

  const cleanedList = userList.filter((user) => {

    const match = user.name?.match(exludeRegEx);

    if (match && match[0] && match[0].length === user.name?.length) {
      return false;
    }

    return !(user.sysadmin || user.name.toLowerCase() === 'admin' || user.fullName?.toLowerCase() === 'admin');
  });


  return cleanedList.map((user) => user.fullName || user.displayName);
}

/**
 * Spilts the allowed users string into an array
 * @param allowedUsersString
 * @returns {*[]}
 */
export function getAllowedUserNamesArray(allowedUsersString) {
  if (!allowedUsersString) {
    return [];
  }

  const splits = allowedUsersString.split(',');
  let usersString;
  if (splits.length > 0) {
    usersString = splits;
  } else {
    usersString = [allowedUsersString]
  }

  return usersString;
}

/**
 * Return an array of the full names of the allowed users
 *
 * @param allowedUsersString
 * @param envidatUsers
 * @returns {*[]}
 */
export function getAllowedUserNames(allowedUsersString, envidatUsers) {
  if (!allowedUsersString || !envidatUsers) {
    return [];
  }

  const usersString = getAllowedUserNamesArray(allowedUsersString);

  const allowedUsers = envidatUsers.filter((user) => usersString.includes(user.name));

  return allowedUsers.map((user) => user.fullName || user.displayName);
}

/**
 * Returns a string of the allowed users names (only the name attribute of the user object)
 * separted by ","
 *
 * @param userFullNameArray
 * @param envidatUsers
 * @returns {string}
 */
export function getAllowedUsersString(userFullNameArray, envidatUsers) {
  if (!userFullNameArray || !envidatUsers) {
    return '';
  }

  const allowedUserObjs = envidatUsers.filter((user) => userFullNameArray.includes(user.fullName || user.displayName));

  const allowedUsers = allowedUserObjs.map((user) => user.name);

  return allowedUsers.join(',');
}

export function storeStepDataInLocalStorage(stepKey, data) {
  const stringData = JSON.stringify(data);
  localStorage.setItem(stepKey, stringData)
  return data;
}

export function loadDataFromLocalStorage(stepKey) {
  const storeData = localStorage.getItem(stepKey);
  try {
    return JSON.parse(storeData);
  } catch (e) {
    return null;
  }
}

function initStepDataInLocalStorage(stepKey, data) {

  const storeData = localStorage.getItem(stepKey);

  if (!storeData) {
    return storeStepDataInLocalStorage(stepKey, data);
  }

  return JSON.parse(storeData);
}


export function loadAllStepDataFromLocalStorage(steps, creationData) {

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepKey = step.key;

    if (creationData[stepKey]) {
      // if the step exists in the data structure, check the localstorage
      // steps which have detailSteps don't keep data in the data structure
      step.genericProps = initStepDataInLocalStorage(stepKey, creationData[stepKey]);
/*
      console.log(`assigned data to ${stepKey}`);
      console.log(step.genericProps);
*/
    }

    if (step.detailSteps) {
      loadAllStepDataFromLocalStorage(step.detailSteps, creationData);
    }

  }
}

export function initializeStepsInUrl(steps, vm) {
  const initialStep = steps[0]?.title || '';
  const initialSubStep = steps[0]?.detailSteps[0]?.title || '';

  const currentStep = this.routeStep
  const currentSubStep = this.routeSubStep
  const params = {}

  if (!currentStep && !currentSubStep) {
    // when no parameter are given in the url, fallback the first ones
    // but add them to the url
    params.step = initialStep;
    params.substep = initialSubStep;

    vm.$router.push({
      params,
      query: this.$route.query,
    });
  }
}

function updateStepCompleted(step, stepData) {
  const data = stepData || {};
  const values = Object.values(data);

  let isComplete = true;
  for (let i = 0; i < values.length; i++) {
    const value = values[i];

    if (value === undefined || value === null || value === '') {
      isComplete = false;
      break;
    }
  }

  step.completed = isComplete;
}

export function updateStepsWithReadOnlyFields(steps, readOnlyObj) {

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (step.detailSteps) {
      updateStepsWithReadOnlyFields(step.detailSteps, readOnlyObj);
    } else {
      step.readOnlyFields = readOnlyObj.readOnlyFields;
      step.readOnlyExplanation = readOnlyObj.explanation;
    }
  }
}

function updateStepValidation(step, stepData, stepValidation) {
  if (!stepValidation) {
    return true;
  }

  try {
    stepValidation.validateSync(stepData);
  } catch (e) {
    console.error(`updateStepValidation validation Error ${e}`);

    step.error = e.message;
    return false;
  }

  step.error = null;
  return true;
}


export function updateStepStatus(stepKey, steps, getStepDataFn) {
  const step = getStepByName(stepKey, steps);

  if (!step) {
    return;
  }

  const stepData = getStepDataFn(step.key);
  const stepValidation = getValidationMetadataEditingObject(step.key);

  if (updateStepValidation(step, stepData, stepValidation)) {

    if (!step.error && step.detailSteps?.length > 0) {
      const anyErrors = step.detailSteps.filter(s => !!s.error);

      /*
                const firstStepWithErrors = anyErrors[0];

                let mainErrorMsg = '';
                if (firstStepWithErrors?.error) {
                  mainErrorMsg = `"${firstStepWithErrors.title}" has an error: ${firstStepWithErrors.error}`;
                }
      */

      step.error = anyErrors[0]?.error ? 'Detail step has an error' : null;
    } else {
      updateStepCompleted(step, stepData);
    }
  }
}

export function componentChangedEvent(updateObj, vm, storeDataFn) {

  const payload = {
    stepKey: updateObj.object,
    data: updateObj.data,
    id: vm.$route.params.metadataid,
  };

  if (updateObj.object === EDITMETADATA_AUTHOR_DATACREDIT) {
    const currentAuthors = vm.$store.getters[`${USER_NAMESPACE}/authors`];
    const authorToMergeDataCredit = updateObj.data;

    // overwrite the authors and stepKey so it will be saved as if it was a EDITMETADATA_AUTHOR_LIST change (to the list of authors)
    payload.data = { authors: mergeAuthorsDataCredit(currentAuthors, authorToMergeDataCredit) };
    payload.stepKey = EDITMETADATA_AUTHOR_LIST;
  }

  if (updateObj.object === EDITMETADATA_AUTHOR_LIST) {
    const currentAuthors = vm.$store.getters[`${USER_NAMESPACE}/authors`];

    // ensure that authors which can't be resolved from the list of existingAuthors aren't overwritten
    // that's why it is necessary to know which have been removed via the picker and combined the three lists
    payload.data.authors = combineAuthorLists(currentAuthors, payload.data.authors, payload.data.removedAuthors);
  }

  storeDataFn(payload);
}
