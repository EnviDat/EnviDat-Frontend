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
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { lightColorblind } from './colorThemes';

const colors = { ...lightColorblind };

export default {
  blueprint: md2,
  defaults: {
    VTextField: {
      variant: 'outlined',
      density: 'compact',
    },
    VAlert: {
      variant: 'flat',
      density: 'compact',
    },
  },
  theme: {
    variations: {
      colors: ['primary', 'secondary'],
      lighten: 2,
      darken: 2,
    },
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

