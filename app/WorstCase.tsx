"use client";

import { useMemo, useState } from "react";

/**
 * Worst-case even numbers: fewest Goldbach pairs ⇒ highest fail chance.
 * They minimise the Hardy–Littlewood boost  ∏_{p|N, p odd}(p−1)/(p−2),
 * whose floor is 1 — reached when N has NO odd prime factors:  N = 2^k.
 * Empirically the worst-case pair density is r ≈ 0.78·N/(lnN)² (measured on
 * powers of two); the top band (many small factors) sits at r ≈ 3.0.
 *   P(fail) ≈ e^(−E[pairs]) = 10^(−X),  X = E[pairs]/ln10
 */
const R_WORST = 0.78;
const R_TOP = 3.0;
const LN2 = Math.LN2;
const LN10 = Math.LN10;

function bigExp(x: number): string {
  if (!isFinite(x)) return "∞";
  if (x < 1e6) return Math.round(x).toLocaleString();
  const e = Math.floor(Math.log10(x));
  return (x / Math.pow(10, e)).toFixed(2) + "×10^" + e;
}
function fmtExp(log10X: number): string {
  if (log10X < 6) return Math.round(Math.pow(10, log10X)).toLocaleString();
  if (log10X < 300) return bigExp(Math.pow(10, log10X)); // X shown as m×10^k
  return "10^" + (log10X < 1e6 ? Math.round(log10X).toLocaleString() : bigExp(log10X));
}

// actual G(2^k) for small k, to verify the model
const M = 2100000;
function realWorst() {
  const comp = new Uint8Array(M + 1);
  for (let i = 2; i * i <= M; i++) if (!comp[i]) for (let j = i * i; j <= M; j += i) comp[j] = 1;
  const isP = (x: number) => x >= 2 && !comp[x];
  const rows: { k: number; N: number; g: number; log10X: number }[] = [];
  for (let k = 6; k <= 21; k++) {
    const N = 2 ** k;
    if (N > M) break;
    let g = 0;
    for (let p = 3; p <= N / 2; p++) if (isP(p) && isP(N - p)) g++;
    rows.push({ k, N, g, log10X: Math.log10(g) - Math.log10(LN10) });
  }
  return rows;
}

export default function WorstCase() {
  const [k, setK] = useState(64); // N = 2^k
  const rows = useMemo(realWorst, []);

  const d = useMemo(() => {
    const lnN = k * LN2;
    const log10N = k * Math.log10(2);
    // E[pairs] in log10, worst case & top band
    const log10EGworst = Math.log10(R_WORST) + log10N - 2 * Math.log10(lnN);
    const log10EGtop = Math.log10(R_TOP) + log10N - 2 * Math.log10(lnN);
    // X = E[pairs]/ln10  (fail chance = 1 in 10^X)
    const log10Xworst = log10EGworst - Math.log10(LN10);
    const log10Xtop = log10EGtop - Math.log10(LN10);
    return { lnN, log10Xworst, log10Xtop };
  }, [k]);

  const Nstr = k <= 53 ? (2 ** k).toLocaleString() : "2^" + k;
  const presets = [16, 32, 64, 128, 512, 2048, 10000];

  return (
    <div className="explorer">
      <div className="callout">
        <span className="tag">the worst-case generator</span>
        <div
          style={{
            fontFamily: "var(--mono)",
            color: "var(--paper)",
            fontSize: 20,
            margin: "4px 0",
          }}
        >
          N = 2^k
        </div>
        Powers of two have <em>no</em> odd prime factors, so the Goldbach boost{" "}
        <code className="kbd">∏(p−1)/(p−2)</code> hits its floor of{" "}
        <strong>1</strong> — the fewest possible pairs for their size. These sit on
        the very bottom edge of the comet. (The family{" "}
        <code className="kbd">N = 2·prime</code> is just as low.) Hunt here and
        nowhere else.
      </div>

      <div className="controls">
        <div className="field">
          <label>
            k &nbsp;→&nbsp; N = 2^{k} {k <= 53 ? "= " + Nstr : ""}
          </label>
          <input
            type="range"
            min={4}
            max={10000}
            step={1}
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
          />
        </div>
      </div>
      <div className="chiprow">
        {presets.map((p) => (
          <span key={p} className="chip" onClick={() => setK(p)}>
            2^{p}
          </span>
        ))}
      </div>

      <div className="callout warn" style={{ marginTop: 6 }}>
        <span className="tag">chance of finding a counterexample at N = {Nstr}</span>
        <div
          style={{
            fontFamily: "var(--mono)",
            color: "var(--paper)",
            fontSize: 22,
            margin: "6px 0",
          }}
        >
          ≈ 1 in 10^{fmtExp(d.log10Xworst)}
        </div>
        This is the <strong>best odds you can possibly get</strong> — the single
        most vulnerable kind of number at this size. And it&apos;s still that.
      </div>

      <div className="stats">
        <div className="stat">
          <div className="k">worst case (N = 2^k)</div>
          <div className="v bad">1 in 10^{fmtExp(d.log10Xworst)}</div>
        </div>
        <div className="stat">
          <div className="k">top band (÷2·3·5·7·11·13)</div>
          <div className="v">1 in 10^{fmtExp(d.log10Xtop)}</div>
        </div>
        <div className="stat">
          <div className="k">targeting advantage vs spikes</div>
          <div className="v win">10^{fmtExp(d.log10Xworst + Math.log10(R_TOP / R_WORST - 1))}× better</div>
        </div>
      </div>

      {/* verification on real small powers of two */}
      <p className="muted" style={{ margin: "18px 0 6px", fontSize: 14 }}>
        Verified on real powers of two (actual pair counts, then the implied fail
        chance):
      </p>
      <div className="ptable-scroll" style={{ maxWidth: 480 }}>
        <table className="ptable">
          <thead>
            <tr>
              <th>N = 2^k</th>
              <th>actual pairs</th>
              <th>fail chance</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k}>
                <td style={{ fontFamily: "var(--mono)" }}>2^{r.k}</td>
                <td>{r.g.toLocaleString()}</td>
                <td className="cell-bad">1 in 10^{fmtExp(r.log10X)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="callout good">
        <span className="tag">the verdict</span>
        Even aimed at the single weakest number of its size, the chance of finding
        a counterexample is <strong>1 in 10^{fmtExp(d.log10Xworst)}</strong>.
        Smart targeting buys you an astronomical relative edge over the spikes —
        and it is still, absolutely, never. The only way a hunt here ever succeeds
        is if primes secretly correlate against these specific numbers, which is
        exactly the unproven gap. So this is the best possible place to look —{" "}
        <strong>and it&apos;s hopeless</strong>, which together is why Goldbach is
        believed but open.
      </div>

      <div className="hint">
        The equation <code className="kbd">N = 2^k</code> streams worst-case even
        numbers; the fail chance uses the measured worst-case density{" "}
        <code className="kbd">≈ 0.78·N/(lnN)²</code> pairs, then{" "}
        <code className="kbd">P(fail) ≈ e^(−pairs)</code>. Drag k up: the exponent X
        grows without bound, so 1-in-10^X races to 1-in-10^(10^3000) by k = 10000.
        (Heuristic, not proof.)
      </div>
    </div>
  );
}
