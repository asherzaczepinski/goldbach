"use client";

import { useMemo, useState } from "react";

/**
 * "Keep adding odd stamps and watch the gaps stall."
 *
 * You pick which odd steps (3,5,7,9,…) to include. For each one we greedily
 * choose the residue that covers the most still-uncovered integers, then measure
 * how much of the number line is left uncovered. Coverage is measured on the
 * first W integers (a sample window) because the true period lcm(steps) explodes
 * past what any screen could hold — but the density it reports is exact to well
 * within a tenth of a percent.
 *
 * The lesson: the "budget" Σ1/n sails past 1 early, yet gaps refuse to vanish —
 * overlaps (Chinese Remainder Theorem) eat most of every new stamp. Whether the
 * gaps can EVER reach 0 with odd distinct steps is the open Erdős–Selfridge
 * problem.
 */

const W = 120_000; // sample window
const CANDIDATES = [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 45, 49];
const STRIP = 231; // preview cells (first 231 integers)

// lcm as a decimal string via BigInt (the true period; usually astronomically large)
function bgcd(a: bigint, b: bigint): bigint {
  while (b) [a, b] = [b, a % b];
  return a < 0n ? -a : a;
}
function lcmStr(steps: number[]): string {
  let l = 1n;
  for (const s of steps) l = (l / bgcd(l, BigInt(s))) * BigInt(s);
  const str = l.toString();
  if (str.length <= 9) return Number(str).toLocaleString();
  return `${str[0]}.${str.slice(1, 3)} × 10^${str.length - 1}`;
}

function greedy(steps: number[]) {
  const sorted = [...steps].sort((a, b) => a - b);
  const covered = new Uint8Array(W);
  const strip = new Uint8Array(STRIP);
  const progression: { step: number; uncoveredPct: number; recip: number }[] = [];
  let recip = 0;
  for (const m of sorted) {
    const counts = new Int32Array(m);
    for (let x = 0; x < W; x++) if (!covered[x]) counts[x % m]++;
    let best = 0;
    for (let r = 1; r < m; r++) if (counts[r] > counts[best]) best = r;
    for (let x = best; x < W; x += m) covered[x] = 1;
    for (let x = best % m; x < STRIP; x += m) strip[x] = 1;
    recip += 1 / m;
    let cov = 0;
    for (let x = 0; x < W; x++) cov += covered[x];
    progression.push({ step: m, uncoveredPct: 100 * (1 - cov / W), recip });
  }
  return { progression, strip, sorted };
}

export default function CoveringGrowth() {
  const [chosen, setChosen] = useState<number[]>([3, 5, 7, 9, 11]);

  const { progression, strip, sorted } = useMemo(
    () => greedy(chosen.length ? chosen : [3]),
    [chosen]
  );
  const last = progression[progression.length - 1];
  const uncovered = last?.uncoveredPct ?? 100;
  const covered = 100 - uncovered;
  const budget = last?.recip ?? 0;
  const period = lcmStr(sorted);

  const toggle = (n: number) =>
    setChosen((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  return (
    <div className="explorer">
      <div className="callout">
        <span className="tag">add your own stamps</span>
        Turn odd steps on and off. Each one greedily grabs the most numbers it can,
        and the readout tracks how much of the number line is still uncovered.
        Watch the <strong>budget</strong> <code className="kbd">Σ1/n</code> shoot
        past 1 while the gaps stubbornly refuse to close — that stall is the whole
        difficulty.
      </div>

      <div className="chiprow" style={{ marginTop: 4 }}>
        {CANDIDATES.map((n) => {
          const on = chosen.includes(n);
          return (
            <span
              key={n}
              className="chip"
              onClick={() => toggle(n)}
              style={
                on
                  ? {
                      background: "var(--accent)",
                      color: "#1a1a1a",
                      borderColor: "var(--accent)",
                      fontWeight: 700,
                    }
                  : undefined
              }
            >
              {n}
            </span>
          );
        })}
      </div>

      <div className="stats" style={{ marginTop: 14 }}>
        <div className="stat">
          <div className="k">covered</div>
          <div className="v win">{covered.toFixed(2)}%</div>
        </div>
        <div className="stat">
          <div className="k">still uncovered</div>
          <div className="v bad">{uncovered.toFixed(2)}%</div>
        </div>
        <div className="stat">
          <div className="k">budget Σ1/n {budget >= 1 ? "(past 1!)" : "(need ≥ 1)"}</div>
          <div className={`v ${budget >= 1 ? "win" : ""}`}>{budget.toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="k">true period (lcm)</div>
          <div className="v" style={{ fontSize: 15 }}>{period}</div>
        </div>
      </div>

      {budget >= 1 && uncovered > 0.5 && (
        <div className="callout warn" style={{ marginTop: 6 }}>
          <span className="tag">the paradox, live</span>
          Your budget is <strong>{budget.toFixed(2)}</strong> — more than the{" "}
          <code className="kbd">1.0</code> you&apos;d think you need — yet{" "}
          <strong>{uncovered.toFixed(1)}%</strong> of numbers are still uncovered.
          The overlaps between odd steps are swallowing the surplus.
        </div>
      )}

      {/* progression: uncovered % after each added stamp */}
      <p className="muted" style={{ fontSize: 14, margin: "16px 0 6px" }}>
        Uncovered % after adding each stamp (in increasing order) — see how each
        new step buys less than the last:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {progression.map((p) => (
          <div key={p.step} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                width: 40,
                textAlign: "right",
                color: "var(--muted)",
              }}
            >
              +{p.step}
            </span>
            <div style={{ flex: 1, background: "var(--panel-2)", borderRadius: 3, height: 16 }}>
              <div
                style={{
                  width: `${100 - p.uncoveredPct}%`,
                  height: "100%",
                  background: "var(--win-dim)",
                  boxShadow: "inset 0 0 0 0.5px var(--win)",
                  borderRadius: 3,
                }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                width: 70,
                color: "var(--hole)",
              }}
            >
              {p.uncoveredPct.toFixed(1)}% gap
            </span>
          </div>
        ))}
      </div>

      {/* sample strip of the first 231 integers */}
      <p className="muted" style={{ fontSize: 14, margin: "16px 0 6px" }}>
        A look at the first {STRIP} integers (green = covered, red = a gap):
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(33, 1fr)`,
          gap: 1,
          background: "var(--line)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        {Array.from({ length: STRIP }, (_, x) => (
          <span
            key={x}
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              background: strip[x] ? "var(--win-dim)" : "var(--hole)",
              boxShadow: strip[x] ? "inset 0 0 0 0.5px var(--win)" : undefined,
            }}
          />
        ))}
      </div>

      <div className="hint">
        Coverage is measured on the first {W.toLocaleString()} integers, because the
        true repeating period (shown above) is far too large to draw once you go
        past a few small steps. Greedy residue choice means this is a{" "}
        <em>lower bound</em> on what those steps could cover — but even the best
        possible choice stalls the same way. The open question:{" "}
        <strong>can any finite pile of distinct odd steps ever reach 0% gap?</strong>
      </div>
    </div>
  );
}
