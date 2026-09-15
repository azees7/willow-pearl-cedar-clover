import type { CountRow, CustomizationProfile, DurationRow } from "./types";

const textDecoder = new TextDecoder();

function asBytes(input: ArrayBuffer | Uint8Array): Uint8Array {
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}

function readAscii(bytes: Uint8Array, start: number, length: number): string {
  return textDecoder.decode(bytes.subarray(start, start + length)).replace(/\0.*$/, "");
}

function parseTarSize(bytes: Uint8Array, offset: number): number {
  const raw = readAscii(bytes, offset, 12).trim();
  if (!raw) return 0;
  return Number.parseInt(raw.replace(/\0/g, "").trim(), 8) || 0;
}

function isTar(bytes: Uint8Array): boolean {
  return bytes.length >= 512 && readAscii(bytes, 257, 5) === "ustar";
}

export function extractCustomizationJsonlFromTar(bytes: Uint8Array): string {
  let offset = 0;
  let fallback: string | null = null;

  while (offset + 512 <= bytes.length) {
    const header = bytes.subarray(offset, offset + 512);
    const empty = header.every((value) => value === 0);
    if (empty) break;

    const name = readAscii(header, 0, 100);
    const prefix = readAscii(header, 345, 155);
    const fullName = prefix ? `${prefix}/${name}` : name;
    const size = parseTarSize(header, 124);
    const typeFlag = String.fromCharCode(header[156] || 48);
    const bodyStart = offset + 512;
    const bodyEnd = bodyStart + size;

    if ((typeFlag === "0" || typeFlag === "\0") && bodyEnd <= bytes.length) {
      const text = textDecoder.decode(bytes.subarray(bodyStart, bodyEnd));
      if (fullName.endsWith("Customization_Service_collected_data.txt")) return text;
      if (!fallback && fullName.toLowerCase().endsWith(".txt") && text.includes('"row_data"')) {
        fallback = text;
      }
    }

    offset = bodyStart + Math.ceil(size / 512) * 512;
  }

  if (fallback) return fallback;
  throw new Error("Customization Service JSONL file not found in tar archive");
}

async function gunzip(bytes: Uint8Array): Promise<Uint8Array> {
  if (typeof DecompressionStream === "undefined") {
    throw new Error("Gzip import requires DecompressionStream support");
  }
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export async function decodeCustomizationExport(input: ArrayBuffer | Uint8Array): Promise<string> {
  let bytes = asBytes(input);
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) bytes = await gunzip(bytes);
  if (isTar(bytes)) return extractCustomizationJsonlFromTar(bytes);
  return textDecoder.decode(bytes);
}

function addCount(map: Map<string, number>, key: unknown, delta = 1) {
  if (typeof key !== "string") return;
  const clean = key.trim();
  if (!clean) return;
  map.set(clean, (map.get(clean) ?? 0) + delta);
}

function topCounts(map: Map<string, number>, limit = 12): CountRow[] {
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

function topDurations(counts: Map<string, number>, durations: Map<string, number>, limit = 12): DurationRow[] {
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count, durationMs: durations.get(name) ?? 0 }))
    .sort((a, b) => b.durationMs - a.durationMs || b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

function nestedData(row: Record<string, unknown>): Record<string, unknown>[] {
  if (typeof row.details !== "string") return [];
  try {
    const parsed = JSON.parse(row.details) as { data?: unknown };
    return Array.isArray(parsed.data)
      ? parsed.data.filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
      : [];
  } catch {
    return [];
  }
}

function updateRange(value: unknown, range: { first: string | null; last: string | null }) {
  if (typeof value !== "string" || !value) return;
  if (!range.first || value < range.first) range.first = value;
  if (!range.last || value > range.last) range.last = value;
}

export function buildCustomizationProfile(jsonl: string): CustomizationProfile {
  const recordTypes = new Map<string, number>();
  const devices = new Map<string, number>();
  const appCounts = new Map<string, number>();
  const appDurations = new Map<string, number>();
  const notificationPackages = new Map<string, number>();
  const webHosts = new Map<string, number>();
  const serviceTypes = new Map<string, number>();
  const dataTypes = new Map<string, number>();
  const placeCategories = new Map<string, number>();
  const mediaArtists = new Map<string, number>();
  const galleryTags = new Map<string, number>();
  const collectRange = { first: null as string | null, last: null as string | null };

  let sourceRecords = 0;
  let appSessions = 0;
  let appDurationMs = 0;
  let notificationCount = 0;
  let webVisits = 0;
  let serviceEvents = 0;

  for (const raw of jsonl.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;

    let parsed: { type?: unknown; row_data?: unknown };
    try {
      parsed = JSON.parse(line) as { type?: unknown; row_data?: unknown };
    } catch {
      continue;
    }

    if (!parsed.row_data || typeof parsed.row_data !== "object") continue;
    const row = parsed.row_data as Record<string, unknown>;
    const type = typeof parsed.type === "string" ? parsed.type : "unknown";
    sourceRecords += 1;
    addCount(recordTypes, type);
    addCount(devices, row.device_model);
    updateRange(row.collect_time, collectRange);

    if (type === "app_usage") {
      appSessions += 1;
      const app = typeof row.app_usage_id === "string" ? row.app_usage_id : "";
      const duration = Math.max(0, Number(row.app_usage_duration) || 0);
      addCount(appCounts, app);
      if (app) appDurations.set(app, (appDurations.get(app) ?? 0) + duration);
      appDurationMs += duration;
      continue;
    }

    if (type === "notification") {
      notificationCount += 1;
      addCount(notificationPackages, row.package_name);
      continue;
    }

    if (type === "url") {
      webVisits += 1;
      addCount(webHosts, row.url_host);
      continue;
    }

    if (type !== "services_apps") continue;
    serviceEvents += 1;
    addCount(serviceTypes, row.service_type);
    addCount(dataTypes, row.data_type);

    for (const detail of nestedData(row)) {
      if (row.data_type === "wifi_bt_connection") addCount(placeCategories, detail.place_category);
      if (row.data_type === "music_play") addCount(mediaArtists, detail.artist);
      if (row.data_type === "tags") {
        const count = Math.max(1, Number(detail.count) || 1);
        addCount(galleryTags, detail.category, count);
      }
    }
  }

  return {
    schemaVersion: 1,
    importedAt: new Date().toISOString(),
    sourceRecords,
    collectRange,
    devices: topCounts(devices, 8),
    recordTypes: topCounts(recordTypes, 12),
    appUsage: {
      sessions: appSessions,
      totalDurationMs: appDurationMs,
      topApps: topDurations(appCounts, appDurations, 16),
    },
    notifications: {
      count: notificationCount,
      topPackages: topCounts(notificationPackages, 12),
    },
    web: {
      visits: webVisits,
      topHosts: topCounts(webHosts, 12),
    },
    services: {
      events: serviceEvents,
      topServiceTypes: topCounts(serviceTypes, 12),
      topDataTypes: topCounts(dataTypes, 12),
      placeCategories: topCounts(placeCategories, 8),
      mediaArtists: topCounts(mediaArtists, 10),
      galleryTags: topCounts(galleryTags, 12),
    },
  };
}
