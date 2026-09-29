"use client";

import { useEffect, useMemo, useState } from "react";

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

const PITCH = 40; // block width (34) + margin (6)
const BLK_W = 34;
const ARC_H = 74;

export default function SieveGoldbach() {
  const [E, setE] = useState(10);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const MAX = 130;
  const evenE = E % 2 === 0 ? E : E + 1;

  // auto-advance through even numbers
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setE((prev) => {
        const next = prev + 2;
        return next > MAX ? 6 : next;
      });
      setActive(null);
    }, 1100);
    return () => clearInterval(id);
  }, [playing]);

  const model = useMemo(() => {
    // odd numbers 3,5,...,E-1
    const odds: {
      v: number;
      prime: boolean;
      factor: number;
      idx: number;
    }[] = [];
    let idx = 0;
    for (let v = 3; v <= evenE - 1; v += 2) {
      const prime = isPrime(v);
      odds.push({ v, prime, factor: prime ? v : smallestFactor(v), idx });
      idx++;
    }
    // Goldbach pairs (p <= q), both odd primes, p+q = E
    const pairs: { p: number; q: number }[] = [];
    for (let p = 3; p <= evenE / 2; p += 2) {
      const q = evenE - p;
      if (isPrime(p) && isPrime(q)) pairs.push({ p, q });
    }
    const primesLeft = odds.filter((o) => o.prime).length;
    const eaten = odds.length - primesLeft;
    return { odds, pairs, primesLeft, eaten };
  }, [evenE]);

  const { odds, pairs, primesLeft, eaten } = model;

  // clamp active index if E changed
  const activePair =
    active !== null && active < pairs.length ? pairs[active] : null;
  const litValues = new Set<number>();
  if (activePair) {
    litValues.add(activePair.p);
    litValues.add(activePair.q);
  }

  const idxOf = (v: number) => (v - 3) / 2;
  const centerX = (v: number) => idxOf(v) * PITCH + BLK_W / 2;
  const totalW = Math.max(odds.length * PITCH, 120);

  return (
    <div className="sieve">
      <div className="toolbar">
        <div className="bignum">{evenE}</div>
        <input
          type="range"
          min={6}
          max={MAX}
          step={2}
          value={Math.min(evenE, MAX)}
          onChange={(e) => {
            setE(Number(e.target.value));
            setActive(null);
          }}
        />
        <button
          className="btn"
          onClick={() => setPlaying((p) => !p)}
          aria-label="play"
        >
          {playing ? "❚❚ pause" : "▶ play"}
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setE((p) => Math.max(6, p - 2));
            setActive(null);
          }}
        >
          −2
        </button>
        <button
          className="btn ghost"
          onClick={() => {
            setE((p) => p + 2);
            setActive(null);
          }}
        >
          +2
        </button>
      </div>

      <div className="eqbig">
        {activePair ? (
          <>
            <span className="e">{evenE}</span> ={" "}
            <span className="p">{activePair.p}</span> +{" "}
            <span className="p">{activePair.q}</span>
          </>
        ) : pairs.length ? (
          <>
            <span className="e">{evenE}</span> ={" "}
            <span className="p">{pairs[0].p}</span> +{" "}
            <span className="p">{pairs[0].q}</span>
            <span
              className="muted"
              style={{ fontSize: 14, marginLeft: 12, fontFamily: "var(--serif)" }}
            >
              (hover a pair below)
            </span>
          </>
        ) : (
          <span className="none">no prime pair — counterexample?!</span>
        )}
      </div>

      <div className="stage">
        <div className="stage-inner" style={{ width: totalW }}>
          <svg
            className="arcs"
            width={totalW}
            height={ARC_H}
            style={{ height: ARC_H }}
          >
            {pairs.map((pr, i) => {
              const x1 = centerX(pr.p);
              const x2 = centerX(pr.q);
              const mid = (x1 + x2) / 2;
              const peak = Math.max(6, ARC_H - (x2 - x1) * 0.32);
              const d = `M ${x1} ${ARC_H} Q ${mid} ${peak} ${x2} ${ARC_H}`;
              const isAct = active === i;
              return (
                <path
                  key={i}
                  d={d}
                  className={isAct ? "active" : ""}
                />
              );
            })}
          </svg>

          <div className="odds-row" style={{ marginTop: ARC_H }}>
            {odds.map((o) => {
              const lit = litValues.has(o.v);
              const cls = lit
                ? "blk paired"
                : o.prime
                ? "blk prime"
                : "blk eaten";
              return (
                <div
                  key={o.v}
                  className={cls}
                  title={
                    o.prime
                      ? `${o.v} is prime — survives`
                      : `${o.v} = ${o.factor} × ${o.v / o.factor} — eaten`
                  }
                >
                  <span className="n">{o.v}</span>
                  {!o.prime && (
                    <span className="f">
                      {o.factor}·{o.v / o.factor}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="miniStats">
        <span>
          odd blocks under {evenE}: <b>{odds.length}</b>
        </span>
        <span>
          eaten (composite): <b>{eaten}</b>
        </span>
        <span>
          primes surviving: <b>{primesLeft}</b>
        </span>
        <span>
          prime pairs summing to {evenE}: <b>{pairs.length}</b>
        </span>
      </div>

      <div className="pairbar">
        <span className="lbl">Goldbach pairs</span>
        {pairs.map((pr, i) => (
          <span
            key={i}
            className={"pchip" + (active === i ? " active" : "")}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onClick={() => setActive(i)}
          >
            {pr.p} + {pr.q}
          </span>
        ))}
        {!pairs.length && <span className="none">none</span>}
      </div>
    </div>
  );
}
