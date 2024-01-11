/**
 * Vuetify plugin definitions.
 *
 * @summary Vuetify plugin definitions.
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import  'vuetify/styles';
import { createVuetify } from 'vuetify';
import config from './vuetifyConfig';


export default createVuetify({
  ...config,
});
