/**
 * Vuetify plugin definitions.
 *
 * @summary Vuetify plugin definitions.
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
// import { lightColorblind } from './colorThemes';
import { md2 } from 'vuetify/blueprints';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import { lightColorblind } from './colorThemes';

// Icons list: https://jossef.github.io/material-design-icons-iconfont/

// const colors = Object.values(lightColorblind);


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
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
};

