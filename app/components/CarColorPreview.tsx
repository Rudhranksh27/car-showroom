"use client";

import { useEffect, useRef, useState } from "react";
import { paint, parseTones, prepare, type Prepared } from "../lib/car-recolor";

// The real car photo, recoloured to the chosen body / roof colour.
export default function CarColorPreview({ color, label, src }: { color: string; label: string; src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prepRef = useRef<Prepared | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const url = src.replaceAll("\\", "/");

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      const prep = prepare(img, canvas, url);
      if (!prep) { setFailed(true); return; }
      prepRef.current = prep;
      setReady(true);
    };
    img.onerror = () => setFailed(true);
    img.src = url;
    return () => { cancelled = true; };
  }, [url]);

  useEffect(() => {
    const canvas = canvasRef.current, prep = prepRef.current;
    if (!ready || !canvas || !prep) return;
    // No colour chosen yet: leave the photo exactly as it is.
    if (!color) { canvas.getContext("2d")?.putImageData(prep.data, 0, 0); return; }
    const { body, roof } = parseTones(color);
    paint(canvas, prep, body, roof);
  }, [ready, color]);

  // If the photo cannot be read (e.g. blocked by the browser), show it unchanged.
  if (failed) return <img src={url} alt={label} className="h-auto w-full object-contain" />;
  return <canvas ref={canvasRef} role="img" aria-label={`${label} in ${color || "its default colour"}`} className="h-auto w-full" />;
}
