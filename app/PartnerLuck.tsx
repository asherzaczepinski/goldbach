"use client";

import { useMemo, useState } from "react";

const PRIMES = [3, 5, 7, 11, 13, 17, 19, 23, 29, 31];

export default function PartnerLuck() {
  const [input, setInput] = useState(200000);

  const HARD_MAX = 600000;
  const maxN = Math.min(HARD_MAX, Math.max(2000, Math.floor(Math.abs(input) || 2000)));

  const { checkpoints, rate, spread, shared } = useMemo(() => {
    const comp = new Uint8Array(maxN + 1);
    for (let i = 2; i * i <= maxN; i++)
      if (!comp[i]) for (let j = i * i; j <= maxN; j += i) comp[j] = 1;
    const isP = (x: number) => x >= 2 && !comp[x];

    const checkpoints = [1000, 10000, 100000, maxN].filter(
      (c, i, a) => c <= maxN && a.indexOf(c) === i
    );
    const hits: Record<number, Record<number, number>> = {};
    const tots: Record<number, Record<number, number>> = {};
    for (const p of PRIMES) {
      hits[p] = {};
      tots[p] = {};
      for (const cp of checkpoints) {
        hits[p][cp] = 0;
        tots[p][cp] = 0;
      }
    }
    for (let N = 6; N <= maxN; N += 2) {
      for (const p of PRIMES) {
        if (N - p < 2) continue;
        const prime = isP(N - p);
        for (const cp of checkpoints) {
          if (N <= cp) {
            tots[p][cp]++;
            if (prime) hits[p][cp]++;
          }
        }
      }
    }
    const rate: Record<number, Record<number, number>> = {};
    for (const p of PRIMES) {
      rate[p] = {};
      for (const cp of checkpoints) rate[p][cp] = (100 * hits[p][cp]) / tots[p][cp];
    }
    // spread across primes at the largest range
    const last = checkpoints[checkpoints.length - 1];
    const vals = PRIMES.map((p) => rate[p][last]);
    const spread = Math.max(...vals) - Math.min(...vals);
    const shared = vals.reduce((s, v) => s + v, 0) / vals.length;
    return { checkpoints, rate, spread, shared };
  }, [maxN]);

  const last = checkpoints[checkpoints.length - 1];
  const fmtRange = (c: number) =>
    c >= 1000000 ? c / 1000000 + "M" : c >= 1000 ? c / 1000 + "k" : "" + c;

  const presets = [20000, 100000, 300000, 600000];

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

      <div className="stats" style={{ marginTop: 16 }}>
        <div className="stat">
          <div className="k">shared success rate</div>
          <div className="v win">{shared.toFixed(2)}%</div>
        </div>
        <div className="stat">
          <div className="k">spread (luckiest − unluckiest)</div>
          <div className="v">{spread.toFixed(3)}%</div>
        </div>
        <div className="stat">
          <div className="k">≈ 2 / ln N (predicted)</div>
          <div className="v">{((200 / Math.log(last))).toFixed(2)}%</div>
        </div>
      </div>

      <div className="callout good">
        <span className="tag">the reveal</span>
        Down every column below the primes are <strong>the same</strong> — no
        prime is luckier. Across every row the chance <strong>shrinks</strong> as
        N grows. The (un)luckiness isn&apos;t in the prime; it averages out to a
        dead heat.
      </div>

      {/* p vs range grid */}
      <div className="ptable-scroll" style={{ marginTop: 6 }}>
        <table className="ptable">
          <thead>
            <tr>
              <th>prime p</th>
              {checkpoints.map((cp) => (
                <th key={cp}>up to {fmtRange(cp)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRIMES.map((p) => (
              <tr key={p}>
                <td style={{ fontFamily: "var(--mono)", fontWeight: 700 }}>{p}</td>
                {checkpoints.map((cp) => (
                  <td key={cp}>{rate[p][cp].toFixed(2)}%</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* bars at the largest range — visibly equal */}
      <p className="muted" style={{ margin: "22px 0 8px", fontSize: 14 }}>
        Success rate of each prime as a Goldbach partner, up to{" "}
        {last.toLocaleString()} — the bars are the same length on purpose:
      </p>
      <div className="luck-bars">
        {PRIMES.map((p) => {
          const r = rate[p][last];
          const w = (r / Math.max(...PRIMES.map((q) => rate[q][last]))) * 100;
          return (
            <div key={p} className="luck-row">
              <span className="luck-p">{p}</span>
              <span className="luck-track">
                <span className="luck-fill" style={{ width: w + "%" }} />
              </span>
              <span className="luck-val">{r.toFixed(2)}%</span>
            </div>
          );
        })}
      </div>

      <div className="hint">
        For each small prime <code className="kbd">p</code>, this is the fraction
        of even numbers N (up to the cap) for which{" "}
        <code className="kbd">N − p</code> is also prime — i.e. how often p works
        as one half of a Goldbach pair. They come out equal because as N sweeps
        the evens, <code className="kbd">N − p</code> lands on primes at the same
        average density no matter which small p you fixed.
      </div>
    </div>
  );
}
