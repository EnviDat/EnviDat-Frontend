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

import * as yup from 'yup';

import {
  EDIT_USER_PROFILE,
  EDITMETADATA_AUTHOR,
  EDITMETADATA_AUTHOR_LIST,
  EDITMETADATA_CUSTOMFIELDS,
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_KEYWORDS,
  EDITMETADATA_MAIN_DESCRIPTION,
  EDITMETADATA_MAIN_HEADER,
  EDITMETADATA_ORGANIZATION,
  EDITMETADATA_PUBLICATION_INFO,
  EDITMETADATA_RELATED_DATASETS,
  EDITMETADATA_RELATED_PUBLICATIONS,
} from '@/factories/eventBus';


const urlRegex = /^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+(\/)?.([\w?[a-zA-Z-_%/@]+)*([^/\w[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

const metadataInEditingValidations = {
  [EDITMETADATA_MAIN_HEADER]: () =>
    yup.object().shape({
      metadataTitle: yup.string()
        .required('Dataset title is required')
        .min(5, 'Dataset title must be at least 5 characters')
        .max(180, 'Dataset title has a maximum of 180 characters'),
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
        .min(1, 'Please add at least one author.'),
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
      // dates validation is done the in the BaseStartEndDate component
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
      relatedPublicationsText: yup
        .string()
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .min(8, 'Please use at least 8 characters to describe the related publications.'),
    }),
  [EDITMETADATA_RELATED_DATASETS]: () =>
    yup.object().shape({
      relatedDatasetsText: yup
        .string()
        .nullable()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .min(8, 'Please use at least 8 characters to describe the related datasets.'),
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
          content: yup.string(),
        }),
      ),
    }),
  [EDITMETADATA_PUBLICATION_INFO]: () =>
    yup.object().shape({
      publicationState: yup.string(),
      doi: yup.string(),
      publisher: yup.string()
        .required()
        .min(3),
      publicationYear: yup.string()
        .required(),
      funders: yup.array()
        .required().min(1, 'Provide at least one entry about funding of the research.').of(
        yup.object().shape({
          institution: yup.string().required().min(3),
          grantNumber: yup.string(),
          institutionUrl: yup.string()
            .nullable()
            .transform((value, originalValue) => originalValue === '' ? null : value)
            .matches(urlRegex, 'Please provide an valid link / url.'),
        }),
      ),
    }),
  [EDIT_USER_PROFILE]: () =>
    yup.object().shape({
      firstName: yup.string()
        .required('First name is required')
        .min(3, 'First name must be at least 3 characters'),
      lastName: yup.string()
        .required('Last name is required')
        .min(3, 'Last name must be at least 3 characters'),
      email: yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    }),
  [EDITMETADATA_AUTHOR]: () =>
    yup.object().shape({
      firstName: yup.string()
        .required('Author first name is required')
        .min(3, 'Author first name must be at least 3 characters'),
      lastName: yup.string()
        .required('Author last name is required')
        .min(3, 'Author last name must be at least 3 characters'),
      email: yup.string()
        .email('Author email must be a valid email address')
        .required('Author email is required'),
      identifier: yup.string()
        // e.g. 0000-0002-3862-8720
        .notRequired()
        .min(19, 'OrcId must be at least 19 characters, like 0000-0002-3862-8720'),
      affiliation: yup.string()
        // .required('Author affiliation is required')
        .min(3, 'Affiliation must be at least 3 characters'),
    }),
};


export function getValidationMetadataEditingObject(key) {
  const validationEntry = metadataInEditingValidations[key];
  return validationEntry ? validationEntry() : null;
}

export function isArrayContentValid(array, arrayProperty, index, valueProperty, validations, errorArray) {
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

export function isFieldValid(property, value, validations, errorObject, errorProperty = undefined) {
  const errProperty = errorProperty || property;

  try {
    validations.validateSyncAt(property, { [property]: value });
  } catch (e) {
    if (!errorObject) {
      // return the full error is there isn't an array given,
      // so the error can be handled differently
      return e;
    }

    errorObject[errProperty] = e.message;
    return false;
  }

  errorObject[errProperty] = '';

  return true;
}

/**
 * Calls the isFieldValid function on every property of the objectToValidate. The objectToValidate and the errorObject
 * need to have the properties as in the array of properties in the input.
 *
 * @param {Array<string>} properties
 * @param {Object} objectToValidate
 * @param validations
 * @param {Object} errorObject
 *
 * @returns {boolean} false if any of the validation rules got an error
 */
export function isObjectValid(properties, objectToValidate, validations, errorObject) {

  // Validate fields corresponding to properties
  for (let i = 0; i < properties.length; i++) {
    isFieldValid(properties[i], objectToValidate[properties[i]], validations, errorObject);
  }

  // Return false if any of the properties have a validation error
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    if (errorObject[prop]) {
      return false;
    }
  }

  return true;
}

export function getUserOrganizationRoleMap(userId, organizations) {
  const roleMap = {};

  if (!userId || !organizations) {
    return roleMap;
  }

  const keys = Object.keys(organizations);

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

export function getCollaboratorCapacity(datasetId, collaboratorIdEntries) {

  if (collaboratorIdEntries?.length > 0) {
    const matches = collaboratorIdEntries.filter(entry => entry.id === datasetId);
    return matches[0]?.role || '';
  }

  return '';
}
