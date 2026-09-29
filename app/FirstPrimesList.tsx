"use client";

import { useMemo, useState } from "react";

/**
 * For each even number E, the "first primes" are the smaller members of every
 * Goldbach pair: primes p with p ≤ E/2 and (E − p) also prime.
 *   E = 6   → [3]            (3 + 3)
 *   E = 100 → [3,11,17,29,41,47]   (six pairs)
 */
export default function FirstPrimesList() {
  const [input, setInput] = useState(100);

  // Any input → an even cap ≥ 4. Guard runaway sizes.
  const HARD_MAX = 20000;
  const raw = Math.max(4, Math.floor(Math.abs(input) || 4));
  const max = Math.min(raw, HARD_MAX);
  const capped = raw > HARD_MAX;

  const rows = useMemo(() => {
    // Sieve of Eratosthenes up to max.
    const isComposite = new Uint8Array(max + 1);
    for (let i = 2; i * i <= max; i++) {
      if (!isComposite[i]) {
        for (let j = i * i; j <= max; j += i) isComposite[j] = 1;
      }
    }
    const isPrime = (x: number) => x >= 2 && !isComposite[x];

    const out: { E: number; firsts: number[] }[] = [];
    for (let E = 4; E <= max; E += 2) {
      const firsts: number[] = [];
      for (let p = 2; p <= E / 2; p++) {
        if (isPrime(p) && isPrime(E - p)) firsts.push(p);
      }
      out.push({ E, firsts });
    }
    return out;
  }, [max]);

  const presets = [50, 100, 200, 500, 1000];

  return (
    <div className="explorer">
      <div className="controls">
        <div className="field">
          <label>List every even number up to</label>
          <input
            type="number"
            step={1}
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>drag max &nbsp;({max})</label>
          <input
            type="range"
            min={4}
            max={2000}
            step={2}
            value={Math.min(Math.max(input, 4), 2000)}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="chiprow">
        {presets.map((p) => (
          <span key={p} className="chip" onClick={() => setInput(p)}>
            up to {p}
          </span>
        ))}
      </div>

      <p className="muted" style={{ marginTop: 14, fontSize: 14 }}>
        Each row is an even number E. The chips are its{" "}
        <strong>first primes</strong> — every prime <code className="kbd">p</code>{" "}
        with <code className="kbd">p ≤ E/2</code> where{" "}
        <code className="kbd">E − p</code> is also prime (the smaller half of each
        Goldbach pair). The count grows with E.
        {capped && ` (Capped at ${HARD_MAX} for speed.)`}
      </p>

      <div className="fp-list">
        {rows.map(({ E, firsts }) => (
          <div key={E} className="fp-row">
            <div className="fp-e">{E}</div>
            <div className="fp-count">{firsts.length}</div>
            <div className="fp-chips">
              {firsts.map((p) => (
                <span
                  key={p}
                  className="fp-chip"
                  title={`${p} + ${E - p} = ${E}`}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
