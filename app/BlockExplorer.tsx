"use client";

import { useMemo, useState } from "react";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  if (n % 3 === 0) return n === 3;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function smallestFactor(n: number): number {
  if (n < 2) return n;
  if (n % 2 === 0) return 2;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return i;
  }
  return n; // prime
}

type Col = {
  x: number;
  leftPrime: boolean;
  rightPrime: boolean;
  leftFactor: number; // smallest prime factor of x (if composite)
  rightFactor: number; // smallest prime factor of E-x (if composite)
  survives: boolean;
};

export default function BlockExplorer() {
  const [E, setE] = useState(122);

  const evenE = E % 2 === 0 ? E : E + 1;

  const data = useMemo(() => {
    const cols: Col[] = [];
    // Folded left half: odd x from 3 up to E/2.
    for (let x = 3; x <= evenE / 2; x += 2) {
      const other = evenE - x;
      const lp = isPrime(x);
      const rp = isPrime(other);
      cols.push({
        x,
        leftPrime: lp,
        rightPrime: rp,
        leftFactor: lp ? x : smallestFactor(x),
        rightFactor: rp ? other : smallestFactor(other),
        survives: lp && rp,
      });
    }
    const firstWin = cols.find((c) => c.survives);
    const pairCount = cols.filter((c) => c.survives).length;
    const sqrtE = Math.sqrt(evenE);
    const quartE = Math.pow(evenE, 0.25);
    return { cols, firstWin, pairCount, sqrtE, quartE };
  }, [evenE]);

  const { cols, firstWin, pairCount, sqrtE, quartE } = data;
  // Cap rendered columns so huge E stays responsive; note the cap in UI.
  const CAP = 260;
  const shown = cols.slice(0, CAP);
  const capped = cols.length > CAP;

  const presets = [122, 100, 7426, 210, 512, 1000, 48];

  return (
    <div className="explorer">
      <div className="controls">
        <div className="field">
          <label>Even number E</label>
          <input
            type="number"
            min={6}
            step={2}
            value={E}
            onChange={(e) => setE(Math.max(6, Number(e.target.value) || 6))}
          />
        </div>
        <div className="field">
          <label>drag E &nbsp;({evenE})</label>
          <input
            type="range"
            min={6}
            max={2000}
            step={2}
            value={Math.min(E, 2000)}
            onChange={(e) => setE(Number(e.target.value))}
          />
        </div>
        <button className="btn ghost" onClick={() => setE(evenE + 2)}>
          + next even
        </button>
      </div>

      <div className="chiprow">
        {presets.map((p) => (
          <span key={p} className="chip" onClick={() => setE(p)}>
            E = {p}
          </span>
        ))}
      </div>

      <div className="legend" style={{ marginTop: 18 }}>
        <span>
          <i className="swatch" style={{ background: "#6b5a2c", border: "1px solid #e8b64c" }} />
          prime block ■
        </span>
        <span>
          <i className="swatch" style={{ background: "#47201d", border: "1px solid #6d2d28" }} />
          hole × (composite) — label = smallest factor
        </span>
        <span>
          <i className="swatch" style={{ background: "#1e3b28", border: "1px solid #58c07a" }} />
          survivor: both prime ⇒ E = x + (E−x)
        </span>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="k">E</div>
          <div className="v">{evenE}</div>
        </div>
        <div className="stat">
          <div className="k">first survivor g(E)</div>
          <div className={"v " + (firstWin ? "win" : "bad")}>
            {firstWin ? firstWin.x : "none"}
          </div>
        </div>
        <div className="stat">
          <div className="k">its partner</div>
          <div className="v win">{firstWin ? evenE - firstWin.x : "—"}</div>
        </div>
        <div className="stat">
          <div className="k">Goldbach pairs</div>
          <div className="v">{pairCount}</div>
        </div>
        <div className="stat">
          <div className="k">√E (hole-makers ≤)</div>
          <div className="v">{sqrtE.toFixed(2)}</div>
        </div>
        <div className="stat">
          <div className="k">E^(1/4)</div>
          <div className="v">{quartE.toFixed(2)}</div>
        </div>
      </div>

      {firstWin ? (
        <div className="callout good">
          <span className="tag">representation found</span>
          <strong style={{ fontFamily: "var(--mono)", color: "var(--paper)" }}>
            {evenE} = {firstWin.x} + {evenE - firstWin.x}
          </strong>{" "}
          — the first column with no hole on either side. Both {firstWin.x} and{" "}
          {evenE - firstWin.x} are prime.
        </div>
      ) : (
        <div className="callout warn">
          <span className="tag">no survivor in strip</span>
          Every column has a hole — this would be a counterexample. (You will not
          find one; try any E.)
        </div>
      )}

      <div className="strip-scroll">
        <div style={{ display: "flex" }}>
          <div className="rowlabels">
            <div className="cell-lbl">x</div>
            <div className="cell-lbl">E−x</div>
            <div className="cell-lbl"></div>
          </div>
          <div className="strip">
            {shown.map((c) => {
              const isFirst = firstWin && c.x === firstWin.x;
              return (
                <div
                  key={c.x}
                  className={
                    "col" +
                    (c.survives ? " win" : "") +
                    (isFirst ? " first-win" : "")
                  }
                  title={`x=${c.x} (${c.leftPrime ? "prime" : "÷" + c.leftFactor})   E−x=${
                    evenE - c.x
                  } (${c.rightPrime ? "prime" : "÷" + c.rightFactor})`}
                >
                  <div className={"cell " + (c.leftPrime ? "prime" : "hole")}>
                    {c.leftPrime ? "■" : c.leftFactor}
                  </div>
                  <div className={"cell " + (c.rightPrime ? "prime" : "hole")}>
                    {c.rightPrime ? "■" : c.rightFactor}
                  </div>
                  <div className="xlabel">{c.x}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="hint">
        Top row = left block x. Middle row = its reflection E−x. A number = the
        smallest prime factor punching that hole; ■ = prime (no hole). A column
        boxed in green is the first place both sides survive.{" "}
        {capped &&
          `Showing first ${CAP} of ${cols.length} columns (E large — strip truncated for speed).`}
      </div>
    </div>
  );
}
