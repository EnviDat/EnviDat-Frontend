/**
 * Vuetify plugin definitions.
 *
 * @summary Vuetify plugin definitions.
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:11:52 
 * Last modified  : 2019-10-23 16:12:20
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

 // Icons list: https://jossef.github.io/material-design-icons-iconfont/

// original theme, not colorblind ready
// const theme = {
//   primary: '#00897B', // teal darken-1
//   secondary: '#4DB6AC', // teal lighten-2
//   highlight: '#B2DFDB', // teal lighten-4
//   info: '#2196F3',
//   success: '#4CAF50',
//   warning: '#FFC107',
//   error: '#FF5252',
//   errorHighlight: '#FF8A80', // red lighten-4
//   accent: '#FFD740', // amber accent-2
// };

// created via https://vis4.net/palettes/#/6|d|00897b,4db6ac,b2dfdb|99ebff,4caf50,ffc107|1|0
// for the error and accent colors: https://vis4.net/palettes/#/6|d|00897b,4db6ac,b2dfdb|ff5252,ff8a80,ffd740|1|0
// colorblind ready theme
export const lightColorblind = {
  primary: '#00897b',
  secondary: '#35a89d',
  highlight: '#71c5bd',
  info: '#92e5ef',
  success: '#8ae0de',
  warning: '#ffc107',
  error: '#ff847b',
  errorHighlight: '#ffb060', // red lighten-4
  accent: '#FFD740', // amber accent-2
};

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
