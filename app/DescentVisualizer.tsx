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
function smallestFactor(n: number): number {
  if (n % 2 === 0) return 2;
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return i;
  return n;
}

const MAX = 1000;

export default function DescentVisualizer() {
  const [E, setE] = useState(122);
  const evenE = E % 2 === 0 ? E : E + 1;

  const { tries, seed, half } = useMemo(() => {
    const half = evenE / 2;
    // Bertrand seed: largest prime below E (guaranteed > E/2)
    let p = evenE - 1;
    while (p > 1 && !isPrime(p)) p--;
    const seed = p;

    const tries: { p: number; q: number; ok: boolean; f: number }[] = [];
    let cur = p;
    while (cur > 1) {
      const q = evenE - cur;
      const ok = q === 1 || isPrime(q);
      tries.push({ p: cur, q, ok, f: ok ? q : smallestFactor(q) });
      if (ok) break;
      cur--;
      while (cur > 1 && !isPrime(cur)) cur--;
    }
    return { tries, seed, half };
  }, [evenE]);

  const winner = tries[tries.length - 1];

  // every even number up to MAX whose descent needs more than one try
  const hardList = useMemo(() => {
    const out: { E: number; tries: number }[] = [];
    for (let m = 6; m <= MAX; m += 2) {
      let p = m - 1;
      while (p > 1 && !isPrime(p)) p--;
      let count = 0;
      let cur = p;
      while (cur > 1) {
        count++;
        const q = m - cur;
        if (q === 1 || isPrime(q)) break;
        cur--;
        while (cur > 1 && !isPrime(cur)) cur--;
      }
      if (count > 1) out.push({ E: m, tries: count });
    }
    return out;
  }, []);

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
          tries needed: <b>{tries.length}</b>
        </span>
      </div>

      <p className="muted" style={{ fontSize: 15 }}>
        Seed = the largest prime below {evenE}, which is{" "}
        <strong style={{ color: "var(--accent)" }}>{seed}</strong> — and Bertrand
        guarantees it sits above the halfway point {half}. Subtract it from {evenE};
        if the result is prime we have a pair. If not, step down to the next prime
        and try again.
      </p>

      <div className="descent">
        {tries.map((t, i) => (
          <div
            key={t.p}
            className={"dtry" + (t.ok ? " win" : "")}
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            <span className="try">try {i + 1}</span>
            <span className="eq">
              {evenE} − <span className="pp">{t.p}</span> ={" "}
              <span className={"qq " + (t.ok ? "ok" : "no")}>{t.q}</span>
            </span>
            <span className={"res " + (t.ok ? "ok" : "no")}>
              {t.ok
                ? `PRIME ✓ ${evenE} = ${t.p} + ${t.q}`
                : `composite (${t.f}×${t.q / t.f})`}
            </span>
          </div>
        ))}
      </div>

      {winner && (
        <div className="callout good">
          <span className="tag">pair locked</span>
          Found in <strong>{tries.length}</strong> step
          {tries.length === 1 ? "" : "s"}:{" "}
          <strong style={{ color: "var(--win)", fontFamily: "var(--mono)" }}>
            {evenE} = {winner.p} + {winner.q}
          </strong>
          . The descent walked primes downward from {seed} until {evenE} − p came out
          prime.
        </div>
      )}

      <div className="callout warn">
        <span className="tag">honest label: this is a search, not a proof</span>
        The loop is guaranteed to have <em>candidates</em> — Bertrand and its refinements
        pack the interval ({half}, {evenE}) with primes. What no theorem guarantees is
        that one of those primes has <strong>{evenE} − p</strong> also prime. If it
        never did, this loop would run through every candidate and halt in failure —
        and that&apos;s exactly the possibility Goldbach forbids but nobody can rule
        out. &ldquo;It always terminates&rdquo; <em>is</em> Goldbach; the descent finds
        the pair, it doesn&apos;t prove one must exist.
      </div>

      <h3 style={{ marginTop: 32 }}>
        Where it needs more than one try (even numbers up to {MAX})
      </h3>
      <p className="muted" style={{ fontSize: 15 }}>
        {hardList.length} of {(MAX - 6) / 2 + 1} even numbers make the seed miss on
        the first subtraction. Every other even number is solved in a single step.
        Click any to load it into the descent above.
      </p>
      <div className="hardlist">
        {hardList.map(({ E: m, tries: k }) => (
          <span
            key={m}
            className={"hchip" + (m === evenE ? " cur" : "")}
            onClick={() => setE(m)}
            title={`${m}: ${k} tries`}
          >
            {m}
            <span className="k">×{k}</span>
          </span>
        ))}
      </div>
    </>
  );
}
