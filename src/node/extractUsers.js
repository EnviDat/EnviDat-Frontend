const fs = require('fs');

const inputPath = `${__dirname}/../../public/testdata/`;
const userListPath = `${inputPath}user_list_17-08-2022.json`;
// eslint-disable-next-line import/no-dynamic-require
const userList = require(userListPath).result;

const packageListPath = `${inputPath}all_packages.json`;
const packageList = require(packageListPath).result;

const outputFileName = 'user_emails.json';
const outputPath = `${__dirname}/../../public/testdata/`;

const outputFileNameCSV = 'envidat_users.csv';
const outputDataMaintainersCSV = 'envidat_datamaintainers.csv';

function getUserObj(userName, email) {

  const nameSplits = userName.split(' ');
  let firstname = nameSplits[0];
  let lastname = nameSplits[1];

  if (nameSplits.length > 2) {
    if (nameSplits[1].length > 3 || nameSplits[1].includes('.')) {
      firstname = `${nameSplits[0]} ${nameSplits[1]}`;
      lastname = nameSplits.slice(2).toString().replaceAll(',', ' ');
      // console.log(`-- sliced from ${user.fullname} -> f: ${firstname} l: ${lastname}`);
    } else {
      lastname = nameSplits.slice(1).toString().replaceAll(',', ' ');
      // console.log(`-- sliced only lastname from ${user.fullname} -> f: ${firstname} l: ${lastname}`);
    }
    // console.log(`-- Got long name: ${user.fullname} ${nameSplits.length}`);
  }

  return {
    firstname,
    lastname,
    email,
  };
}

function isBetterEmail(email, oldEmail) {
  return (email.includes('wsl') || email.includes('slf') || email.includes('epfl') || email.includes('eth'))
    && (!oldEmail.includes('wsl') && !oldEmail.includes('slf') && !oldEmail.includes('epfl') && !oldEmail.includes('eth'));
}

function getEnviDatUser(entry) {
  return {
    userName: entry.fullname,
    email: entry.email,
  }

}

function getDataMaintainer(entry) {
  const maintainer = JSON.parse(entry.maintainer);
  const email = maintainer.email;
  const userName = `${maintainer.given_name} ${maintainer.name}`;

  return {
    userName,
    email,
  }
}

function genericExtractUser(array, getUserFromData){

  const userMap = {};
  let userCount = 0;

  for (let i = 0; i < array.length; i++) {
    const entry = array[i];
    const user = getUserFromData(entry);

    const userName = user.userName;
    const email = user.email;
    const existingUser = userMap[userName];
    let save = false;

    if (!userName) {
      console.warn(`-- Wrong entry: ${JSON.stringify(user)}`);
    }

    if (existingUser) {

      const oldEmail = userMap[userName].email;

      const isBetter = isBetterEmail(email, oldEmail);

      if (isBetter) {
        save = true;
      } else {
        console.warn(`${userName} already added with email: ${userMap[userName].email} but also got ${email}`)
      }

    } else {
      save = true;
    }

    if (save) {
      userMap[userName] = getUserObj(userName, email);
      userCount++;
    }

  }

  console.log(`extracted ${userCount} users`);

  return userMap;
}

function writeUsersToFile(data, fileName) {


  fs.writeFileSync(fileName, data, (err) => {

    if (err) {
      return console.log(err);
    }

    return console.log(`Users extracted to ${outputPath}${fileName}. Wrote ${data.length} lines.`);
  }); 
  
}

function getCSVData (userMap) {
  let csvString = 'firstname, lastname, email \n';
  const keys = Object.keys(userMap)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const user = userMap[key];

    csvString += `${user.firstname}, ${user.lastname || ''}, ${user.email} \n`;
  }

  return csvString;
}

/* Create the envidat users csv file */

/*
const userMap = genericExtractUser(userList, getEnviDatUser);

const csvString = getCSVData(userMap);

writeUsersToFile(csvString, outputPath + outputFileNameCSV);
*/

/* Create a envidat user json file

const usersJsonString = JSON.stringify(userMap, null, 2);
writeUsersToFile(usersJsonString, outputPath + outputFileName);

*/

/* Create the data owners csv file */

const userMap = genericExtractUser(packageList, getDataMaintainer);

const csvString = getCSVData(userMap);

writeUsersToFile(csvString, outputPath + outputDataMaintainersCSV);

