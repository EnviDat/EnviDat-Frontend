/**
 * Vuetify plugin definitions.
 *
 * @summary Vuetify plugin definitions.
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { VTreeview } from 'vuetify/labs/VTreeview'
import config from './vuetifyConfig';


export const createSSGVuetify = () =>
  createVuetify({
    ...config,
    ssr: false,
    components: {
      VTreeview,
    },
  })

export const createSSRVuetify = () =>
  createVuetify({
    ...config,
    ssr: true,
    components: {
      VTreeview,
    },
  });
