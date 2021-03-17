const fs = require('fs');

const packagePath = `${__dirname}/../testdata/packagelist`;
// eslint-disable-next-line import/no-dynamic-require
const packagelist = require(packagePath);
const metadataList = packagelist.result;

const outputFileName = 'authorCollection.json';
const outputPath = `${__dirname}/../testdata/`;

const fullNameList = {
  'Meile, R.': 'Rolf Meile',
};

function getDataCredit(author) {
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

function getAuthorName(author) {

  let fullName = author.name.trim();

  if (fullName.indexOf('.') >= 0) {
    // for names like 'Meile R.' usually the lastname comes first then
    const lookupName = fullNameList[fullName];
    if (lookupName) {
      fullName = lookupName;
    }
  }

  const nameSpilts = fullName.split(' ');

  const firstName = nameSpilts[0];
  let lastName = nameSpilts[1];

  if (nameSpilts.length === 3) {
    // For Names like 'Dude van Dudehood'
    lastName = `${nameSpilts[1]} ${nameSpilts[2]}`;
  }

  return {
    fullName,
    firstName,
    lastName,
  };
}

function getAuthors(dataset) {
  let authors = null;

  if (typeof dataset.author === 'string') {
    authors = JSON.parse(dataset.author);
  }

  if (authors && authors instanceof Array) {
    const authorObjs = [];

    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];

      const authorName = getAuthorName(author);

      const id = {
        type: author.identifier_scheme,
        identifier: author.identifier,
      };
      
      const dataCredit = getDataCredit(author);

      authorObjs.push({
                        firstName: authorName.firstName,
                        lastName: authorName.lastName,
                        fullName: authorName.fullName,
                        datasetCount: 1,
                        affiliation: author.affiliation,
                        id,
                        email: author.email,
                        dataCredit, 
        });
    }

    return authorObjs;
  }

  return null;
}

function extractAuthorsMap(datasets) {

  const mapAuthors = {};
  let authorCount = 0;

  for (let i = 0; i < datasets.length; i++) {
    const dataset = datasets[i];

    const authors = getAuthors(dataset);
 
    if (authors) {
      for (let j = 0; j < authors.length; j++) {
        const author = authors[j];

        const authorName = author.fullName;
        const existingAuthor = mapAuthors[authorName];

        if (existingAuthor) {
          existingAuthor.datasetCount += author.datasetCount;

          if (author.data_credit) {
            if (!existingAuthor.data_credit) {
              existingAuthor.data_credit = author.data_credit;
            } else {
              const keys = Object.keys(author.data_credit);

              for (let k = 0; k < keys.length; k++) {
                const key = keys[k];
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
          }

          // console.log('for ' + author.name + ' updated ' + existingAuthor.count);
          mapAuthors[authorName] = existingAuthor;
        } else {
          // console.log('for ' + author.name + ' set ' + author.count);
          mapAuthors[authorName] = author;
          authorCount++;
        }
      }
    } else {
      console.log(`Dataset ${dataset.title} id ${dataset.id} has no authors?`);
    }

    console.log(`extracted ${authorCount} authors`);
  }

  return mapAuthors;
}

function writeAuthorsToFile(authorMap) {

  const authorJson = JSON.stringify(authorMap, null, 2);

  fs.writeFile(outputPath + outputFileName, authorJson, (err) => {

    if (err) {
      return console.log(err);
    }

    return console.log(`Authors extracted to ${outputPath}${outputFileName}. Wrote ${authorJson.length} lines.`);
  }); 
  
}

const authorsMap = extractAuthorsMap(metadataList);

writeAuthorsToFile(authorsMap);
