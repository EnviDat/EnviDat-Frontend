/**
 * Vuetify plugin definitions.
 *
 * @summary Vuetify plugin definitions.
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:11:52 
 * Last modified  : 2021-01-26 09:11:25
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  lightColorblind,
} from '@/plugins/colorThemes';

 // Icons list: https://jossef.github.io/material-design-icons-iconfont/

export default {
  theme: {
    themes: {
      light: lightColorblind,
    },
  },
  options: {
    customProperties: true,
  },
  icons: {
    iconfont: 'mdi',
  },
};
