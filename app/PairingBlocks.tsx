"use client";

import { useMemo, useState } from "react";

/**
 * Walk every odd number strictly before `x` (starting at 3) and return the
 * FIRST one that divides x — i.e. the smallest odd factor. If none divides it,
 * x has no odd factor before it and the pairing stays valid.
 * (x = 1 is a special case: nothing comes before it, so it is left valid.)
 */
function firstOddFactorBefore(x: number): number | null {
  for (let d = 3; d < x; d += 2) {
    if (x % d === 0) return d; // e.g. 9/3, 15/3, 21/3, 25/5 ...
  }
  return null;
}

type Pairing = {
  a: number; // first number in the pairing
  b: number; // its partner, E - a
  killer: number | null; // the odd before `a` that divides it (null ⇒ valid)
  killerB: number | null; // the odd before `b` that divides it (null ⇒ valid)
};

export default function PairingBlocks() {
  const [input, setInput] = useState(100);

  // Force an even integer ≥ 2; Goldbach-style pairings need an even total.
  const n = Math.max(2, Math.floor(Math.abs(input) || 2));
  const E = n % 2 === 0 ? n : n + 1;

  // Keep huge E responsive: stop building pairings past this many.
  const COMPUTE_CAP = 3000;

  const { pairings, totalPairings } = useMemo(() => {
    const list: Pairing[] = [];
    const half = E / 2;
    // Every summation pairing: 1+(E-1), 3+(E-3), 5+(E-5) ... up to the middle.
    for (let a = 1; a <= half && list.length < COMPUTE_CAP; a += 2) {
      const b = E - a;
      list.push({
        a,
        b,
        killer: firstOddFactorBefore(a),
        killerB: firstOddFactorBefore(b),
      });
    }
    const total = Math.floor((half - 1) / 2) + 1;
    return { pairings: list, totalPairings: total };
  }, [E]);

  // A number "works" only if it is an odd prime: no smaller odd divides it,
  // and it is not the unit 1.
  const works = (num: number, killer: number | null) =>
    killer === null && num !== 1;

  // Bucket every pairing by how many of its two numbers work.
  const noneRows = pairings.filter((p) => !works(p.a, p.killer) && !works(p.b, p.killerB));
  const oneRows = pairings.filter(
    (p) => works(p.a, p.killer) !== works(p.b, p.killerB)
  );
  const bothRows = pairings.filter((p) => works(p.a, p.killer) && works(p.b, p.killerB));

  const capped = pairings.length < totalPairings;

  // A pairing to explain step-by-step (default: the first invalid one).
  const [focus, setFocus] = useState<number | null>(null);
  const focusPair =
    pairings.find((p) => p.a === focus) ??
    pairings.find((p) => p.killer !== null) ??
    pairings[0];

  const presets = [10, 50, 100, 210, 500, 1000];

  return (
    <div className="explorer">
      <div className="controls">
        <div className="field">
          <label>Number (any) — becomes E = {E}</label>
          <input
            type="number"
            step={1}
            value={input}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <div className="field">
          <label>drag E &nbsp;({E})</label>
          <input
            type="range"
            min={2}
            max={2000}
            step={1}
            value={Math.min(Math.max(input, 2), 2000)}
            onChange={(e) => setInput(Number(e.target.value))}
          />
        </div>
        <button className="btn ghost" onClick={() => setInput(E + 2)}>
          + next even
        </button>
      </div>

      <div className="chiprow">
        {presets.map((p) => (
          <span key={p} className="chip" onClick={() => setInput(p)}>
            E = {p}
          </span>
        ))}
      </div>

      <div className="legend" style={{ marginTop: 18 }}>
        <span>
          <i className="swatch" style={{ background: "#1e3b28", border: "1px solid #58c07a" }} />
          <span style={{ color: "#1a8f4c" }}>prime ✓</span> — no smaller odd divides it
        </span>
        <span>
          <i className="swatch" style={{ background: "#47201d", border: "1px solid #6d2d28" }} />
          <span style={{ color: "#c0392b" }}>÷d</span> — multiple of a smaller odd (or the unit 1)
        </span>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="k">E</div>
          <div className="v">{E}</div>
        </div>
        <div className="stat">
          <div className="k">total pairings</div>
          <div className="v">{totalPairings}</div>
        </div>
        <div className="stat">
          <div className="k">neither works</div>
          <div className="v bad">{noneRows.length}</div>
        </div>
        <div className="stat">
          <div className="k">one is off</div>
          <div className="v">{oneRows.length}</div>
        </div>
        <div className="stat">
          <div className="k">both work</div>
          <div className="v win">{bothRows.length}</div>
        </div>
      </div>

      {/* Step-by-step walk of one pairing's first number */}
      {focusPair && (
        <div className={"callout " + (focusPair.killer ? "warn" : "good")}>
          <span className="tag">
            {focusPair.killer ? "invalid pairing" : "valid pairing"}
          </span>
          <div
            style={{
              fontFamily: "var(--mono)",
              color: "var(--paper)",
              fontSize: 18,
              marginBottom: 8,
            }}
          >
            {E} = {focusPair.a} + {focusPair.b}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 14, lineHeight: 1.9 }}>
            checking odds before {focusPair.a}:{" "}
            {focusPair.a < 3 ? (
              <em>nothing comes before {focusPair.a}</em>
            ) : (
              Array.from(
                { length: Math.floor((focusPair.a - 3) / 2) + 1 },
                (_, i) => 3 + i * 2
              ).map((d) => {
                const hit = focusPair.a % d === 0;
                const isKiller = d === focusPair.killer;
                if (isKiller) {
                  return (
                    <span key={d} style={{ color: "#c0392b", fontWeight: 700 }}>
                      {focusPair.a} ÷ {d} = {focusPair.a / d} ✓ multiple → STOP
                    </span>
                  );
                }
                // odds after the killer aren't reached
                if (focusPair.killer !== null && d > focusPair.killer) return null;
                return (
                  <span key={d} style={{ opacity: 0.7 }}>
                    {focusPair.a} ÷ {d} {hit ? "= " + focusPair.a / d : "✗"} ·{" "}
                  </span>
                );
              })
            )}
            {focusPair.killer === null && (
              <span style={{ color: "#1a8f4c" }}>
                none divide it → first number is valid ✓
              </span>
            )}
          </div>
        </div>
      )}

      {/* Three tables, grouped by how many of the two numbers work */}
      <PairTable
        title="Neither works"
        subtitle="the unit 1 and composites — no odd prime on either side"
        rows={noneRows}
        onPick={setFocus}
      />
      <PairTable
        title="One is off"
        subtitle="exactly one side is prime; the other is a multiple of a smaller odd"
        rows={oneRows}
        onPick={setFocus}
      />
      <PairTable
        title="Both work"
        subtitle="both sides prime ⇒ a real Goldbach pair for E"
        rows={bothRows}
        onPick={setFocus}
        good
      />

      <div className="hint">
        Each row is one pairing that adds to <strong>{E}</strong>. A number is{" "}
        <span style={{ color: "#1a8f4c" }}>prime ✓</span> when no smaller odd
        divides it; it is <span style={{ color: "#c0392b" }}>÷d</span> when it is
        a multiple of the smaller odd <em>d</em>; <strong>1</strong> is the{" "}
        <em>unit</em> and counts as not working. Click any row to walk its first
        number against every odd before it.{" "}
        {capped &&
          `Computed the first ${pairings.length} of ${totalPairings} pairings (E large — truncated for speed).`}
      </div>
    </div>
  );
}

function numNote(num: number, killer: number | null) {
  if (killer !== null) return `÷${killer}`;
  if (num === 1) return "✗ unit";
  return "✓ prime";
}

function PairTable({
  title,
  subtitle,
  rows,
  onPick,
  good = false,
}: {
  title: string;
  subtitle: string;
  rows: Pairing[];
  onPick: (a: number) => void;
  good?: boolean;
}) {
  return (
    <div style={{ marginTop: 26 }}>
      <div className="ptable-title">
        {title} <span className="ptable-count">{rows.length}</span>
      </div>
      <div className="ptable-sub">{subtitle}</div>
      {rows.length === 0 ? (
        <div className="ptable-empty">none for this E</div>
      ) : (
        <div className="ptable-scroll">
          <table className="ptable">
            <thead>
              <tr>
                <th>#</th>
                <th>First</th>
                <th>Second</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr
                  key={p.a}
                  className={good ? "row-good" : ""}
                  onClick={() => onPick(p.a)}
                  style={{ cursor: "pointer" }}
                >
                  <td className="muted-cell">{i + 1}</td>
                  <td className={p.killer !== null || p.a === 1 ? "cell-bad" : "cell-good"}>
                    {p.a} <span className="cell-note">{numNote(p.a, p.killer)}</span>
                  </td>
                  <td className={p.killerB !== null || p.b === 1 ? "cell-bad" : "cell-good"}>
                    {p.b} <span className="cell-note">{numNote(p.b, p.killerB)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
