"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Pt = { E: number; g: number; oddFactors: number; div3: boolean };

// Color a point by how many DISTINCT odd prime factors E has — the thing that
// drives the bands. More small factors ⇒ warmer ⇒ higher up.
function colorFor(p: Pt, mode: "factors" | "div3"): string {
  if (mode === "div3") {
    return p.div3 ? "rgba(232,182,76,0.85)" : "rgba(88,160,200,0.55)";
  }
  switch (Math.min(p.oddFactors, 3)) {
    case 0:
      return "rgba(80,140,210,0.55)"; // powers of 2 etc. — bottom band
    case 1:
      return "rgba(90,200,170,0.6)"; // teal
    case 2:
      return "rgba(232,182,76,0.8)"; // gold
    default:
      return "rgba(230,110,70,0.9)"; // 3+ — red, top band
  }
}

export default function CometPlot() {
  const [input, setInput] = useState(3000);
  const [mode, setMode] = useState<"factors" | "div3">("factors");

  const HARD_MAX = 15000;
  const raw = Math.max(10, Math.floor(Math.abs(input) || 10));
  const max = Math.min(raw, HARD_MAX);
  const capped = raw > HARD_MAX;

  const { pts, maxG } = useMemo(() => {
    // sieve for primality
    const comp = new Uint8Array(max + 1);
    // smallest prime factor for fast distinct-factor counting
    for (let i = 2; i * i <= max; i++) {
      if (!comp[i]) for (let j = i * i; j <= max; j += i) comp[j] = 1;
    }
    const isPrime = (x: number) => x >= 2 && !comp[x];

    const distinctOddFactors = (E: number) => {
      let n = E;
      while (n % 2 === 0) n /= 2; // strip 2s
      let count = 0;
      for (let p = 3; p * p <= n; p += 2) {
        if (n % p === 0) {
          count++;
          while (n % p === 0) n /= p;
        }
      }
      if (n > 1) count++;
      return count;
    };

    const out: Pt[] = [];
    let mg = 0;
    for (let E = 4; E <= max; E += 2) {
      let g = 0;
      for (let p = 2; p <= E / 2; p++) if (isPrime(p) && isPrime(E - p)) g++;
      if (g > mg) mg = g;
      out.push({ E, g, oddFactors: distinctOddFactors(E), div3: E % 3 === 0 });
    }
    return { pts: out, maxG: mg };
  }, [max]);

  // Responsive width.
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(900);
  const height = 480;

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) setWidth(wrapRef.current.clientWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const [hover, setHover] = useState<Pt | null>(null);

  // Draw.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const padL = 52,
      padR = 16,
      padT = 16,
      padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const xFor = (E: number) => padL + (E / max) * plotW;
    const yFor = (g: number) => padT + plotH - (g / maxG) * plotH;

    // axes
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    ctx.fillStyle = "rgba(244,236,216,0.55)";
    ctx.font = "11px ui-monospace, monospace";
    // y ticks
    for (let t = 0; t <= 4; t++) {
      const gv = Math.round((maxG * t) / 4);
      const y = yFor(gv);
      ctx.fillText(String(gv), 8, y + 3);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
    }
    // x ticks
    for (let t = 0; t <= 5; t++) {
      const ev = Math.round((max * t) / 5);
      const x = xFor(ev);
      ctx.fillText(String(ev), x - 10, padT + plotH + 20);
    }

    // points
    for (const p of pts) {
      ctx.fillStyle = colorFor(p, mode);
      ctx.fillRect(xFor(p.E) - 1, yFor(p.g) - 1, 2, 2);
    }

    // hover marker
    if (hover) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(xFor(hover.E), yFor(hover.g), 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [pts, maxG, width, max, mode, hover]);

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const padL = 52,
      padR = 16;
    const plotW = width - padL - padR;
    const E = Math.round(((px - padL) / plotW) * max);
    // nearest even
    const target = Math.max(4, Math.min(max, E % 2 === 0 ? E : E + 1));
    const p = pts[(target - 4) / 2];
    setHover(p ?? null);
  };

  const presets = [1000, 3000, 6000, 10000];

  return (
    <div className="explorer">
      <div className="controls">
        <div className="field">
          <label>Plot even numbers up to</label>
          <input
            type="number"
            step={100}
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>drag max &nbsp;({max})</label>
          <input
            type="range"
            min={100}
            max={HARD_MAX}
            step={100}
            value={Math.min(Math.max(input, 100), HARD_MAX)}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>color by</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "factors" | "div3")}
            style={{
              background: "#201a10",
              color: "var(--paper)",
              border: "1px solid var(--accent-dim)",
              borderRadius: 6,
              padding: "8px 10px",
              fontFamily: "var(--mono)",
            }}
          >
            <option value="factors">distinct odd prime factors</option>
            <option value="div3">divisible by 3?</option>
          </select>
        </div>
      </div>

      <div className="chiprow">
        {presets.map((p) => (
          <span key={p} className="chip" onClick={() => setInput(p)}>
            up to {p}
          </span>
        ))}
      </div>

      <div className="legend" style={{ marginTop: 16 }}>
        {mode === "factors" ? (
          <>
            <span>
              <i className="swatch" style={{ background: "rgb(80,140,210)" }} /> 0
              odd factors (powers of 2)
            </span>
            <span>
              <i className="swatch" style={{ background: "rgb(90,200,170)" }} /> 1
            </span>
            <span>
              <i className="swatch" style={{ background: "rgb(232,182,76)" }} /> 2
            </span>
            <span>
              <i className="swatch" style={{ background: "rgb(230,110,70)" }} /> 3+
              (top band)
            </span>
          </>
        ) : (
          <>
            <span>
              <i className="swatch" style={{ background: "rgb(232,182,76)" }} />{" "}
              divisible by 3 (top band)
            </span>
            <span>
              <i className="swatch" style={{ background: "rgb(88,160,200)" }} /> not
              divisible by 3
            </span>
          </>
        )}
      </div>

      <div className="comet-readout">
        {hover ? (
          <>
            <strong style={{ color: "var(--accent)" }}>E = {hover.E}</strong> ·{" "}
            {hover.g} Goldbach pairs · {hover.oddFactors} distinct odd prime
            factor{hover.oddFactors === 1 ? "" : "s"}
            {hover.div3 ? " · ÷3" : ""}
          </>
        ) : (
          <span className="muted">hover the plot to inspect a number…</span>
        )}
      </div>

      <div ref={wrapRef} style={{ width: "100%" }}>
        <canvas
          ref={canvasRef}
          style={{ width: width + "px", height: height + "px", display: "block" }}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
        />
      </div>

      <div className="hint">
        Each dot is one even number E: horizontal = E, vertical = how many
        Goldbach pairs it has. The dots split into <strong>bands</strong> — and
        the coloring shows why: numbers with more distinct small prime factors
        ride higher. The very top band is the multiples of 3 (switch the color
        mode to see it). Powers of 2 hug the bottom. Y-axis y-value{" "}
        <code className="kbd">g(E)</code> peaks at {maxG} in this range.
        {capped && ` (Capped at ${HARD_MAX} for speed.)`}
      </div>
    </div>
  );
}
