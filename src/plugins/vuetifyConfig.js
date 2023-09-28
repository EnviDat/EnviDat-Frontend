/**
 * Vuetify plugin definitions.
 *
 * @summary Vuetify plugin definitions.
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { md2 } from 'vuetify/blueprints';
import { lightColorblind } from './colorThemes';

// Icons list: https://jossef.github.io/material-design-icons-iconfont/
import 'material-design-icons-iconfont/dist/material-design-icons.css';


const colors = { ...lightColorblind };

export default {
  blueprint: md2,
  defaults: {
    VTextField: {
      variant: 'outlined',
      density: 'compact',
    },
  },
  theme: {
    themes: {
      light: { colors },
    },
  },
};

