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

const selectionStyling = {
  variant: overallVariant,
  density: overallDensity,
};

export default {
  blueprint: md2,
  defaults: {
    VTextField: {
      variant: overallVariant,
      density: overallDensity,
      color: colors.primary,
    },
    VTextarea: {
      variant: overallVariant,
      density: overallDensity,
      color: colors.primary,
    },
    VSelect: {
      ...selectionStyling,
      color: colors.primary,
    },
    VAutocomplete: {
      ...selectionStyling,
      color: colors.primary,
    },
    VCombobox: {
      ...selectionStyling,
      color: colors.primary,
    },
    VAlert: {
      variant: 'flat',
      density: overallDensity,
    },
    VChip: {
      variant: 'flat',
      color: '#e0e0e0',
    },
    VList: {
      density: overallDensity,
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

