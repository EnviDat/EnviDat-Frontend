import { randomInt } from '@/factories/metaDataFactory';

export const urlParameters = [
  'accessoriesType',
  'avatarStyle',
  'clotheColor',
  'clotheType',
  'graphicType',
  'eyeType',
  'eyebrowType',
  'facialHairColor',
  'facialHairType',
  'hairColor',
  'hatColor',
  'mouthType',
  'skinColor',
  'topType',
];

export const avatarStyle = [
  'Circle',
  'Tranparent',
];

export const skinColor = [
  'Black',
  'Tanned',
  'Pale',
  'Brown',
  'Light',
  'Yellow',
  'DarkBrown',
];

export const mouthType = [
  'Concerned',
  'Default',
  'Disbelief',
  'Eating',
  'Grimace',
  'Sad',
  'ScreamOpen',
  'Serious',
  'Smile',
  'Tongue',
  'Twinkle',
  // 'Vomit',
];

export const eyebrowType = [
  'Angry',
  'AngryNatural',
  'Default',
  'DefaultNatural',
  'FlatNatural',
  'RaisedExcited',
  'RaisedExcitedNatural',
  'SadConcerned',
  'SadConcernedNatural',
  'UnibrowNatural',
  'UpDown',
  'UpDownNatural',
];

export const eyeType = [
  'Close',
  'Cry',
  'Default',
  'Dizzy',
  'EyeRoll',
  'Happy',
  'Hearts',
  'Side',
  'Squint',
  'Surprised',
  'Wink',
  'WinkWacky',
];

export const clotheType = [
  'BlazerShirt',
  'BlazerSweater',
  'CollarSweater',
  'GraphicShirt',
  'Hoodie',
  'Overall',
  'ShirtCrewNeck',
  'ShirtScoopNeck',
  'ShirtVNeck',
];

export const clotheColor = [
  'Black',
  'Blue01',
  'Blue02',
  'Blue03',
  'Gray01',
  'Gray02',
  'Heather',
  'PastelBlue',
  'PastelGreen',
  'PastelOrange',
  'PastelRed',
  'PastelYellow',
  'Pink',
  'Red',
  'White',
];

export const graphicType = [
  'Bat',
  'Cumbia',
  'Deer',
  'Diamond',
  'Hola',
  'Pizza',
  'Resist',
  'Selena',
  'Bear',
  'SkullOutline',
  'Skull',  
];

export const facialHairType = [
  'Blank',
  'BeardMedium',
  'BeardLight',
  'BeardMagestic',
  'MoustacheFancy',
  'MoustacheMagnum',
];

export const facialHairColor = [
  'Auburn',
  'Black',
  'Blonde',
  'BlondeGolden',
  'Brown',
  'BrownDark',
  'Platinum',
  'Red',
];

export const hairColor = [
  'Auburn',
  'Black',
  'Blonde',
  'BlondeGolden',
  'Brown',
  'BrownDark',
  'PastelPink',
  'Platinum',
  'Red',
  'SilverGray',
];

export const hatColor = [
  'Black',
  'Blue01',
  'Blue02',
  'Blue03',
  'Gray01',
  'Gray02',
  'Heather',
  'PastelBlue',
  'PastelGreen',
  'PastelOrange',
  'PastelRed',  
];

export const accessoriesType = [
  'Blank',
  'Kurt',
  'Prescription01',
  'Prescription02',
  'Round',
  'Sunglasses',
  'Wayfarers',
];

export const topType = [
  'NoHair',
  'Eyepatch',
  'Hat',
  'Hijab',
  'Turban',
  'WinterHat1',
  'WinterHat2',
  'WinterHat3',
  'WinterHat4',
  'LongHairBigHair',
  'LongHairBob',
  'LongHairBun',
  'LongHairCurly',
  'LongHairCurvy',
  'LongHairDreads',
  'LongHairFrida',
  'LongHairFro',
  'LongHairFroBand',
  'LongHairNotTooLong',
  'LongHairShavedSides',
  'LongHairMiaWallace',
  'LongHairStraight',
  'LongHairStraight2',
  'LongHairStraightStrand',
  'ShortHairDreads01',
  'ShortHairDreads02',
  'ShortHairFrizzle',
  'ShortHairShaggyMullet',
  'ShortHairShortCurly',
  'ShortHairShortFlat',
  'ShortHairShortRound',
  'ShortHairShortWaved',
  'ShortHairSides',
  'ShortHairTheCaesar',
  'ShortHairTheCaesarSidePart',
];

export const parameterCollection = {
  accessoriesType,
  avatarStyle,
  clotheColor,
  clotheType,
  graphicType,
  eyeType,
  eyebrowType,
  facialHairColor,
  facialHairType,
  hairColor,
  hatColor,
  mouthType,
  skinColor,
  topType,
};

function getNextHashNumber(hash, index) {
  if (!hash) {
    const number = randomInt(0, 9);

    return { index: index + 1, number };
  }

  let number = 0;

  let i = index;
  for (; i < hash.length; i++) {
    const char = hash[i];

    number = Number.parseInt(char, 10);

    if (typeof number === 'number' && !Number.isNaN(number)) {
      return { index: i + 1, number };
    }

  }

  return { index: i, number };
}

export function getAvataaarUrl(emailHash, avatarStyleParam = 'Transparent') {

  const paramKeys = Object.keys(parameterCollection);

  let url = `https://avataaars.io/?avatarStyle=${avatarStyleParam}`;
  let hashIndex = 0;

  for (let i = 0; i < paramKeys.length; i++) {
    const key = paramKeys[i];
    
    const paramValues = parameterCollection[key];

    const returnObj = getNextHashNumber(emailHash, hashIndex);
    const nextHashNumber = returnObj.number;
    hashIndex = returnObj.index;

    let valueIndex = nextHashNumber % paramValues.length;

    if (valueIndex === 0) {
      valueIndex = paramValues.length - 1;
    }

    // console.log(`param ${key} hashIndex: ${hashIndex} nextHashNumber: ${nextHashNumber} valueIndex: ${valueIndex} paramValues.length ${paramValues.length}`);

    if (key !== 'avatarStyle') {
      url += `&${key}=${paramValues[valueIndex]}`;
    }
  }

  return url;
}
