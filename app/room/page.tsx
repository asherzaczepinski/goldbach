import Link from "next/link";
import type { Metadata } from "next";
import RoomVisualizer from "../RoomVisualizer";
import DescentVisualizer from "../DescentVisualizer";

export const metadata: Metadata = {
  title: "Always room — Bertrand, the 1/3, and the honest gap",
  description:
    "Sieve the window [3, E/2] by every small prime, watch the 1/3 of space that always survives, and see Bertrand's postulate guarantee a prime there.",
};

export default function RoomPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">Part V · Interactive</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            There is always{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>room</em> for
            a prime.
          </h1>
          <p className="lede">
            Try every small prime on the window below E/2, one at a time. A third of
            the space survives the small primes, and Bertrand&apos;s postulate
            guarantees a real prime is always sitting in there — provably. Then see
            exactly why that guarantee, real as it is, still stops one step short of
            Goldbach.
          </p>
        </div>

        <RoomVisualizer />

        {/* ---- The descent: seed + subtract + step down ---- */}
        <section style={{ borderBottom: "none", padding: "48px 0 0" }}>
          <h2>
            <span className="num">▪</span>The descent — seed, subtract, step down
          </h2>
          <p className="muted">
            Your construction, made live: start from Bertrand&apos;s guaranteed prime
            (the largest below E), subtract it from E, and if the partner isn&apos;t
            prime, walk down to the next prime and try again — until the pair locks
            in. Watch how few tries it takes (try E = 122 to see it miss first).
          </p>
          <DescentVisualizer />
        </section>

        {/* ---- Erdős's proof of Bertrand's postulate ---- */}
        <section style={{ borderBottom: "none", padding: "48px 0 0" }}>
          <h2>
            <span className="num">▪</span>How it&apos;s actually proved
          </h2>
          <p className="muted">
            Bertrand only <em>conjectured</em> it in 1845 (and checked it by hand to
            ~3,000,000). Chebyshev proved it in 1852; the short, elementary proof
            below is <strong>Erdős&apos;s</strong>, from 1932, when he was 19. The
            whole thing is a fight between two facts about one number.
          </p>

          <h3>The one clever object</h3>
          <p>
            Take the middle of row 2n of Pascal&apos;s triangle, the central
            binomial coefficient:
          </p>
          <div className="math">N = C(2n, n) = (2n)! / (n! · n!)</div>

          <div className="callout good">
            <span className="tag">Fact A — it&apos;s big</span>
            The 2n+1 entries of Pascal&apos;s row sum to 4ⁿ, and the middle one is
            the largest, so
            <div className="math" style={{ marginBottom: 0 }}>
              C(2n, n) ≥ 4ⁿ / (2n + 1)
            </div>
          </div>

          <div className="callout">
            <span className="tag">Fact B — its prime factors are small &amp; gentle</span>
            From Legendre&apos;s formula for how often a prime divides a factorial:
            <ul className="clean" style={{ marginTop: 8 }}>
              <li>Every prime power dividing C(2n, n) is ≤ 2n.</li>
              <li>
                Every prime p with 2n/3 &lt; p ≤ n divides it{" "}
                <strong>zero</strong> times — the exponent is exactly 2 − 2·1 = 0.
              </li>
            </ul>
          </div>

          <h3>The squeeze</h3>
          <p>
            Suppose, for contradiction, there is <strong>no prime</strong> between n
            and 2n. Then every prime factor of N is ≤ 2n/3 (nothing in (n, 2n] by
            assumption, nothing in (2n/3, n] by Fact B). Cap how big N could be, built
            only from those:
          </p>
          <div className="math">
            {`primes up to 2n/3   →   product < 4^(2n/3)      (∏_{p≤x} p < 4^x)
primes up to √(2n)  →   product ≤ (2n)^√(2n)     (each prime power ≤ 2n)

           C(2n, n)  ≤  (2n)^√(2n) · 4^(2n/3)`}
          </div>

          <h3>The collision</h3>
          <p>Put the big-ness and the small-ness together:</p>
          <div className="math">
            {`  4ⁿ/(2n+1)   ≤   C(2n,n)   ≤   (2n)^√(2n) · 4^(2n/3)`}
          </div>
          <p>
            The left side grows like <code className="kbd">4ⁿ</code>; the right side
            like <code className="kbd">4^(2n/3)</code> times a far slower{" "}
            <code className="kbd">(2n)^√(2n)</code> piece. Past a few hundred,{" "}
            <strong>4ⁿ crushes 4^(2n/3)</strong> and the inequality becomes
            impossible. Contradiction — so a prime between n and 2n must exist.
          </p>

          <div className="callout">
            <span className="tag">the small cases</span>
            For the n below where the inequality bites, one line finishes it — the
            chain of primes
            <div className="math" style={{ marginBottom: 0 }}>
              2, 3, 5, 7, 13, 23, 43, 83, 163, 317, 631
            </div>
            each less than twice the one before, so together they cover every small n.
          </div>

          <p>
            That&apos;s the whole idea: <strong>a number too big to be manufactured
            out of only small primes — so a big prime has to exist.</strong> Pure
            Euclid spirit (assume otherwise, derive a contradiction), just with a
            cleverer counting object.
          </p>

          <div className="callout warn">
            <span className="tag">and why it doesn&apos;t reach Goldbach</span>
            The squeeze forces <em>one</em> prime into an interval. Goldbach needs{" "}
            <strong>p</strong> and <strong>E − p</strong> prime at the same time —
            and there is no binomial coefficient whose sheer size forces{" "}
            <em>two coordinated</em> primes. The pairing is exactly what this counting
            trick cannot reach.
          </div>
        </section>

        <p className="muted" style={{ padding: "36px 0 60px", fontSize: 15 }}>
          This is the strongest honest thing your instinct points at: the area is
          never empty, and that&apos;s a theorem. The uncrossable step is making the
          prime you find here have a prime partner on the other side — see the{" "}
          <Link href="/#explore">write-up</Link>.
        </p>
      </div>
    </main>
  );
}
