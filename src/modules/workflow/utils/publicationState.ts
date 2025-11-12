const STATE_LABELS = {
  draft: 'Draft',
  reserved: 'Reserved',
  pub_pending: 'Pending',
  published: 'Published',
} as const;

export type PublicationLabel = (typeof STATE_LABELS)[keyof typeof STATE_LABELS];

export function mapPublicationState(raw: unknown): PublicationLabel {
  const key = String(raw ?? '')
    .toLowerCase()
    .trim() as keyof typeof STATE_LABELS;
  return STATE_LABELS[key] ?? 'Draft';
}
