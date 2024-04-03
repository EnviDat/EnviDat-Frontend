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

const overallVariant = 'outlined';
const overallDensity = 'compact';

const selection = {
  variant: overallVariant,
  density: overallDensity,
};

export default {
  blueprint: md2,
  defaults: {
    VTextField: {
      variant: overallVariant,
      density: overallDensity,
    },
    VTextarea: {
      variant: overallVariant,
      density: overallDensity,
    },
    VSelect: {
      ...selection,
    },
    VAutocomplete: {
      ...selection,
    },
    VCombobox: {
      ...selection,
    },
    VAlert: {
      variant: 'flat',
      density: overallDensity,
    },
    VChip: {
      variant: 'flat',
      density: overallDensity,
      color: '#e0e0e0',
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

