import {
  EDITMETADATA_AUTHOR,
  EDITMETADATA_AUTHOR_DATACREDIT,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  eventBus,
  REMOVE_EDITING_AUTHOR,
} from '@/factories/eventBus';

import {
  combineAuthorLists,
  createAuthor,
  mergeAuthorsDataCredit,
} from '@/factories/authorFactory';

import { getValidationMetadataEditingObject } from '@/factories/userEditingValidations';
import { updateEditingArray } from '@/factories/userEditingFactory';
import {
  convertToBackendJSONWithRules,
  getMetadataUrlFromTitle,
  mapBackendToFrontend,
  mapFrontendToBackend,
} from '@/factories/mappingFactory';

import {
  defaultSwissLocation,
  getDataKeysToStepKey,
  getEmptyMetadataInEditingObject,
  getStepByName,
  getStepKeyToDataKey,
} from '@/factories/workflowFactory';
import { getYear } from 'date-fns';

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

export function getNewDatasetDefaults(userEditMetadataConfig) {

  const geoJSON = userEditMetadataConfig?.defaultLocation || defaultSwissLocation;
  const defaults = {
    location: { geoJSON },
    resourceTypeGeneral: 'dataset',
  };

  const backendSpatial = mapFrontendToBackend(EDITMETADATA_DATA_GEO, defaults);

  const backendJSONDefaults = convertToBackendJSONWithRules([
    ['resourceTypeGeneral', 'resource_type_general'],
  ], defaults);

  return {
    ...backendSpatial,
    ...backendJSONDefaults,
  };
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

  const userAuthor = [];
  if (firstName && lastName && email) {
    const author = createAuthor({
      firstName,
      lastName,
      email,
    });
    userAuthor.push(author);
  }

  creationData[EDITMETADATA_AUTHOR_LIST] = { authors: userAuthor };

  const defaultCurrentYear = getYear(new Date()).toString();

  const publicationStep = creationData[EDITMETADATA_PUBLICATION_INFO];
  creationData[EDITMETADATA_PUBLICATION_INFO] = {
    ...publicationStep,
    publisher: 'EnviDat',
    publicationYear: defaultCurrentYear,
  };

  creationData[EDITMETADATA_DATA_GEO] = {
    location: {
      geoJSON: defaultSwissLocation,
    },
  }

  if (organizationId) {
    const organizationData = creationData[EDITMETADATA_ORGANIZATION];

    creationData[EDITMETADATA_ORGANIZATION] = {
      ...organizationData,
      organizationId,
    }
  }

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
  'organizationId',
  // 'location', // 'location.geoJSON',
  'publisher',
  'publicationYear',
];

function matchedWithRequiredProps(steps) {

  let step;
  let matches;

  for (let i = 0; i < steps.length; i++) {
    step = steps[i];
    const genericKeys = Object.keys(step.genericProps);

    matches = minRequiredPropsForDatasetCreation.filter((prop) => genericKeys.includes(prop));

    if (matches.length > 0) {

      for (let j = 0; j < matches.length; j++) {

        const key = matches[j];
        const value = step.genericProps[key];
        const isArray = value instanceof Array;
        const arrayWithValues = isArray && value.length > 0;

        if (value && (!isArray || arrayWithValues)) {
          // continue
        } else {
          return false;
        }
      }
    }

    if (step.detailSteps) {
      const detailMatched = matchedWithRequiredProps(step.detailSteps);

      if (!detailMatched) {
        return false;
      }
    }
  }

  return true;
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
    localStorage.setItem(stepKey, stringData);
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
 * @param dataKey
 * @returns {*|null}
 */
export function readDataFromLocalStorage(dataKey) {
  if (!dataKey) {
    return null;
  }

  try {
    const localData = localStorage.getItem(dataKey);

    if (!localData) {
      return null;
    }

    const bData = JSON.parse(localData);
    const fData = mapBackendToFrontend(dataKey, bData);
    return fData;
  } catch (e) {
    console.error(`Failed to parse json of ${dataKey} : ${e}`);
    return null;
  }
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
    const stepKey = step.key;

    const dataKeys = getDataKeysToStepKey(stepKey);

    // use the stepKey itself aswell, for merged step data and flat stored
    // it is used in both cases
    dataKeys.push(stepKey);

    for (let j = 0; j < dataKeys.length; j++) {

      const dataKey = dataKeys[j];
      const bData = mapFrontendToBackend(dataKey, step.genericProps);

      if (bData) {
        flatData = {
          ...flatData,
          ...bData,
        };
      }

    }

    if (step.detailSteps) {
      const flatDetailData = getFlatBackendDataFromSteps(step.detailSteps);
      flatData = {
        ...flatData,
        ...flatDetailData,
      };
    }
  }

  return flatData;
}

/**
 *
 * @param steps {array}
 * @param userEditMetadataConfig
 * @returns {object} dataset in a json structure as the backend expects it
 */
export function createNewDatasetFromSteps(steps, userEditMetadataConfig) {

  const bData = getFlatBackendDataFromSteps(steps);
  const bDefaults = getNewDatasetDefaults(userEditMetadataConfig);
  const name = getMetadataUrlFromTitle(bData.title);

  const orgaId = bData.organization?.id || '';

  return {
    'owner_org': orgaId,
    ...bData,
    name,
    ...bDefaults,
  };
}

export function loadAllStepDataFromLocalStorage(steps, creationData) {

  const keys = Object.keys(creationData);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    const storeData = initStepDataInLocalStorage(key, creationData[key]);

    if (storeData) {
      const stepKey = getStepKeyToDataKey(key);
      const step = getStepByName(stepKey, steps);

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

  const params = {};

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

export function initStepDataOnLocalStorage(steps, user, prefilledOrganizationId) {
  const creationData = getEmptyMetadataInEditingObject();

  initCreationDataWithDefaults(creationData, user, prefilledOrganizationId);
  loadAllStepDataFromLocalStorage(steps, creationData);
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

function stepValidation(step, stepData, validationRules, skipError = false) {
  if (!validationRules) {
    return false;
  }

  try {
    validationRules.validateSync(stepData);
  } catch (e) {

    if (!skipError) {
      console.error(`stepValidation validation Error ${e}`);

      step.error = e.message;
    }

    return false;
  }

  if (!skipError) {
    step.error = null;
  }

  return true;
}

export function updateStepValidation(step, steps) {
  if (!step) {
    return;
  }

  const detailSteps = step.detailSteps;

  if (detailSteps) {
    for (let i = 0; i < detailSteps.length; i++) {
      const detailStep = step.detailSteps[i];
      updateStepValidation(detailStep, steps);
    }

    const anyErrors = detailSteps.filter(s => !!s.error);
    step.error = anyErrors[0]?.error ? 'Error in detail step' : null;
    step.completed = !!step.error;

    return;
  }

  const stepKey = step.key;
  const stepData = step.genericProps;
  const dataKeys = getDataKeysToStepKey(stepKey);

  // use the stepKey itself aswell, for merged step data and flat stored
  // it is used in both cases
  dataKeys.push(stepKey);

  for (let i = 0; i < dataKeys.length; i++) {
    const key = dataKeys[i];
    const validationRules = getValidationMetadataEditingObject(key);

    if (validationRules) {
      step.completed = stepValidation(step, stepData, validationRules);
      if (step.error) {
        break;
      }
    }
  }

  // console.log(`updateStepStatus step ${step.key} completed? ${step.completed}`);

}

export function updateAllStepsForCompletion(steps) {
  if (!steps) {
    return 0;
  }

  let countCompleted = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const detailSteps = step.detailSteps;

    if (detailSteps) {
      const completedDetailSteps = updateAllStepsForCompletion(step.detailSteps);
      step.completed = completedDetailSteps === detailSteps.length;

      if(step.completed) {
        countCompleted++;
        // clear the error for a parent step, they only get cleared through the validation check
        step.error = null;
      }
    } else {

      const stepData = step.genericProps;
      const stepKey = step.key;
      const dataKeys = getDataKeysToStepKey(stepKey);

      // use the stepKey itself aswell, for merged step data and flat stored
      // it is used in both cases
      dataKeys.push(stepKey);

      let countDataValid = 0;

      for (let j = 0; j < dataKeys.length; j++) {
        const key = dataKeys[j];
        const validationRules = getValidationMetadataEditingObject(key);

        step.completed = validationRules ? stepValidation(step, stepData, validationRules, true) : true;

        if(step.completed) {
          countDataValid++;
        } else {
          break;
        }
      }

      if (countDataValid === dataKeys.length) {
        countCompleted++;
      }

    }
    // console.log(`step ${step.key} completed? ${step.completed}`);
  }

  return countCompleted;
}

export function countSteps(steps, onlyCompleted) {
  if (!steps) {
    return 0;
  }
  
  let count = 0;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.detailSteps) {
      const detailCounts = countSteps(step.detailSteps, onlyCompleted);
      count += detailCounts;
    } else if (!onlyCompleted) {
      count++;
    } else if (onlyCompleted && step.completed) {
      count++;
    }
  }
  
  return count;
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

  let storedData;
  let stepData;
  let stepKey;

  if (dataKey.includes('AUTHOR')) {
    // any author information is stored in the author list
    stepData = combineAuthorDataChanges(dataKey, data);
    storedData = writeStepDataInLocalStorage(EDITMETADATA_AUTHOR_LIST, stepData);
    stepKey = EDITMETADATA_AUTHOR_LIST;
  } else {
    stepData = data;
    storedData = writeStepDataInLocalStorage(dataKey, stepData);
    stepKey = getStepKeyToDataKey(dataKey);
  }

  // some of the data is stored in the same "Step" object therefore we need to the right step key
  // (the data structure is flat key -> object, the step structure as a hierachy steps with details steps
  // const stepKey = getStepKeyToDataKey(dataKey);
  const step = getStepByName(stepKey, steps);

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

export function canLocalDatasetBeStoredInBackend(steps) {

  if (!steps) {
    return false;
  }

  const allSteps = countSteps(steps);
  const onlyCompleted = countSteps(steps, true);

  return allSteps === onlyCompleted;
}

