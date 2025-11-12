import type { PageContextClient } from 'vike/types';

const data = async (pageContext: PageContextClient) => {
  return pageContext.data;
};

export { data };
