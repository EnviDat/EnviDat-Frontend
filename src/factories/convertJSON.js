
export function convertJSONArray(array, recursive) {
  const parsedArray = [];

  for (let i = 0; i < array.length; i++) {
    const entry = array[i];
    let parsedValue = JSON.parse(entry);

    if (recursive) {
      if (parsedValue instanceof Array) {
        convertJSONArray(parsedValue, recursive);
      } else if (typeof parsedValue === 'object') {
        // eslint-disable-next-line no-use-before-define
        parsedValue = convertJSON(parsedValue, false, recursive);
      }
    }

    parsedArray.push(parsedValue);
  }

  return parsedArray;
}

const jsonStartRegex = /^\s*(\{|\[)/;

export function convertJSON(data, stringify, recursive = false) {
  const properties = Object.keys(data);
  const flatObj = {};

  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i];
    let value = data[prop];

    if (stringify) {
      if (value instanceof Array) {
        value = JSON.stringify(value);

      } else if (typeof value === 'object') {
        if (recursive) {
          value = convertJSON(value, stringify, recursive);
        } else {
          value = JSON.stringify(value);
        }
      }
    } else {

      // eslint-disable-next-line no-lonely-if
      if (typeof value === 'string' && jsonStartRegex.test(value)) {
        try {
          const parsedValue = JSON.parse(value);
          if (parsedValue && typeof parsedValue === 'object') {
            value = parsedValue;
          }
        } catch (e) {

          if (import.meta.env?.MODE === 'development') {
            console.error(`Json parse error on property: ${prop} with value: ${value} had error: ${e}`);
          }
        }
      }

      if (recursive && value instanceof Array) {
        value = convertJSONArray(value, recursive);
      }

      if (recursive && typeof value === 'object') {
        value = convertJSON(value, stringify, recursive);
      }

    }

    flatObj[prop] = value;
  }

  return flatObj;
}



/**
 * Code from https://stackoverflow.com/questions/54246477/how-to-convert-camelcase-to-snake-case-in-javascript
 * @param {String} inputString camelCaseString
 * @returns {String} snake_case_string
 */
export function toSnakeCase(inputString) {
  return inputString.split('').map((character) => {
    if (character === character.toUpperCase() && character !== '_') {
      return `_${character.toLowerCase()}`;
    }

    return character;
  }).join('');
}

/**
 * Code from https://stackoverflow.com/a/61375162/2733509
 * @param {String} snakeCaseString
 * @returns {String} camelCaseString
 */
// eslint-disable-next-line camelcase
export function toCamelCase(snakeCaseString) {
  return snakeCaseString
      // .toLowerCase()
      .replace(/([-_][a-z])/g, group => group
          .toUpperCase()
          //        .replace('-', '')
          .replace('_', ''));
}

export function getObjectInOtherCase(fromCaseObject, caseConversionFunc) {
  const properties = Object.keys(fromCaseObject);
  const toCaseObject = {};

  for (let i = 0; i < properties.length; i++) {
    const fromCaseProp = properties[i];
    const otherCaseProp = caseConversionFunc(fromCaseProp);

    let value = fromCaseObject[fromCaseProp];

    if (value) {
      if (value instanceof Array) {
        // eslint-disable-next-line no-use-before-define
        value = getArrayInOtherCase(value, caseConversionFunc);
      } else if (typeof value === 'object') {
        value = getObjectInOtherCase(value, caseConversionFunc);
      }
    }

    toCaseObject[otherCaseProp] = value;
  }

  return toCaseObject;
}

export function getArrayInOtherCase(fromCaseArray, caseConversionFunc) {
  if (fromCaseArray.length <= 0 || typeof fromCaseArray[0] !== 'object') {
    return fromCaseArray;
  }

  const otherCaseArray = [];
  for (let i = 0; i < fromCaseArray.length; i++) {
    let arrayValue = fromCaseArray[i];

    if (arrayValue) {
      if (arrayValue instanceof Array) {
        arrayValue = getArrayInOtherCase(arrayValue, caseConversionFunc);
      } else if (typeof arrayValue === 'object') {
        // eslint-disable-next-line no-use-before-define
        arrayValue = getObjectInOtherCase(arrayValue, caseConversionFunc);
      }
    }

    otherCaseArray[i] = arrayValue;
  }

  return otherCaseArray;
}

function convertPut(entity, property, value) {
  const path = property.split('.');
  const key = path.pop();

  const o = path.reduce((entry, prop) => {
    // if (!entry.hasOwnProperty(prop)) {
    if (!entry[prop]) {
      entry[prop] = {};
    }
    return entry[prop];
  }, entity);

  o[key] = value;

  return entity;
}

function convertGet(entity, property) {
  return property.split('.').reduce((entry, key) => 
    // Check if entry is an object and the key exists in the entry
     (entry && typeof entry === 'object' && key in entry) ? entry[key] : undefined
  , entity);
}

export function convertToBackendJSONWithRules(rules, data) {
  if (!rules) {
    return null;
  }

  let backendJson = {};

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    try {
      const value = convertGet(data, rule[0]);
      convertPut(backendJson, rule[1], value);
    } catch (e) {
      console.error(i);
      console.error(rule);
      console.error(e);
    }
  }

  backendJson = getObjectInOtherCase(backendJson, toSnakeCase);
  return backendJson;
}

export function convertToFrontendJSONWithRules(rules, data) {
  if (!rules) {
    return null;
  }

  let frontendJson = {};

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    try {
      const value = convertGet(data, rule[1]);
      convertPut(frontendJson, rule[0], value);
    } catch (e) {
      console.error(i);
      console.error(rule);
      console.error(e);
    }
  }

  frontendJson = getObjectInOtherCase(frontendJson, toCamelCase);
  return frontendJson;
}

