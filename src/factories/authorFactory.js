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

import { localIdProperty } from '@/factories/strategyFactory';

const authorDataCreditLevels = [
  { score: 160, lvl: 6 },
  { score: 80, lvl: 5 },
  { score: 40, lvl: 4 },
  { score: 20, lvl: 3 },
  { score: 10, lvl: 2 },
  { score: 1, lvl: 1 },
];

export function getAuthorName(author) {
  let fullName = author.fullName;

  if (!fullName) {
    const firstName = author.given_name || author.firstName || '';
    const lastName = author.name || author.lastName || '';

    fullName = `${firstName.trim()} ${lastName.trim()}`;
  }

  return fullName.trim();
}

/**
 *
 * @param userObjects {Array}
 * @returns {String[]}
 */
export function getArrayOfFullNames(userObjects) {
  if (!userObjects || !(userObjects instanceof Array) || userObjects.length <= 0) {
    return [];
  }
  const fullNameArray = [];

  userObjects.forEach((user) => {
    fullNameArray.push(getAuthorName(user));
  });

  return fullNameArray;
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

export function getDataCredit(author) {
  if (!author.data_credit) {
    return null;
  }

  // key: dataCreditName, value: count
  const dataCredits = {};

  if (author.data_credit instanceof Array) {
    for (let i = 0; i < author.data_credit.length; i++) {
      const credit = author.data_credit[i];

      if (dataCredits[credit]) {
        let v = dataCredits[credit];
        v += 1;
        dataCredits[credit] = v;
      } else {
        dataCredits[credit] = 1;
      }
    }

  } else if (typeof author.data_credit === 'string') {
    dataCredits[author.data_credit] = 1;
  } else {
    console.error(`Unexpected type for author.data_credit ${typeof author.data_credit}`);
    // throw new Error(`Unexpected type for author.data_credit ${typeof author.data_credit}`);
  }

  return dataCredits;
}

export function createAuthors(dataset) {
  if (!dataset) {
    return null;
  }

  let authors = null;

  if (typeof dataset.author === 'string') {
    authors = JSON.parse(dataset.author);
  } else {
    authors = dataset.author;
  }

  if (!authors || !(authors instanceof Array)) {
    return null;
  }

  const authorObjs = [];

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];

    const fullName = getAuthorName(author);
    // const nameSplits = fullName.split(' ');
    const firstName = author.given_name || author.firstName || '';
    const lastName = author.name || author.lastName || '';

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

    const dataCredit = getDataCredit(author);

    authorObjs.push({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName,
      datasetCount: 1,
      affiliation: author.affiliation,
      id: {
        type: author.identifier_scheme,
        identifier: author.identifier,
      },
      email: author.email,
      dataCredit,
    });
  }

  return authorObjs;
}

function overwriteDataCredit(author, existingAuthor) {
  const keys = Object.keys(author.dataCredit);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = author.dataCredit[key];

    let existingValue = existingAuthor.dataCredit[key];

    if (existingValue) {
      existingValue += value;
    } else {
      existingValue = value;
    }

    // console.log('for ' + author.name + ' set ' + key + ' ' + existingValue);
    existingAuthor.dataCredit[key] = existingValue;
  }
}

export function getAuthorKey(author) {

  if (author?.email) {
    return author.email.trim();
  }

  return author?.fullName?.trim().toLowerCase() || null;
}

// TODO try using different method and compare performance
// make 1st loop over the datasets and store the authors on the authorMap
// then 2nd loop over the authors and do the counting of the datasets and merging
// of the dataCredits
let noDataCredit = 0;

export function extractAuthorsMap(datasets) {
  if (!datasets) { return null; }

  const authorMap = {};
  // let authorCount = 0;

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    const authors = createAuthors(dataset);

    for (let j = 0; j < authors.length; j++) {
      const author = authors[j];

      const authorKey = getAuthorKey(author);
      let existingAuthor = authorMap[authorKey];

      if (existingAuthor) {
        existingAuthor.datasetCount += author.datasetCount;

        if (author.dataCredit) {
          if (existingAuthor.dataCredit) {
            overwriteDataCredit(author, existingAuthor);
          } else {
            existingAuthor.dataCredit = author.dataCredit;
          }
        } else {
          noDataCredit++;
        }

        if (author.id.identifier && author.id.identifier !== existingAuthor.id.identifier) {
          existingAuthor.id.identifier = author.id.identifier;
        }

        if (author.id.type && author.id.type !== existingAuthor.id.type) {
          existingAuthor.id.type = author.id.type;
        }

        // console.log('for ' + author.name + ' updated ' + existingAuthor.count);
      } else {
        // console.log('for ' + author.name + ' set ' + author.count);
        existingAuthor = author;
        // authorCount++;
      }

      authorMap[authorKey] = existingAuthor;
    }

    // console.log(`extracted ${authorCount} authors`);
  }

  console.log(`counted noDataCredit ${noDataCredit} of ${Object.keys(authorMap).length}`)
  return authorMap;
}

/**
 *
 * @param {Object} authorMap
 * @param {Array} dataset
 */
export function getFullAuthorsFromDataset(authorMap, dataset) {
  if (!authorMap || !dataset) { return null; }

  const authors = createAuthors(dataset);
  const fullAuthors = [];

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    const authorKey = getAuthorKey(author);

    const fullAuthor = authorMap[authorKey];
    if (fullAuthor) {
      fullAuthors.push(fullAuthor);
    }

  }

  return fullAuthors;
}

export function getDataCreditLevel(dataCreditScore) {
  const entires = authorDataCreditLevels;

  for (let i = 0; i < entires.length; i++) {
    const scoreLvl = entires[i];
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

export function getNameInitials(userObject) {
  if (!userObject || !userObject.name || !userObject.fullname) {
    return '';
  }

  return `${userObject.name.substring(0, 1)}${userObject.fullname.substring(0, 1)}`.toUpperCase();
}

let localAuthorID = 0;

export function initializeLocalAuthor() {
  localAuthorID++;

  const newAuthor = {
    firstName: 'unknown',
    lastName: '',
    affiliation: '',
    id: {
      type: '',
      identifier: '',
    },
    email: '',
    existsOnlyLocal: true,
    loading: false,
  };

  newAuthor[localIdProperty] = `authorId_${localAuthorID}`;

  return newAuthor;
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
