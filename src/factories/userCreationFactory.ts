import { EDITMETADATA_KEYWORDS, EDITMETADATA_MAIN_DESCRIPTION, EDITMETADATA_MAIN_HEADER } from '@/factories/eventBus';
import { mapBackendToFrontend } from '@/factories/mappingFactory';

import { WorkflowStep } from '@/factories/workflowFactory';

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
export function readDataFromLocalStorage(dataKey: string) {
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

export function readDatasetFromLocalStorage(datasetId: string) {
  if (!datasetId) {
    return undefined;
  }

  try {
    const localData = localStorage.getItem(datasetId);

    if (!localData) {
      return undefined;
    }

    return JSON.parse(localData);
  } catch (e) {
    console.error(`Failed to parse json of ${datasetId} : ${e}`);
    return null;
  }
}

export function countSteps(steps: WorkflowStep[], onlyCompleted: boolean = false) {
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

export function storeDatasetInLocalStorage(datasetId: string, data: any) {
  if (!datasetId) {
    return null;
  }

  try {
    const stringData = JSON.stringify(data);
    localStorage.setItem(datasetId, stringData);
  } catch (e) {
    console.error(`Failed to stringify json of ${datasetId} : ${e}`);
    return null;
  }

  return data;
}

export function getPreviewDatasetFromLocalStorage() {
  const header = readDataFromLocalStorage(EDITMETADATA_MAIN_HEADER);
  const desc = readDataFromLocalStorage(EDITMETADATA_MAIN_DESCRIPTION);
  const keywords = readDataFromLocalStorage(EDITMETADATA_KEYWORDS);

  return {
    ...desc,
    ...keywords,
    // keywords also contains METADATA_TITLE_PROPERTY, therefore the header needs to be applied afterwards
    ...header,
  };
}
