/**
 * category cards for filtering metadatas
 *
 * @summary categories for metadata
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-11-04 09:09:07
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  FOREST,
  SNOW,
  LAND,
  HAZARD,
  DIVERSITY,
  METEO,
} from '@/store/categoriesConsts';

// import snowImg from '@/assets/cards/c_b_snow_icy2_small.jpg';
// import woodImg from '@/assets/cards/c_b_forest_topdown3_small.jpg';
// import landImg from '@/assets/cards/c_b_landscape_view_small.jpg';
// import hazardImg from '@/assets/cards/c_b_hazard_cloud_small.jpg';
// import diversityImg from '@/assets/cards/c_b_diversity_meadow_small.jpg';
// import meteoImg from '@/assets/cards/c_b_c_b_clouds_lighting_small.jpg';
// import dataCreatorImg from '@/assets/cards/data_creator_small.jpg';
// import swissFLLogo from '@/assets/cards/swiss_forest_lab_logo.jpg';

import { SWISSFL_MODE } from '@/store/metadataMutationsConsts';

export default [
  {
    title: 'Login',
    type: 'login',
    alias: ['signin'],
    imgPath: 'cards/data_creator_small',
    color: '#E0F2F1',
    darkColor: '#B2DFDB',
    disabled: false,
  },
  {
    title: 'Forest',
    type: FOREST,
    alias: ['wood', 'tree'],
    imgPath: 'cards/c_b_forest_topdown3_small',
    color: '#e8f5e9',
    darkColor: '#C8E6C9',
    disabled: false,
  },
  {
    title: 'Snow',
    type: SNOW,
    alias: ['avalanche', 'antarctica', 'arctic', 'polar'],
    imgPath: 'cards/c_b_snow_icy2_small',
    color: '#e0f2f1',
    darkColor: '#e0f2f1',
    disabled: false,
  },
  {
    title: 'Landscape',
    type: LAND,
    alias: ['soil'],
    imgPath: 'cards/c_b_landscape_view_small',
    color: '#f1f8e9',
    darkColor: '#DCEDC8',
    disabled: false,
  },
  {
    title: 'Natural Hazards',
    type: HAZARD,
    alias: ['accident', 'fatalities'],
    imgPath: 'cards/c_b_hazard_cloud_small',
    color: '#fbe9e7',
    darkColor: '#FFCCBC',
    disabled: false,
  },
  {
    title: 'Biodiversity',
    type: DIVERSITY,
    alias: ['abundance', 'plants', 'insect', 'fungi'],
    imgPath: 'cards/c_b_diversity_meadow_small',
    color: '#ede7f6',
    darkColor: '#D1C4E9',
    disabled: false,
  },
  {
    title: 'Meteo',
    type: METEO,
    alias: ['climate'],
    imgPath: 'cards/c_b_c_b_clouds_lighting_small',
    color: '#E8EAF6',
    darkColor: '#C5CAE9',
    disabled: false,
  },
  {
    title: 'Swiss Forest Lab View',
    type: `mode_${SWISSFL_MODE}`,
    alias: [],
    imgPath: 'cards/swiss_forest_lab_logo',
    color: '#8BC34A',
    darkColor: '#8BC34A',
    contain: true,
    disabled: false,
  },
];
