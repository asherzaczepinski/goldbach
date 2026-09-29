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
function fClass(p: number): string {
  return p === 3 ? "f3" : p === 5 ? "f5" : p === 7 ? "f7" : "fx";
}

const MAX = 600;

export default function RoomVisualizer() {
  const [E, setE] = useState(120);
  const [step, setStep] = useState(99);
  const evenE = E % 2 === 0 ? E : E + 1;

  const data = useMemo(() => {
    const half = Math.floor(evenE / 2);
    const allPrimes: number[] = [];
    for (let p = 3; p * p <= half; p += 2) if (isPrime(p)) allPrimes.push(p);
    const k = Math.min(step, allPrimes.length);
    const applied = allPrimes.slice(0, k);

    const cells = [];
    for (let x = 3; x <= half; x += 2) {
      let eatenBy = 0;
      for (const p of applied)
        if (x % p === 0 && x !== p) {
          eatenBy = p;
          break;
        }
      cells.push({ x, eatenBy, prime: isPrime(x) });
    }
    const survivors = cells.filter((c) => !c.eatenBy).length;
    const trulyPrimes = cells.filter((c) => c.prime).length;

    // Bertrand: a prime is guaranteed in (half/2, half]; mark the largest such prime
    let bert = 0;
    for (let x = half; x > half / 2; x--)
      if (isPrime(x)) {
        bert = x;
        break;
      }

    let density = 0.5;
    for (const p of applied) density *= 1 - 1 / p;

    return { half, allPrimes, applied, cells, survivors, trulyPrimes, bert, density };
  }, [evenE, step]);

  const { half, allPrimes, applied, cells, survivors, trulyPrimes, bert, density } =
    data;
  const current = applied[applied.length - 1];

  return (
    <>
      <div className="bctrl">
        <div className="bignum">{evenE}</div>
        <input
          type="range"
          min={20}
          max={MAX}
          step={2}
          value={Math.min(evenE, MAX)}
          onChange={(e) => setE(Number(e.target.value))}
        />
        <span className="bstat">
          window [3, {half}] · {allPrimes.length} sieving primes ≤ √{half}
        </span>
      </div>

      <div className="stepbar">
        <span className="trybadge">
          trying prime: <b>{current ?? "—"}</b>
        </span>
        <button
          className="btn ghost"
          onClick={() => setStep(0)}
        >
          reset
        </button>
        <button
          className="btn ghost"
          onClick={() => setStep((s) => Math.max(0, Math.min(s, allPrimes.length) - 1))}
        >
          ◀ prev
        </button>
        <button
          className="btn"
          onClick={() =>
            setStep((s) => Math.min(allPrimes.length, Math.min(s, allPrimes.length) + 1))
          }
        >
          next prime ▶
        </button>
        <button className="btn ghost" onClick={() => setStep(99)}>
          apply all
        </button>
      </div>

      <div className="miniStats">
        <span>
          primes applied: <b>{applied.length}</b> / {allPrimes.length}
        </span>
        <span>
          still standing: <b>{survivors}</b>
        </span>
        <span>
          actual primes in window: <b>{trulyPrimes}</b>
        </span>
        <span>
          survivor density now: <b>{(density * 100).toFixed(1)}%</b>
        </span>
      </div>

      <div className="roomstrip">
        {cells.map((c) => {
          const cls = c.eatenBy
            ? "rcell " + fClass(c.eatenBy)
            : c.prime
            ? "rcell surv" + (c.x === bert ? " bert" : "")
            : "rcell pending";
          return (
            <div
              key={c.x}
              className={cls}
              title={
                c.eatenBy
                  ? `${c.x} eaten by ${c.eatenBy}`
                  : c.prime
                  ? `${c.x} prime — still standing`
                  : `${c.x} not yet eaten`
              }
            >
              {c.x}
            </div>
          );
        })}
      </div>

      <div className="callout">
        <span className="tag">the 1/3</span>
        Sieve out multiples of 2 (we already only show odds) and 3, and exactly{" "}
        <strong>(1/2)(2/3) = 1/3</strong> of the numbers survive — the window is
        never wiped out by the small primes. Keep going and the surviving fraction
        keeps shrinking (like <code className="kbd">1 / ln</code>), but it stays
        positive: there is always leftover space.
      </div>

      <div className="callout good">
        <span className="tag">Bertrand&apos;s postulate — proved</span>
        For every n there is a prime between n and 2n. Taking n = {Math.floor(half / 2)},
        a prime is guaranteed in ({Math.floor(half / 2)}, {half}] — here it&apos;s{" "}
        <strong style={{ color: "var(--win)" }}>{bert}</strong> (outlined green). So
        the window [3, {half}] <em>always</em> contains a prime. That is the honest,
        provable version of &ldquo;there&apos;s always a prime in this area&rdquo; —
        and it&apos;s elementary (Erdős), the same flavor as Euclid.
      </div>

      <div className="callout warn">
        <span className="tag">why this still isn&apos;t Goldbach</span>
        Euclid gives infinitely many primes; Bertrand pins one inside the window.
        But Goldbach needs a prime <strong>p</strong> in here whose partner{" "}
        <strong>{evenE} − p</strong> is <em>also</em> prime — two survivors lined up
        at once. Bertrand guarantees the room; it says nothing about the partner on
        the far side also landing prime. That pairing is the parity wall from the
        write-up, and no interval theorem crosses it.
      </div>
    </>
  );
}
