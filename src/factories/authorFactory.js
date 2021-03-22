/**
 * method factory for authors related funtionality.
 *
 * @summary method factory for authors related funtionality
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-06-05 14:07:03
 * Last modified  : 2020-08-25 14:29:25
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

const authorDataCreditLevels = [
  { score: 160, lvl: 6 },
  { score: 80, lvl: 5 },
  { score: 40, lvl: 4 },
  { score: 20, lvl: 3 },
  { score: 10, lvl: 2 },
  { score: 1, lvl: 1 },
];

export function getAuthorName(author) {
  return `${author.given_name ? author.given_name : ''} ${author.name ? author.name : ''}`.trim();
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
    console.log(`Unexpected type for author.data_credit ${typeof author.data_credit}`);
    throw new Error(`Unexpected type for author.data_credit ${typeof author.data_credit}`);
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
  }

  if (!authors || !(authors instanceof Array)) {
    return null;
  }

  const authorObjs = [];

  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];

    const fullName = getAuthorName(author);
    const nameSplits = fullName.split(' ');
    const firstName = nameSplits[0] ? nameSplits[0].trim() : '';
    const lastName = nameSplits[1] ? nameSplits[1].trim() : '';

    const dataCredit = getDataCredit(author);

    authorObjs.push({
      firstName,
      lastName,
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
  const keys = Object.keys(author.data_credit);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = author.data_credit[key];

    let existingValue = existingAuthor.data_credit[key];

    if (existingValue) {
      existingValue += value;
    } else {
      existingValue = value;
    }

    // console.log('for ' + author.name + ' set ' + key + ' ' + existingValue);
    existingAuthor.data_credit[key] = existingValue;
  }
}

export function extractAuthorsMap(datasets) {
  if (!datasets) { return null; }

  const authorMap = {};
  // let authorCount = 0;

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    const authors = createAuthors(dataset);

    if (authors) {
      for (let j = 0; j < authors.length; j++) {
        const author = authors[j];

        const authorName = author.fullName;
        const existingAuthor = authorMap[authorName];

        if (existingAuthor) {
          existingAuthor.datasetCount += author.datasetCount;

          if (author.data_credit) {
            if (existingAuthor.data_credit) {
              overwriteDataCredit(author, existingAuthor);
            } else {
              existingAuthor.data_credit = author.data_credit;
            }
          }

          // console.log('for ' + author.name + ' updated ' + existingAuthor.count);
          authorMap[authorName] = existingAuthor;
        } else {
          // console.log('for ' + author.name + ' set ' + author.count);
          authorMap[authorName] = author;
          // authorCount++;
        }
      }
    // } else {
      // console.log(`Dataset ${dataset.title} id ${dataset.id} has no authors?`);
    }

    // console.log(`extracted ${authorCount} authors`);
  }

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

    const fullAuthor = authorMap[author.fullName];
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
