/**
 * category cards for filtering metadatas
 *
 * @summary categories for metadata
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  mdiForest,
  mdiSnowflake,
  mdiImageFilterHdr,
  mdiHazardLights,
  mdiLeaf,
  mdiWeatherCloudy,
} from '@mdi/js';

import {
  DIVERSITY,
  FOREST,
  HAZARD,
  LAND,
  CLIMATE,
  SNOW,
} from '@/store/categoriesConsts';

import { EDNA_MODE, SWISSFL_MODE } from '@/store/metadataMutationsConsts';
import { getModeData } from '@/factories/modeFactory';
import { getImage, getImageList } from '@/factories/imageFactory';


const swissFLMode = getModeData(SWISSFL_MODE);
const ednaMode = getModeData(EDNA_MODE);

export default [
  {
    title: 'Forest',
    type: FOREST,
    alias: ['wood', 'tree'],
    iconPath: mdiForest,
    imgPath: getImage('c_b_forest_topdown3_small'),
    color: '#e8f5e9',
    darkColor: '#C8E6C9',
    disabled: false,
  },
  {
    title: 'Snow',
    type: SNOW,
    alias: ['avalanche', 'antarctica', 'arctic', 'polar'],
    iconPath: mdiSnowflake,
    imgPath: getImage('c_b_snow_icy2_small'),
    color: '#e0f2f1',
    darkColor: '#e0f2f1',
    disabled: false,
  },
  {
    title: 'Landscape',
    type: LAND,
    alias: ['soil'],
    iconPath: mdiImageFilterHdr,
    imgPath: getImage('c_b_landscape_view_small'),
    color: '#f1f8e9',
    darkColor: '#DCEDC8',
    disabled: false,
  },
  {
    title: 'Natural Hazards',
    type: HAZARD,
    alias: ['accident', 'fatalities'],
    iconPath: mdiHazardLights,
    imgPath: getImage('c_b_hazard_cloud_small'),
    color: '#fbe9e7',
    darkColor: '#FFCCBC',
    disabled: false,
  },
  {
    title: 'Biodiversity',
    type: DIVERSITY,
    alias: ['abundance', 'plants', 'insect', 'fungi', 'lichens'],
    iconPath: mdiLeaf,
    imgPath: getImage('c_b_diversity_meadow_small'),
    color: '#ede7f6',
    darkColor: '#D1C4E9',
    disabled: false,
  },
  {
    title: 'Climate',
    type: CLIMATE,
    alias: ['meteo'],
    iconPath: mdiWeatherCloudy,
    imgPath: getImage('c_b_meteo_clouds_lighting_small'),
    color: '#E8EAF6',
    darkColor: '#C5CAE9',
    disabled: false,
  },
  {
    title: `${swissFLMode.title} View`,
    type: `mode_${SWISSFL_MODE}`,
    alias: [],
    imgPath: getImage('swiss_forest_lab_logo'),
    color: '#8BC34A',
    darkColor: '#8BC34A',
    contain: true,
    disabled: false,
    isMode: true,
  },
  {
    title: `${ednaMode.title} View`,
    type: `mode_${EDNA_MODE}`,
    alias: [],
    imgPath: getImage('edna_logo_small'),
    color: '#3966d0',
    darkColor: '#2f5dc7',
    contain: true,
    disabled: false,
    isMode: true,
  },
];

export const cardImageBgs = {
  [LAND]: getImageList('c_b_landscape'),
  [FOREST]: getImageList('c_b_forest'),
  [SNOW]: getImageList('c_b_snow'),
  [DIVERSITY]: getImageList('c_b_diversity'),
  [HAZARD]: getImageList('c_b_hazard'),
  [CLIMATE]: getImageList('c_b_meteo'),
};
