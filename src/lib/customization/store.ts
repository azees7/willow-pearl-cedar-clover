import { buildCustomizationProfile, decodeCustomizationExport } from "./import";
import type { CustomizationProfile } from "./types";

const KEY = "CHATCPU-CUSTOMIZATION-PROFILE-V1";

export function loadCustomizationProfile(): CustomizationProfile | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CustomizationProfile;
    return parsed?.schemaVersion === 1 ? parsed : null;
  } catch {
    return null;
  }
}

export function saveCustomizationProfile(profile: CustomizationProfile) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(profile));
}

export function clearCustomizationProfile() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(KEY);
}

export async function importCustomizationExport(input: ArrayBuffer | Uint8Array) {
  const text = await decodeCustomizationExport(input);
  const profile = buildCustomizationProfile(text);
  saveCustomizationProfile(profile);
  return profile;
}

function names(rows: { name: string }[], n = 5) {
  return rows.slice(0, n).map((row) => row.name).join(", ");
}

export function customizationBeliefLines(query = ""): string[] {
  const profile = loadCustomizationProfile();
  if (!profile) return [];
  const q = query.toLowerCase();
  const lines = [
    `Local customization profile: ${profile.sourceRecords} records across ${profile.collectRange.first ?? "unknown"} to ${profile.collectRange.last ?? "unknown"}.`,
  ];

  if (!q || /app|usage|work|tool|phone|device/.test(q)) {
    lines.push(`Frequently used apps include ${names(profile.appUsage.topApps)}.`);
  }
  if (/web|site|browser|url|research/.test(q)) {
    lines.push(`Frequent web hosts include ${names(profile.web.topHosts)}.`);
  }
  if (/music|audio|artist|listen/.test(q)) {
    lines.push(`Frequent media artists include ${names(profile.services.mediaArtists)}.`);
  }
  if (/photo|gallery|camera|image/.test(q)) {
    lines.push(`Gallery themes include ${names(profile.services.galleryTags)}.`);
  }
  if (/home|place|wifi|bluetooth|location/.test(q)) {
    lines.push(`Observed place categories include ${names(profile.services.placeCategories)}.`);
  }

  return lines.filter((line) => !line.endsWith("include ."));
}

export function customizationStats(): string {
  const profile = loadCustomizationProfile();
  if (!profile) return "customization=none";
  return `customization=ready records=${profile.sourceRecords} apps=${profile.appUsage.sessions} web=${profile.web.visits} notifications=${profile.notifications.count}`;
}
