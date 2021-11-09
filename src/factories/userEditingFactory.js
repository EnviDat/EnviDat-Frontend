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
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_ORGANIZATION,
} from '@/factories/eventBus';

import { localIdProperty } from '@/factories/strategyFactory';
import { getOrganizationMap } from '@/factories/metaDataFactory';
import testOrganizations from '@/../stories/js/organizations';
import * as yup from 'yup';

const allOrganizations = getOrganizationMap(testOrganizations);

/**
 * Code from https://stackoverflow.com/questions/54246477/how-to-convert-camelcase-to-snake-case-in-javascript
 * @param {String} inputString camelCaseString
 * @returns {String} snake_case_string
 */
export function toSnakeCase(inputString) {
  return inputString.split('').map((character) => {
    if (character === character.toUpperCase()) {
      return `_${character.toLowerCase()}`;
    }

    return character;
  }).join('');
}

/**
 * Code from https://stackoverflow.com/a/61375162/2733509
 * @param {String} snake_case_string
 * @returns {String} camelCaseString
 */
// eslint-disable-next-line camelcase
export function toCamelCase (snake_case_string) {
  return snake_case_string.toLowerCase()
    .replace(/([-_][a-z])/g, group =>
      group
        .toUpperCase()
//        .replace('-', '')
        .replace('_', '')
    );
}

export function getObjectInOtherCase(fromCaseObject, caseConversionFunc) {
  const properties = Object.keys(fromCaseObject);
  const toCaseObject = { };

  for (let i = 0; i < properties.length; i++) {
    const fromCaseProp = properties[i];
    const otherCaseProp = caseConversionFunc(fromCaseProp);

    let value = fromCaseObject[fromCaseProp];

    if (value instanceof Array) {
      // eslint-disable-next-line no-use-before-define
      value = getArrayInOtherCase(value, caseConversionFunc);
    }

    toCaseObject[otherCaseProp] = value;
  }

  return toCaseObject;
}

export function getArrayInOtherCase(fromCaseArray, caseConversionFunc) {
  if (fromCaseArray.length <= 0 || typeof fromCaseArray[0] !== 'object') {
    return fromCaseArray;
  }

  const otherCaseArray = [];
  for (let i = 0; i < fromCaseArray.length; i++) {
    const obj = fromCaseArray[i];
    otherCaseArray[i] = getObjectInOtherCase(obj, caseConversionFunc);
  }
  
  return otherCaseArray;
}

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
    const match =
      el[localIdProperty] === newElement[localIdProperty] ||
      el[propertyToCompare] === newElement[propertyToCompare];
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
  const resources =
    state.metadataInEditing[EDITMETADATA_DATA_RESOURCES].resources;
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
    const match =
      element[localIdProperty] === id || element[propertyToCompare] === id;

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
    dates: [],
    dataLicense: '',
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
    color: 'white',
  },
  {
    title: 'Data Info',
    completed: false,
    component: MetadataCreationDataInfo,
    key: EDITMETADATA_DATA,
    detailSteps: dataDetailSteps,
    initialStepTitle: dataDetailSteps[0].title,
    color: 'white',
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

    const filteredKeys = editingKeys.filter((k) => k === s.key);
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
  return Object.values(obj).every((x) => x === null || x === '');
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

const metadataInEditingValidations = {
  [EDITMETADATA_MAIN_HEADER]: () =>
    yup.object().shape({
      metadataTitle: yup
        .string()
        .required('Metadata Title is required')
        .min(5, 'Metadata Title must be at least 5 characters'),
      contactAuthor: yup.object({
        contactGivenName: yup
          .string()
          .required('Contact given (first) name is required')
          .min(3, 'Contact given (first) name must be at least 3 characters'),
        contactSurname: yup
          .string()
          .required('Contact surname is required')
          .min(3, 'Contact surname must be at least 3 characters'),
        contactEmail: yup
          .string()
          .email('Contact email must be a valid email address')
          .required('Contact email is required'),
      }),
    }),
  /*
    [EDITMETADATA_MAIN_DESCRIPTION]: {
      description: '',
    },
    [EDITMETADATA_KEYWORDS]: {
      keywords: [],
    },
    [EDITMETADATA_AUTHOR_LIST]: {
      authors: [],
    },
  */
  // [EDITMETADATA_DATA_RESOURCES]: () =>
  //   yup.object().shape({
  //     isLink: yup.boolean(),
  //     name: yup
  //       .string()
  //       .required('Resource name is required')
  //       .min(5, 'Resource name must be at least 5 characters')
  //       .notOneOf(
  //         [yup.ref('url')],
  //         'Title cannot be the same as the resource url',
  //       ),
  //     description: yup.string(),
  //     url: yup.string().when('isLink', {
  //       is: true,
  //       then: yup
  //         .string()
  //         .url('Resource url must be valid')
  //         .required('Resource url is required'),
  //       otherwise: yup.string().notRequired(),
  //     }),
  //   }),
  [EDITMETADATA_DATA_INFO]: () =>
    yup.object().shape({
      dates: yup.array().of(
        yup.object().shape({
          dateType: yup.string('Date type must be a string'),
          dateStart: yup.date('Start date must be a valid date'),
          dateEnd: yup
            .date('End date must be a valid date')
            .min(yup.ref('dateStart'), "End date can't be before start date"),
        }),
      ),
      dataLicense: yup.string(),
    }),
  [EDITMETADATA_DATA_GEO]: () =>
    yup.object().shape({
      geometries: yup
        .array()
        .min(1, 'Editting Error: a geometry is required to be set'),
    }),
  /*
    [EDITMETADATA_RELATED_PUBLICATIONS]: {
      relatedPublicationsText: '',
    },
    [EDITMETADATA_ORGANIZATION]: {
      organizationsMap: allOrganizations,
      organization: '',
    },
  */
  [EDITMETADATA_CUSTOMFIELDS]: () =>
    yup.object().shape({
      customFields: yup.array().of(
        yup.object({
          fieldName: yup.string().required().min(3),
          content: yup.string().min(3),
        }),
      ),
    }),
  [EDITMETADATA_PUBLICATION_INFO]: () =>
    yup.object().shape({
      publicationState: yup.string().required(),
      doi: yup.string().required().min(3),
      publisher: yup.string().required().min(3),
      publicationYear: yup.string().required(),
      funders: yup
        .array()
        .min(1)
        .of(
          yup.object({
            institution: yup.string().required().min(3),
            grantNumber: yup.string(),
            link: yup.string().url(),
          }),
        ),
    }),
};

export function getValidationMetadataEditingObject(key) {
  const validationEntry = metadataInEditingValidations[key];
  return validationEntry ? validationEntry() : null;
}

export function isArrayValid(
  array,
  arrayProperty,
  index,
  valueProperty,
  validations,
  errorArray = null,
) {
  const arrayPrefix = `${arrayProperty}[${index}].${valueProperty}`;

  try {
    validations.validateSyncAt(arrayPrefix, { [arrayProperty]: array });
  } catch (e) {
    if (!errorArray) {
      // return the full error is there isn't an array given,
      // so the error can be handled differently
      return e;
    }

    let msg = e.message;
    msg = msg.replace(arrayPrefix, valueProperty);

    errorArray[index][valueProperty] = msg;
    return false;
  }

  errorArray[index][valueProperty] = '';

  return true;
}

export function isFieldValid(property, value, validations, errorObject = null) {
  try {
    validations.validateSyncAt(property, { [property]: value });
  } catch (e) {
    if (!errorObject) {
      // return the full error is there isn't an array given,
      // so the error can be handled differently
      return e;
    }

    errorObject[property] = e.message;
    return false;
  }

  errorObject[property] = '';

  return true;
}
