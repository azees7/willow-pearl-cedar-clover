import { CACHE_NAME, FACTORY, VERSION } from "./image";

const KEY = CACHE_NAME;

function readAll(): Record<string, string> {
  if (typeof localStorage === "undefined") return { ...FACTORY };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...FACTORY };
    const parsed = JSON.parse(raw) as Record<string, string>;
    return { ...FACTORY, ...parsed };
  } catch {
    return { ...FACTORY };
  }
}

function writeAll(files: Record<string, string>) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(files));
}

export function listFiles(): string[] {
  return Object.keys(readAll()).sort();
}

export function readFile(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const files = readAll();
  if (!(p in files)) throw new Error(`FileNotFoundError: ${p}`);
  return files[p];
}

export function writeFile(path: string, data: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const files = readAll();
  files[p] = data;
  writeAll(files);
}

export function removeFile(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  const files = readAll();
  delete files[p];
  writeAll(files);
}

export function ensureDisk() {
  if (typeof localStorage === "undefined") return;
  if (!localStorage.getItem(KEY)) {
    writeAll({ ...FACTORY });
    return;
  }
  const files = readAll();
  if (!files["/minios/version.txt"]?.includes("4.0")) {
    writeAll({
      ...files,
      "/minios/version.txt": VERSION,
      "/minios/config.cfg": FACTORY["/minios/config.cfg"],
      "/minios/system.cfg": FACTORY["/minios/system.cfg"],
      "/minios/helix.cfg": FACTORY["/minios/helix.cfg"],
      "/minios/shell.py": FACTORY["/minios/shell.py"],
    });
  }
}

export function installFactory() {
  writeAll({ ...FACTORY });
}

export function diskStatus() {
  const files = readAll();
  return {
    backend: "local",
    name: CACHE_NAME,
    count: Object.keys(files).length,
    files: Object.keys(files).sort(),
  };
}
