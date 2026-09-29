import Link from "next/link";
import type { Metadata } from "next";
import FirstPrimesList from "../FirstPrimesList";

export const metadata: Metadata = {
  title: "First primes — Goldbach visualizer",
  description:
    "For every even number up to a chosen max, the list of first primes: each prime p ≤ E/2 whose partner E − p is also prime.",
};

export default function FirstPrimesPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">Interactive · First primes</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            Every even number and its{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              first-prime list
            </em>
            .
          </h1>
          <p className="lede">
            Pick a ceiling. For each even number E up to it, the list shows every{" "}
            <strong>first prime</strong> — the smaller prime{" "}
            <code className="kbd">p ≤ E/2</code> of each Goldbach pair, where{" "}
            <code className="kbd">E − p</code> is also prime. Small numbers get one
            entry (6 → 3); <code className="kbd">100</code> gets six:{" "}
            <code className="kbd">3, 11, 17, 29, 41, 47</code>. The list only ever
            grows longer — never empty.
          </p>
        </div>

        <FirstPrimesList />

        <p className="muted" style={{ padding: "40px 0 60px", fontSize: 15 }}>
          That every row has at least one chip is exactly Goldbach&apos;s
          conjecture. See the <Link href="/#explore">folded-strip write-up</Link>{" "}
          for why proving &ldquo;never empty&rdquo; for <em>all</em> E is the hard
          part.
        </p>
      </div>
    </main>
  );
}
