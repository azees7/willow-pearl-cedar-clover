import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const outDir = await mkdtemp(join(tmpdir(), "minios-integrations-"));

function run(command, args) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit", env: process.env });
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    return false;
  }
  return true;
}

try {
  const tsc = resolve(root, "node_modules/typescript/bin/tsc");
  const compiled = run(process.execPath, [
    tsc,
    "--target", "ES2022",
    "--module", "commonjs",
    "--moduleResolution", "node",
    "--types", "node",
    "--esModuleInterop",
    "--strict",
    "--skipLibCheck",
    "--outDir", outDir,
    "src/lib/customization/types.ts",
    "src/lib/customization/import.ts",
    "src/lib/customization/store.ts",
    "src/lib/customization/customization.test.ts",
    "src/lib/mcp/registry.ts",
    "src/lib/mcp/client.ts",
    "src/lib/mcp/mcp.test.ts",
  ]);
  if (!compiled) process.exit();

  await writeFile(join(outDir, "package.json"), '{"type":"commonjs"}\n', "utf8");
  const first = run(process.execPath, ["--test", join(outDir, "customization", "customization.test.js")]);
  if (first) run(process.execPath, ["--test", join(outDir, "mcp", "mcp.test.js")]);
} finally {
  await rm(outDir, { recursive: true, force: true });
}
