import {
  mdiForest,
  mdiSnowflake,
  mdiImageFilterHdr,
  mdiHazardLights,
  mdiLeaf,
  mdiWeatherCloudy,
  mdiShieldCheck,
  mdiMapPlus,
  mdiEarth,
} from '@mdi/js';

export const extractIcons = (data) => {
  if (!data) {
    return null;
  }

  const lowerData = data.toLowerCase();
  const map = {
    snow: mdiSnowflake,
    forest: mdiForest,
    land: mdiImageFilterHdr,
    meteo: mdiWeatherCloudy,
    hazard: mdiHazardLights,
    diversity: mdiLeaf,
    protected: mdiShieldCheck,
    create: mdiMapPlus,
    world: mdiEarth,
  };
  return map[lowerData];
};
