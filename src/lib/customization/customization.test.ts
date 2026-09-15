import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildCustomizationProfile, extractCustomizationJsonlFromTar } from "./import";

function octal(value: number, width: number) {
  return value.toString(8).padStart(width - 1, "0") + "\0";
}

function tarWith(name: string, body: string): Uint8Array {
  const encoder = new TextEncoder();
  const payload = encoder.encode(body);
  const header = new Uint8Array(512);
  header.set(encoder.encode(name).subarray(0, 100), 0);
  header.set(encoder.encode("0000644\0"), 100);
  header.set(encoder.encode("0000000\0"), 108);
  header.set(encoder.encode("0000000\0"), 116);
  header.set(encoder.encode(octal(payload.length, 12)), 124);
  header.set(encoder.encode("00000000000\0"), 136);
  header.fill(0x20, 148, 156);
  header[156] = "0".charCodeAt(0);
  header.set(encoder.encode("ustar\0"), 257);
  header.set(encoder.encode("00"), 263);

  let checksum = 0;
  for (const byte of header) checksum += byte;
  header.set(encoder.encode(checksum.toString(8).padStart(6, "0") + "\0 "), 148);

  const padded = Math.ceil(payload.length / 512) * 512;
  const out = new Uint8Array(512 + padded + 1024);
  out.set(header, 0);
  out.set(payload, 512);
  return out;
}

const rows = [
  { type: "app_usage", row_data: { collect_time: "2026-01-01", device_model: "PHONE", app_usage_id: "chat", app_usage_duration: "100" } },
  { type: "app_usage", row_data: { collect_time: "2026-01-02", device_model: "PHONE", app_usage_id: "chat", app_usage_duration: "250" } },
  { type: "url", row_data: { collect_time: "2026-01-03", device_model: "PHONE", url_host: "example.com" } },
  { type: "notification", row_data: { collect_time: "2026-01-04", device_model: "PHONE", package_name: "mail" } },
  { type: "services_apps", row_data: { collect_time: "2026-01-05", device_model: "TABLET", service_type: "framework", data_type: "wifi_bt_connection", details: JSON.stringify({ data: [{ place_category: "HOME", mac_address: "never-retain-this", device_name: "private" }] }) } },
  { type: "services_apps", row_data: { collect_time: "2026-01-06", device_model: "TABLET", service_type: "cmh", data_type: "tags", details: JSON.stringify({ data: [{ category: "documents", count: "3" }] }) } },
];
const jsonl = rows.map((row) => JSON.stringify(row)).join("\n");

describe("Customization Service importer", () => {
  it("extracts the collected JSONL file from a tar archive", () => {
    const tar = tarWith("request/Customization_Service_collected_data.txt", jsonl);
    assert.equal(extractCustomizationJsonlFromTar(tar), jsonl);
  });

  it("builds an aggregate profile without retaining raw identifiers", () => {
    const profile = buildCustomizationProfile(jsonl);
    assert.equal(profile.sourceRecords, 6);
    assert.equal(profile.appUsage.sessions, 2);
    assert.equal(profile.appUsage.topApps[0]?.name, "chat");
    assert.equal(profile.appUsage.topApps[0]?.durationMs, 350);
    assert.equal(profile.web.topHosts[0]?.name, "example.com");
    assert.equal(profile.services.placeCategories[0]?.name, "HOME");
    assert.equal(profile.services.galleryTags[0]?.count, 3);
    assert.doesNotMatch(JSON.stringify(profile), /never-retain-this|private/);
  });
});
