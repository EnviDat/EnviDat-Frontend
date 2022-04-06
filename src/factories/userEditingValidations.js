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

import { parse, isDate } from 'date-fns';
import * as yup from 'yup';
import { ckanDateFormat } from '@/factories/mappingFactory';


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
            .required('Enter at least a start date')
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
      relatedPublicationsText: yup
        .string()
        .min(20, 'Please use at least 20 characters to describe the related publications.')
        .nullable(),
    }),
  [EDITMETADATA_RELATED_DATASETS]: () =>
    yup.object().shape({
      relatedDatasetsText: yup
        .string()
        .min(20, 'Please use at least 20 characters to describe the related datasets.')
        .nullable(),
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


// eslint-disable-next-line func-names
yup.addMethod(yup.date, 'parseDateString', function () {
  // Helper function for yup date string parsing
  // eslint-disable-next-line func-names
  return this.transform((value, originalValue) => {
      if (!originalValue) {
        return null
      }

      const parsedDate = isDate(originalValue)
        ? originalValue
        : parse(originalValue, ckanDateFormat, new Date());

      return parsedDate;
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

      const parsedStart = isDate(dateStart)
        ? dateStart
        : parse(dateStart, ckanDateFormat, new Date());

      const dateEnd = options.parent[dateEndField]
      if (!dateEnd) {
        return true;
      }

      const parsedEnd = isDate(dateEnd)
        ? dateEnd
        : parse(dateEnd, ckanDateFormat, new Date());

      return parsedEnd >= parsedStart;
    }
  );
});


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
