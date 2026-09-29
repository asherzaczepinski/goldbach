import Link from "next/link";
import type { Metadata } from "next";
import WorstCase from "../WorstCase";

export const metadata: Metadata = {
  title: "Worst-case hunter — the best place to break Goldbach",
  description:
    "An equation that generates the even numbers most likely to be a Goldbach counterexample (N = 2^k), and the chance of finding one there — the best odds possible, and still hopeless.",
};

export default function WorstCasePage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">A checked finding · search strategy</p>
          <h1 style={{ fontSize: "clamp(28px,4.5vw,42px)" }}>
            The{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              worst-case hunter
            </em>{" "}
            — the smartest place to look.
          </h1>
          <p className="lede">
            If you wanted to <em>break</em> Goldbach, you&apos;d ignore the spikes
            and hunt the numbers with the fewest pairs. Here&apos;s an equation
            that generates exactly those worst cases — and the chance of finding a
            counterexample among them, which is the best odds possible.
          </p>
        </div>

        <section style={{ borderBottom: "none", paddingTop: 16 }}>
          <WorstCase />
        </section>

        <section style={{ borderBottom: "none", paddingTop: 6, paddingBottom: 20 }}>
          <p className="muted" style={{ fontSize: 15 }}>
            Why <code className="kbd">2^k</code>? The number of Goldbach pairs is{" "}
            <code className="kbd">≈ 2C₂ · N/(lnN)² · ∏(p−1)/(p−2)</code> over odd
            primes dividing N. That product is a boost that&apos;s bigger the more
            small factors N has — so it&apos;s <em>smallest</em> (equal to 1) when N
            has none, i.e. a power of two. Fewest pairs ⇒ highest failure chance ⇒
            the best target. See the bands this creates on{" "}
            <Link href="/comet">the comet</Link>, the growth on{" "}
            <Link href="/luck">lucky primes</Link>, and where the whole thing
            stalls on <Link href="/frontier">the frontier</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
