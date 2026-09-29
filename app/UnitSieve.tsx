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
  if (n % 2 === 0) return 2;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return i;
  return n;
}

// color a prime addend to match the factor scheme: 1&2 blue, 3 purple, 5 orange, 7 pink, rest gold
function addColor(v: number): string {
  if (v <= 2) return "special";
  if (v === 3) return "a3";
  if (v === 5) return "a5";
  if (v === 7) return "a7";
  return "p";
}

type Step = { text: string; hit: boolean };
type Line = { base: number; steps: Step[] };

// For odd n: test each prime base b up to √n.
// Either b divides n (a multiple lands exactly on it → composite),
// or n sits strictly between two consecutive multiples of b (→ b can't divide it).
// If every b ≤ √n skips, nothing divides n → prime.
function buildTrace(n: number): { lines: Line[]; prime: boolean } {
  const lines: Line[] = [];
  for (let b = 3; b * b <= n; b += 2) {
    if (!isPrime(b)) continue;
    if (n % b === 0) {
      lines.push({
        base: b,
        steps: [{ text: `${b}×${n / b}=${n}`, hit: true }],
      });
      return { lines, prime: false };
    }
    const q = Math.floor(n / b);
    lines.push({
      base: b,
      steps: [
        { text: `${b}×${q}=${b * q}`, hit: false },
        { text: `${b}×${q + 1}=${b * (q + 1)} →`, hit: false },
      ],
    });
  }
  return { lines, prime: true };
}

const MAX = 100;

export default function UnitSieve() {
  const [E, setE] = useState(30);
  const [hoverN, setHoverN] = useState<number | null>(null);
  const evenE = E % 2 === 0 ? E : E + 1;

  // The odd numbers before n that could eat it: 3, 5, …, up to n/3
  // (a proper divisor pairs n into ≥3 groups). Mark the ones that divide.
  const attackersOf = (n: number) => {
    const list: { d: number; eats: boolean }[] = [];
    for (let d = 3; d <= n / 3; d += 2) list.push({ d, eats: n % d === 0 });
    return list;
  };

  const { odds, primes, evenSums, firstPair, primesLeft, eaten } = useMemo(() => {
    const odds = [];
    for (let n = 3; n <= evenE - 1; n += 2) {
      const prime = isPrime(n);
      const f = prime ? n : smallestFactor(n);
      const co = prime ? 1 : n / f;
      odds.push({
        n,
        prime,
        f,
        co,
        groups: prime ? 1 : f,
        per: prime ? n : co,
        trace: buildTrace(n),
      });
    }
    const primes = odds.filter((o) => o.prime).map((o) => o.n);

    // Right panel: every even number 2..E written as prime + prime.
    // 1 and 2 are allowed as special primes to cover the tiny cases (2, 4).
    const evenSums: { m: number; a: number; b: number }[] = [];
    for (let m = 2; m <= evenE; m += 2) {
      let a = 0,
        b = 0;
      for (let x = 2; x <= m / 2; x++) {
        if (isPrime(x) && isPrime(m - x)) {
          a = x;
          b = m - x;
          break;
        }
      }
      if (!a && m === 2) {
        a = 1;
        b = 1; // 2 = 1 + 1, the weird little case
      }
      evenSums.push({ m, a, b });
    }

    let firstPair: { p: number; q: number } | null = null;
    for (let p = 3; p <= evenE / 2; p += 2) {
      if (isPrime(p) && isPrime(evenE - p)) {
        firstPair = { p, q: evenE - p };
        break;
      }
    }
    return {
      odds,
      primes,
      evenSums,
      firstPair,
      primesLeft: primes.length,
      eaten: odds.length - primes.length,
    };
  }, [evenE]);

  return (
    <>
      <div className="ucontrols">
        <div className="bignum">{evenE}</div>
        <input
          type="range"
          min={6}
          max={MAX}
          step={2}
          value={Math.min(evenE, MAX)}
          onChange={(e) => setE(Number(e.target.value))}
        />
        <button
          className="btn ghost"
          onClick={() => setE((p) => Math.max(6, p - 2))}
        >
          −2
        </button>
        <button
          className="btn ghost"
          onClick={() => setE((p) => Math.min(MAX, p + 2))}
        >
          +2
        </button>
      </div>

      <div className="miniStats">
        <span>
          odd numbers under {evenE}: <b>{odds.length}</b>
        </span>
        <span>
          eaten by a factor: <b>{eaten}</b>
        </span>
        <span>
          primes surviving: <b>{primesLeft}</b>
        </span>
      </div>

      <p className="muted" style={{ fontSize: 15 }}>
        Read it top to bottom. For each odd number, we walk the multiples of every
        prime found before it. If a multiple{" "}
        <span style={{ color: "#d38a82" }}>lands exactly on it</span>, that prime
        divides it — composite, eaten. If the number falls{" "}
        <span style={{ color: "var(--muted)" }}>between two multiples</span> of
        every prime up to √n, nothing divides it — it&apos;s{" "}
        <span style={{ color: "var(--accent)" }}>prime</span> and survives.
      </p>

      <div className="factor-legend">
        <span>
          <i style={{ background: "#8b6cff" }} />÷ 3 (purple)
        </span>
        <span>
          <i style={{ background: "#f0913c" }} />÷ 5 (orange)
        </span>
        <span>
          <i style={{ background: "#ec6fb0" }} />÷ 7 (pink)
        </span>
        <span>
          <i style={{ background: "var(--accent)" }} />prime (gold)
        </span>
      </div>

      <div className="sieve-cols">
      <div className="ledger">
        <div className="lhead">
          <span>number</span>
          <span>blocks · factor check</span>
        </div>
        {odds.map((o) => (
          <div
            key={o.n}
            className={"lrow " + (o.prime ? "prime" : "eaten")}
            onMouseEnter={() => setHoverN(o.n)}
            onMouseLeave={() => setHoverN((h) => (h === o.n ? null : h))}
          >
            <div className="lnum">
              <span className="v">{o.n}</span>
              <span className="lbadge">{o.prime ? "prime" : "eaten"}</span>
            </div>
            <div className="lright">
              <div className="lblocks">
                {Array.from({ length: o.groups }).map((_, g) => (
                  <div className="lgroup" key={g}>
                    {Array.from({ length: o.per }).map((_, c) => (
                      <span
                        key={c}
                        className={
                          "u2 " +
                          (o.prime
                            ? "p"
                            : `${
                                o.f === 3
                                  ? "f3"
                                  : o.f === 5
                                  ? "f5"
                                  : o.f === 7
                                  ? "f7"
                                  : "fx"
                              } ${g % 2 === 0 ? "g0" : "g1"}`)
                        }
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="lcheck">
                {o.trace.lines.length === 0 && (
                  <span className="tstep skip">no prime ≤ √{o.n} to test</span>
                )}
                {o.trace.lines.map((line) => (
                  <span
                    key={line.base}
                    style={{ display: "inline-flex", gap: 5, alignItems: "center" }}
                  >
                    {line.steps.map((s, i) => (
                      <span
                        key={i}
                        className={"tstep " + (s.hit ? "hit" : "skip")}
                      >
                        {s.text}
                      </span>
                    ))}
                  </span>
                ))}
                <span className={"tverdict " + (o.prime ? "prime" : "eaten")}>
                  {o.prime ? "· PRIME" : `· ${o.f}×${o.co} eats it`}
                </span>
              </div>

              {hoverN === o.n && (
                <div className="attackers">
                  <span className="lbl">
                    odds trying to eat {o.n} — groups climbing to it:
                  </span>
                  {attackersOf(o.n).map((a) => {
                    const d = a.d;
                    const q = Math.floor(o.n / d); // full groups that fit
                    const exact = a.eats; // lands on n
                    return (
                      <div className="eatrow" key={d}>
                        <span className="elbl">{d}×</span>
                        <div className="etrack">
                          {Array.from({ length: q }).map((_, gi) => (
                            <span
                              className={"egroup " + (exact ? "eat" : "fit")}
                              key={gi}
                              title={`${d} × ${gi + 1} = ${d * (gi + 1)}`}
                            >
                              {Array.from({ length: d }).map((_, ci) => (
                                <span className="ecell" key={ci} />
                              ))}
                            </span>
                          ))}
                          {!exact && (
                            <span
                              className="egroup spill"
                              title={`${d} × ${q + 1} = ${d * (q + 1)} — past ${o.n}`}
                            >
                              {Array.from({ length: d }).map((_, ci) => (
                                <span className="ecell" key={ci} />
                              ))}
                            </span>
                          )}
                        </div>
                        <span className={"ever " + (exact ? "eat" : "miss")}>
                          {exact
                            ? `${d}×${o.n / d}=${o.n} ✓ eats`
                            : `${d}×${q + 1}=${d * (q + 1)} > ${o.n} ✗`}
                        </span>
                      </div>
                    );
                  })}
                  {attackersOf(o.n).length === 0 && (
                    <span className="atk miss">nothing small enough to try</span>
                  )}
                  <span className={"concl " + (o.prime ? "prime" : "eaten")}>
                    {o.prime
                      ? "→ every odd lands short then overshoots · nothing divides it · PRIME"
                      : `→ some group lands exactly on ${o.n} · eaten`}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

        <aside className="sumpanel">
          <h4 className="sp-title">every even number = prime + prime</h4>
          <p className="sp-note">
            <span className="b">1</span> and <span className="b">2</span> count as
            special primes here — they cover the tiny cases{" "}
            <span className="b">2 = 1 + 1</span> and{" "}
            <span className="b">4 = 2 + 2</span>.
          </p>
          <div className="sumlist">
            {evenSums.map(({ m, a, b }) => (
              <div className={"sumrow" + (m === evenE ? " cur" : "")} key={m}>
                <span className="even">{m}</span>
                <span className="conn" />
                {a ? (
                  <span className="pairlink">
                    <span className={"addend " + addColor(a)}>{a}</span>
                    <span className="plus">+</span>
                    <span className={"addend " + addColor(b)}>{b}</span>
                  </span>
                ) : (
                  <span className="pairlink none">?</span>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* survivors */}
      <div className="survivors">
        <span className="lbl">survivors (primes under {evenE})</span>
        {primes.map((p) => (
          <span key={p} className="schip">
            {p}
          </span>
        ))}
      </div>

      {/* rebuild E from the first pair */}
      <div className="payoff">
        {firstPair ? (
          <>
            <div className="eqbig">
              <span className="e">{evenE}</span> ={" "}
              <span className="p">{firstPair.p}</span> +{" "}
              <span className="p">{firstPair.q}</span>
            </div>
            <div className="rebuild-bars">
              <div className="rbar">
                {Array.from({ length: firstPair.p }).map((_, i) => (
                  <span key={i} className="u2 win" />
                ))}
              </div>
              <span className="op">+</span>
              <div className="rbar">
                {Array.from({ length: firstPair.q }).map((_, i) => (
                  <span key={i} className="u2 win" />
                ))}
              </div>
              <span className="op">=</span>
              <div className="rbar">
                {Array.from({ length: evenE }).map((_, i) => (
                  <span key={i} className="u2 win" />
                ))}
              </div>
            </div>
            <p
              className="muted"
              style={{ textAlign: "center", marginTop: 14, fontSize: 14 }}
            >
              two survivors rebuild {evenE} — the first such pair
            </p>
          </>
        ) : (
          <div className="eqbig" style={{ color: "var(--hole)" }}>
            no prime pair — counterexample?!
          </div>
        )}
      </div>
    </>
  );
}
