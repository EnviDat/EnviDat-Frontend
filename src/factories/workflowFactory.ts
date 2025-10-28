import type { RouteLocationNamedRaw } from 'vue-router';
import {
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA_LICENSE,
  EDITMETADATA_FUNDING_INFO,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_RELATED_DATASETS,
} from '@/factories/eventBus';

import { emptyMetadataInEditing } from '@/factories/workflowData';


export type WorkflowStep = {
  key: string;
  title: string;
  readOnlyFields: string | null;
  readOnlyExplanation: string | null;
  loading: boolean;
  completed: boolean;
  genericProps: any;
  message: string | null;
  messageDetails: string | null;
  error: string | null;
  errorDetails: string | null;
  detailSteps: WorkflowStep[];
}

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


export function initializeSteps(steps: WorkflowStep[]) {

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

export function getStepByName(stepKey: string, steps: WorkflowStep[]): WorkflowStep | null {
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

export function getStepFromRoute(route: RouteLocationNamedRaw, steps: WorkflowStep[]) {

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
export function getDataKeysToStepKey(stepKey: string)  {
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
export function getStepKeyToDataKey(dataKey: string) {
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
