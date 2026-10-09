import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
const root = process.cwd();
const sources = JSON.parse(
  await fs.readFile(path.join(root, "assets/source-map.json"), "utf8"),
);
await fs.mkdir(path.join(root, "public/media/images"), { recursive: true });
await fs.mkdir(path.join(root, "src/config"), { recursive: true });
const manifest = {};
const audit = [];
for (const [key, source] of Object.entries(sources)) {
  try {
    const input = await fs.readFile(path.join(root, "assets", source.path));
    if (!input.length) throw new Error("Empty placeholder");
    const hash = crypto
      .createHash("sha256")
      .update(input)
      .digest("hex")
      .slice(0, 10);
    const filename = `${key}-${hash}.webp`;
    const output = await sharp(input)
      .rotate()
      .resize({
        width: key.includes("Logo") ? 600 : 1800,
        withoutEnlargement: true,
      })
      .webp({ quality: 84 })
      .toBuffer({ resolveWithObject: true });
    await fs.writeFile(
      path.join(root, "public/media/images", filename),
      output.data,
    );
    manifest[key] = {
      src: `/media/images/${filename}`,
      alt: source.alt,
      width: output.info.width,
      height: output.info.height,
    };
    audit.push({
      key,
      source: source.path,
      status: "ready",
      sourceBytes: input.length,
      webBytes: output.data.length,
    });
  } catch (error) {
    manifest[key] = null;
    audit.push({
      key,
      source: source.path,
      status: "missing or invalid",
      reason: error.message,
    });
  }
}
await fs.writeFile(
  path.join(root, "src/config/assets.generated.json"),
  JSON.stringify(manifest, null, 2),
);
await fs.mkdir(path.join(root, "docs"), { recursive: true });
await fs.writeFile(
  path.join(root, "docs/asset-audit.json"),
  JSON.stringify(audit, null, 2),
);
console.table(audit);
