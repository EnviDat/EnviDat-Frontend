/**
 * function factory for general techncial enhancements and syntatic sugar for node.js environment
 *
 * @summary function for techncial enhancements and syntatic sugar
 * @author Dominik Haas-Artho
 *
 * Created at     : 2020-10-13 17:06:03
 * Last modified  : 2020-10-29 20:32:51
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
*/

import fs from 'fs';

/**
 * Get all files in a folder with a specific prefix. This function only works in the
 * node.js environment!
 *
 * @export
 * @param {string} path
 * @param {string} [prefix='']
 * @returns {Array} founfFiles
 */
function getFilesWithPrefix(path, prefix = '') {
  // eslint-disable-next-line global-require
  const foundFiles = [];

  try {
    const files = fs.readdirSync(path);

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (prefix) {
          if (f.includes(prefix)) {
            foundFiles.push(f);
          }
        } else {
          foundFiles.push(f);
        }
      }
    }
  } catch (err) {
    console.log(`Couldn't read path: ${path}. Error: ${err}`);
  }

  return foundFiles;
}

export {
  getFilesWithPrefix,
};
