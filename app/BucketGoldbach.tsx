"use client";

import { useMemo, useState } from "react";

// water color for a prime value: 1&2 blue, 3 purple, 5 orange, 7 pink, else gold
function waterColor(v: number): string {
  if (v <= 2) return "#6ea8fe";
  if (v === 3) return "#8b6cff";
  if (v === 5) return "#f0913c";
  if (v === 7) return "#ec6fb0";
  return "#e8b64c";
}

const MAX = 1000;

export default function BucketGoldbach() {
  const [E, setE] = useState(100);
  const evenE = E % 2 === 0 ? E : E + 1;

  // sieve once
  const isP = useMemo(() => {
    const comp = new Uint8Array(MAX + 1);
    for (let i = 2; i * i <= MAX; i++)
      if (!comp[i]) for (let j = i * i; j <= MAX; j += i) comp[j] = 1;
    return (n: number) => n >= 2 && !comp[n];
  }, []);

  // pool (1..MAX) + comet (counts for every even 6..MAX) computed once
  const { pool, comet, maxCount } = useMemo(() => {
    const pool = [];
    for (let n = 1; n <= MAX; n++)
      pool.push({ n, prime: n === 1 || isP(n), special: n <= 2 });
    const comet: { m: number; count: number }[] = [];
    let maxCount = 1;
    for (let m = 6; m <= MAX; m += 2) {
      let c = 0;
      for (let p = 3; p <= m / 2; p += 2) if (isP(p) && isP(m - p)) c++;
      comet.push({ m, count: c });
      if (c > maxCount) maxCount = c;
    }
    return { pool, comet, maxCount };
  }, [isP]);

  // pairs that fill E exactly (1,2 allowed for the tiny cases)
  const pairs = useMemo(() => {
    const out: { p: number; q: number }[] = [];
    for (let p = evenE === 2 ? 1 : 2; p <= evenE / 2; p++) {
      const q = evenE - p;
      const pOK = isP(p) || (p === 1 && q === 1);
      const qOK = isP(q) || (q === 1 && p === 1);
      if (pOK && qOK) out.push({ p, q });
    }
    return out;
  }, [evenE, isP]);

  const usedSet = useMemo(() => {
    const s = new Set<number>();
    for (const pr of pairs) {
      s.add(pr.p);
      s.add(pr.q);
    }
    return s;
  }, [pairs]);

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
          pairs that fill {evenE}: <b>{pairs.length}</b>
        </span>
      </div>

      {/* the pour */}
      <h3 style={{ marginTop: 8 }}>Each pair pours to exactly {evenE}</h3>
      <p className="muted" style={{ fontSize: 15 }}>
        Two prime buckets tipped into one E-sized bucket. The dashed line is the
        brim — the water has to land <em>exactly</em> on it: no overflow, no
        underflow. Every pair below hits it, because {evenE} = p + q.
      </p>
      <div className="pairbuckets">
        {pairs.map(({ p, q }) => (
          <div className="pbk" key={p}>
            <div className="g" title={`${p} + ${q} = ${evenE}`}>
              <span className="brim" />
              <span className="brimlab">{evenE}</span>
              <span
                className="band"
                style={{ height: `${(p / evenE) * 100}%`, background: waterColor(p) }}
              />
              <span
                className="band"
                style={{ height: `${(q / evenE) * 100}%`, background: waterColor(q) }}
              />
            </div>
            <span className="cap">
              <span className="s" style={{ color: waterColor(p) }}>
                {p}
              </span>{" "}
              +{" "}
              <span className="s" style={{ color: waterColor(q) }}>
                {q}
              </span>
            </span>
          </div>
        ))}
        {pairs.length === 0 && (
          <span className="bstat">no pair fills it — a counterexample?!</span>
        )}
      </div>

      {/* the buckets */}
      <h3 style={{ marginTop: 40 }}>The {MAX} buckets</h3>
      <p className="muted" style={{ fontSize: 15 }}>
        Every number 1–{MAX} as a bucket. A{" "}
        <span style={{ color: "var(--accent)" }}>prime</span> holds its water —
        nothing divides it evenly, so it&apos;s &ldquo;just right.&rdquo; A
        composite <span style={{ opacity: 0.6 }}>leaks</span> (dashed, empty). The
        two buckets used in the current pour glow green.{" "}
        <span style={{ color: "var(--blue)" }}>1 and 2</span> are special.
      </p>
      <div className="poolgrid">
        {pool.map((b) => {
          const cls =
            "pb " +
            (b.prime ? (b.special ? "special" : "prime") : "comp") +
            (usedSet.has(b.n) ? " cur" : "");
          return (
            <div className={cls} key={b.n}>
              <div className="g">
                {b.prime && (
                  <span
                    className="w"
                    style={{
                      height: "100%",
                      background: `linear-gradient(180deg, ${
                        b.special ? "#9ec9ff" : "#e8c56a"
                      }, ${b.special ? "#6ea8fe" : "#c9922f"})`,
                    }}
                  />
                )}
              </div>
              <span className="n">{b.n}</span>
            </div>
          );
        })}
      </div>

      {/* comet */}
      <h3 style={{ marginTop: 40 }}>How many pairs each even number has</h3>
      <p className="muted" style={{ fontSize: 15 }}>
        One bar per even number, 6 → {MAX}. Height = how many prime pairs fill it.
        Click a bar to jump there. It <strong>never touches zero</strong> — that is
        Goldbach, verified across all {comet.length} of them.
      </p>
      <div className="comet">
        {comet.map(({ m, count }) => (
          <div
            key={m}
            className={"cbar" + (m === evenE ? " cur" : "")}
            style={{ height: `${(count / maxCount) * 100}%` }}
            title={`${m}: ${count} pair${count === 1 ? "" : "s"}`}
            onClick={() => setE(m)}
          />
        ))}
      </div>
      <p className="bstat" style={{ marginTop: 10 }}>
        minimum pairs across every even 6–{MAX}:{" "}
        <b>{Math.min(...comet.map((c) => c.count))}</b> — never 0.
      </p>
    </>
  );
}
