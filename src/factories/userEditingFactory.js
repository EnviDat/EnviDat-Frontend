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

import { EDITMETADATA_AUTHOR_DATACREDIT, EDITMETADATA_AUTHOR_LIST } from '@/factories/eventBus';
import { USER_NAMESPACE } from '@/modules/user/store/userMutationsConsts';
import { mergeAuthorsDataCredit } from '@/factories/authorFactory';
import { USER_ROLE_ADMIN } from '@/factories/userEditingValidations';

export const ACCESS_LEVEL_PUBLIC_VALUE = 'public';
export const ACCESS_LEVEL_SAMEORGANIZATION_VALUE = 'same_organization';

/**
 *
 * @param elementList
 * @param newElement
 * @param propertyToCompare
 * @returns {[]}
 */
export function updateEditingArray(elementList, newElement, propertyToCompare) {
  // use a localcopy of the array because it might come directly
  // from the vuex store
  const localCopy = [...elementList];

  let match = false;
  for (let i = 0; i < elementList.length; i++) {
    const el = elementList[i];

    // the localIdProperty is used to identify any elements which exists local only
    // ex. a resource which isn't uploaded yet or an author which isn't saved yet
    match = el[propertyToCompare] === newElement[propertyToCompare];
    if (match) {
      // make sure to merged the elements, because ex. an author
      // has more information attached then is editable -> not all the properties
      // are passed down ex. the EditAuthor component

      localCopy[i] = {
        ...el,
        ...newElement,
      };

      break;
    }
  }

  if (!match) {
    // if the element doesn't exist, add it via unshift as the first entry in the list
    localCopy.unshift(newElement);
  }

  return localCopy;
}

/**
 *
 * @param store
 * @param elementList
 * @param id
 * @param propertyToCompare
 * @param selected
 * @returns {object|null}
 */
export function setSelected(store, elementList, id, propertyToCompare, selected) {
  if (!id) {
    return null;
  }

  for (let i = 0; i < elementList.length; i++) {
    const element = elementList[i];

    // check for newly created entries (local only)
    // with the localIdProperty first
    const match = element[propertyToCompare] === id;

    if (match) {
      element.isSelected = selected;
      if (store) {
        store.elementList = element;
      }
      return element;
    }
  }

  return null;
}

/**
 *
 * @param store
 * @param elementList
 * @param id
 * @param previousId
 * @param propertyToCompare
 * @returns {Object|null}
 */
export function selectForEditing(store, elementList, id, previousId, propertyToCompare) {
  if (previousId !== '') {
    setSelected(store, elementList, previousId, propertyToCompare, false);
  }

  return setSelected(store, elementList, id, propertyToCompare, true);
}

export function getSelectedElement(elementList) {
  if (!elementList) {
    return null;
  }

  const selected = elementList.filter((r) => r.isSelected);

  if (selected.length > 0) {
    return selected[0];
  }

  return null;
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
// const excludeRegEX = /(?:\d+\w+\S\-\w+)/gm
// eslint-disable-next-line no-useless-escape
const excludeRegEX = /(\d+\w+\S\-\w+)|(\d+\S*\d+)/gm;

/**
 *
 * @param {User []} userList
 * @returns {User []}
 */
export function getUserAutocompleteList(userList) {
  return userList.filter((user) => {
    const match = user.name?.match(excludeRegEX);

    if (match && match[0] && match[0].length === user.name?.length) {
      return false;
    }

    return !(
      user.sysadmin ||
      user.name.toLowerCase() === USER_ROLE_ADMIN ||
      user.fullName?.toLowerCase() === USER_ROLE_ADMIN
    );
  });
}

/**
 * Splits the allowed users string into an array
 * @param allowedUsersString
 * @returns {*[]}
 */
export function getAllowedUserNamesArray(allowedUsersString) {
  if (!allowedUsersString) {
    return [];
  }

  const splits = allowedUsersString.split(',');
  let usersString;
  if (splits.length > 0) {
    usersString = splits;
  } else {
    usersString = [allowedUsersString];
  }

  return usersString;
}

/**
 * Return an array of emails the allowed users
 *
 * @param {string} allowedUsersString
 * @param {User[]} envidatUsers
 * @returns {*[]}
 */
export function getAllowedUserNames(allowedUsersString, envidatUsers) {
  if (!allowedUsersString || !envidatUsers) {
    return [];
  }

  const usersString = getAllowedUserNamesArray(allowedUsersString);

  const allowedUsers = envidatUsers.filter((user) => usersString.includes(user.name));

  return allowedUsers.map((user) => user.fullName || user.displayName);
}

/**
 * Returns a string of the allowed users names (only the name attribute of the user object)
 * separated by ","
 *
 * @param {string[]} pickUserEmailHash
 * @param {User[]} envidatUsers
 * @returns {string}
 */
export function getAllowedUsersString(pickUserEmailHash, envidatUsers) {
  if (!pickUserEmailHash || !envidatUsers) {
    return '';
  }

  const pickedUsers = envidatUsers.filter((user) => pickUserEmailHash.includes(user.email || user.emailHash));
  const allowedUsers = pickedUsers.map((user) => user.name);

  return allowedUsers.join(',');
}

export function componentChangedEvent(updateObj, vm) {
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

  return payload;
}
