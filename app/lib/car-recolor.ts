// Recolours real car photos in the browser: body-coloured pixels take the body colour, and an optional
// roof outline lets the dark roof take a second colour. Shading is preserved.

const NAMED: [RegExp, string][] = [
  [/off[\s-]?white|ivory|cream/i, "#ece8da"],
  [/maroon|burgundy|wine/i, "#7a1f2b"],
  [/black|midnight|ebony/i, "#16181d"],
  [/white|pearl|arctic/i, "#f6f6f4"],
  [/beige|sand|khaki/i, "#cdb892"],
  [/silver/i, "#b9bec6"],
  [/grey|gray|steel|granite|graphite/i, "#6b7280"],
  [/red|sizzling|crimson|scarlet/i, "#c8202f"],
  [/blue|navy|cobalt|azure|splendid/i, "#2756a8"],
  [/green|olive|emerald|forest/i, "#2f6f4a"],
  [/orange|copper|bronze/i, "#d9732a"],
  [/yellow|gold|amber/i, "#e3b82b"],
  [/brown|coffee|chocolate/i, "#6b4a35"],
];
const FALLBACK = "#94a3b8";

export const colorHex = (name: string) => NAMED.find(([re]) => re.test(name))?.[1] ?? FALLBACK;

/** "Red / Black" → body red, roof black. A single colour paints the whole car. */
export function parseTones(color: string) {
  const [body, roof] = color.split("/").map((p) => p.trim()).filter(Boolean);
  return { body: colorHex(body ?? ""), roof: colorHex(roof ?? body ?? ""), dual: !!roof };
}


type Hsl = [number, number, number];

function hexToHsl(hex: string): Hsl {
  const n = parseInt(hex.slice(1), 16);
  return rgbToHsl((n >> 16) & 255, (n >> 8) & 255, n & 255);
}
function rgbToHsl(r: number, g: number, b: number): Hsl {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h * 6) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.floor(h * 6) % 6];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

// Roof outlines (in image pixels) for photos where the roof is a separate colour from the body.
const ROOF_POLYGONS: Record<string, { size: [number, number]; points: [number, number][] }> = {
  "maruati.png": {
    size: [928, 495],
    points: [[100, 96], [108, 72], [150, 60], [240, 55], [335, 58], [500, 57], [535, 78], [520, 80], [480, 72], [380, 82], [350, 84], [250, 90], [150, 95]],
  },
};

export type Prepared = { data: ImageData; body: number[]; roof: number[]; refBody: number; bbox: [number, number, number, number] };

export function prepare(img: HTMLImageElement, canvas: HTMLCanvasElement, src: string): Prepared | null {
  const w = img.naturalWidth, h = img.naturalHeight;
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  let data: ImageData;
  try { data = ctx.getImageData(0, 0, w, h); } catch { return null; }
  const px = data.data;

  // The body colour is the most common strongly-saturated hue in the photo.
  const hist = new Array(36).fill(0);
  const hsl: (Hsl | null)[] = new Array(w * h).fill(null);
  for (let i = 0; i < w * h; i++) {
    if (px[i * 4 + 3] < 128) continue;
    const v = rgbToHsl(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
    hsl[i] = v;
    if (v[1] > 0.35 && v[2] > 0.06 && v[2] < 0.85) hist[Math.floor(v[0] * 36) % 36]++;
  }
  const best = hist.indexOf(Math.max(...hist));
  const dom = best / 36 + 1 / 72;
  const total = hist.reduce((a, b) => a + b, 0);

  const body: number[] = [];
  let lSum = 0;
  if (total > 500) {
    for (let i = 0; i < hsl.length; i++) {
      const v = hsl[i];
      if (!v || v[1] <= 0.35 || v[2] <= 0.06 || v[2] >= 0.85) continue;
      if (Math.abs(((v[0] - dom + 1.5) % 1) - 0.5) < 25 / 360) { body.push(i); lSum += v[2]; }
    }
  }

  // Bounding box of the car itself (body-coloured or dark pixels), used to keep every 360° frame at the same size.
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let i = 0; i < hsl.length; i++) {
    const v = hsl[i];
    if (!v) continue;
    const isBody = total > 500 && v[1] > 0.35 && v[2] > 0.06 && v[2] < 0.85 && Math.abs(((v[0] - dom + 1.5) % 1) - 0.5) < 25 / 360;
    if (!isBody && v[2] >= 0.2) continue;
    const x = i % w, y = (i - x) / w;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  if (x1 <= x0 || y1 <= y0) { x0 = 0; y0 = 0; x1 = w - 1; y1 = h - 1; }

  const roof: number[] = [];
  const spec = ROOF_POLYGONS[src.split("/").pop()?.toLowerCase() ?? ""];
  if (spec) {
    const m = document.createElement("canvas");
    m.width = w; m.height = h;
    const mc = m.getContext("2d");
    if (mc) {
      mc.fillStyle = "#fff";
      mc.beginPath();
      spec.points.forEach(([x, y], k) => {
        const X = (x / spec.size[0]) * w, Y = (y / spec.size[1]) * h;
        if (k === 0) mc.moveTo(X, Y); else mc.lineTo(X, Y);
      });
      mc.fill();
      const md = mc.getImageData(0, 0, w, h).data;
      for (let i = 0; i < hsl.length; i++) {
        const v = hsl[i];
        if (v && md[i * 4 + 3] > 128 && v[2] < 0.3 && v[1] < 0.35) roof.push(i);
      }
    }
  }
  return { data, body, roof, refBody: body.length ? lSum / body.length : 0.4, bbox: [x0, y0, x1, y1] };
}

export function paint(canvas: HTMLCanvasElement, prep: Prepared, bodyHex: string, roofHex: string) {
  if (canvas.width !== prep.data.width) { canvas.width = prep.data.width; canvas.height = prep.data.height; }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const out = new ImageData(new Uint8ClampedArray(prep.data.data), prep.data.width, prep.data.height);
  const px = out.data;

  const apply = (idx: number[], [th, ts, tl]: Hsl, ref: number) => {
    for (const i of idx) {
      const [, , l] = rgbToHsl(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
      // Dark targets scale the shading; light targets shift it, so highlights and shadows survive either way.
      const nl = tl <= ref ? (l * tl) / ref : tl + (l - ref) * 0.9;
      const [r, g, b] = hslToRgb(th, ts, Math.min(0.98, Math.max(0.02, nl)));
      px[i * 4] = r; px[i * 4 + 1] = g; px[i * 4 + 2] = b;
    }
  };
  apply(prep.body, hexToHsl(bodyHex), prep.refBody);
  const roofHsl = hexToHsl(roofHex);
  if (roofHsl[2] > 0.14) apply(prep.roof, roofHsl, 0.12); // a black roof is already in the photo
  ctx.putImageData(out, 0, 0);
}

