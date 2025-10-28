const useTestdata = import.meta.env?.VITE_USE_TESTDATA === 'true';

export const DOI_API_ACTIONS = 'DOI_API_ACTIONS';

export const DOI_RESERVE = 'DOI_RESERVE';

export const ACTION_DOI_RESERVE = () => {
  if (import.meta.env?.MODE === 'development' && useTestdata) {
    return './testdata/doi_draft.json';
  }

  return 'draft';
};
export const DOI_REQUEST = 'DOI_REQUEST';

export const ACTION_DOI_REQUEST = () => {
  if (import.meta.env?.MODE === 'development' && useTestdata) {
    return './testdata/doi_request.json';
  }

  return 'request';
};

export const DOI_PUBLISH = 'DOI_PUBLISH';

export const ACTION_DOI_PUBLISH = () => {
  if (import.meta.env?.MODE === 'development' && useTestdata) {
    return './testdata/doi_publish.json';
  }

  return 'publish';
};

export const DOI_RESERVED_PROPERTY = 'doiReversed';
