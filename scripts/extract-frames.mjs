import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
const root = process.cwd();
const input = path.join(root, "assets/animations/radian-scroll.mp4");
await fs.mkdir(path.join(root, "src/config"), { recursive: true });
const empty = {
  available: false,
  desktop: null,
  mobile: null,
  poster: null,
  previewVideo: null,
};
let bytes;
try {
  bytes = await fs.readFile(input);
  if (!bytes.length) throw new Error("empty");
} catch {
  await fs.writeFile(
    "src/config/sequence.generated.json",
    JSON.stringify(empty),
  );
  console.log(
    "No usable animation; static architectural image fallback enabled.",
  );
  process.exit(0);
}
const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
const probe = spawnSync(ffmpeg, ["-hide_banner", "-i", input], {
  encoding: "utf8",
});
const match = probe.stderr?.match(/Duration: (\d+):(\d+):(\d+\.\d+)/);
if (!match)
  throw new Error(
    "FFmpeg could not inspect this video. Install FFmpeg or set FFMPEG_PATH.",
  );
const duration =
  Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
const hash = crypto
  .createHash("sha256")
  .update(bytes)
  .update("desktop-1440-q77-180_mobile-640-q66-90_v2")
  .digest("hex")
  .slice(0, 10);
const base = `media/sequence/${hash}`;
const run = (args) => {
  const r = spawnSync(
    ffmpeg,
    ["-hide_banner", "-loglevel", "error", "-y", ...args],
    { encoding: "utf8" },
  );
  if (r.status !== 0) throw new Error(r.stderr || "FFmpeg failed");
};
const variants = {};
for (const [name, width, target] of [
  ["desktop", 1440, 180],
  ["mobile", 640, 90],
]) {
  const folder = path.join(root, "public", base, name);
  await fs.mkdir(folder, { recursive: true });
  const rate = Math.min(name === "desktop" ? 18 : 9, target / duration);
  run([
    "-i",
    input,
    "-an",
    "-vf",
    `fps=${rate},scale=${width}:-2`,
    "-c:v",
    "libwebp",
    "-quality",
    name === "desktop" ? "77" : "66",
    "-start_number",
    "0",
    path.join(folder, "frame-%04d.webp"),
  ]);
  const files = (await fs.readdir(folder))
    .filter((f) => f.endsWith(".webp"))
    .sort();
  let totalBytes = 0;
  for (const f of files)
    totalBytes += (await fs.stat(path.join(folder, f))).size;
  variants[name] = {
    base: `/${base}/${name}`,
    count: files.length,
    width,
    bytes: totalBytes,
  };
}
const video = `/${base}/preview.mp4`;
run([
  "-i",
  input,
  "-an",
  "-vf",
  "scale=960:-2",
  "-c:v",
  "libx264",
  "-crf",
  "27",
  "-preset",
  "fast",
  "-g",
  "12",
  "-movflags",
  "+faststart",
  path.join(root, "public", video),
]);
const manifest = {
  available: true,
  duration,
  ...variants,
  poster: `/${base}/desktop/frame-0000.webp`,
  previewVideo: video,
};
await fs.writeFile(
  path.join(root, "src/config/sequence.generated.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(JSON.stringify(manifest, null, 2));
