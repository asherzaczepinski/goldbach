"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * The "luck number": how far do you have to check before the probability that
 * a Goldbach counterexample exists beyond that point is negligible?
 *   P(fail)(N) = (1 − 1/lnN)^π(N/3)              — chance THIS N has no pair
 *   T(X)       = Σ_{even N > X} P(fail)(N)         — expected counterexamples left
 *   P(nothing beyond X) ≈ e^(−T(X))               — confidence it's all clear
 * Solve e^(−T(X)) = confidence  ⇒  T(X) = −ln(confidence).
 */
const LEVELS = [
  { label: "90%", tau: -Math.log(0.9) },
  { label: "99%", tau: -Math.log(0.99) },
  { label: "99.9%", tau: -Math.log(0.999) },
  { label: "99.9999%", tau: -Math.log(0.999999) },
];

export default function WillItBreak() {
  const [input, setInput] = useState(200000);
  const HARD_MAX = 400000;
  const maxN = Math.min(HARD_MAX, Math.max(4000, Math.floor(Math.abs(input) || 4000)));

  const { pts, total, thresholds, luckNumber } = useMemo(() => {
    const comp = new Uint8Array(maxN + 1);
    for (let i = 2; i * i <= maxN; i++)
      if (!comp[i]) for (let j = i * i; j <= maxN; j += i) comp[j] = 1;
    const pi = new Int32Array(maxN + 1);
    for (let i = 1; i <= maxN; i++) pi[i] = pi[i - 1] + (i >= 2 && !comp[i] ? 1 : 0);

    const Ns: number[] = [];
    const cum: number[] = [];
    let run = 0;
    for (let N = 6; N <= maxN; N += 2) {
      const C = pi[Math.floor(N / 3)];
      const w = 1 / Math.log(N);
      run += C > 0 ? Math.exp(C * Math.log(1 - w)) : 1;
      Ns.push(N);
      cum.push(run);
    }
    const total = run;
    // tail beyond N_i  =  total − cum_i
    const findX = (tau: number) => {
      for (let i = 0; i < Ns.length; i++) if (total - cum[i] < tau) return Ns[i];
      return maxN;
    };
    const thresholds = LEVELS.map((L) => ({ ...L, N: findX(L.tau) }));
    const luckNumber = thresholds.find((t) => t.label === "99.9%")?.N ?? maxN;

    const SAMP = 200;
    const pts: { N: number; cum: number }[] = [];
    for (let s = 1; s <= SAMP; s++) {
      const idx = Math.min(Ns.length - 1, Math.floor((Ns.length * s) / SAMP));
      pts.push({ N: Ns[idx], cum: cum[idx] });
    }
    return { pts, total, thresholds, luckNumber };
  }, [maxN]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [width, setWidth] = useState(860);
  const height = 280;
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
    const padL = 44,
      padR = 16,
      padT = 16,
      padB = 30;
    const pw = width - padL - padR;
    const ph = height - padT - padB;
    const maxY = Math.max(0.2, Math.max(...pts.map((p) => p.cum)) * 1.1);
    const xFor = (N: number) => padL + (N / maxN) * pw;
    const yFor = (v: number) => padT + ph - (v / maxY) * ph;
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + ph);
    ctx.lineTo(padL + pw, padT + ph);
    ctx.stroke();
    ctx.font = "11px ui-monospace, monospace";
    ctx.fillStyle = "rgba(244,236,216,0.6)";
    for (let t = 0; t <= 4; t++) {
      const v = (maxY * t) / 4;
      const y = yFor(v);
      ctx.fillText(v.toFixed(2), 4, y + 3);
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + pw, y);
      ctx.stroke();
    }
    for (let t = 0; t <= 5; t++) {
      const N = Math.round((maxN * t) / 5);
      ctx.fillText(String(N), xFor(N) - 12, padT + ph + 18);
    }
    // luck-number marker
    ctx.strokeStyle = "rgba(88,230,217,0.8)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(xFor(luckNumber), padT);
    ctx.lineTo(xFor(luckNumber), padT + ph);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(88,230,217,0.95)";
    ctx.fillText("99.9% clear ≈ " + luckNumber.toLocaleString(), xFor(luckNumber) + 6, padT + 12);
    // cumulative curve
    ctx.strokeStyle = "rgba(240,196,86,0.95)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    pts.forEach((p, i) => {
      const x = xFor(p.N),
        y = yFor(p.cum);
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    });
    ctx.stroke();
  }, [pts, width, maxN, luckNumber]);

  const presets = [40000, 100000, 250000, 400000];

  return (
    <div className="explorer">
      <div className="controls">
        <div className="field">
          <label>Compute using evens up to</label>
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
            min={4000}
            max={HARD_MAX}
            step={1000}
            value={Math.min(Math.max(input, 4000), HARD_MAX)}
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

      <div className="callout good" style={{ marginTop: 14 }}>
        <span className="tag">the luck number</span>
        Check every even number up to about{" "}
        <strong style={{ fontSize: 20 }}>{luckNumber.toLocaleString()}</strong> and
        you&apos;re already <strong>99.9%</strong> likely that <em>no</em>{" "}
        counterexample exists anywhere above it. That&apos;s the number you asked
        for.
      </div>

      {/* confidence -> how far table */}
      <div className="ptable-scroll" style={{ maxWidth: 460, marginTop: 6 }}>
        <table className="ptable">
          <thead>
            <tr>
              <th>to be this sure nothing&apos;s out there…</th>
              <th>…check up to about</th>
            </tr>
          </thead>
          <tbody>
            {thresholds.map((t) => (
              <tr key={t.label}>
                <td className="cell-good">{t.label}</td>
                <td style={{ fontFamily: "var(--mono)" }}>{t.N.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted" style={{ margin: "20px 0 4px", fontSize: 14 }}>
        Why so small? The cumulative expected counterexamples climb at the very
        start, then <strong>flatline</strong> — each new even number adds almost
        nothing:
      </p>
      <div ref={wrapRef} style={{ width: "100%" }}>
        <canvas ref={canvasRef} style={{ width: width + "px", height: height + "px", display: "block" }} />
      </div>

      <div className="hint">
        Reading it: the running total climbs to{" "}
        <code className="kbd">≈ {total.toFixed(1)}</code> then stops. Almost all of
        that comes from the <em>first few</em> even numbers, where this crude
        estimate is loose — and those are directly checked by hand and all hold. The
        honest quantity is the <strong>tail past the luck number</strong>, which is
        already under <code className="kbd">0.001</code> and keeps collapsing toward
        zero, so a counterexample is never statistically &ldquo;due.&rdquo; The wild
        part: a few thousand checks make you near-certain, yet computers have
        verified Goldbach to <strong>4×10¹⁸</strong> — astronomically past the luck
        number — and found nothing, exactly as predicted. (Still a heuristic, not a
        proof — being 99.9999% sure isn&apos;t certain, which is why it stays open.)
      </div>
    </div>
  );
}
