/**
 * category cards for filtering metadatas
 *
 * @summary categories for metadata
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-23 16:34:51
 * Last modified  : 2020-08-12 08:46:54
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

import snowImg from '@/assets/cards/c_b_snow_icy2_small.jpg';
import woodImg from '@/assets/cards/c_b_forest_topdown3_small.jpg';
import landImg from '@/assets/cards/c_b_landscape_view_small.jpg';
import hazardImg from '@/assets/cards/c_b_hazard_cloud_small.jpg';
import diversityImg from '@/assets/cards/c_b_diversity_meadow_small.jpg';
import meteoImg from '@/assets/cards/c_b_c_b_clouds_lighting_small.jpg';
import dataCreatorImg from '@/assets/cards/data_creator_small.jpg';
import swissFLLogo from '@/assets/cards/swiss_forest_lab_logo.jpg';

import { SWISSFL_MODE } from '@/store/metadataMutationsConsts';

export default [
  {
    title: 'Sign in', type: 'login', img: dataCreatorImg, color: '#E0F2F1', darkColor: '#B2DFDB',
  },
  {
    title: 'Forest', type: FOREST, img: woodImg, color: '#e8f5e9', darkColor: '#C8E6C9',
  },
  {
    title: 'Snow', type: SNOW, img: snowImg, color: '#e0f2f1', darkColor: '#e0f2f1',
  },
  {
    title: 'Landscape', type: LAND, img: landImg, color: '#f1f8e9', darkColor: '#DCEDC8',
  },
  {
    title: 'Natural Hazards', type: HAZARD, img: hazardImg, color: '#fbe9e7', darkColor: '#FFCCBC',
  },
  {
    title: 'Biodiversity', type: DIVERSITY, img: diversityImg, color: '#ede7f6', darkColor: '#D1C4E9',
  },
  {
    title: 'Meteo', type: METEO, img: meteoImg, color: '#E8EAF6', darkColor: '#C5CAE9',
  },
  {
    title: 'Swiss Forest Lab View', type: `mode_${SWISSFL_MODE}`, img: swissFLLogo, color: '#8BC34A', darkColor: '#8BC34A', contain: true,
  },
];
