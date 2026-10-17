import { readdirSync } from "node:fs";
import { join } from "node:path";

// 360° frames live in public/carImages/<model>360/ (e.g. brezza360/brezza-1.PNG … brezza-38.PNG), ordered by number.
export function get360Frames(modelName: string) {
  const root = join(process.cwd(), "public", "carImages");
  try {
    // Pick the "<name>360" folder whose name appears in the model name, e.g. brezza360 for "Maruti-suzuki Brezza".
    const key = modelName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const folder = readdirSync(root, { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.toLowerCase().endsWith("360"))
      .map((d) => d.name)
      .find((n) => key.includes(n.toLowerCase().slice(0, -3)));
    if (!folder) return [];
    return readdirSync(join(root, folder))
      .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
      .sort((a, b) => parseInt(a.match(/\d+/)?.[0] ?? "0") - parseInt(b.match(/\d+/)?.[0] ?? "0"))
      .map((f) => `/carImages/${folder}/${encodeURIComponent(f)}`);
  } catch {
    return [];
  }
}
