import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const outDir = await mkdtemp(join(tmpdir(), "chatcpu-core-"));

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
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
    "--target",
    "ES2022",
    "--module",
    "commonjs",
    "--moduleResolution",
    "node",
    "--types",
    "node",
    "--strict",
    "--skipLibCheck",
    "--outDir",
    outDir,
    "src/lib/chatcpu/isa.ts",
    "src/lib/chatcpu/cpu.ts",
    "src/lib/chatcpu/assemble.ts",
    "src/lib/chatcpu/chatcpu.test.ts",
  ]);

  if (!compiled) process.exit();

  await writeFile(join(outDir, "package.json"), '{"type":"commonjs"}\n', "utf8");
  run(process.execPath, ["--test", join(outDir, "chatcpu.test.js")]);
} finally {
  await rm(outDir, { recursive: true, force: true });
}
