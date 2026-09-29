"use client";

import { useMemo, useState } from "react";

// First K primes.
function firstPrimes(k: number): number[] {
  if (k < 1) return [];
  // upper bound estimate for the k-th prime, then sieve.
  const lim = Math.max(20, Math.ceil(k * (Math.log(k) + Math.log(Math.log(k + 2)) + 2)));
  const comp = new Uint8Array(lim + 1);
  const out: number[] = [];
  for (let i = 2; i <= lim && out.length < k; i++) {
    if (!comp[i]) {
      out.push(i);
      for (let j = i * i; j <= lim; j += i) comp[j] = 1;
    }
  }
  return out;
}

function diff(arr: number[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < arr.length; i++) out.push(arr[i] - arr[i - 1]);
  return out;
}

type Series = { label: string; values: number[]; signed: boolean };

export default function DifferenceGraph() {
  const [k, setK] = useState(40);
  const [levels, setLevels] = useState(3);

  const series = useMemo<Series[]>(() => {
    const primes = firstPrimes(Math.max(3, k));
    const out: Series[] = [
      { label: "primes", values: primes, signed: false },
    ];
    let cur = primes;
    for (let L = 1; L <= levels; L++) {
      cur = diff(cur);
      out.push({
        label:
          L === 1 ? "Δ  gaps between primes" : "Δ".repeat(L) + `  ${ordinal(L)} difference`,
        values: cur,
        // gaps (level 1) are always ≥ 0; higher differences swing negative.
        signed: L >= 2,
      });
    }
    return out;
  }, [k, levels]);

  const presetsK = [20, 40, 80, 160, 300];

  return (
    <div className="explorer">
      <div className="controls">
        <div className="field">
          <label>How many primes ({k})</label>
          <input
            type="range"
            min={5}
            max={400}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>Difference levels</label>
          <select
            value={levels}
            onChange={(e) => setLevels(Number(e.target.value))}
            style={{
              background: "#201a10",
              color: "var(--paper)",
              border: "1px solid var(--accent-dim)",
              borderRadius: 6,
              padding: "8px 10px",
              fontFamily: "var(--mono)",
            }}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chiprow">
        {presetsK.map((p) => (
          <span key={p} className="chip" onClick={() => setK(p)}>
            {p} primes
          </span>
        ))}
      </div>

      <div className="diff-stack">
        {series.map((s, i) => (
          <DiffRow key={i} series={s} />
        ))}
      </div>

      <div className="hint">
        The top row is the primes themselves. Each row below is the{" "}
        <strong>difference</strong> between neighbours in the row above: row 2 is
        the prime gaps, row 3 the gaps-between-gaps, and so on. Gold bars are
        positive, <span style={{ color: "#c0392b" }}>red</span> bars negative.
        Notice the gaps are all even after the first (2→3), and the higher
        differences oscillate around zero without ever settling — primes have no
        polynomial rule, so the differences never flatten to a constant the way
        they would for, say, squares.
      </div>
    </div>
  );
}

function DiffRow({ series }: { series: Series }) {
  const { label, values, signed } = series;
  const maxAbs = Math.max(1, ...values.map((v) => Math.abs(v)));
  const H = signed ? 96 : 84;

  return (
    <div className="diff-row">
      <div className="diff-label">
        <span className="diff-name">{label}</span>
        <span className="diff-meta">
          n={values.length} · max|v|={maxAbs}
        </span>
      </div>
      <div className="diff-bars" style={{ height: H }}>
        {signed && <div className="diff-baseline" />}
        {values.map((v, i) => {
          const mag = (Math.abs(v) / maxAbs) * (signed ? H / 2 : H);
          const neg = v < 0;
          const style: React.CSSProperties = signed
            ? neg
              ? { top: "50%", height: mag }
              : { bottom: "50%", height: mag }
            : { bottom: 0, height: mag };
          return (
            <div key={i} className="diff-cell">
              <div
                className={"diff-bar" + (neg ? " neg" : "")}
                style={style}
                title={`#${i + 1}: ${v}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ordinal(n: number): string {
  return ["", "1st", "2nd", "3rd", "4th", "5th"][n] ?? n + "th";
}
