import Link from "next/link";
import type { Metadata } from "next";
import UnitSieve from "../UnitSieve";

export const metadata: Metadata = {
  title: "Unit-Block Sieve — Goldbach visualizer",
  description:
    "Every odd number drawn as unit squares; watch factors carve composites into equal groups while primes survive, then two survivors rebuild the even number.",
};

export default function SievePage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">Part II · Interactive</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            Carve the odds into <em style={{ color: "var(--accent)", fontStyle: "normal" }}>primes</em>,
            then rebuild the even number.
          </h1>
          <p className="lede">
            Drag through 6 → 100. The numbers run down the left; on the right each
            is drawn as blocks with its factor check. Walk the multiples of the
            primes found so far — if one lands on the number it&apos;s composite
            and eaten; if the number falls between multiples of every prime up to
            √n, nothing divides it and it survives. The survivors are the primes,
            and the first two of them rebuild E.
          </p>
        </div>

        <UnitSieve />

        <p className="muted" style={{ paddingBottom: 60, fontSize: 15 }}>
          This picture makes Goldbach feel inevitable: there are always plenty of
          uncarvable gold rows, and two of them line up to E. Proving &ldquo;two
          always line up&rdquo; for <em>every</em> even number is the part that
          resists — see the{" "}
          <Link href="/#explore">folded-strip write-up</Link> for exactly where
          and why.
        </p>
      </div>
    </main>
  );
}
