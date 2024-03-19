/**
 * function factory for global methods, mainly used as a mixin to
 * provide functions for every vue component.
 *
 * @summary function factory for global methods
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export const isFieldReadOnly = (props, property) => {
  if (props?.readOnlyFields?.length > 0) {
    return props.readOnlyFields.includes(property);
  }

  return false;
}

 export const readOnlyHint = (props, property) => {
  let hint = '';

  if (isFieldReadOnly(property)) {
    hint = props?.readOnlyExplanation || '';
  }

  return hint;
}

