// types used to normalize date entries for backend
export type BackendDate = {
  date_type: string;
  date?: string;
  end_date?: string;
};

// string normalizer used by pick()
const norm = (v: unknown) =>
  typeof v === 'string' ? v.trim() : (v as string | undefined);

// returns the first non-empty value
const pick = (...vals: Array<unknown>) => {
  for (const v of vals) {
    const n = norm(v);
    if (n != null && n !== '') return n;
  }
  return undefined;
};

// Set dates to a clean array of BackendDate objects
export function cleanDatesForBackend(datesLike: unknown): BackendDate[] {
  let arr: any[] = [];
  if (Array.isArray(datesLike)) {
    arr = datesLike;
  } else if (typeof datesLike === 'string') {
    try {
      const parsed = JSON.parse(datesLike);
      if (Array.isArray(parsed)) arr = parsed;
    } catch {
      arr = [];
    }
  } else {
    return [];
  }

  // TODO ENRICO improve this function

  return arr
    .map((e: any) => {
      const type = pick(e.dateType, e.date_type);
      if (!type) return null;

      const start = pick(e.date, e.dateStart, e.date_start, e.start_date);
      const end = pick(e.endDate, e.dateEnd, e.end_date, e.date_end);

      const out: BackendDate = { date_type: String(type) };
      if (start) out.date = String(start);
      if (end) out.end_date = String(end);

      if (out.date_type === 'created') {
        return out.date && out.end_date ? out : null;
      }
      return out.date || out.end_date ? out : null;
    })
    .filter(Boolean) as BackendDate[];
}

export type CleanOpts = {
  // Keys that must be kept even if their value is an empty string.
  keepEmptyKeys?: string[];
  // Drop string values that are exactly "{}".
  dropEmptyJsonBraces?: boolean;
  // Convert spatial to a GeometryCollection JSON string.
  wrapSpatial?: boolean;
};

// converts various spatial shapes to a GeometryCollection JSON string
function toGeometryCollectionString(spatial: any): string | undefined {
  let val: any = spatial;

  if (typeof val === 'string') {
    try {
      val = JSON.parse(val);
    } catch {
      return spatial;
    }
  }

  if (Array.isArray(val)) {
    return JSON.stringify({ type: 'GeometryCollection', geometries: val });
  }

  if (val && typeof val === 'object') {
    if (val.type === 'GeometryCollection' && Array.isArray(val.geometries)) {
      return JSON.stringify(val);
    }
    if (val.type) {
      return JSON.stringify({ type: 'GeometryCollection', geometries: [val] });
    }
  }

  return undefined;
}

// removes empty top-level strings (except a whitelist) and normalizes spatial
export function cleanPostData(
  input: Record<string, any>,
  opts: CleanOpts = {},
): Record<string, any> {
  const {
    keepEmptyKeys = [],
    dropEmptyJsonBraces = true,
    wrapSpatial = true,
  } = opts;

  const out: Record<string, any> = { ...input };

  if (wrapSpatial && 'spatial' in out) {
    const gc = toGeometryCollectionString(out.spatial);
    if (gc) out.spatial = gc;
  }

  for (const [k, v] of Object.entries(out)) {
    const isNullish =
      v == null || (typeof v === 'string' && v.trim().toLowerCase() === 'null');

    if (isNullish) {
      delete out[k];
    } else if (typeof v === 'string') {
      const trimmed = v.trim();
      const shouldDrop =
        !keepEmptyKeys.includes(k) &&
        (trimmed === '' || (dropEmptyJsonBraces && trimmed === '{}'));
      if (shouldDrop) {
        delete out[k];
      }
    }
  }

  return out;
}

export function makeMaintainerFromUser(u: any): string {
  const email = u?.email ?? '';
  const full = (u?.fullName ?? u?.displayName ?? '').trim();
  let given = '';
  let family = '';

  if (full) {
    const parts = full.split(/\s+/);
    given = parts.shift() ?? '';
    family = parts.join(' ');
  }

  return JSON.stringify({
    email,
    given_name: given,
    name: family,
  });
}

// GET the tags string and convert into object array
export function normalizeTagsForPatch(
  input: Record<string, any>,
): Record<string, any> {
  const out: any = { ...input };
  if (out.tags == null) return out;

  let tags = out.tags;
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch {
      tags = null;
    }
  }

  if (Array.isArray(tags)) {
    out.tags = tags
      .map((t: any) => ({
        name: t?.name ?? t?.display_name ?? String(t ?? '').trim(),
        ...(t?.color ? { color: t.color } : {}),
      }))
      .filter((t: any) => !!t.name);
  } else {
    delete out.tags;
  }

  return out;
}
