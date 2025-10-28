export interface Person {
  '@type': 'Person';
  name: string;
  url?: string;
  sameAs?: string; // A URL pointing to a page with more information about the person
}

export interface Organization {
  '@type': 'Organization';
  name: string;
  url?: string;
  sameAs?: string; // A URL pointing to a page with more information about the organization
}

export interface DatasetDistribution {
  '@type': 'DataDownload' | 'DatasetDistribution';
  url: string; // URL for the dataset
  format: string; // Format of the dataset (e.g., CSV, JSON)
}

export interface CreativeWork {
  '@type': 'CreativeWork';
  name: string;
  url?: string;
}

export interface Event {
  '@type': 'Event';
  name: string;
  startDate?: string;
  endDate?: string;
}

export interface Claim {
  '@type': 'Claim';
  claimReview: string;
}

export interface Dataset {
  '@context': string; // "http://schema.org"
  '@type': string; // "Dataset"
  description?: string;
  identifier?: string | { '@type': string; value: string }; // Can be a URL or identifier
  name: string;
  keywords?: string | string[];
  creator?: Person | Organization; // Creator of the dataset
  publisher?: Organization | Person; // Publisher of the dataset
  dateCreated?: string; // Date when the dataset was created
  dateModified?: string; // Date when the dataset was last modified
  distribution?: DatasetDistribution[]; // Distribution (download link) for the dataset
  license?: string | CreativeWork; // License for the dataset
  schemaVersion?: string; // Schema version
  isAccessibleForFree?: boolean; // If the dataset is free to access
  subjectOf?: CreativeWork | Event | Claim; // Works related to the dataset
  format?: string; // The format of the dataset (e.g., CSV, JSON)
  version?: string; // Dataset version
  additionalType?: string; // Additional types related to the dataset
}
