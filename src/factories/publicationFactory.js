import { METADATA_STATE_DRAFT, METADATA_STATE_INVISIBLE, METADATA_STATE_VISIBLE } from '@/factories/metadataConsts';

export function getMetadataVisibilityState(metadata) {
  const state = metadata?.state || null;
  const priv = metadata?.private || undefined;

  let visibilityState = METADATA_STATE_DRAFT;

  if (state === 'active') {
    visibilityState = priv ? METADATA_STATE_INVISIBLE : METADATA_STATE_VISIBLE;
  }

  return visibilityState;
}
