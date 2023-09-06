const useTestdata = import.meta.env.VITE_USE_TESTDATA === 'true';

export const DOI_API_ACTIONS = 'DOI_API_ACTIONS';

export const DOI_RESERVE = 'DOI_RESERVE';

export const DOI_RESERVE_ACTION = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/doi_draft.json';
  }

  return 'draft';
};
export const DOI_REQUEST = 'DOI_REQUEST';

export const DOI_REQUEST_ACTION = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/doi_request.json';
  }

  return 'request';
};

export const DOI_PUBLISH = 'DOI_PUBLISH';

export const DOI_PUBLISH_ACTION = () => {
  if (import.meta.env.DEV && useTestdata) {
    return './testdata/doi_publish.json';
  }

  return 'publish';
};


export const DOI_RESERVED_PROPERTY = 'doiReversed';
