"use client";

import { useMemo, useState } from "react";

/**
 * Covering systems (Erdős). Choose one residue a_n mod n for each modulus in
 * {3,5,7,9,11}. An integer is COVERED if it hits at least one congruence, and a
 * HOLE if it dodges all five. Everything repeats mod LCM(3,5,7,9,11) = 3465, so
 * the whole infinite picture lives in one 3465-cell fundamental domain.
 *
 * Exact facts (provable, not heuristic):
 *  - For pairwise-COPRIME moduli the residue choice never changes the COUNT
 *    covered — each modulus n always removes exactly 1/n of the integers; only
 *    WHICH integers shift. So the only real lever here is 3 vs 9 (shared factor).
 *  - Make 9's residue dodge 3's residue mod 3 → the two become disjoint.
 *    Survivors = (5/9)(4/5)(6/7)(10/11) = 80/231  ⇒  best coverage = 151/231.
 *  - 2265 / 3465 = 65.37% is the most you can ever cover with this set;
 *    100% is impossible because 1/3+1/5+1/7+1/9+1/11 ≈ 0.878 < 1.
 */

const MODULI = [3, 5, 7, 9, 11] as const;
const LCM = 3465; // = 9·5·7·11
const COLS = 77; // 77·45 = 3465 — mod-7/mod-11 align to columns, mod-9/mod-5 to rows

type Residues = Record<number, number>;

const BEST: Residues = { 3: 0, 5: 0, 7: 0, 9: 1, 11: 0 }; // a9 % 3 ≠ a3  → 2265 covered
const WORST: Residues = { 3: 0, 5: 0, 7: 0, 9: 0, 11: 0 }; // a9 % 3 = a3 → 9 is redundant

function coverageOf(a: Residues) {
  const covered = new Uint8Array(LCM);
  let count = 0;
  for (let x = 0; x < LCM; x++) {
    if (
      x % 3 === a[3] ||
      x % 5 === a[5] ||
      x % 7 === a[7] ||
      x % 9 === a[9] ||
      x % 11 === a[11]
    ) {
      covered[x] = 1;
      count++;
    }
  }
  return { covered, count };
}

export default function CoveringGame() {
  const [a, setA] = useState<Residues>({ ...BEST });

  const { covered, count } = useMemo(() => coverageOf(a), [a]);
  const holes = LCM - count;
  const pct = (100 * count) / LCM;

  // does 9 pull its weight, or is it redundant against 3?
  const nineDodges = a[9] % 3 !== a[3];

  const set = (n: number, v: number) => setA((p) => ({ ...p, [n]: v }));

  return (
    <div className="explorer">
      <div className="callout">
        <span className="tag">the game</span>
        Pick one remainder for each modulus. A number turns{" "}
        <span style={{ color: "var(--win)", fontWeight: 600 }}>green</span> the
        moment any pattern hits it, and stays a{" "}
        <span style={{ color: "var(--hole)", fontWeight: 600 }}>red hole</span> if
        it dodges all five. Everything repeats after{" "}
        <code className="kbd">LCM(3,5,7,9,11) = 3465</code>, so this one panel is
        the entire number line, forever.
      </div>

      {/* residue pickers */}
      <div className="controls" style={{ gap: 14 }}>
        {MODULI.map((n) => (
          <div className="field" key={n} style={{ minWidth: 0 }}>
            <label style={{ fontFamily: "var(--mono)" }}>
              a<sub>{n}</sub> mod {n}
            </label>
            <div className="chiprow" style={{ margin: "4px 0 0" }}>
              {Array.from({ length: n }, (_, r) => {
                const on = a[n] === r;
                return (
                  <span
                    key={r}
                    className="chip"
                    onClick={() => set(n, r)}
                    style={
                      on
                        ? {
                            background: "var(--accent)",
                            color: "#1a1a1a",
                            borderColor: "var(--accent)",
                            fontWeight: 700,
                          }
                        : undefined
                    }
                  >
                    {r}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="chiprow" style={{ marginTop: 10 }}>
        <span className="chip" onClick={() => setA({ ...BEST })}>
          ★ best possible
        </span>
        <span className="chip" onClick={() => setA({ ...WORST })}>
          worst
        </span>
      </div>

      {/* coverage grid — the full fundamental domain mod 3465 */}
      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 1,
          background: "var(--line)",
          border: "1px solid var(--line)",
          borderRadius: 6,
          overflow: "hidden",
          lineHeight: 0,
        }}
        aria-label="coverage of every residue mod 3465"
      >
        {Array.from({ length: LCM }, (_, x) => (
          <span
            key={x}
            style={{
              width: "100%",
              aspectRatio: "1 / 1",
              background: covered[x]
                ? "var(--win-dim)"
                : "var(--hole)",
              boxShadow: covered[x]
                ? "inset 0 0 0 0.5px var(--win)"
                : undefined,
            }}
          />
        ))}
      </div>
      <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>
        3465 cells — one full period. Green = covered, red = a hole that repeats
        forever. Columns run mod 77 (=7·11), rows mod 45 (=9·5), so the leftover
        holes fall into clean arithmetic-progression stripes.
      </p>

      {/* stats */}
      <div className="stats">
        <div className="stat">
          <div className="k">covered</div>
          <div className={`v ${pct >= 65 ? "win" : ""}`}>
            {pct.toFixed(2)}%
          </div>
        </div>
        <div className="stat">
          <div className="k">holes left (per 3465)</div>
          <div className="v bad">{holes.toLocaleString()}</div>
        </div>
        <div className="stat">
          <div className="k">best possible with {`{3,5,7,9,11}`}</div>
          <div className="v win">65.37%</div>
        </div>
      </div>

      <div
        className={`callout ${nineDodges ? "good" : "warn"}`}
        style={{ marginTop: 6 }}
      >
        <span className="tag">the only choice that matters: 3 vs 9</span>
        {nineDodges ? (
          <>
            Right now <code className="kbd">a₉ mod 3 = {a[9] % 3}</code> ≠{" "}
            <code className="kbd">a₃ = {a[3]}</code>, so the 9-pattern lands on
            fresh numbers the 3-pattern missed — it pulls its full weight. This is
            the winning move.
          </>
        ) : (
          <>
            Right now <code className="kbd">a₉ mod 3 = {a[9] % 3}</code> ={" "}
            <code className="kbd">a₃ = {a[3]}</code>, so every number the
            9-pattern hits was <em>already</em> covered by the 3-pattern. The
            modulus 9 is doing nothing. Give it a residue with{" "}
            <code className="kbd">a₉ mod 3 ≠ {a[3]}</code> to gain 6.9 points.
          </>
        )}
      </div>

      <div className="callout">
        <span className="tag">why only 3 and 9?</span>
        For any two <em>coprime</em> moduli (3&amp;5, 5&amp;7, …), the Chinese
        Remainder Theorem forces them to overlap on exactly one class no matter
        which residues you pick — so shuffling residues moves the holes around but
        never changes <em>how many</em> there are. Each coprime modulus{" "}
        <code className="kbd">n</code> removes exactly{" "}
        <code className="kbd">1/n</code>, full stop. The single real decision in
        this whole puzzle is whether <strong>9</strong> reinforces{" "}
        <strong>3</strong> or dodges it.
      </div>

      {/* the exact optimum */}
      <div className="callout good">
        <span className="tag">the exact ceiling</span>
        The most you can ever cover with these five moduli is
        <div
          style={{
            fontFamily: "var(--mono)",
            color: "var(--paper)",
            fontSize: 20,
            margin: "6px 0",
          }}
        >
          (5⁄9)(4⁄5)(6⁄7)(10⁄11) uncovered ⇒ 2265 / 3465 = 151⁄231 ≈ 65.37%
        </div>
        leaving <strong>1200</strong> holes per period that no choice can close.
        And it can never reach 100%, because{" "}
        <code className="kbd">1⁄3+1⁄5+1⁄7+1⁄9+1⁄11 ≈ 0.878 &lt; 1</code> — there
        simply isn&apos;t enough coverage to go around, even before overlaps eat
        into it.
      </div>

      <div className="callout warn">
        <span className="tag">the honest frontier</span>
        This exact 65.37% is a finite fact — a computer checks all 3465 residues
        and it&apos;s settled. The genuinely <em>open</em> question sits one step
        out: can you cover <em>every</em> integer using{" "}
        <strong>distinct odd moduli &gt; 1</strong> if you&apos;re allowed as many
        as you like? This is <strong>Erdős Problem #7</strong>, still unsolved —
        Selfridge offered <strong>$2000</strong> for a single explicit example.
        Nobody has one. We do know a lot about what one would have to look like:
        its lcm must be divisible by <strong>9 or 15</strong>, it can&apos;t use
        only square-free moduli (BBMST), and a 2026 machine-checked proof forces
        its lcm past <strong>10,000</strong>. The starvation you feel above — odd
        moduli give so little coverage that you can&apos;t reach 1 — is exactly the
        intuition. The one modulus that makes covering trivial,{" "}
        <code className="kbd">2</code>, is the one you&apos;re barred from.
      </div>

      <div className="hint">
        A <em>covering system</em> is a set of congruences that leaves no holes.
        With an even modulus available it&apos;s easy (0 mod 2 alone covers half;
        add 1 mod 2 and you&apos;re done). Ban even moduli and force them distinct
        and it may be impossible — that&apos;s the Erdős–Selfridge conjecture. Play
        above and you can feel why: red never fully disappears.
      </div>
    </div>
  );
}
