"use client";

import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { paint, parseTones, prepare, type Prepared } from "../lib/car-recolor";

// Every frame is drawn onto one fixed stage so the car keeps the same size and ground position while turning.
const MIN_ZOOM = 1, MAX_ZOOM = 2.5, ZOOM_STEP = 0.25;
const STAGE_W = 1200, STAGE_H = 600, CAR_H = 470, GROUND_Y = 550, FEATHER = 40;

/** Alpha mask that fades the photo's own edges out, so frames of different sizes never show a hard border. */
function edgeMask(w: number, h: number) {
  const m = document.createElement("canvas");
  m.width = w; m.height = h;
  const c = m.getContext("2d")!;
  const f = Math.min(FEATHER, w / 4, h / 4);
  const gx = c.createLinearGradient(0, 0, w, 0);
  gx.addColorStop(0, "rgba(0,0,0,0)"); gx.addColorStop(f / w, "#000"); gx.addColorStop(1 - f / w, "#000"); gx.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = gx; c.fillRect(0, 0, w, h);
  const gy = c.createLinearGradient(0, 0, 0, h);
  gy.addColorStop(0, "rgba(0,0,0,0)"); gy.addColorStop(f / h, "#000"); gy.addColorStop(1 - f / h, "#000"); gy.addColorStop(1, "rgba(0,0,0,0)");
  c.globalCompositeOperation = "destination-in";
  c.fillStyle = gy; c.fillRect(0, 0, w, h);
  return m;
}

/** Drag-to-rotate 360° view built from a ring of photos, every frame recoloured to the chosen colour. */
export default function Car360Viewer({ frames, color, label }: { frames: string[]; color: string; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preps = useRef<(Prepared | null)[]>([]);
  const painted = useRef<(HTMLCanvasElement | null)[]>([]);
  const [loaded, setLoaded] = useState(0);
  const [frame, setFrame] = useState(0);
  const [zoom, setZoom] = useState(1);
  const zoomBy = (d: number) => setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round((z + d) * 100) / 100)));
  const tmpRef = useRef<HTMLCanvasElement | null>(null);
  const masks = useRef<Record<string, HTMLCanvasElement>>({});
  const drag = useRef<{ x: number; frame: number } | null>(null);

  // Load every frame once and prepare its recolour masks.
  useEffect(() => {
    let cancelled = false;
    preps.current = new Array(frames.length).fill(null);
    painted.current = new Array(frames.length).fill(null);
    setLoaded(0);
    frames.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        const scratch = document.createElement("canvas");
        preps.current[i] = prepare(img, scratch, src);
        painted.current[i] = scratch;
        setLoaded((n) => n + 1);
      };
      img.onerror = () => { if (!cancelled) setLoaded((n) => n + 1); };
      img.src = src;
    });
    return () => { cancelled = true; };
  }, [frames]);

  // A new colour invalidates every recoloured frame; they are repainted on demand.
  const stamp = useRef<(string | null)[]>([]);
  useEffect(() => { stamp.current = []; }, [color]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current, prep = preps.current[frame];
    if (!canvas || !prep) return;
    const off = painted.current[frame]!;
    if (stamp.current[frame] !== color) {
      if (color) { const t = parseTones(color); paint(off, prep, t.body, t.roof); }
      else { off.width = prep.data.width; off.height = prep.data.height; off.getContext("2d")?.putImageData(prep.data, 0, 0); }
      stamp.current[frame] = color;
    }
    if (canvas.width !== STAGE_W) { canvas.width = STAGE_W; canvas.height = STAGE_H; }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: w, height: h } = off;
    const [bx0, by0, bx1, by1] = prep.bbox;
    const scale = CAR_H / (by1 - by0);
    const tmp = (tmpRef.current ??= document.createElement("canvas"));
    tmp.width = w; tmp.height = h;
    const t = tmp.getContext("2d")!;
    t.drawImage(off, 0, 0);
    t.globalCompositeOperation = "destination-in";
    t.drawImage(masks.current[w + "x" + h] ??= edgeMask(w, h), 0, 0);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    // Zoom about the middle of the car, the same at every angle.
    const cx = STAGE_W / 2, cy = GROUND_Y - CAR_H / 2;
    ctx.save();
    ctx.translate(cx, cy); ctx.scale(zoom, zoom); ctx.translate(-cx, -cy);
    ctx.drawImage(tmp, STAGE_W / 2 - ((bx0 + bx1) / 2) * scale, GROUND_Y - by1 * scale, w * scale, h * scale);
    ctx.restore();
  }, [frame, color, zoom]);

  useEffect(() => { draw(); }, [draw, loaded]);

  const ready = loaded >= frames.length;

  // Scroll wheel / trackpad pinch zooms the car instead of scrolling the page.
  const boxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => { e.preventDefault(); zoomBy(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP); };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, frame };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const step = (e.currentTarget as HTMLElement).clientWidth / frames.length; // one full drag across = one full turn
    const delta = Math.round((e.clientX - drag.current.x) / step);
    setFrame((((drag.current.frame - delta) % frames.length) + frames.length) % frames.length);
  };
  const onUp = () => { drag.current = null; };

  return (
    <div className="w-full">
      <div
        ref={boxRef}
        className="relative overflow-hidden cursor-grab touch-pan-y select-none active:cursor-grabbing"
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      >
        <canvas ref={canvasRef} role="img" aria-label={`${label} 360° view in ${color || "its default colour"}`} className="h-auto w-full" />
        <div className="absolute right-2 top-2 flex flex-col gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" onClick={() => zoomBy(ZOOM_STEP)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0b3d32] shadow ring-1 ring-slate-200 disabled:opacity-40"><Plus className="h-4 w-4" /></button>
          <button type="button" onClick={() => zoomBy(-ZOOM_STEP)} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0b3d32] shadow ring-1 ring-slate-200 disabled:opacity-40"><Minus className="h-4 w-4" /></button>
          {zoom !== 1 && (
            <button type="button" onClick={() => setZoom(1)} aria-label="Reset zoom"
              className="rounded-full bg-white px-2 py-1 text-xs font-bold text-slate-600 shadow ring-1 ring-slate-200">{Math.round(zoom * 100)}%</button>
          )}
        </div>
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-bold text-slate-600">
            Loading 360° view… {Math.round((loaded / frames.length) * 100)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <input
          type="range" min={0} max={frames.length - 1} value={frame} disabled={!ready}
          onChange={(e) => setFrame(Number(e.target.value))}
          aria-label="Rotate car" className="w-full accent-[#0b3d32]"
        />
      </div>
      <p className="mt-1 text-center text-xs font-semibold text-slate-400">Drag the car or use the slider to rotate · scroll or +/− to zoom</p>
    </div>
  );
}
