import {
  EDITMETADATA_AUTHOR,
  EDITMETADATA_AUTHOR_DATACREDIT,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_FUNDING_INFO,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS,
  REMOVE_EDITING_AUTHOR,
  eventBus,
} from '@/factories/eventBus';

import {
  combineAuthorLists,
  createAuthor,
  mergeAuthorsDataCredit,
} from '@/factories/authorFactory';

import { getValidationMetadataEditingObject } from '@/factories/userEditingValidations';
import { updateEditingArray } from '@/factories/userEditingFactory';
import { convertToBackendJSONWithRules, mapBackendToFrontend, mapFrontendToBackend } from '@/factories/mappingFactory';

import { getEmptyMetadataInEditingObject, getStepByName } from '@/factories/workflowFactory';

/*
export const ckanRequiredPropsForDatasetCreation = [
  'title', // can include whitespaces
  'name', // whitespaces should be replaced with '-'
  'maintainer', // add the user which creates the dataset as default
  'tags', // maybe use ? 'tag_string',
  'notes',
  'author',  // add the user which creates the dataset as default
  'license_id',
  'funding',
  'date',
  'owner_org',
  'resource_type_general', // default: 'dataset'
  'spatial',
  'publication', // default: "{\"publisher\": \"EnviDat\", \"publication_year\": \"2023\"}"
];
*/

const hardCodedDefaultLocation = {
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
};

export function getNewDatasetDefaults(userEditMetadataConfig) {

  const geoJSON = userEditMetadataConfig?.defaultLocation || hardCodedDefaultLocation;
  const defaults = {
    location: { geoJSON },
    resourceTypeGeneral : 'dataset',
  }

  const backendJSONDefaults = convertToBackendJSONWithRules([
    ['ownerOrg', 'owner_org'],
    ['resourceTypeGeneral', 'resource_type_general'],
  ], defaults);

  return backendJSONDefaults;
}

function initCreationDataWithDefaults(creationData, user, organizationId) {
  const fullName = user?.fullName || user?.name || '';
  const nameSplits = fullName.split(' ');

  let firstName = nameSplits[0];
  if (nameSplits.length > 2) {
    const lastIndex = fullName.lastIndexOf(' ');
    firstName = fullName.substring(0, lastIndex);
  }

  const lastName = nameSplits[nameSplits.length - 1];
  const email = user?.email || undefined;

  const headerStep = creationData[EDITMETADATA_MAIN_HEADER];

  creationData[EDITMETADATA_MAIN_HEADER] = {
    ...headerStep,
    contactEmail: email,
    contactGivenName: firstName,
    contactSurname: lastName,
  };

  const userAuthor =[];
  if (firstName && lastName && email) {
    const author = createAuthor({
      firstName,
      lastName,
      email,
    });
    userAuthor.push(author);
  }

  creationData[EDITMETADATA_AUTHOR_LIST] = { authors: userAuthor };

  const publicationStep = creationData[EDITMETADATA_PUBLICATION_INFO];
  creationData[EDITMETADATA_PUBLICATION_INFO] = {
    ...publicationStep,
    publisher: 'EnviDat',
  };
}

const minRequiredPropsForDatasetCreation = [
  'metadataTitle',
  'contactEmail',
  'contactGivenName',
  'contactSurname',
  'keywords',
  'description',
  'authors',
  'dataLicenseId',
  'funders',
  'dates',
  'location.geoJSON',
  'publisher',
  'publicationYear',
];

function matchedWithRequiredProps(steps) {

  let step;
  let matches;

  const matchedPropsWithValue = [];

  for (let i = 0; i < steps.length; i++) {
    step = steps[i];
    const genericKeys = Object.keys(step.genericProps);

    matches = minRequiredPropsForDatasetCreation.filter((prop) => genericKeys.includes(prop));

    if (matches.length > 0) {
      for (let j = 0; j < matches.length; j++) {
        const key = matches[j];
        const value = step.genericProps[key];
        if (value) {
          matchedPropsWithValue.push(key);
        }
      }

    }

    if (step.detailSteps) {
      const detailMatches = matchedWithRequiredProps(step.detailSteps);
      if (detailMatches.length > 0) {
        matchedPropsWithValue.push(...detailMatches);
      }
    }
  }

  return matchedPropsWithValue;
}

export function canLocalDatasetBeStoredInBackend(steps) {

  if (!steps) {
    return false;
  }

  const matchedPropsWithValue = matchedWithRequiredProps(steps);

  return matchedPropsWithValue.length === minRequiredPropsForDatasetCreation.length;
}

/**
 * stores the data to a step in the creation workflow.
 * It uses the mapFrontendToBackend function to make sure only data is stored
 * which is needed in the JSON structure in the backend.
 * (Nothing which is only part of the user communication to fill out a current step
 * ex. input validation errors)
 * This is the disadvantage the in the local storage the JSON
 * has snake_case style property names (coming from the Python backend).
 * But via the mapping functions, this is resovled in the same
 * was as if communicating with the backend.
 *
 * @param stepKey
 * @param data
 * @returns {*|null}
 */
function writeStepDataInLocalStorage(stepKey, data) {

  if (!stepKey) {
    return null;
  }

  try {
    const bData = mapFrontendToBackend(stepKey, data);
    const stringData = JSON.stringify(bData);
    localStorage.setItem(stepKey, stringData)
  } catch (e) {
    console.error(`Failed to stringify json of ${stepKey} : ${e}`);
    return null;
  }

  return data;
}

/**
 * Loads data from the browsers local storage for the given step
 * from the creation workflow.
 *
 * The mapBackendToFrontend function is used to make sure only
 * data which is defined in the mapping rules will be available for the frontend.
 * In the same as if communicating to the Python backend.
 *
 * @param stepKey
 * @returns {*|null}
 */
export function readDataFromLocalStorage(stepKey) {
  if(!stepKey) {
    return null;
  }

  try {
    const localData = localStorage.getItem(stepKey);

    if (!localData) {
      return null;
    }

    const bData = JSON.parse(localData);
    const fData = mapBackendToFrontend(stepKey, bData);
    return fData;
  } catch (e) {
    console.error(`Failed to parse json of ${stepKey} : ${e}`);
    return null;
  }
}


export function getFlatDataFromLocalStorage(steps) {
  let flatStoreData = {};

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    const data = readDataFromLocalStorage(step.key);
    flatStoreData = {
      ...flatStoreData,
      ...data,
    }

    if (step.detailSteps) {
      const flatDetailData = getFlatDataFromLocalStorage(step.detailSteps);
      flatStoreData = {
        ...flatStoreData,
        ...flatDetailData,
      }
    }
  }

  return flatStoreData;
}

function initStepDataInLocalStorage(stepKey, data) {

  const localData = readDataFromLocalStorage(stepKey);

  if (!localData) {
    return writeStepDataInLocalStorage(stepKey, data);
  }

  return localData;
}

function getFlatBackendDataFromSteps(steps) {
  let flatData = {};

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    const bData = mapFrontendToBackend(step.key, step.genericProps);

    flatData = {
      ...flatData,
      ...bData,
    }

    if (step.detailSteps) {
      const flatDetailData = getFlatBackendDataFromSteps(step.detailSteps);
      flatData = {
        ...flatData,
        ...flatDetailData,
      }
    }
  }

  return flatData;
}

export function createNewDatasetFromSteps(steps, userEditMetadataConfig) {

  const bData = getFlatBackendDataFromSteps(steps);
  const bDefaults = getNewDatasetDefaults(userEditMetadataConfig);
  return {
    ...bData,
    ...bDefaults,
  };
}

/**
 *
 * @param key {string}
 * @returns {*|string}
 */
function getStepKeyToDataKey(key) {
  // merged the data from these localstorage objects
  // on to a single step object because it's one step with multiple components
  // not sub steps aka. details steps

  if (key === EDITMETADATA_AUTHOR ||
      key === EDITMETADATA_AUTHOR_DATACREDIT ||
      key === REMOVE_EDITING_AUTHOR) {
    return EDITMETADATA_AUTHOR_LIST;
  }

  if (key === EDITMETADATA_RELATED_DATASETS ||
    key === EDITMETADATA_CUSTOMFIELDS) {
    return EDITMETADATA_RELATED_PUBLICATIONS;
  }

  if (key === EDITMETADATA_FUNDING_INFO ||
    key === EDITMETADATA_ORGANIZATION) {
    return EDITMETADATA_PUBLICATION_INFO;
  }

  return key;
}

export function loadAllStepDataFromLocalStorage(steps, creationData) {

  const keys = Object.keys(creationData);

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    const storeData = initStepDataInLocalStorage(key, creationData[key]);

    if (storeData) {
      key = getStepKeyToDataKey(key);

      const step = getStepByName(key, steps);

      if (step) {
        step.genericProps = {
          ...step.genericProps,
          ...storeData,
        };
      }
    }

  }
}

export function initializeStepsInUrl(steps, routeStep, routeSubStep, vm) {
  const initialStep = steps[0]?.title || '';
  const initialSubStep = steps[0]?.detailSteps[0]?.title || '';

  const params = {}

  if (!routeStep && !routeSubStep) {
    // when no parameter are given in the url, fallback the first ones
    // but add them to the url
    params.step = initialStep;
    params.substep = initialSubStep;

    vm.$router.push({
      params,
      query: vm.$route.query,
    });
  }
}

export function initStepDataOnLocalStorage(steps, user) {
  const creationData = getEmptyMetadataInEditingObject();

  initCreationDataWithDefaults(creationData, user, 'test')
  loadAllStepDataFromLocalStorage(steps, creationData);
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

  const stepData = getStepDataFn(step);
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

function combineAuthorDataChanges(dataKey, data) {
  if (dataKey === EDITMETADATA_AUTHOR) {

    const authorsStepData = readDataFromLocalStorage(EDITMETADATA_AUTHOR_LIST);
    authorsStepData.authors = updateEditingArray(authorsStepData.authors, data, 'email');
    return authorsStepData;
  }

  if (dataKey === EDITMETADATA_AUTHOR_LIST) {

    const authorsStepData = readDataFromLocalStorage(EDITMETADATA_AUTHOR_LIST);
    // ensure that authors which can't be resolved from the list of existingAuthors aren't overwritten
    // that's why it is necessary to know which have been removed via the picker and combined the three lists
    authorsStepData.authors = combineAuthorLists(authorsStepData.authors, data.authors, data.removedAuthors);
    return authorsStepData;
  }

  if (dataKey === REMOVE_EDITING_AUTHOR) {

    const email = data;
    const authorsStepData = readDataFromLocalStorage(EDITMETADATA_AUTHOR_LIST);
    const authorToRemove = authorsStepData.authors.filter(a => a.email === email);

    authorsStepData.authors = combineAuthorLists(authorsStepData.authors, [], authorToRemove);
    return authorsStepData;
  }

  if (dataKey === EDITMETADATA_AUTHOR_DATACREDIT) {
    const authorsStepData = readDataFromLocalStorage(EDITMETADATA_AUTHOR_LIST);

    // overwrite the authors and dataKey that it will be saved as if it was a EDITMETADATA_AUTHOR_LIST change (to the list of authors)
    authorsStepData.authors = mergeAuthorsDataCredit(authorsStepData.authors, data);
    return authorsStepData;
  }

  return data;
}


export function storeCreationStepsData(dataKey, data, steps, resetMessages = true) {

  const stepData = combineAuthorDataChanges(dataKey, data);

  // some of the data is stored in the same "Step" object therefore we need to the right step key
  // (the data structure is flat key -> object, the step structure as a hierachy steps with details steps
  const key = getStepKeyToDataKey(dataKey);
  const storedData = writeStepDataInLocalStorage(key, stepData);
  const step = getStepByName(key, steps);

  if (storedData) {
    stepData.message = `Changes for ${step.title} saved locally!`;
    stepData.messageDetails = `Saved data for ${step.title} in your browser, enter all mandatory fields to save it on the server!`;

    if (resetMessages) {
      setTimeout(() => {
        step.genericProps.message = null;
        step.genericProps.messageDetails = null;
      }, 2500);
    }
  }

  step.genericProps = {
    ...step.genericProps,
    // use the stepData here, because the storeData only contains
    // what later on is stored in the backend
    ...stepData,
  };

  eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

  return stepData;
}


