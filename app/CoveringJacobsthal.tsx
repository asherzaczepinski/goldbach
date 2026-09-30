"use client";

import { useMemo, useState } from "react";

/**
 * Where the covering doodle actually leads: sieve the odd numbers in (x/3, x] by
 * every odd divisor up to √x. Any survivor is PRIME (a composite ≤ x has a prime
 * factor ≤ √x, which the sieve removes). So "is there a survivor?" = "is there a
 * prime in (x/3, x]?".
 *
 * A survivor is guaranteed whenever the interval is longer than the biggest gap
 * between integers coprime to P(√x) = ∏_{p≤√x} p — the Jacobsthal function
 * j(P(√x)). So the whole idea reduces to the inequality
 *
 *        j(P(√x))  <  2x/3.
 *
 * Verified values (k≤8 computed directly; the rest are OEIS A048670, matching the
 * computed prefix exactly). The margin 2x/3 ÷ j keeps GROWING — the sieve never
 * comes close to covering the interval — yet this is NOT a new proof: the
 * conclusion already follows from Bertrand's postulate (Erdős's elementary
 * proof), and bounding j better than ≈ y² is itself open.
 */

// { y = largest prime used, j = j(primorial up to y) }  — A048670
const DATA: { y: number; j: number }[] = [
  { y: 2, j: 2 }, { y: 3, j: 4 }, { y: 5, j: 6 }, { y: 7, j: 10 },
  { y: 11, j: 14 }, { y: 13, j: 22 }, { y: 17, j: 26 }, { y: 19, j: 34 },
  { y: 23, j: 40 }, { y: 29, j: 46 }, { y: 31, j: 58 }, { y: 37, j: 66 },
  { y: 41, j: 74 }, { y: 43, j: 90 }, { y: 47, j: 100 }, { y: 53, j: 106 },
  { y: 59, j: 118 }, { y: 61, j: 132 }, { y: 67, j: 152 }, { y: 71, j: 174 },
  { y: 73, j: 190 }, { y: 79, j: 200 }, { y: 83, j: 216 }, { y: 89, j: 234 },
  { y: 97, j: 258 },
];

const ROWS = DATA.map((d) => {
  const x = d.y * d.y; // x = y², so √x = y
  const need = (2 * x) / 3; // interval (x/3, x] length
  return { ...d, x, need, margin: need / d.j };
});

const W = 640;
const H = 260;
const PAD = { l: 46, r: 16, t: 16, b: 34 };
const maxMargin = Math.ceil(Math.max(...ROWS.map((r) => r.margin)));
const maxY = ROWS[ROWS.length - 1].y;
const px = (y: number) => PAD.l + (y / maxY) * (W - PAD.l - PAD.r);
const py = (m: number) => PAD.t + (1 - m / maxMargin) * (H - PAD.t - PAD.b);

export default function CoveringJacobsthal() {
  const [sel, setSel] = useState(ROWS.length - 1);
  const r = ROWS[sel];

  const line = useMemo(
    () => ROWS.map((d) => `${px(d.y).toFixed(1)},${py(d.margin).toFixed(1)}`).join(" "),
    []
  );

  return (
    <div className="explorer">
      <div className="callout">
        <span className="tag">the reduction, in one line</span>
        Sieve the odds in <code className="kbd">(x/3, x]</code> by every prime up
        to <code className="kbd">√x</code>. Every survivor is <strong>prime</strong>
        , so a prime is guaranteed the moment the interval outruns the largest gap
        between survivors — the Jacobsthal number{" "}
        <code className="kbd">j(P(√x))</code>. The entire idea becomes one
        inequality:
        <div
          style={{
            fontFamily: "var(--mono)",
            color: "var(--paper)",
            fontSize: 20,
            margin: "8px 0 2px",
            textAlign: "center",
          }}
        >
          j(P(√x)) &lt; 2x⁄3 ?
        </div>
      </div>

      {/* margin curve */}
      <p className="muted" style={{ fontSize: 14, margin: "6px 0" }}>
        Safety margin = (interval length <code className="kbd">2x/3</code>) ÷ (max
        survivor gap <code className="kbd">j</code>). Above 1 means a prime is
        forced. Click a point.
      </p>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }} role="img"
        aria-label="Jacobsthal safety margin versus largest prime used">
        {/* margin = 1 danger line */}
        <line x1={PAD.l} y1={py(1)} x2={W - PAD.r} y2={py(1)} stroke="var(--hole)" strokeDasharray="4 4" strokeWidth={1} />
        <text x={PAD.l + 4} y={py(1) - 4} fill="var(--hole)" fontSize={11}>margin = 1 (break-even)</text>
        {/* gridlines */}
        {[5, 10, 15, 20].map((m) => (
          <g key={m}>
            <line x1={PAD.l} y1={py(m)} x2={W - PAD.r} y2={py(m)} stroke="var(--line)" strokeWidth={0.5} />
            <text x={PAD.l - 6} y={py(m) + 3} fill="var(--muted)" fontSize={10} textAnchor="end">{m}×</text>
          </g>
        ))}
        {[3, 11, 23, 41, 59, 79, 97].map((yy) => (
          <text key={yy} x={px(yy)} y={H - 10} fill="var(--muted)" fontSize={10} textAnchor="middle">{yy}</text>
        ))}
        <text x={(PAD.l + W) / 2} y={H - 1} fill="var(--muted)" fontSize={10} textAnchor="middle">largest prime √x</text>
        <polyline points={line} fill="none" stroke="var(--accent)" strokeWidth={2} />
        {ROWS.map((d, i) => (
          <circle key={d.y} cx={px(d.y)} cy={py(d.margin)} r={i === sel ? 5 : 2.5}
            fill={i === sel ? "var(--win)" : "var(--accent)"} style={{ cursor: "pointer" }}
            onClick={() => setSel(i)} />
        ))}
      </svg>

      <div className="stats">
        <div className="stat">
          <div className="k">largest prime √x</div>
          <div className="v">{r.y}</div>
        </div>
        <div className="stat">
          <div className="k">interval (x/3, x] length</div>
          <div className="v">{r.need.toFixed(0)}</div>
        </div>
        <div className="stat">
          <div className="k">max survivor gap j</div>
          <div className="v">{r.j}</div>
        </div>
        <div className="stat">
          <div className="k">safety margin</div>
          <div className="v win">{r.margin.toFixed(1)}×</div>
        </div>
      </div>

      <div className="callout good">
        <span className="tag">your intuition, confirmed</span>
        The margin doesn&apos;t just stay above 1 — it <strong>keeps growing</strong>
        , from ~1.3× at the start to ~{maxMargin.toFixed(0)}× by √x = {maxY}. The
        overlap of small-prime multiples really does keep survivors packed far
        tighter than the interval is wide, exactly as you pictured. There is always
        a prime in (x/3, x], with room to spare.
      </div>

      <div className="callout warn">
        <span className="tag">and yet — still not a new proof</span>
        Two walls. <strong>One:</strong> the conclusion already falls out of{" "}
        <em>Bertrand&apos;s postulate</em> (a prime in (x/2, x)), which Erdős proved
        elementarily in 1932 — so the destination isn&apos;t new.{" "}
        <strong>Two:</strong> the growing margin above is <em>measured</em>, not
        proven. The best proven bound on <code className="kbd">j(P(√x))</code> is
        about <code className="kbd">x</code> itself — the same size as{" "}
        <code className="kbd">2x/3</code> — with no controlled constant below 2/3.
        Turning that 20× empirical cushion into a theorem <em>is</em> the open
        Jacobsthal problem. The idea is real; the last step is a genuine research
        frontier, not a missing trick.
      </div>

      <div className="hint">
        Data: Jacobsthal values of the primorials (OEIS A048670); the first eight
        were recomputed here directly and match. The honest lineage your doodle
        walked: wheel sieve → reduced residues → Jacobsthal&apos;s function →
        primes in intervals.
      </div>
    </div>
  );
}
