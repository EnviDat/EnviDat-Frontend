/**
 * category cards for filtering metadatas
 *
 * @summary categories for metadata
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { DIVERSITY, FOREST, HAZARD, LAND, METEO, SNOW } from '@/store/categoriesConsts';
import { EDNA_MODE, SWISSFL_MODE } from '@/store/metadataMutationsConsts';
import { getModeData } from '@/factories/modeFactory';
import { checkWebpSupport } from '@/factories/enhancementsFactory';

const isWebpSupported = checkWebpSupport();

const normalizeImagePath = (path) => {
  const splits = path.split('/');
  if (splits.length > 0) {
    const fileNameWithExt = splits[splits.length - 1];
    // return only the fileName without extensions
    return fileNameWithExt.split('.')[0];
  }

  return path;
}

const loadImageUrlMap  = () => {
  let imageUrls;

  if (isWebpSupported) {
    imageUrls = import.meta.glob([
      '@/assets/cards/**/*.{webp,WEBP}',
      '@/assets/cards/*.{webp,WEBP}',
    ], { eager: true, query: '?url', import: 'default' });
  } else {
    imageUrls = import.meta.glob([
      '@/assets/cards/**/*.{jpg,jpeg,JPEG,JPG}',
      '@/assets/cards/*.{jpg,jpeg,JPEG,JPG}',
      ], { eager: true, query: '?url', import: 'default' });
  }

  const keys = Object.keys(imageUrls);

  const imageMap = {};
  keys.forEach(imageUrl => {
    const key = normalizeImagePath(imageUrl);
    imageMap[key] = imageUrl;
  })

  return imageMap;
}

const cardImagesUrlMap = loadImageUrlMap();

const swissFLMode = getModeData(SWISSFL_MODE);
const ednaMode = getModeData(EDNA_MODE);


/**
 *
 * @param {string} imageName
 */
export const getCardImage = (imageName) => cardImagesUrlMap[imageName]

const getCardImagesSubset = (imagePath, imageUrlMap) => {
  const images = {};

  if (!imagePath) {
    return images;
  }

  const keys = Object.keys(imageUrlMap);

  keys.forEach(key => {
    const fullPath = imageUrlMap[key];
    if (fullPath.includes(imagePath)) {
      images[key] = imageUrlMap[key];
    }
  });

  return images;
}


export default [
  {
    title: 'Forest',
    type: FOREST,
    alias: ['wood', 'tree'],
    imgPath: getCardImage('c_b_forest_topdown3_small'),
    color: '#e8f5e9',
    darkColor: '#C8E6C9',
    disabled: false,
  },
  {
    title: 'Snow',
    type: SNOW,
    alias: ['avalanche', 'antarctica', 'arctic', 'polar'],
    imgPath: getCardImage('c_b_snow_icy2_small'),
    color: '#e0f2f1',
    darkColor: '#e0f2f1',
    disabled: false,
  },
  {
    title: 'Landscape',
    type: LAND,
    alias: ['soil'],
    imgPath: getCardImage('c_b_landscape_view_small'),
    color: '#f1f8e9',
    darkColor: '#DCEDC8',
    disabled: false,
  },
  {
    title: 'Natural Hazards',
    type: HAZARD,
    alias: ['accident', 'fatalities'],
    imgPath: getCardImage('c_b_hazard_cloud_small'),
    color: '#fbe9e7',
    darkColor: '#FFCCBC',
    disabled: false,
  },
  {
    title: 'Biodiversity',
    type: DIVERSITY,
    alias: ['abundance', 'plants', 'insect', 'fungi', 'lichens'],
    imgPath: getCardImage('c_b_diversity_meadow_small'),
    color: '#ede7f6',
    darkColor: '#D1C4E9',
    disabled: false,
  },
  {
    title: 'Meteo',
    type: METEO,
    alias: ['climate'],
    imgPath: getCardImage('c_b_c_b_clouds_lighting_small'),
    color: '#E8EAF6',
    darkColor: '#C5CAE9',
    disabled: false,
  },
  {
    title: `${swissFLMode.title} View`,
    type: `mode_${SWISSFL_MODE}`,
    alias: [],
    imgPath: getCardImage('swiss_forest_lab_logo'),
    color: '#8BC34A',
    darkColor: '#8BC34A',
    contain: true,
    disabled: false,
  },
  {
    title: `${ednaMode.title} View`,
    type: `mode_${EDNA_MODE}`,
    alias: [],
    imgPath: getCardImage('edna_logo_small'),
    color: '#3966d0',
    darkColor: '#2f5dc7',
    contain: true,
    disabled: false,
  },
];

export const cardImageBgs = {
  [LAND]: getCardImagesSubset('cards/landscape/', cardImagesUrlMap),
  [FOREST]: getCardImagesSubset('cards/forest/', cardImagesUrlMap),
  [SNOW]: getCardImagesSubset('cards/snow/', cardImagesUrlMap),
  [DIVERSITY]: getCardImagesSubset('cards/diversity/', cardImagesUrlMap),
  [HAZARD]: getCardImagesSubset('cards/hazard/', cardImagesUrlMap),
  [METEO]: getCardImagesSubset('cards/meteo/', cardImagesUrlMap),
};


