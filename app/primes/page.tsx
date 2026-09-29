import Link from "next/link";
import type { Metadata } from "next";
import PrimeGraph from "../PrimeGraph";

export const metadata: Metadata = {
  title: "Every prime — Ulam spiral & grid",
  description:
    "Plot every prime from 1 up to as high as you like, as an Ulam spiral or a square grid. Watch the diagonal streaks and the thinning density.",
};

export default function PrimesPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">Interactive · Every prime</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            Every prime from 1 up to{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              as high as you dare
            </em>
            .
          </h1>
          <p className="lede">
            Start at 1000, then crank N up. In the <strong>Ulam spiral</strong>{" "}
            the numbers wind out from the center and the primes fall onto
            unexplained diagonal streaks. In the <strong>grid</strong> they lay
            out in reading order. Either way you can watch the primes thin out as
            the numbers get large.
          </p>
        </div>

        <PrimeGraph />

        <p className="muted" style={{ padding: "40px 0 60px", fontSize: 15 }}>
          These are the same primes that pair up in the{" "}
          <Link href="/comet">comet</Link> and{" "}
          <Link href="/firstprimes">first-primes</Link> tabs — here shown raw, no
          Goldbach. The diagonals in the spiral come from prime-rich quadratics;
          the overall thinning is the Prime Number Theorem,{" "}
          <code className="kbd">π(N) ≈ N / ln N</code>.
        </p>
      </div>
    </main>
  );
}
