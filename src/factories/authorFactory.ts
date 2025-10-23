/**
 * method factory for authors related funtionality.
 *
 * @summary method factory for authors related funtionality
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-06-05 14:07:03
 * Last modified  : 2020-10-29 21:09:18
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  compareAsc,
  parseISO,
} from 'date-fns';
import { mdiAccountSupervisor, mdiAccountVoice, mdiBookOpenVariant, mdiCodeTags, mdiInformation, mdiLibrary, mdiWidgets } from '@mdi/js';
import { toRaw } from 'vue';
import {
  METADATA_CONTACT_EMAIL,
  METADATA_CONTACT_FIRSTNAME,
  METADATA_CONTACT_LASTNAME,
} from '@/factories/metadataConsts';

import { AUTHOR_ASCII_DEAD } from '@/store/mainMutationsConsts';
import { Author, User, UserPickerObject } from '@/types/modelTypes';
import { AuthorDTO } from '@/types/dataTransferObjectsTypes';

const authorDataCreditLevels = [
  { score: 160, lvl: 6 },
  { score: 80, lvl: 5 },
  { score: 40, lvl: 4 },
  { score: 20, lvl: 3 },
  { score: 10, lvl: 2 },
  { score: 1, lvl: 1 },
];

export function getAuthorGivenName(author:
  {
    given_name?: string,
    firstName?: string,
  }
) {
  const firstName = author?.given_name || author?.firstName || '';
  return firstName.trim() || null;
}

export function getAuthorLastName(author:
  {
    name?: string,
    lastName?: string,
  }
) {
  const lastName = author.name || author.lastName || '';
  return lastName.trim() || null;
}

export function getAuthorName(author:
  {
    fullName?: string,
    given_name?: string,
    firstName?: string,
    name?: string,
    lastName?: string,
  }
): string | undefined {
  let fullName = author?.fullName;

  if (!fullName) {
    const firstName = author?.given_name || author?.firstName || '';
    const lastName = author?.name || author?.lastName || '';

    fullName = `${firstName.trim()} ${lastName.trim()}`;
  }

  fullName = fullName.trim();

  return fullName || undefined;
}

export function getAuthorNameCitation(author:
  {
    fullName?: string,
    given_name?: string,
    firstName?: string,
    name?: string,
    lastName?: string,
  }
) {

  const firstName = author.given_name || author.firstName || '';

  const splits = firstName.trim().split(' ');
  let firstnameInitials = '';

  splits.forEach((name: string) => {
    firstnameInitials += `${name.substring(0, 1)}. `;
  })

  const lastName = author.name || author.lastName || '';

  return `${lastName.trim()}, ${firstnameInitials.trim()}`;
}

/**
 *
 * @param userObjects | authorObjects {Array}
 * @returns {[{ fullName: string, email: string}]}
 */
export function getUserPickerObjects(
  userObjects: Author[] | User [] | { fullName: string, email: string }[],
) : UserPickerObject[] {
  if (!userObjects || !(userObjects instanceof Array) || userObjects.length <= 0) {
    return [];
  }

  return userObjects
    .map((user) => ({
      fullName: getAuthorName(user),
      email: user.email,
    }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
}

export function getAuthorsString(dataset) {
  if (!dataset) {
    return null;
  }

  let authors = '';

  if (dataset.author !== undefined) {
    let { author } = dataset;

    if (typeof dataset.author === 'string') {
      author = JSON.parse(dataset.author);
    }

    author.forEach((element) => {
      authors += ` ${getAuthorName(element)};`;
    });

    // cut of the last ';'
    if (authors.length > 1) {
      authors = authors.substring(0, authors.length - 1);
    }
  }

  return authors.trim();
}

export function getAuthorsCitationString(dataset) {
  if (!dataset) {
    return null;
  }

  let authorString = '';

  if (dataset.author !== undefined) {
    let { author } = dataset;

    if (typeof dataset.author === 'string') {
      author = JSON.parse(dataset.author);
    }

    const authors = author;

    for (let i = 0; i < (authors.length || 19); i++) {
      const element = authors[i];
      authorString += ` ${getAuthorNameCitation(element)},`;
    }

    // cut of the last ';'
    if (authorString.length > 1) {
      authorString = authorString.substring(0, authorString.length - 1);
    }

    if (authors.length > 19) {
      authorString += ' et al.';
    }

  }

  return authorString.trim();
}

export function getDataCreditIcon(creditName) {
  switch (creditName) {
    case 'publication':
      return mdiBookOpenVariant;
    case 'software':
      return mdiCodeTags;
    case 'curation':
      return mdiLibrary;
    case 'collection':
      return mdiWidgets;
    case 'validation':
      return mdiAccountVoice;
    case 'supervision':
      return mdiAccountSupervisor;
    default:
      return mdiInformation;
  }
}

export function getDataCredit(author) {
  if (!author.data_credit) {
    return null;
  }

  // key: dataCreditName, value: count
  const dataCredit = {};

  if (author.data_credit instanceof Array) {
    for (let i = 0; i < author.data_credit.length; i++) {
      const credit = author.data_credit[i];

      if (dataCredit[credit]) {
        let v = dataCredit[credit];
        v += 1;
        dataCredit[credit] = v;
      } else {
        dataCredit[credit] = 1;
      }
    }

  } else if (typeof author.data_credit === 'string') {
    dataCredit[author.data_credit] = 1;
  } else {
    console.error(`Unexpected type for author.data_credit ${typeof author.data_credit}`);
  }

  return dataCredit;
}

export function createContact(email, firstName, lastName) {
  return {
    [METADATA_CONTACT_FIRSTNAME]: firstName,
    [METADATA_CONTACT_LASTNAME]: lastName,
    [METADATA_CONTACT_EMAIL]: email,
  }
}

export function creationContactFromAuthor(author) {
  if (author) {
    return {
      [METADATA_CONTACT_FIRSTNAME]: author.firstName?.trim(),
      [METADATA_CONTACT_LASTNAME]: author.lastName?.trim(),
      [METADATA_CONTACT_EMAIL]: author.email?.trim(),
    };
  }

  return undefined;
}

export function createAuthor(author: Author | AuthorDTO, lastModified: string = '') {

  // const nameSplits = fullName.split(' ');
  const firstName = author.given_name || author.firstName || '';
  const lastName = author.name || author.lastName || '';
  const fullName = getAuthorName({ firstName, lastName } as Author);

  // if (nameSplits.length > 0) {
  //   if (nameSplits.length === 1) {
  //     lastName = nameSplits[0].trim();
  //   } else if (nameSplits.length === 2) {
  //     firstName = nameSplits[0].trim();
  //     lastName = nameSplits[1].trim();
  //   } else if (nameSplits.length === 3) {
  //     firstName = nameSplits[0].trim();
  //     lastName = `${nameSplits[1].trim()} ${nameSplits[2].trim()}`;
  //   }
  // }

//    const dataCredit = author.data_credit ? getDataCredit(author) : author.dataCredit;
  let dataCredit = author.dataCredit || author.data_credit || [];

  if (typeof dataCredit === 'string') {
    dataCredit = [dataCredit];
  }

  // console.log(`creating author from ${fullName} dataCredit: ${dataCredit} datasetCount: ${author.datasetCount}`);

  const isAuthorDead = firstName?.includes(AUTHOR_ASCII_DEAD) ||
    lastName?.includes(AUTHOR_ASCII_DEAD);

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    fullName,
    datasetCount: author.datasetCount || 1,
    affiliation: author.affiliation,
    /*
          // this is probably old
          id: {
            type: author.identifier_scheme,
            identifier: author.identifier,
          },
    */
    identifier: author.identifier,
    email: author.email,
    isSelected: false,
    isAuthorDead,
    dataCredit,
    totalDataCredits: author.totalDataCredits || {},
    lastModified,
  } satisfies Author;
}

/**
 * This function is merging the information from the author editing with the full author information which is provided
 * from an existing author (build up via the extractAuthors function to build up the authors map / dictionary)
 *
 * @param newAuthor
 * @param existingAuthor
 * @returns {{firstName: *, lastName: *, identifier: *, datasetCount: (number|(function(): number)|*), affiliation: *, isSelected, fullName: *, email: *, dataCredit: *, totalDataCredits: (*|*[])}}
 */
export function mergeEditingAuthor(newAuthor: Author, existingAuthor: Author) : Author {
  return {
    ...createAuthor(newAuthor),
    datasetCount: existingAuthor.datasetCount,
    totalDataCredits: existingAuthor.totalDataCredits ||
      {
        curation: 0,
        publication: 0,
        software: 0,
        supervision: 0,
        validation: 0,
        collection: 0,
      },
  }
}

export function createAuthors(dataset) {
  if (!dataset) {
    return null;
  }

  let parsedAuthors = null;

  if (typeof dataset.author === 'string') {
    parsedAuthors = JSON.parse(dataset.author);
  } else {
    parsedAuthors = dataset.author;
  }

  if (!parsedAuthors || !(parsedAuthors instanceof Array)) {
    return null;
  }

  const authorObjs = [];

  for (let i = 0; i < parsedAuthors.length; i++) {
    const parsedAuthor = parsedAuthors[i];
    const author = createAuthor(parsedAuthor, dataset.metadata_modified);

    authorObjs.push(author);
  }

  return authorObjs;
}

function overwriteDataCredit(author, existingAuthor) {
  let credits = author.dataCredit || author.data_credit || [];

  if (typeof credits === 'string') {
    credits = [credits];
  }

  if (!existingAuthor.totalDataCredits) {
    existingAuthor.totalDataCredits = {};
  }

  for (let i = 0; i < credits.length; i++) {
    const key = credits[i];

    let existingValue = existingAuthor.totalDataCredits[key];

    if (existingValue) {
      existingValue += 1;
    } else {
      existingValue = 1;
    }

    // console.log('for ' + author.name + ' set ' + key + ' ' + existingValue);
    existingAuthor.totalDataCredits[key] = existingValue;
  }
}

export function getAuthorKey(author: Author) {

  if (author?.email) {
    return author.email.trim().toLowerCase();
  }

  return author?.fullName?.trim().toLowerCase() || null;
}

// TODO try using different method and compare performance
// make 1st loop over the datasets and store the authors on the authorMap
// then 2nd loop over the authors and do the counting of the datasets and merging
// of the dataCredit
// let noDataCredit = 0;
export function extractAuthorsMap(datasets) {
  if (!datasets) { return null; }

  const authorMap = {};
  // let authorCount = 0;

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];
    const datasetModifiedDate = parseISO(dataset.metadata_modified);

    const authors = createAuthors(dataset);

    for (let j = 0; j < authors.length; j++) {
      const author = authors[j];

      const authorKey = getAuthorKey(author);
      let existingAuthor = authorMap[authorKey];

      if (existingAuthor) {
        existingAuthor.datasetCount += author.datasetCount;

        if (author.dataCredit) {
          overwriteDataCredit(author, existingAuthor);
        }

        const lastDate = parseISO(existingAuthor.lastModified);

        if (compareAsc(lastDate, datasetModifiedDate) === 1) {
          // compareAsc === 1 means the last modified date from the dataset is newer then the
          // one from the author, therefore information from this datasets is newer and should be used
          existingAuthor.lastModified = dataset.metadata_modified;

          existingAuthor.firstName = author.firstName;
          existingAuthor.lastName = author.lastName;
          existingAuthor.fullName = author.fullName;

          if (author.identifier && author.identifier !== existingAuthor.identifier) {
            existingAuthor.identifier = author.identifier;
          }

          if (author.identifierType && author.identifierType !== existingAuthor.identifierType) {
            existingAuthor.identifierType = author.identifierType;
          }
        }

        // console.log('for ' + author.name + ' updated ' + existingAuthor.count);
      } else {
        // console.log('for ' + author.name + ' set ' + author.count);
        existingAuthor = author;

        overwriteDataCredit(author, existingAuthor);
      }

      // always clear the dataCredit because for the authorsMap only the total is relevant!
      existingAuthor.dataCredit = [];

      authorMap[authorKey] = existingAuthor;
    }

    // console.log(`extracted ${authorCount} authors`);
  }

  // console.log(`counted noDataCredit ${noDataCredit} of ${Object.keys(authorMap).length}`)
  return authorMap;
}

/**
 *
 * @param {Object} authorMap
 * @param {Array} dataset
 */
export function getFullAuthorsFromDataset(authorMap, dataset) {
  if (!authorMap || !dataset) {
    return null;
  }

  const authors = createAuthors(dataset);
  if (!authors) {
    return [];
  }

  const fullAuthors = [];
  const authorPlaceholder = [];

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    const authorKey = getAuthorKey(author);

    const fullAuthor = authorMap[authorKey];

    if (fullAuthor) {
      fullAuthors.push({
        ...fullAuthor,
        // merge / overwrite the dataCredit, because
        // it's based on the current datasets
        dataCredit: author.dataCredit,
      });
    } else {
      authorPlaceholder.push({
        ...author,
        dataCredit: author.dataCredit || null,
        isMissing: true,
      });
    }
  }

  return [...fullAuthors, ...authorPlaceholder];
}

export function getDataCreditLevel(dataCreditScore) {
  const entries = authorDataCreditLevels;

  for (let i = 0; i < entries.length; i++) {
    const scoreLvl = entries[i];
    if (dataCreditScore >= scoreLvl.score) {
      return scoreLvl.lvl;
    }
  }

  return 0;
}

export function getDataCreditLevelIndex(lvl) {
  const entires = authorDataCreditLevels;

  for (let i = 0; i < entires.length; i++) {
    const scoreLvl = entires[i];
    if (lvl === scoreLvl.lvl) {
      return i;
    }
  }

  return -1;
}

export function getLevelProgress(dataCreditScore) {
  const levels = authorDataCreditLevels;
  const currentLvl = getDataCreditLevel(dataCreditScore);
  const index = currentLvl > 0 ? getDataCreditLevelIndex(currentLvl) : levels.length;
  const next = index - 1;
  let progress = 100;

  if (next >= 0 && next < levels.length) {
    progress = dataCreditScore / levels[next].score * 100;
    // console.log(`progress: ${progress}`);
  }

  return progress;
}

function getInitials(first, last) {
  const firstName = first || '';
  const lastName = last || '';
  return `${firstName.substring(0, 1)}${lastName.substring(0, 1)}`.toUpperCase();
}

export function getNameInitials(userObject) {
  if (!userObject) {
    return '';
  }

  if (userObject.fullName) {
    const splits = userObject.fullName.split(' ');
    if (splits.length > 1) {
      return getInitials(splits[0], splits[splits.length - 1]);
    }
  }

  if (userObject.firstName && userObject.lastName) {
    return getInitials(userObject.firstName, userObject.lastName);
  }

  if (userObject.name && userObject.fullName) {
    return getInitials(userObject.name, userObject.fullName);
  }

  return '';
}


export function UnwrapEditingAuthors(wrappedAuthors, authorsMap) {
  const authorWithFullInfos = [];

  wrappedAuthors.forEach((wAuthor) => {
    const author = authorsMap[wAuthor.key];
    authorWithFullInfos.push({
      ...author,
      ...wAuthor,
    });
  });

  return authorWithFullInfos;
}

/**
 * Combines authors arrays, the current is the basis, removedAuthors are subtracted from the currentAuthors and the newAuthors are being added.
 * Main usage of this function is in the context of editing authors.
 *
 * @param currentAuthors
 * @param removedAuthors
 * @param newAuthors
 * @returns {*[]}
 */
export function combineAuthorLists(currentAuthors, newAuthors = [], removedAuthors = []) {
  const authors = [...currentAuthors];

  for (let i = 0; i < removedAuthors.length; i++) {
    const authToRemove = removedAuthors[i];

    let deleteIndex = authors.findIndex(a => a.email === authToRemove.email);

    if (deleteIndex >= 0) {
      authors.splice(deleteIndex, 1);
    }

    deleteIndex = newAuthors.findIndex(a => a.email === authToRemove.email);

    if (deleteIndex >= 0) {
      newAuthors.splice(deleteIndex, 1);
    }

  }

  for (let i = 0; i < newAuthors.length; i++) {
    const auth = newAuthors[i];

    if (!authors.some(a => a.email === auth.email)) {
      authors.push(auth);
    }
  }

  return authors;
}

export function mergeAuthorsDataCredit(currentAuthors: Author[], newAuthors: Author[]) : Author[] {
  const authors = [...currentAuthors];

  let toMerge = newAuthors;
  if (!(newAuthors instanceof Array)) {
    toMerge = [newAuthors];
  }

  const authorsToMerge = toMerge.filter((auth: Author) => authors.some(a => a.email === auth.email))

  for (let i = 0; i < authorsToMerge.length; i++) {
    const auth = authorsToMerge[i];

    const mergeIndex = authors.findIndex(a => a.email === auth.email);
    // treat the newAuthor as the "existingAuthor" so it's dataCredit are being used
    authors[mergeIndex] = {
      ...authors[mergeIndex],
      dataCredit: auth.dataCredit,
    };
  }

  return authors;
}

export function enhanceAuthorsFromAuthorMap(authors: Author[], authorMap) {
  
  const canEnhance = (authorMap && Object.keys(authorMap).length > 0);
  if (!canEnhance || authors?.length <= 0) {
    return authors;
  }
  
  const enhancedAuthors = [];

  for (let i = 0; i < authors.length; i++) {
    const auth = authors[i];
    const key = getAuthorKey(auth);
    const existingAuthor = authorMap[key];

    let enhanced: Author = auth;

    if (existingAuthor) {
      enhanced = mergeEditingAuthor(auth, existingAuthor);
    }

    enhancedAuthors.push(enhanced);
  }

  return enhancedAuthors;
}

export function getAuthorByName(fullName: string, authors: Author[] | User[]) : Author | User {
  if (!fullName) {
    return null;
  }

  const found = authors.filter(auth => getAuthorName(auth) === fullName);
  return found.length > 0 ? found[0] : null;
}

export function getAuthorByEmail(email: string, authors: Author[] | User[]) : Author | User {
  if (!email) {
    return null;
  }

  const found = authors.filter((author: Author) => author.email === email);
  return found[0] || null;
}

export function replaceAuthorDeadAscii(name: string) {
  let rawName = toRaw(name);
  rawName = rawName.replace(`(${AUTHOR_ASCII_DEAD})`, '');
  rawName = rawName.replace(AUTHOR_ASCII_DEAD, '');
  return rawName.trim();
}

export function getFullAuthorsForUserPicker(pickedUsersEmails: string[], authors: Author[], existingEnviDatUsers: User[]) {
  const fullAuthors = [];

  pickedUsersEmails.forEach((email) => {
    let author = getAuthorByEmail(email, authors);

    // if the author is part of the dataset authors, pick it as it is
    // including the existing dataCredits
    if (!author) {
      // if the author is newly picked, use the existing list as reference
      author = getAuthorByEmail(email, existingEnviDatUsers);
    }

    if (author) {
      fullAuthors.push(author);
    }
  });

  return fullAuthors;
}
