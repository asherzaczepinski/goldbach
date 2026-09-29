import Link from "next/link";
import type { Metadata } from "next";
import PairingBlocks from "../PairingBlocks";

export const metadata: Metadata = {
  title: "Pairing Blocks — Goldbach visualizer",
  description:
    "Type an even number, split it into every odd + odd summation pairing, then invalidate any pairing whose first number is a multiple of a smaller odd.",
};

export default function PairingsPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">Interactive · Pairings</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            Split an even number into{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              every pairing
            </em>
            , then knock out the multiples.
          </h1>
          <p className="lede">
            Type an even number <code className="kbd">E</code>. It fans out into
            every summation pairing that adds to E —{" "}
            <code className="kbd">1 + 99</code>, <code className="kbd">3 + 97</code>
            , <code className="kbd">5 + 95</code>, and so on. Then it walks the
            first number of each pairing against every odd before it: if some
            smaller odd divides it (the first number is a multiple of 3, 5, 7…),
            that first number is composite and the pairing is marked invalid.
          </p>
        </div>

        <PairingBlocks />

        <p className="muted" style={{ paddingBottom: 60, fontSize: 15 }}>
          What survives are the pairings whose first number no smaller odd can
          divide — the primes (plus 1). Pair those survivors up and you are back
          at Goldbach&apos;s question of whether two of them always rebuild E. See
          the <Link href="/#explore">folded-strip write-up</Link> for where that
          gets hard.
        </p>
      </div>
    </main>
  );
}
