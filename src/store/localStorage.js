/**
 * main vuex store module it contains all other store modules.
 *
 * @summary main vuex store
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-24 13:36:23
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import VuexPersist from 'vuex-persist';

import {
  decryptString,
  encryptString,
  GetEncryptedKeyFromCookie,
} from '@/factories/stringFactory';
import {
  ENVIDAT_USER_SIGNIN_COOKIE,
  ENVIDAT_USER_SIGNIN_MODULE,
} from '@/store/storeConsts';

// const encryptionEnabled = true;
const cookieName = ENVIDAT_USER_SIGNIN_COOKIE;
const storageKey = ENVIDAT_USER_SIGNIN_MODULE;
const encryptedKey = GetEncryptedKeyFromCookie(cookieName);

function getVuexPersist() {
  return new VuexPersist({
    storage: {
      getItem: () => {
        // Get the store from local storage.
        const store = window.localStorage.getItem(storageKey);

        if (store) {
          /*
          if (!encryptionEnabled) {
            return store;
          }
*/
          try {
            // Decrypt the store retrieved from local storage
            return decryptString(store, encryptedKey);
          } catch (e) {
            // The store will be reset if decryption fails.
            window.localStorage.removeItem(storageKey);
          }
        }

        return store;
      },
      setItem: (key, value) => {
        /*
        if (!encryptionEnabled) {
          return window.localStorage.setItem(storageKey, value);
        }
*/

        // Encrypt the store using our encryption token stored in cookies.
        const store = encryptString(value, encryptedKey);

        // Save the encrypted store in local storage.
        return window.localStorage.setItem(storageKey, store);
      },
      removeItem: () => window.localStorage.removeItem(storageKey),
    },
    modules: ['userSignIn'],
  });
}

const localStoragePlugin = getVuexPersist();

export default localStoragePlugin;
