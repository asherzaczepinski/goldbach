"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Your algorithm, drawn as it grows:
 *   candidates C(N)  = primes p up to N/3 (your cap) — the pairs to try
 *   w(N)             = chance one pair works = N−p prime ≈ 1 / ln N
 *   P(fails)         = (1 − w)^C            — every pair misses
 *   P(works)         = 1 − (1 − w)^C        — at least one lands  → Goldbach
 */
export default function PairChance() {
  const [input, setInput] = useState(100000);
  const HARD_MAX = 300000;
  const maxN = Math.min(HARD_MAX, Math.max(2000, Math.floor(Math.abs(input) || 2000)));

  const { pts, atMax } = useMemo(() => {
    const comp = new Uint8Array(maxN + 1);
    for (let i = 2; i * i <= maxN; i++)
      if (!comp[i]) for (let j = i * i; j <= maxN; j += i) comp[j] = 1;
    const isP = (x: number) => x >= 2 && !comp[x];
    // prefix count of primes for π(x)
    const pi = new Int32Array(maxN + 1);
    for (let i = 1; i <= maxN; i++) pi[i] = pi[i - 1] + (isP(i) ? 1 : 0);

    const actualG = (N: number) => {
      let g = 0;
      for (let p = 3; p <= N / 2; p++) if (isP(p) && isP(N - p)) g++;
      return g;
    };

    const SAMPLES = 160;
    const pts: {
      N: number;
      C: number;
      w: number;
      pairs: number;
      actual: number;
      pWork: number;
      pFailLog10: number;
    }[] = [];
    for (let s = 1; s <= SAMPLES; s++) {
      let N = Math.round((maxN * s) / SAMPLES);
      if (N % 2 !== 0) N++;
      if (N < 6) continue;
      const C = pi[Math.floor(N / 3)]; // your n/3 cap
      const w = 1 / Math.log(N); // chance one pair works ≈ 1/ln N
      const pairs = C * w; // expected working pairs
      const lnFail = C * Math.log(1 - w); // ln P(fails)
      const pWork = 1 - Math.exp(lnFail);
      const pFailLog10 = -lnFail / Math.log(10); // P(fails) ≈ 10^(−this)
      pts.push({ N, C, w, pairs, actual: actualG(N), pWork, pFailLog10 });
    }
    return { pts, atMax: pts[pts.length - 1] };
  }, [maxN]);

  // canvas
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(860);
  const height = 340;
  useEffect(() => {
    const m = () => wrapRef.current && setWidth(wrapRef.current.clientWidth);
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = width * dpr;
    cv.height = height * dpr;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const padL = 52,
      padR = 52,
      padT = 18,
      padB = 34;
    const pw = width - padL - padR;
    const ph = height - padT - padB;
    const maxPairs = Math.max(...pts.map((p) => Math.max(p.pairs, p.actual)), 1);
    const xFor = (N: number) => padL + (N / maxN) * pw;
    const yPairs = (v: number) => padT + ph - (v / maxPairs) * ph;
    const yPct = (v: number) => padT + ph - v * ph; // 0..1

    // axes
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + ph);
    ctx.lineTo(padL + pw, padT + ph);
    ctx.stroke();
    ctx.font = "11px ui-monospace, monospace";

    // left ticks (pairs)
    ctx.fillStyle = "rgba(240,196,86,0.9)";
    for (let t = 0; t <= 4; t++) {
      const v = Math.round((maxPairs * t) / 4);
      const y = yPairs(v);
      ctx.fillText(String(v), 6, y + 3);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + pw, y);
      ctx.stroke();
    }
    // right ticks (probability %)
    ctx.fillStyle = "rgba(120,220,210,0.95)";
    for (let t = 0; t <= 4; t++) {
      const y = yPct(t / 4);
      ctx.fillText(t * 25 + "%", padL + pw + 8, y + 3);
    }
    // x ticks
    ctx.fillStyle = "rgba(244,236,216,0.55)";
    for (let t = 0; t <= 5; t++) {
      const N = Math.round((maxN * t) / 5);
      ctx.fillText(String(N), xFor(N) - 12, padT + ph + 20);
    }

    const line = (
      getY: (p: (typeof pts)[number]) => number,
      color: string,
      dash: number[] = []
    ) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash(dash);
      ctx.beginPath();
      pts.forEach((p, i) => {
        const x = xFor(p.N);
        const y = getY(p);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    };

    // P(works) — cyan, pinned near 100%
    line((p) => yPct(p.pWork), "rgba(88,230,217,0.95)");
    // expected pairs — gold
    line((p) => yPairs(p.pairs), "rgba(240,196,86,0.95)");
    // actual pairs — dashed gold
    line((p) => yPairs(p.actual), "rgba(240,196,86,0.55)", [5, 4]);
  }, [pts, width, maxN]);

  const presets = [20000, 60000, 150000, 300000];

  return (
    <div className="explorer">
      <div className="controls">
        <div className="field">
          <label>Grow N up to</label>
          <input
            type="number"
            step={1000}
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>drag &nbsp;({maxN.toLocaleString()})</label>
          <input
            type="range"
            min={2000}
            max={HARD_MAX}
            step={1000}
            value={Math.min(Math.max(input, 2000), HARD_MAX)}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="chiprow">
        {presets.map((p) => (
          <span key={p} className="chip" onClick={() => setInput(p)}>
            up to {p.toLocaleString()}
          </span>
        ))}
      </div>

      <div className="legend" style={{ marginTop: 14 }}>
        <span>
          <i className="swatch" style={{ background: "rgb(240,196,86)" }} /> expected
          working pairs (C·w)
        </span>
        <span>
          <i className="swatch" style={{ background: "rgba(240,196,86,0.55)" }} />{" "}
          actual Goldbach pairs
        </span>
        <span>
          <i className="swatch" style={{ background: "rgb(88,230,217)" }} /> chance it
          works = 1 − (1−w)^C
        </span>
      </div>

      <div ref={wrapRef} style={{ width: "100%", marginTop: 12 }}>
        <canvas
          ref={canvasRef}
          style={{ width: width + "px", height: height + "px", display: "block" }}
        />
      </div>

      {atMax && (
        <div className="stats" style={{ marginTop: 16 }}>
          <div className="stat">
            <div className="k">candidates C = π(N/3)</div>
            <div className="v">{atMax.C.toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="k">one pair works, w ≈ 1/ln N</div>
            <div className="v">{(100 * atMax.w).toFixed(1)}%</div>
          </div>
          <div className="stat">
            <div className="k">expected pairs C·w</div>
            <div className="v win">{Math.round(atMax.pairs).toLocaleString()}</div>
          </div>
          <div className="stat">
            <div className="k">chance it works</div>
            <div className="v win">
              {atMax.pWork > 0.999999 ? "99.9999…%" : (100 * atMax.pWork).toFixed(4) + "%"}
            </div>
          </div>
          <div className="stat">
            <div className="k">chance it fails (1−w)^C</div>
            <div className="v bad">
              1 in 10^{Math.round(atMax.pFailLog10).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <div className="hint">
        Your algorithm, growing: there are{" "}
        <code className="kbd">C = π(N/3)</code> candidate pairs, each works with{" "}
        <code className="kbd">w ≈ 1/ln N</code>. The chance <em>all</em> miss is{" "}
        <code className="kbd">(1−w)^C</code>, so the chance at least one lands is{" "}
        <code className="kbd">1 − (1−w)^C</code>. The gold line (pairs) climbs; the
        cyan line (chance it works) slams into ~100% almost immediately and never
        leaves — and the failure odds fall to{" "}
        <strong>1 in 10^{atMax ? Math.round(atMax.pFailLog10).toLocaleString() : "…"}</strong>
        . Not luck — an avalanche.
      </div>
    </div>
  );
}
