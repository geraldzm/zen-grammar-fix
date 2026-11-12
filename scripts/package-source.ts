/* Zips the source AMO reviewers need to rebuild dist/. Uses an allowlist so local files
   (.env, editor/agent config, node_modules, build output) can never end up in the upload. */
import { mkdir, rm } from "node:fs/promises";
import manifest from "../src/manifest.json";

const FILES = [
  "src",
  "scripts",
  "icons",
  "package.json",
  "bun.lock",
  "tsconfig.json",
  "README.md",
  "PRIVACY.md",
  "LICENSE",
];

const out = `web-ext-artifacts/zen_grammar_fix-${manifest.version}-source.zip`;
await mkdir("web-ext-artifacts", { recursive: true });
await rm(out, { force: true });

const zip = Bun.spawnSync(["zip", "-r", "-q", "-X", out, ...FILES], { stdout: "inherit", stderr: "inherit" });
if (zip.exitCode !== 0) process.exit(zip.exitCode ?? 1);

console.log(`Source package written to ${out}`);
