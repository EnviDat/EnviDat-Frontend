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

import MetadataGenericSubStepper from '@/modules/user/components/MetadataGenericSubStepper';

import EditDataAndResources from '@/modules/user/components/EditDataAndResources';

import {
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_DATA_RESOURCES,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';

import { localIdProperty } from '@/factories/strategyFactory';

import { parse, isDate } from 'date-fns';
import * as yup from 'yup';


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
    const match = element[localIdProperty] === id || element[propertyToCompare] === id;

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
    doi: '',
    publisher: '',
    publicationYear: '',
    funders: [],
  },
};

const mainDetailSteps = [
  {
    title: 'Header Information',
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
    title: 'Managing Data & Resources',
    completed: false,
    component: EditDataAndResources,
    key: EDITMETADATA_DATA_RESOURCES,
  },
  {
    title: 'Data License & Time',
    completed: false,
    key: EDITMETADATA_DATA_INFO,
    component: EditDataInfo,
  },
  {
    title: 'Geospatial Information',
    completed: false,
    key: EDITMETADATA_DATA_GEO,
    component: EditDataGeo,
  },
];

export const metadataCreationSteps = [
  {
    title: 'Metadata',
    completed: false,
    component: MetadataGenericSubStepper,
    key: EDITMETADATA_MAIN,
    detailSteps: mainDetailSteps,
    stepTitle: mainDetailSteps[0].title,
    color: 'white',
  },
  {
    title: 'Data & Resources',
    completed: false,
    component: MetadataGenericSubStepper,
    key: EDITMETADATA_DATA,
    detailSteps: dataDetailSteps,
    stepTitle: dataDetailSteps[0].title,
    color: 'white',
  },
  {
    title: 'Related Research',
    completed: false,
    component: MetadataCreationRelatedInfo,
    key: EDITMETADATA_RELATED_PUBLICATIONS,
  },
  {
    title: 'Publication Status',
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
  const emptyEditingObject = JSON.parse(JSON.stringify(emptyMetadataInEditing));

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

// eslint-disable-next-line func-names
yup.addMethod(yup.date, 'parseDateString', function (dateStringFormat='dd.MM.yyyy') {
  // Helper function for yup date string parsing
  // eslint-disable-next-line func-names
  return this.transform((value, originalValue) => {
    if (originalValue === '') {
      return null
    }

    return parse(originalValue, dateStringFormat, new Date());
  });
});

// eslint-disable-next-line func-names
yup.addMethod(yup.date, 'validateDateRange', function (dateStartField, dateEndField) {
  // Helper function for yup date range validation
  return this.test(
    'validate-date-range',
    'End date can\'t be before start date.',
    (value, options) => {
      const dateStart = options.parent[dateStartField]

      const parsedStart = isDate(dateStart) ?
      dateStart : parse(dateStart, 'dd.MM.yyyy', new Date());

      const dateEnd = options.parent[dateEndField]

      const parsedEnd = isDate(dateEnd) ?
      dateEnd : parse(dateEnd, 'dd.MM.yyyy', new Date());

      return parsedEnd >= parsedStart;
    }
  );
});

const metadataInEditingValidations = {
  [EDITMETADATA_MAIN_HEADER]: () =>
    yup.object().shape({
      metadataTitle: yup.string()
        .required('Dataset title is required')
        .min(5, 'Dataset title must be at least 5 characters'),
      contactGivenName: yup.string()
        .required('Contact given (first) name is required')
        .min(3, 'Contact given (first) name must be at least 3 characters'),
      contactSurname: yup.string()
        .required('Contact surname is required')
        .min(3, 'Contact surname must be at least 3 characters'),
      contactEmail: yup.string()
        .email('Contact email must be a valid email address')
        .required('Contact email is required'),
    }),
  [EDITMETADATA_MAIN_DESCRIPTION]: () =>
    yup.object().shape({
      description: yup.string()
        .required('Description is required')
        .min(100, 'Please write at least a minimal description with 100 characters.'),
    }),
  [EDITMETADATA_KEYWORDS]: () =>
    yup.object().shape({
      keywords: yup.array()
        .min(5, 'Please enter at least 5 keywords.'),
    }),
  [EDITMETADATA_AUTHOR_LIST]: () =>
    yup.object().shape({
      authors: yup.array()
        .min(1, 'Please enter at least one author.'),
    }),
  // [EDITMETADATA_DATA_RESOURCES]: () => yup.object(),
  // yup.object().shape({
  //   isLink: yup.boolean(),
  //   name: yup
  //     .string()
  //     .required('Resource name is required')
  //     .min(5, 'Resource name must be at least 5 characters')
  //     .notOneOf(
  //       [yup.ref('url')],
  //       'Title cannot be the same as the resource url',
  //     ),
  //   description: yup.string(),
  //   url: yup.string().when('isLink', {
  //     is: true,
  //     then: yup
  //       .string()
  //       .url('Resource url must be valid')
  //       .required('Resource url is required'),
  //     otherwise: yup.string().notRequired(),
  //   }),
  // }),
  [EDITMETADATA_DATA_INFO]: () =>
    yup.object().shape({
      dates: yup.array().of(
        yup.object().shape({
          dateType: yup.string('Date type must be a string.'),
          dateStart: yup
            .date('Start date must be a valid date.')
            .parseDateString()
            .validateDateRange('dateStart', 'dateEnd'),
          dateEnd: yup
            .date('End date must be a valid date.')
            .parseDateString()
            .validateDateRange('dateStart', 'dateEnd')
            .nullable(),
        }),
      ),
      dataLicenseId: yup
      .string()
      .test(
        'empty-check',
        'An data licence must be selected.',
        dataLicenseId => dataLicenseId !== '',
      ),
    }),
  [EDITMETADATA_DATA_GEO]: () =>
    yup.object().shape({
      geometries: yup.array().min(1, 'Editing Error: a geometry is required to be set'),
    }),
  [EDITMETADATA_RELATED_PUBLICATIONS]: () =>
    yup.object().shape({
      relatedPublicationsText: yup.string().min(20, 'Please use at least 20 characters to describe the related publications.'),
    }),
  [EDITMETADATA_RELATED_DATASETS]: () =>
    yup.object().shape({
      relatedDatasetsText: yup.string().min(20, 'Please use at least 20 characters to describe the related datasets.'),
    }),
  [EDITMETADATA_ORGANIZATION]: () =>
    yup.object().shape({
      organizationId: yup
      .string('organizationId must be a string.')
      .test(
        'empty-check',
        'An organization must be selected.',
        organizationId => organizationId !== '',
        // Add validation - one of items in list
      ),
    }),
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
      publicationState: yup.string(),
      doi: yup.string(),
      publisher: yup.string().required().min(3),
      publicationYear: yup.string().required(),
      funders: yup.array().min(1).of(
        yup.object().shape({
          institution: yup.string().required().min(3),
          grantNumber: yup.string(),
          institutionUrl: yup.string().url('Please provide an valid link / url with starting "http://"'),
        }),
      ),
    }),
};

export function getValidationMetadataEditingObject(key) {
  const validationEntry = metadataInEditingValidations[key];
  return validationEntry ? validationEntry() : null;
}

export function isArrayValid(array, arrayProperty, index, valueProperty, validations, errorArray) {
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

export function isFieldValid(property, value, validations, errorObject) {
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

export function getUserOrganizationRoleMap(userId, organizations) {
  const roleMap = {};

  const keys = Object.keys(organizations);

  if (!userId || !organizations || keys.length <= 0) {
    return roleMap;
  }

  keys.forEach(k => {
    const orga = organizations[k];
    const matchedUsers = orga.users.filter(u => u.id === userId);
    if (matchedUsers[0]) {
      roleMap[orga.name] = matchedUsers[0].capacity;
    }
  })

  return roleMap;
}


export function hasRole(roleName, organizationRoles) {
  if (!organizationRoles || organizationRoles.length <= 0) {
    return false;
  }

  const matchedRole = organizationRoles.filter(r => r.role === roleName);
  return matchedRole.length > 0 && !!matchedRole[0];
}

export function isMember(organizationRoles) {
  return hasRole('member', organizationRoles);
}

export function isEditor(organizationRoles) {
  return hasRole('editor', organizationRoles);
}

export function isAdmin(organizationRoles) {
  return hasRole('admin', organizationRoles);
}

export function isSysadmin(organizationRoles) {
  return hasRole('sysadmin', organizationRoles);
}

export function hasOrganizationRoles(organizationRoles){
  return isMember(organizationRoles) || isEditor(organizationRoles) || isAdmin(organizationRoles) || isSysadmin(organizationRoles);
}

export function isUserGroupAdmin(userId, organization) {

  if (organization?.users?.length > 0) {
    const matches = organization.users.filter(user => user.id === userId && user.capacity === 'admin');
    return matches.length > 0;
  }

  return false;
}
