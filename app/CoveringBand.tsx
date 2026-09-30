"use client";

import { useMemo, useState } from "react";

/**
 * The band strategy: use the odd steps in (x/c, x]. Because no odd number in
 * that window divides another (odd multiples jump by ≥3×, which lands past x),
 * the nested-overlap trap is gone. The chance a random integer is hit then has a
 * clean closed form, independent of x:
 *
 *        budget  Σ1/n  ≈ ½ ln c
 *        coverage      ≈ 1 − 1/√c
 *
 * Slide c and watch coverage climb toward — but never reach — 100%. Reaching
 * 100% needs c → ∞, i.e. the band must stretch down to the tiny steps that
 * reintroduce the very overlaps this trick was built to avoid.
 */

const X = 1_000_000; // representative scale
const W = 620;
const H = 210;
const PAD = { l: 44, r: 14, t: 14, b: 28 };

const coverage = (c: number) => 1 - 1 / Math.sqrt(c);
const budget = (c: number) => 0.5 * Math.log(c);

// log10(c) axis from 1.5 to 10^6
const LOGC_MIN = Math.log10(1.5);
const LOGC_MAX = 6;
const sx = (logc: number) =>
  PAD.l + ((logc - LOGC_MIN) / (LOGC_MAX - LOGC_MIN)) * (W - PAD.l - PAD.r);
const sy = (p: number) => PAD.t + (1 - p) * (H - PAD.t - PAD.b);

export default function CoveringBand() {
  // slider 0..1000 → c on a log scale
  const [pos, setPos] = useState(300); // ~ c=3
  const c = useMemo(
    () => Math.pow(10, LOGC_MIN + (pos / 1000) * (LOGC_MAX - LOGC_MIN)),
    [pos]
  );

  const cov = coverage(c);
  const bud = budget(c);
  const lo = Math.round(X / c);
  const nSteps = Math.round((X - X / c) / 2);

  const curve = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const logc = LOGC_MIN + (i / 120) * (LOGC_MAX - LOGC_MIN);
      pts.push(`${sx(logc).toFixed(1)},${sy(coverage(Math.pow(10, logc))).toFixed(1)}`);
    }
    return pts.join(" ");
  }, []);

  const cx = sx(Math.log10(c));
  const cy = sy(cov);

  const presets = [
    { c: 3, label: "1/3 band" },
    { c: 9, label: "1/9" },
    { c: 100, label: "1/100" },
    { c: 10000, label: "1/10⁴" },
  ];

  return (
    <div className="explorer">
      <div className="callout">
        <span className="tag">the overlap-free band</span>
        Use the odd steps between <code className="kbd">x/c</code> and{" "}
        <code className="kbd">x</code>. None divides another, so coverage has a
        clean formula that doesn&apos;t care how big x is:
        <div
          style={{
            fontFamily: "var(--mono)",
            color: "var(--paper)",
            fontSize: 19,
            margin: "8px 0 2px",
          }}
        >
          coverage ≈ 1 − 1/√c
        </div>
      </div>

      <div className="controls">
        <div className="field">
          <label>
            band width c &nbsp;→&nbsp; steps in ( x/{c.toFixed(c < 20 ? 2 : 0)},
            &nbsp;x ]
          </label>
          <input
            type="range"
            min={0}
            max={1000}
            step={1}
            value={pos}
            onChange={(e) => setPos(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="chiprow">
        {presets.map((p) => (
          <span
            key={p.c}
            className="chip"
            onClick={() =>
              setPos(
                Math.round(
                  ((Math.log10(p.c) - LOGC_MIN) / (LOGC_MAX - LOGC_MIN)) * 1000
                )
              )
            }
          >
            {p.label}
          </span>
        ))}
      </div>

      <div className="stats">
        <div className="stat">
          <div className="k">coverage (1 − 1/√c)</div>
          <div className="v win">{(100 * cov).toFixed(2)}%</div>
        </div>
        <div className="stat">
          <div className="k">gap that remains</div>
          <div className="v bad">{(100 * (1 - cov)).toFixed(2)}%</div>
        </div>
        <div className="stat">
          <div className="k">budget Σ1/n (≈ ½ ln c)</div>
          <div className={`v ${bud >= 1 ? "win" : ""}`}>{bud.toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="k">odd steps used (at x = 10⁶)</div>
          <div className="v" style={{ fontSize: 16 }}>
            ~{nSteps.toLocaleString()}
          </div>
        </div>
      </div>

      <p className="muted" style={{ fontSize: 13, margin: "4px 0 0" }}>
        At x = 1,000,000 that&apos;s the odd numbers from{" "}
        <code className="kbd">{lo.toLocaleString()}</code> up to{" "}
        <code className="kbd">1,000,000</code>.
      </p>

      {/* coverage vs c curve */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", marginTop: 14 }}
        role="img"
        aria-label="coverage 1 - 1/sqrt(c) versus band width c"
      >
        {/* 100% line it never touches */}
        <line
          x1={PAD.l}
          y1={sy(1)}
          x2={W - PAD.r}
          y2={sy(1)}
          stroke="var(--hole)"
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <text x={W - PAD.r} y={sy(1) - 4} fill="var(--hole)" fontSize={11} textAnchor="end">
          100% — never reached
        </text>
        {/* axes */}
        {[0, 0.25, 0.5, 0.75].map((p) => (
          <g key={p}>
            <line x1={PAD.l} y1={sy(p)} x2={W - PAD.r} y2={sy(p)} stroke="var(--line)" strokeWidth={0.5} />
            <text x={PAD.l - 6} y={sy(p) + 3} fill="var(--muted)" fontSize={10} textAnchor="end">
              {p * 100}%
            </text>
          </g>
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((k) =>
          k >= LOGC_MIN ? (
            <text key={k} x={sx(k)} y={H - 8} fill="var(--muted)" fontSize={10} textAnchor="middle">
              {k === 0 ? "1" : `10${["", "¹", "²", "³", "⁴", "⁵", "⁶"][k]}`}
            </text>
          ) : null
        )}
        <text x={(PAD.l + W) / 2} y={H} fill="var(--muted)" fontSize={10} textAnchor="middle">
          band width c
        </text>
        {/* the curve */}
        <polyline points={curve} fill="none" stroke="var(--accent)" strokeWidth={2} />
        {/* current point */}
        <line x1={cx} y1={sy(0)} x2={cx} y2={cy} stroke="var(--win)" strokeWidth={1} strokeDasharray="3 3" />
        <circle cx={cx} cy={cy} r={4.5} fill="var(--win)" />
      </svg>

      <div className="callout warn">
        <span className="tag">why it can&apos;t finish</span>
        The curve rises forever but flattens against 100% — it only gets there as{" "}
        <code className="kbd">c → ∞</code>. And a bigger c means reaching down to{" "}
        <em>smaller</em> steps... all the way back to 3, 5, 7, the very numbers
        that divide each other and bring back the overlap waste this band was
        built to dodge. Clean coverage tops out; closing the last sliver drags the
        whole hard problem back in.
      </div>

      <div className="callout">
        <span className="tag">why this isn&apos;t a proof of anything</span>
        Two honest caveats sit right next to the pretty formula. First,{" "}
        <code className="kbd">1 − 1/√c</code> is an <em>average</em> over random
        starting points — it says nothing about whether some hand-picked alignment
        leaves <em>zero</em> gaps, which is what covering actually demands. Second,
        it only describes one family (steps in a single band, none dividing
        another). Real coverings roam every scale and <em>use</em> divisible steps
        on purpose — the very thing this band throws away. A clean ceiling for one
        strategy is not a limit on all of them.
      </div>

      <div className="hint">
        The magic is that x cancels: the budget over odds in (x/c, x] is{" "}
        <code className="kbd">≈ ½ ln(c)</code> no matter the scale, so coverage{" "}
        <code className="kbd">≈ 1 − e^(−½ln c) = 1 − 1/√c</code> is a pure function
        of the band <em>ratio</em>. A beautiful, exact ceiling — and still not a
        covering.
      </div>
    </div>
  );
}
