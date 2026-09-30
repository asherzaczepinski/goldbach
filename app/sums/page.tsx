import Link from "next/link";
import type { Metadata } from "next";
import RunningSum from "../RunningSum";

export const metadata: Metadata = {
  title: "Running sums — primes vs non-primes",
  description:
    "Two piggy banks up the number line: the running sum of the primes against the running sum of the non-primes, and the point where the lead flips for good.",
};

export default function SumsPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">Plot · Running sums</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            Primes lead early, then{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              lose forever
            </em>
            .
          </h1>
          <p className="lede">
            March up the whole numbers and keep two totals: everything prime goes
            in one pile, everything non-prime (1 and the composites) in the other.
            At the very start the primes are ahead — but the composites pile up
            faster and faster, and after one early crossover the primes never lead
            again. Watch where the flip happens, and how small the primes&apos;
            share of the total eventually gets.
          </p>
        </div>

        <RunningSum />

        <p className="muted" style={{ padding: "40px 0 60px", fontSize: 15 }}>
          The primes stay ahead only through <code className="kbd">n = 7</code>;
          from 8 onward the non-prime total is permanently in front. That&apos;s
          the prime number theorem showing up as arithmetic: the count of primes
          below <code className="kbd">n</code> grows like{" "}
          <code className="kbd">n / ln n</code>, so their <em>sum</em> is about{" "}
          <code className="kbd">n² / (2 ln n)</code> against{" "}
          <code className="kbd">n² / 2</code> for all the numbers — a share that
          slides toward zero as <code className="kbd">1 / ln n</code>. Compare with{" "}
          <Link href="/differences">differences</Link> and the{" "}
          <Link href="/comet">comet</Link>.
        </p>
      </div>
    </main>
  );
}
