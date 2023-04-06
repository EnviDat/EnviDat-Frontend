import { EDITMETADATA_AUTHOR_DATACREDIT, EDITMETADATA_AUTHOR_LIST } from '@/factories/eventBus';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import { combineAuthorLists, mergeAuthorsDataCredit } from '@/factories/authorFactory';
import { getValidationMetadataEditingObject } from '@/factories/userEditingValidations';
import { getStepByName } from '@/factories/userEditingFactory';

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
