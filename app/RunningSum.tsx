"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const HARD_MAX = 1_000_000;

type Model = {
  cumP: Float64Array; // running sum of primes, indexed by n
  cumN: Float64Array; // running sum of non-primes (1 and composites), indexed by n
  lastLead: number; // largest n where the primes were still ahead (or tied)
  pAt: number; // prime total at N
  nAt: number; // non-prime total at N
};

function fmt(x: number): string {
  if (x < 1e6) return x.toLocaleString();
  return x.toExponential(3).replace("e+", " ×10^");
}

export default function RunningSum() {
  const [input, setInput] = useState(200);
  const [mode, setMode] = useState<"totals" | "share">("totals");

  const raw = Math.max(4, Math.floor(Math.abs(input) || 4));
  const max = Math.min(raw, HARD_MAX);
  const capped = raw > HARD_MAX;

  const model = useMemo<Model>(() => {
    const comp = new Uint8Array(max + 1);
    for (let i = 2; i * i <= max; i++) {
      if (!comp[i]) for (let j = i * i; j <= max; j += i) comp[j] = 1;
    }
    const isPrime = (x: number) => x >= 2 && !comp[x];

    const cumP = new Float64Array(max + 1);
    const cumN = new Float64Array(max + 1);
    let p = 0;
    let n = 0;
    let lastLead = 0;
    for (let i = 1; i <= max; i++) {
      if (isPrime(i)) p += i;
      else n += i; // 1 counts as non-prime
      cumP[i] = p;
      cumN[i] = n;
      if (p >= n) lastLead = i;
    }
    return { cumP, cumN, lastLead, pAt: cumP[max], nAt: cumN[max] };
  }, [max]);

  // Responsive width.
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(900);
  const height = 460;

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) setWidth(wrapRef.current.clientWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const [hoverN, setHoverN] = useState<number | null>(null);

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

    const padL = 66,
      padR = 16,
      padT = 16,
      padB = 34;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;
    const xFor = (i: number) => padL + (i / max) * plotW;

    const { cumP, cumN, lastLead } = model;

    // y-scale + the value we read at a given n, depend on mode.
    const shareAt = (i: number) => {
      const tot = cumP[i] + cumN[i];
      return tot === 0 ? 0 : cumP[i] / tot;
    };
    const yMax = mode === "totals" ? Math.max(1, cumN[max]) : 1;
    const yFor = (v: number) => padT + plotH - (v / yMax) * plotH;

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
      const yv = (yMax * t) / 4;
      const y = yFor(yv);
      const label = mode === "totals" ? fmt(Math.round(yv)) : yv.toFixed(2);
      ctx.fillText(label, 6, y + 3);
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
    }
    // x ticks
    ctx.fillStyle = "rgba(244,236,216,0.55)";
    for (let t = 0; t <= 5; t++) {
      const iv = Math.round((max * t) / 5);
      const x = xFor(iv);
      ctx.fillText(String(iv), x - 10, padT + plotH + 20);
    }

    // in "share" mode draw the 0.5 crossover baseline
    if (mode === "share") {
      const y = yFor(0.5);
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(244,236,216,0.5)";
      ctx.fillText("half", padL + plotW - 30, y - 5);
    }

    // sample one point per horizontal pixel for speed
    const cols = Math.min(max, Math.floor(plotW));
    const drawLine = (
      valAt: (i: number) => number,
      color: string,
      w = 2
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = w;
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const i = Math.max(1, Math.round((c / cols) * max));
        const x = xFor(i);
        const y = yFor(valAt(i));
        if (c === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    if (mode === "totals") {
      drawLine((i) => cumN[i], "#5aa0c8"); // non-primes, blue
      drawLine((i) => cumP[i], "var(--accent)"); // primes, gold
    } else {
      drawLine((i) => shareAt(i), "var(--accent)");
    }

    // crossover marker — the last moment primes were ahead
    if (lastLead >= 1 && lastLead < max) {
      const x = xFor(lastLead);
      ctx.strokeStyle = "rgba(230,110,70,0.9)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(230,110,70,0.95)";
      ctx.fillText(`n=${lastLead}`, x + 4, padT + 12);
    }

    // hover marker
    if (hoverN != null) {
      const x = xFor(hoverN);
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();
    }
  }, [model, width, max, mode, hoverN]);

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const padL = 66,
      padR = 16;
    const plotW = width - padL - padR;
    const i = Math.round(((px - padL) / plotW) * max);
    setHoverN(Math.max(1, Math.min(max, i)));
  };

  const presets = [50, 200, 1000, 10000, 100000];

  const hp = hoverN != null ? model.cumP[hoverN] : model.pAt;
  const hn = hoverN != null ? model.cumN[hoverN] : model.nAt;
  const hAt = hoverN != null ? hoverN : max;
  const total = hp + hn;
  const share = total === 0 ? 0 : hp / total;
  const ahead = hp > hn ? "primes" : hp < hn ? "non-primes" : "tied";

  return (
    <div className="explorer">
      <div className="controls">
        <div className="field">
          <label>Walk up to n</label>
          <input
            type="number"
            step={10}
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>drag n &nbsp;({max.toLocaleString()})</label>
          <input
            type="range"
            min={4}
            max={HARD_MAX}
            step={4}
            value={Math.min(Math.max(input, 4), HARD_MAX)}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>view</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "totals" | "share")}
            style={{
              background: "#201a10",
              color: "var(--paper)",
              border: "1px solid var(--accent-dim)",
              borderRadius: 6,
              padding: "8px 10px",
              fontFamily: "var(--mono)",
            }}
          >
            <option value="totals">both running totals</option>
            <option value="share">prime share of the total</option>
          </select>
        </div>
      </div>

      <div className="chiprow">
        {presets.map((p) => (
          <span key={p} className="chip" onClick={() => setInput(p)}>
            up to {p.toLocaleString()}
          </span>
        ))}
      </div>

      <div className="legend" style={{ marginTop: 16 }}>
        {mode === "totals" ? (
          <>
            <span>
              <i className="swatch" style={{ background: "var(--accent)" }} />{" "}
              Σ primes
            </span>
            <span>
              <i className="swatch" style={{ background: "#5aa0c8" }} /> Σ
              non-primes (1 &amp; composites)
            </span>
          </>
        ) : (
          <span>
            <i className="swatch" style={{ background: "var(--accent)" }} /> prime
            share = Σprimes ÷ (Σprimes + Σnon-primes)
          </span>
        )}
        <span>
          <i className="swatch" style={{ background: "rgb(230,110,70)" }} /> last
          point primes led
        </span>
      </div>

      <div className="comet-readout">
        <strong style={{ color: "var(--accent)" }}>n = {hAt.toLocaleString()}</strong>{" "}
        · Σprimes = {fmt(hp)} · Σnon-primes = {fmt(hn)} · prime share ={" "}
        {(share * 100).toFixed(2)}% ·{" "}
        <span
          style={{
            color: ahead === "primes" ? "var(--accent)" : "#5aa0c8",
          }}
        >
          {ahead} ahead
        </span>
        {hoverN == null && (
          <span className="muted"> &nbsp;(hover the plot to inspect any n)</span>
        )}
      </div>

      <div ref={wrapRef} style={{ width: "100%" }}>
        <canvas
          ref={canvasRef}
          style={{ width: width + "px", height: height + "px", display: "block" }}
          onMouseMove={onMove}
          onMouseLeave={() => setHoverN(null)}
        />
      </div>

      <div className="hint">
        Walk the whole numbers 1, 2, 3, … and keep two piggy banks: every time you
        hit a <strong>prime</strong> you add it to the gold total, every time you
        hit a <strong>non-prime</strong> (1 and the composites) you add it to the
        blue total. For the first few steps the primes actually lead — 2, 3, 5, 7
        arrive fast and there aren&apos;t many composites yet. But primes thin out
        (the count below <code className="kbd">n</code> grows like{" "}
        <code className="kbd">n/ln n</code>), so the blue total pulls ahead and{" "}
        <strong>never gives the lead back</strong>. The red line marks the last
        moment the primes were ahead: <strong>n = {model.lastLead}</strong> in
        this range. Switch to <em>prime share</em> to watch that fraction fall
        toward zero like <code className="kbd">1 / ln n</code> — the running sum
        of the primes becomes a vanishing sliver of everything.
        {capped && ` (Capped at ${HARD_MAX.toLocaleString()} for speed.)`}
      </div>
    </div>
  );
}
