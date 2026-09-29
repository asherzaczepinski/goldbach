import Link from "next/link";
import type { Metadata } from "next";
import DifferenceGraph from "../DifferenceGraph";

export const metadata: Metadata = {
  title: "Prime differences — gaps, and gaps of gaps",
  description:
    "Bar graphs of the finite differences of the primes: the gaps between primes, then the differences between those, and so on down.",
};

export default function DifferencesPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">Interactive · Prime differences</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            The gaps, the gaps between gaps, and{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              on down
            </em>
            .
          </h1>
          <p className="lede">
            Start with the primes. The first bar row below them is the{" "}
            <strong>difference</strong> between each pair — the prime gaps. The
            next row is the difference between <em>those</em>. The next, the
            difference between those. Stack as many levels as you like and watch
            whether the pattern ever calms down. (It doesn&apos;t.)
          </p>
        </div>

        <DifferenceGraph />

        <p className="muted" style={{ padding: "40px 0 60px", fontSize: 15 }}>
          For a polynomial sequence like <code className="kbd">n²</code> the
          differences flatten to a constant after a few levels. The primes never
          do — every level keeps jittering, a small visual echo of the fact that
          primes obey no simple closed-form rule. See{" "}
          <Link href="/primes">primes</Link> for the raw dots.
        </p>
      </div>
    </main>
  );
}
