"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function PrimeGraph() {
  const [input, setInput] = useState(400000);
  const [mode, setMode] = useState<"spiral" | "grid">("spiral");

  // Debounce the heavy value so dragging the slider doesn't recompute a
  // 10-million sieve on every tick — only after a short pause.
  const [committed, setCommitted] = useState(input);
  useEffect(() => {
    const t = setTimeout(() => setCommitted(input), 180);
    return () => clearTimeout(t);
  }, [input]);

  const HARD_MAX = 10000000;
  const raw = Math.max(4, Math.floor(Math.abs(committed) || 4));
  const N = Math.min(raw, HARD_MAX);
  const capped = raw > HARD_MAX;

  // Sieve once per N.
  const { sieve, piN } = useMemo(() => {
    const comp = new Uint8Array(N + 1);
    for (let i = 2; i * i <= N; i++) {
      if (!comp[i]) for (let j = i * i; j <= N; j += i) comp[j] = 1;
    }
    let count = 0;
    for (let i = 2; i <= N; i++) if (!comp[i]) count++;
    return { sieve: comp, piN: count };
  }, [N]);

  // Responsive square canvas.
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [side, setSide] = useState(640);

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) {
        const w = wrapRef.current.clientWidth;
        setSide(Math.max(280, Math.min(w, 720)));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    // Cells across the picture. Give the backing buffer ~1 pixel per cell so
    // even a 10-million spiral keeps its structure, capped to bound memory.
    const spanCells =
      mode === "spiral" ? Math.ceil(Math.sqrt(N)) + 1 : Math.ceil(Math.sqrt(N));
    const res = Math.min(3000, Math.max(Math.round(side * dpr), spanCells));
    canvas.width = res;
    canvas.height = res;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#14100a";
    ctx.fillRect(0, 0, res, res);

    const isPrime = (x: number) => x >= 2 && !sieve[x];

    if (mode === "spiral") {
      // Ulam spiral: 1 at center, wind counter-clockwise.
      const span = spanCells;
      const cell = res / span;
      const cx = res / 2;
      const cy = res / 2;
      const r = Math.max(0.5, cell * 0.4);

      let x = 0,
        y = 0,
        dx = 1,
        dy = 0,
        segLen = 1,
        segPassed = 0,
        turns = 0;
      ctx.fillStyle = "rgba(232,182,76,0.95)";
      for (let n = 1; n <= N; n++) {
        if (isPrime(n)) {
          const px = cx + x * cell;
          const py = cy - y * cell;
          ctx.fillRect(px - r, py - r, r * 2, r * 2);
        }
        // advance one step along the spiral
        x += dx;
        y += dy;
        segPassed++;
        if (segPassed === segLen) {
          segPassed = 0;
          const ndx = -dy,
            ndy = dx; // turn left
          dx = ndx;
          dy = ndy;
          turns++;
          if (turns % 2 === 0) segLen++;
        }
      }
    } else {
      // Plain grid: numbers laid left→right, top→bottom.
      const cols = spanCells;
      const cell = res / cols;
      const r = Math.max(0.5, cell * 0.4);
      ctx.fillStyle = "rgba(232,182,76,0.95)";
      for (let n = 2; n <= N; n++) {
        if (!sieve[n]) {
          const col = (n - 1) % cols;
          const row = Math.floor((n - 1) / cols);
          const px = col * cell + cell / 2;
          const py = row * cell + cell / 2;
          ctx.fillRect(px - r, py - r, r * 2, r * 2);
        }
      }
    }
  }, [sieve, N, side, mode]);

  const presets = [10000, 100000, 500000, 1000000, 5000000, 10000000];

  return (
    <div className="explorer">
      <div className="controls">
        <div className="field">
          <label>Primes from 1 up to</label>
          <input
            type="number"
            step={100}
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>drag N &nbsp;({N.toLocaleString()})</label>
          <input
            type="range"
            min={100}
            max={HARD_MAX}
            step={1000}
            value={Math.min(Math.max(input, 100), HARD_MAX)}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>layout</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as "spiral" | "grid")}
            style={{
              background: "#201a10",
              color: "var(--paper)",
              border: "1px solid var(--accent-dim)",
              borderRadius: 6,
              padding: "8px 10px",
              fontFamily: "var(--mono)",
            }}
          >
            <option value="spiral">Ulam spiral</option>
            <option value="grid">square grid</option>
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

      <div className="stats" style={{ marginTop: 16 }}>
        <div className="stat">
          <div className="k">range</div>
          <div className="v">1 … {N.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="k">primes found π(N)</div>
          <div className="v win">{piN.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="k">prime density</div>
          <div className="v">{((100 * piN) / N).toFixed(1)}%</div>
        </div>
      </div>

      <div ref={wrapRef} style={{ width: "100%", marginTop: 16 }}>
        <canvas
          ref={canvasRef}
          style={{
            width: side + "px",
            height: side + "px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>

      <div className="hint">
        Each gold dot is a prime.{" "}
        {mode === "spiral" ? (
          <>
            In the <strong>Ulam spiral</strong> the integers wind out from the
            center (1 in the middle, counter-clockwise). Primes mysteriously line
            up along <em>diagonal</em> streaks — those are quadratic polynomials
            like <code className="kbd">4n² + n + 41</code> that happen to be
            prime-rich. Nobody fully explains the diagonals; that&apos;s the
            famous surprise.
          </>
        ) : (
          <>
            In the <strong>square grid</strong> the numbers run left-to-right, top
            to bottom. Vertical gaps appear at columns that are always even or
            always multiples of 3 — the sieve made visible.
          </>
        )}{" "}
        As N grows the primes visibly thin out — density drops toward{" "}
        <code className="kbd">1 / ln N</code>.
        {capped && ` (Capped at ${HARD_MAX.toLocaleString()} for speed.)`}
      </div>
    </div>
  );
}
