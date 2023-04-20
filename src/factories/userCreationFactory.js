import {
  EDITMETADATA_AUTHOR,
  EDITMETADATA_AUTHOR_DATACREDIT,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_PUBLICATION_INFO,
  eventBus,
} from '@/factories/eventBus';

import {
  combineAuthorLists,
  createAuthor,
  mergeAuthorsDataCredit,
} from '@/factories/authorFactory';

import { getValidationMetadataEditingObject } from '@/factories/userEditingValidations';
import { getStepByName, updateEditingArray } from '@/factories/userEditingFactory';
import { mapBackendToFrontend, mapFrontendToBackend } from '@/factories/mappingFactory';

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

export function addDefaultsToNewDataset(newDataset) {

  return {
    ...newDataset,
    resourceTypeGeneral : 'dataset',
  }
}

export function initializeStepDataWithDefaults(steps, user, organizationId) {
  const nameSplits = user.fullName.split(' ');
  const firstName = nameSplits[0];
  const lastName = nameSplits[1];

  const headerStep = getStepByName(EDITMETADATA_MAIN_HEADER, steps);

  headerStep.genericProps = {
    contactEmail: user.email,
    contactGivenName: firstName,
    contactSurname: lastName,
  };

  const userAuthor = createAuthor({
    firstName,
    lastName,
    email: user.email,
  });

  const authorsStep = getStepByName(EDITMETADATA_AUTHOR, steps);
  authorsStep.genericProps = { authors: [userAuthor] };

  const publicationStep = getStepByName(EDITMETADATA_PUBLICATION_INFO, steps);
  publicationStep.genericProps = {
    publisher: 'EnviDat',
  };
}

const minRequiredPropsForDatasetCreation = [
  'metadataTitle',
  'contactEmail',
  'contactGivenName',
  'contactSurname',
  // 'keywords',
  'description',
  'authors',
/*
  'dataLicenseId',
  'funders',
  'dates',
  'location.geoJSON',
  'publisher', // default "EnviDat"
*/
  'publicationYear',
];

function matchedWithRequiredProps(steps) {

  let step;
  let genericKey;
  let matches;

  const matchedPropsWithValue = [];

  for (let i = 0; i < steps.length; i++) {
    step = steps[i];
    const genericKeys = Object.keys(step.genericProps);

    matches = minRequiredPropsForDatasetCreation.filter((prop) => genericKeys.includes(prop));

    if (matches.length > 0) {
      genericKey = matches[0];
      const value = step.genericProps[genericKey];
      if (value) {
        matchedPropsWithValue.push(genericKey);
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
    const storeData = localStorage.getItem(stepKey);
    const bData = JSON.parse(storeData);
    const fData = mapBackendToFrontend(stepKey, bData);
    return fData;
  } catch (e) {
    console.error(`Failed to parse json of ${stepKey} : ${e}`);
    return null;
  }
}

function initStepDataInLocalStorage(stepKey, data) {

  const storeData = readDataFromLocalStorage(stepKey);

  if (!storeData) {
    return writeStepDataInLocalStorage(stepKey, data);
  }

  return storeData;
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


export function storeCreationStepsData(stepKey, data, steps, resetMessages = true) {

  let key = stepKey;
  let stepData = data;

  if (stepKey === EDITMETADATA_AUTHOR) {
    key = EDITMETADATA_AUTHOR_LIST;
    const authorsStepData = readDataFromLocalStorage(key);
    authorsStepData.authors = updateEditingArray(authorsStepData.authors, data, 'email');
    stepData = authorsStepData;

  } else if (stepKey === EDITMETADATA_AUTHOR_LIST) {

    key = EDITMETADATA_AUTHOR_LIST;
    const authorsStepData = readDataFromLocalStorage(key);
    // add the new author as an array
    authorsStepData.authors = combineAuthorLists(authorsStepData.authors, [data]);

    stepData = authorsStepData;
  } else if (stepKey === EDITMETADATA_AUTHOR_DATACREDIT) {
    key = EDITMETADATA_AUTHOR_LIST;
    const authorsStepData = readDataFromLocalStorage(key);

    // overwrite the authors and stepKey that it will be saved as if it was a EDITMETADATA_AUTHOR_LIST change (to the list of authors)
    authorsStepData.authors = mergeAuthorsDataCredit(authorsStepData.authors, data);

    stepData = authorsStepData;
  }

  const step = getStepByName(key, steps);
  const storedData = writeStepDataInLocalStorage(key, stepData);

  if (storedData) {
    stepData.message = `Changes for ${step.title} saved locally!`;
    stepData.messageDetails = `Saved data for ${step.title} in your browser, enter all mandatory fields to save it on the server!`;

    if (resetMessages) {
      setTimeout(() => {
        step.genericProps = {
          ...stepData,
          message: null,
          messageDetails: null,
        };
      }, 2500);
    }
  }


  step.genericProps = stepData;

  eventBus.emit(EDITMETADATA_CLEAR_PREVIEW);

  return stepData;
}


