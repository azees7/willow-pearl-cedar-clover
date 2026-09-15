export type CountRow = {
  name: string;
  count: number;
};

export type DurationRow = CountRow & {
  durationMs: number;
};

export type CustomizationProfile = {
  schemaVersion: 1;
  importedAt: string;
  sourceRecords: number;
  collectRange: { first: string | null; last: string | null };
  devices: CountRow[];
  recordTypes: CountRow[];
  appUsage: {
    sessions: number;
    totalDurationMs: number;
    topApps: DurationRow[];
  };
  notifications: {
    count: number;
    topPackages: CountRow[];
  };
  web: {
    visits: number;
    topHosts: CountRow[];
  };
  services: {
    events: number;
    topServiceTypes: CountRow[];
    topDataTypes: CountRow[];
    placeCategories: CountRow[];
    mediaArtists: CountRow[];
    galleryTags: CountRow[];
  };
};
