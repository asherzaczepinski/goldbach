"use client";

import { useMemo, useState } from "react";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  if (n % 3 === 0) return n === 3;
  for (let i = 5; i * i <= n; i += 6)
    if (n % i === 0 || n % (i + 2) === 0) return false;
  return true;
}
function toBase(n: number, b: number): string {
  if (n === 0) return "0";
  let s = "";
  let x = n;
  while (x > 0) {
    s = (x % b) + s;
    x = Math.floor(x / b);
  }
  return s;
}
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const BASES = [2, 3, 4];
const MAX = 200;

export default function BasesGoldbach() {
  const [E, setE] = useState(28);
  const evenE = E % 2 === 0 ? E : E + 1;

  const firstPair = useMemo(() => {
    for (let p = 3; p <= evenE / 2; p += 2)
      if (isPrime(p) && isPrime(evenE - p)) return { p, q: evenE - p };
    return null;
  }, [evenE]);

  return (
    <>
      <div className="bctrl">
        <div className="bignum">{evenE}</div>
        <input
          type="range"
          min={6}
          max={MAX}
          step={2}
          value={Math.min(evenE, MAX)}
          onChange={(e) => setE(Number(e.target.value))}
        />
        <button className="btn ghost" onClick={() => setE((p) => Math.max(6, p - 2))}>
          −2
        </button>
        <button className="btn ghost" onClick={() => setE((p) => Math.min(MAX, p + 2))}>
          +2
        </button>
        <span className="bstat">
          decimal: {firstPair ? `${evenE} = ${firstPair.p} + ${firstPair.q}` : "—"}
        </span>
      </div>

      {firstPair ? (
        <>
          <p className="muted" style={{ fontSize: 15 }}>
            The same pair — <span style={{ color: "var(--win)" }}>{firstPair.p}</span> +{" "}
            <span style={{ color: "#7fd39a" }}>{firstPair.q}</span> ={" "}
            <span style={{ color: "var(--accent)" }}>{evenE}</span> — written and
            added in each base. Different digits, identical truth.
          </p>
          <div className="basecards">
            {BASES.map((b) => {
              const pS = toBase(firstPair.p, b);
              const qS = toBase(firstPair.q, b);
              const eS = toBase(evenE, b);
              const w = eS.length + 1;
              return (
                <div className="basecard" key={b}>
                  <h4>base {b}</h4>
                  <div className="dec">
                    (decimal {firstPair.p} + {firstPair.q} = {evenE})
                  </div>
                  <div className="sum">
                    <span className="r">
                      <span className="lbl">{"  "}</span>
                      <span className="pv">{pS.padStart(w)}</span>
                    </span>
                    <span className="r">
                      <span className="lbl">{"+ "}</span>
                      <span className="qv">{qS.padStart(w - 2)}</span>
                    </span>
                    <span className="r rule">
                      {"  " + "─".repeat(Math.max(w, eS.length))}
                    </span>
                    <span className="r">
                      <span className="lbl">{"  "}</span>
                      <span className="ev">{eS.padStart(w)}</span>{" "}
                      <span className="ok">✓</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="bstat">no pair — counterexample?!</p>
      )}

      <h3 style={{ marginTop: 36 }}>Why it still applies</h3>
      <p className="muted" style={{ fontSize: 15 }}>
        A base only changes the <em>digits</em> you write a number with — never the
        number itself. {evenE} is even, {firstPair?.p} and {firstPair?.q} are prime,
        and their sum is {evenE} whether you spell them in base 2, 3, 4, or ten.
        Primality, evenness, and addition are properties of the quantity, not the
        notation. So Goldbach isn&apos;t base-dependent — it&apos;s exactly the same
        statement in every base. Nothing to re-check.
      </p>

      <h3 style={{ marginTop: 28 }}>What the base <em>does</em> change: the last digit</h3>
      <p className="muted" style={{ fontSize: 15 }}>
        The one thing that shifts is which final digits a prime can even have — a
        prime bigger than the base can&apos;t end in a digit that shares a factor
        with the base:
      </p>
      {BASES.concat([10]).map((b) => {
        const allowed = [];
        for (let d = 1; d < b; d++) if (gcd(d, b) === 1) allowed.push(d);
        return (
          <div className="lastdig" key={b}>
            <span className="lbl" style={{ minWidth: 70, color: "var(--muted)" }}>
              base {b}:
            </span>
            {allowed.map((d) => (
              <span className="digchip" key={d}>
                …{d}
              </span>
            ))}
            <span style={{ color: "var(--muted)" }}>
              ({allowed.length} of {b - 1} digits can end a large prime)
            </span>
          </div>
        );
      })}
    </>
  );
}
