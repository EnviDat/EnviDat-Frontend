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

import { localIdProperty } from '@/factories/strategyFactory';
import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
} from '@/factories/eventBus';

export function updateEditingArray(store, elementList, newElement) {
  for (let i = 0; i < elementList.length; i++) {
    const el = elementList[i];

    if (el.id === newElement.id) {
      store._vm.$set(elementList, i, newElement);
      return;
    }
  }

  elementList.unshift(newElement);
}

export function updateResource(store, state, payload) {

  const resources = state.metadataInEditing[EDITMETADATA_DATA_RESOURCES].resources;
  const newRes = payload.data;

  updateEditingArray(store, resources, newRes);
}

export function updateAuthors(store, state, payload) {

  const authors = state.metadataInEditing[EDITMETADATA_AUTHOR_LIST].authors;
  const newAuthors = payload.data;

  updateEditingArray(store, authors, newAuthors);
}

export function setSelected(store, elementList, id, propertyToCompare, selected) {

  for (let i = 0; i < elementList.length; i++) {
    const element = elementList[i];

    if (element[localIdProperty]) {
      // check for newly created entries (local only)
      // with the localIdProperty first

      if (element[localIdProperty] === id) {
        element.isSelected = selected;
        store._vm.$set(elementList, i, element);
        return;
      }
    }

    if (element[propertyToCompare] === id) {
      // then check with a specific property like the id
      // of a resource or the email of an author

      element.isSelected = selected;
      store._vm.$set(elementList, i, element);
      return;
    }
  }
}

export function selectForEditing(store, elementList, id, previousId, propertyToCompare) {

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
    labelTextarea: 'Metadata Description',
    descriptionInstructions: 'Please enter a description for the research data.',
    subtitlePreview: 'Description Preview',
    description: '',
  },
  [EDITMETADATA_KEYWORDS]: {
    keywordsSource: [],
    keywords: [],
  },
  [EDITMETADATA_AUTHOR_LIST]: {
    authors: [],
    existingAuthors: [],
    authorDetailsConfig: {
      showDatasetCount: true,
      showAuthorInfos: true,
      showDataCredits: true,
      showDataCreditScore: false,
    },
  },
  [EDITMETADATA_DATA_RESOURCES]: {
    resources: [],
      resourcesConfig: {
      downloadActive: false,
    },
  },
  [EDITMETADATA_AUTHOR_LIST]: {
    authors: [],
      existingAuthors: [],
      authorDetailsConfig: {
      showDatasetCount: true,
        showAuthorInfos: true,
        showDataCredits: true,
        showDataCreditScore: false,
    },
  },
  [EDITMETADATA_KEYWORDS]: {
    keywordsSource: [],
    keywords: [],
  },
};

export function getEmptyMetadataInEditingObject() {
  return JSON.parse(JSON.stringify(emptyMetadataInEditing));
}
