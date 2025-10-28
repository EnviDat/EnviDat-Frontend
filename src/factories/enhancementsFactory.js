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
};

/**
 * Checks to see if the browser can render webp
 * @returns {boolean} ```true``` if the browser supports webp rendering
 */
export const checkWebpSupport = () => {
  if (import.meta.env?.MODE === 'test') {
    // don't execute canvas test of webp support because in test (unit-testing)
    // the document isn't available because it's running on node (vitest)
    return false;
  }

  try {
    // try catch for the testing environment when running with vitest
    if (document === undefined) {
      return false;
    }
  } catch (e) {
    return false;
  }

  const elem = document.createElement('canvas');

  if (!(elem.getContext && elem.getContext('2d'))) {
    return false;
  }

  const isWebpSupported = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  elem.remove();

  return isWebpSupported;
};
