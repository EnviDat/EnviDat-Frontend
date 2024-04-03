/**
 * function factory for general techncial enhancements and syntatic sugar
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

export const importStoreModule = async (store, moduleKey, importFunction) => {

  if (store.state[moduleKey]) {
    return store.state[moduleKey];
  }

  try {
    const importObject = await importFunction();
    const module = importObject[moduleKey];
    store.registerModule(moduleKey, module);

    return module;
  } catch (e) {
    console.error(`error registering ${moduleKey}`);
    console.error(e);
  }

  return null;
}
