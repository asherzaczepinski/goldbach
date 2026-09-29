"use client";

import { useMemo, useState } from "react";

/**
 * Drag N from 10^0 to 10^10000. Log-space throughout so exponents can be huge.
 *   w = 1/lnN,  C = π(N/3),  P(N breaks) = (1−w)^C = 10^(−X)
 * The headline is the CUMULATIVE fail total: every number's fail chance added
 * onto all the previous ones (a running sum). It converges — that's the point.
 */
const LN10 = Math.LN10;
const M = 100000; // mini-sieve range where the cumulative actually accrues

function bigExp(x: number): string {
  if (!isFinite(x)) return "∞";
  if (x < 1e6) return Math.round(x).toLocaleString();
  const e = Math.floor(Math.log10(x));
  return (x / Math.pow(10, e)).toFixed(2) + "×10^" + e;
}
// render "10^<exp>" where we may only know log10(exp)
function fmtExponent(log10X: number): string {
  if (log10X < 6) return Math.round(Math.pow(10, log10X)).toLocaleString();
  if (log10X < 15) return bigExp(Math.pow(10, log10X));
  return "10^" + (log10X < 1e6 ? Math.round(log10X).toLocaleString() : bigExp(log10X));
}
// log10 of X, where P(N breaks) = 10^(−X);  e = log10(N)
function log10Xof(e: number): number {
  const lnN = Math.max(1.2, e * LN10);
  const w = 1 / lnN;
  const lnN3 = lnN - Math.log(3);
  const log10C = (lnN3 - Math.log(Math.max(1.1, lnN3))) / LN10;
  const negln = -Math.log(1 - w);
  return log10C + Math.log10(negln) - Math.log10(LN10);
}

function buildSieve() {
  const comp = new Uint8Array(M + 1);
  for (let i = 2; i * i <= M; i++) if (!comp[i]) for (let j = i * i; j <= M; j += i) comp[j] = 1;
  const pi = new Int32Array(M + 1);
  for (let i = 1; i <= M; i++) pi[i] = pi[i - 1] + (i >= 2 && !comp[i] ? 1 : 0);
  const prefix = new Float64Array(M + 1); // cumulative Σ P(fail) for even N ≤ index
  let run = 0;
  for (let N = 6; N <= M; N += 2) {
    const C = pi[Math.floor(N / 3)];
    const w = 1 / Math.log(N);
    run += C > 0 ? Math.exp(C * Math.log(1 - w)) : 1;
    prefix[N] = run;
    prefix[N - 1] = run;
  }
  for (let i = 2; i <= M; i++) if (prefix[i] === 0) prefix[i] = prefix[i - 1];
  const total = run;
  // decade adds
  const decade: { k: number; add: number; cum: number }[] = [];
  let prev = 0;
  for (let k = 1; k <= 5; k++) {
    const cum = prefix[Math.pow(10, k)];
    decade.push({ k, add: cum - prev, cum });
    prev = cum;
  }
  // luck number (99.9% clear)
  const tau = -Math.log(0.999);
  let luck = M;
  for (let N = 6; N <= M; N += 2)
    if (total - prefix[N] < tau) {
      luck = N;
      break;
    }
  return { prefix, total, decade, luck };
}

export default function BreakOdds() {
  const [exp, setExp] = useState(12);
  const s = useMemo(buildSieve, []);

  const N = Math.pow(10, exp);
  const Nstr = exp < 15 ? Math.round(N).toLocaleString() : "10^" + exp.toFixed(0);
  const log10X = log10Xof(exp); // per-number: P(break) = 1 in 10^(10^log10X)
  const stepChance = Math.pow(10, -Math.min(300, Math.pow(10, Math.min(2.4, log10X)))); // for the "+add" display when tiny
  const cumNow = exp <= 5 ? s.prefix[Math.min(M, Math.round(N))] : s.total;

  const presets = [0.5, 3, 6, 12, 18, 100, 1000, 10000];

  return (
    <div className="explorer">
      <div className="controls">
        <div className="field">
          <label>
            N = 10^{exp.toFixed(exp < 20 ? 1 : 0)} &nbsp;=&nbsp; {Nstr}
          </label>
          <input
            type="range"
            min={0}
            max={10000}
            step={0.5}
            value={exp}
            onChange={(e) => setExp(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="chiprow">
        {presets.map((p) => (
          <span key={p} className="chip" onClick={() => setExp(p)}>
            10^{p}
          </span>
        ))}
      </div>

      {/* THE cumulative fail total */}
      <div className="callout warn" style={{ marginTop: 14 }}>
        <span className="tag">cumulative chance of fail — every number so far, added up</span>
        <div
          style={{
            fontFamily: "var(--mono)",
            color: "var(--paper)",
            fontSize: 22,
            margin: "6px 0",
          }}
        >
          Σ ≈ {cumNow.toFixed(4)}
        </div>
        This is the running sum of <em>every</em> even number&apos;s fail chance
        from 4 up to {Nstr}. The step at N = {Nstr} adds only{" "}
        <code className="kbd">
          {log10X < 1
            ? "+" + Math.pow(10, -Math.pow(10, log10X)).toExponential(1)
            : "+1 / 10^" + fmtExponent(log10X)}
        </code>{" "}
        — so past the first few numbers the total barely moves, and it converges
        to <strong>≈ {s.total.toFixed(2)}</strong> and stops.
      </div>

      <div className="stats">
        <div className="stat">
          <div className="k">this number&apos;s own fail chance</div>
          <div className="v bad">1 in 10^{fmtExponent(log10X)}</div>
        </div>
        <div className="stat">
          <div className="k">cumulative Σ so far</div>
          <div className="v">{cumNow.toFixed(4)}</div>
        </div>
        <div className="stat">
          <div className="k">converges to (all N)</div>
          <div className="v">≈ {s.total.toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="k">luck number (99.9% clear)</div>
          <div className="v win">≈ {s.luck.toLocaleString()}</div>
        </div>
      </div>

      {/* ledger: what each step adds + running total */}
      <p className="muted" style={{ margin: "18px 0 6px", fontSize: 14 }}>
        Each ×10 block: what it adds, and the running cumulative total —
        <strong> add this step&apos;s chance to all the previous ones</strong>:
      </p>
      <div className="ptable-scroll" style={{ maxWidth: 520 }}>
        <table className="ptable">
          <thead>
            <tr>
              <th>block up to</th>
              <th>this step adds</th>
              <th>cumulative Σ</th>
            </tr>
          </thead>
          <tbody>
            {s.decade.map((d) => (
              <tr key={d.k}>
                <td style={{ fontFamily: "var(--mono)" }}>10^{d.k}</td>
                <td>+{d.add.toFixed(4)}</td>
                <td className="cell-good">{d.cum.toFixed(4)}</td>
              </tr>
            ))}
            <tr>
              <td style={{ fontFamily: "var(--mono)" }}>10^6 … 10^{exp.toFixed(0)}</td>
              <td>+0.0000… (each &lt; 10^−300)</td>
              <td className="cell-good">{s.total.toFixed(4)} (unchanged)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="callout good">
        <span className="tag">so it never breaks</span>
        The cumulative fail chance is dominated entirely by the first handful of
        even numbers (where this crude estimate runs high — and those are all
        directly verified to hold). Every step after adds a smaller number than
        the one before, so the running total flatlines by the luck number{" "}
        <strong>≈ {s.luck.toLocaleString()}</strong>. Drag all the way to{" "}
        <strong>10^10000</strong>: that number&apos;s own fail chance is{" "}
        <strong>1 in 10^{fmtExponent(log10Xof(10000))}</strong>, and it adds
        essentially nothing. Add up every fail chance to infinity and you still get
        a finite ≈{s.total.toFixed(1)} — so a counterexample is never expected.
      </div>

      <div className="hint">
        The sum <code className="kbd">Σ P(fail)</code> is the expected number of
        counterexamples. Because each term shrinks faster than the count of numbers
        grows, the sum <strong>converges</strong> instead of running to infinity —
        that convergence is exactly why Goldbach is believed. (A heuristic, not a
        proof: a finite tiny expected count can&apos;t rule out one freak N, which
        is the wall the problem still sits behind.)
      </div>
    </div>
  );
}
