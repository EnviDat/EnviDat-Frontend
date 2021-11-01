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

// eslint-disable-next-line no-unused-vars
import MetadataCreationMainInfo from '@/modules/user/components/MetadataCreationMainInfo';
import MetadataCreationDataInfo from '@/modules/user/components/MetadataCreationDataInfo';

import EditDataAndResources from '@/modules/user/components/EditDataAndResources';

import {
  EDITMETADATA_MAIN,
  EDITMETADATA_DATA,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_PUBLICATIONS,
  EDITMETADATA_CUSTOMFIELDS, EDITMETADATA_ORGANIZATION,
} from '@/factories/eventBus';

import { localIdProperty } from '@/factories/strategyFactory';
import { getOrganizationMap } from '@/factories/metaDataFactory';
import testOrganizations from '@/../stories/js/organizations';

const allOrganizations = getOrganizationMap(testOrganizations);


export function updateEditingArray(store, elementList, newElement, propertyToCompare) {
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

export function setSelected(store, elementList, id, propertyToCompare, selected) {

  for (let i = 0; i < elementList.length; i++) {
    const element = elementList[i];

    // check for newly created entries (local only)
    // with the localIdProperty first
    const match = element[localIdProperty] === id
      || element[propertyToCompare] === id;

    if (match) {
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
    contactAuthor: {
      contactEmail: '',
      contactGivenName: '',
      contactSurname: '',
    },
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
    addInfoObj: {
      creationYear: '',
      collectionYear: '',
      publicationYear: '',
      dataLicense: '',
    },
  },
  [EDITMETADATA_DATA_GEO]: {
    geometries: null,
  },
  [EDITMETADATA_RELATED_PUBLICATIONS]: {
    relatedPublicationsText: '',
  },
  [EDITMETADATA_CUSTOMFIELDS]: {
    customFields: [],
  },
  [EDITMETADATA_ORGANIZATION]: {
    organizationsMap: allOrganizations,
    organization: '',
    organizations: [],
  },
  [EDITMETADATA_PUBLICATION_INFO]: {
    publicationState: 'Draft',
    doi: '',
    publisher: '',
    publicationYear: '',
    funders: [],
  },
};

const mainDetailSteps = [
  {
    title: 'Basic Info',
    completed: false,
    component: EditMetadataHeader,
    key: EDITMETADATA_MAIN_HEADER,
  },
  {
    title: 'Description',
    completed: false,
    component: EditDescription,
    key: EDITMETADATA_MAIN_DESCRIPTION,
  },
  {
    title: 'Keywords',
    completed: false,
    component: EditKeywords,
    key: EDITMETADATA_KEYWORDS,
  },
  {
    title: 'Authors',
    completed: false,
    component: EditAuthorList,
    key: EDITMETADATA_AUTHOR_LIST,
  },
];

const dataDetailSteps = [
  {
    title: 'Data & Resources',
    completed: false,
    component: EditDataAndResources,
    key: EDITMETADATA_DATA_RESOURCES,
  },
  {
    title: 'Data Info',
    completed: false,
    key: EDITMETADATA_DATA_INFO,
    component: EditDataInfo,
  },
  {
    title: 'Data Location',
    completed: false,
    key: EDITMETADATA_DATA_GEO,
    component: EditDataGeo,
  },
];

export const metadataCreationSteps = [
  {
    title: 'Main Info',
    completed: false,
    component: MetadataCreationMainInfo,
    key: EDITMETADATA_MAIN,
    detailSteps: mainDetailSteps,
    initialStepTitle: mainDetailSteps[0].title,
  },
  {
    title: 'Data Info',
    completed: false,
    component: MetadataCreationDataInfo,
    key: EDITMETADATA_DATA,
    detailSteps: dataDetailSteps,
    initialStepTitle: dataDetailSteps[0].title,
  },
  {
    title: 'Related Info',
    completed: false,
    component: MetadataCreationRelatedInfo,
    key: EDITMETADATA_RELATED_PUBLICATIONS,
  },
  {
    title: 'Publication Info',
    completed: false,
    component: MetadataCreationPublicationInfo,
    key: EDITMETADATA_PUBLICATION_INFO,
  },
];

export function initializeSteps(steps, editingState) {
  const editingKeys = Object.keys(editingState);

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];

    const filteredKeys = editingKeys.filter(k => k === s.key);
    const editStateKey = filteredKeys[0] || null;

    if (editStateKey) {
      s.genericProps = editingState[editStateKey];
    }

    if (s?.detailSteps) {
      initializeSteps(s.detailSteps, editingState);
    }
  }

}

export function getStepByName(eventName, steps) {
  if (!steps) {
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

export function getEmptyMetadataInEditingObject() {
  // use the JSON.parse and JSON.stringify to disconnect it from this file
  // meaning it won't connect with the reactivity of vue.js
  const emptyEditingObject = JSON.parse(JSON.stringify(emptyMetadataInEditing));
  initializeSteps(metadataCreationSteps, emptyEditingObject);
  return emptyEditingObject;
}

// Returns true if all values in obj are null or empty strings, else returns false
export function isObjectEmpty(obj) {
  return Object.values(obj).every(x => (x === null || x === ''));
}

export function deleteEmptyObject(index, localObjects) {

  // Assign currentObj to object with pased index in localObjects
  const currentObj = localObjects[index];

  if (!currentObj) {
    return;
  }

  // Assign isEmpty to true if all values in currentObj are null or empty strings, else assign isEmpty to false
  const isEmpty = isObjectEmpty(currentObj);

  // If isEmpty is true and localObjects has more than one item then remove item at current index
  if (isEmpty && localObjects.length > 1) {
    localObjects.splice(index, 1);
  }
}

export function isMaxLength(maximum, localObjects) {

  if (localObjects.length >= maximum) {
    return true;
  }
  return false;

}
