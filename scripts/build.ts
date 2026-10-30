import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });

const result = await Bun.build({
  entrypoints: ["src/background.ts", "src/content.ts", "src/options.ts"],
  outdir: "dist",
  target: "browser",
  format: "esm",
  minify: true,
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

await cp("src/manifest.json", "dist/manifest.json");
await cp("src/options.html", "dist/options.html");
await cp("icons", "dist/icons", { recursive: true });

console.log("Built extension into dist/");
