import Link from "next/link";
import type { Metadata } from "next";
import PartnerLuck from "../PartnerLuck";
import PairChance from "../PairChance";
import WillItBreak from "../WillItBreak";
import BreakOdds from "../BreakOdds";

export const metadata: Metadata = {
  title: "Lucky primes? — which primes make Goldbach pairs, as it grows",
  description:
    "Do some primes (3 vs 5 vs 7) get luckier at making Goldbach pairs than others as N grows? Computed the percent chance vs the pairs — and it turns out to be a dead heat.",
};

export default function LuckPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">A checked finding</p>
          <h1 style={{ fontSize: "clamp(28px,4.5vw,42px)" }}>
            Which primes get{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              unlucky
            </em>{" "}
            making pairs — 3 vs 5 vs 7 — as it grows?
          </h1>
          <p className="lede">
            The question, in your words:{" "}
            <em>
              &ldquo;which prime pairs happen to have unluckiness making pairs —
              like 3 vs 5 vs 7 — as it grows; take the percent chance vs the pairs
              and show the probability of finding as it grows, because right now it
              just seems like luck.&rdquo;
            </em>{" "}
            So I took each small prime p, measured how often{" "}
            <code className="kbd">N − p</code> is also prime, and watched it grow.
          </p>
        </div>

        <section style={{ borderBottom: "none", paddingTop: 16 }}>
          <PartnerLuck />
        </section>

        <section style={{ borderBottom: "none", paddingTop: 6, paddingBottom: 20 }}>
          <h2>
            <span className="num">◆</span>The answer: it&apos;s not luck, and no
            prime is special
          </h2>
          <p>
            It really looks like luck — but the numbers say otherwise, in a
            surprising way:
          </p>
          <div className="callout good">
            <span className="tag">no lucky prime</span>
            Averaged over all even numbers, <strong>every</strong> small prime is
            an equally good Goldbach partner. At a million, 3, 5, 7, 11, … all
            succeed <strong>15.70%</strong> of the time — identical to two
            decimals. The tiny wobble you see at small ranges is just sample noise
            and vanishes as N grows.
          </div>
          <div className="callout warn">
            <span className="tag">the chance shrinks</span>
            Each individual prime&apos;s success rate <em>falls</em> as N grows
            (~24% → ~19% → ~16%, tracking <code className="kbd">2 / ln N</code>) —
            yet the <em>total</em> number of Goldbach pairs still grows, because
            you get more and more primes to try. Fewer wins per prime, but far
            more primes.
          </div>
          <p className="muted" style={{ fontSize: 15 }}>
            So where does the real (un)luckiness live? Not in the prime — in the{" "}
            <strong>even number itself</strong>. Numbers with more small factors
            (especially 3) get many more pairs. That&apos;s the banding you can see
            in <Link href="/comet">the comet</Link>, and the growth story is on{" "}
            <Link href="/pattern">the pattern</Link> page.
          </p>
        </section>

        {/* the odds a pair works, as it grows */}
        <section style={{ borderBottom: "none", paddingTop: 6 }}>
          <h2>
            <span className="num">01</span>The odds a pair works, as it grows
          </h2>
          <p>
            Your algorithm, drawn out: there are{" "}
            <code className="kbd">C = π(N/3)</code> candidate pairs, each works with{" "}
            <code className="kbd">w ≈ 1/ln N</code>. So the chance <em>all</em> miss
            is <code className="kbd">(1−w)^C</code>, and the chance at least one
            lands — Goldbach holds — is <code className="kbd">1 − (1−w)^C</code>.
          </p>
          <PairChance />
        </section>

        {/* will it ever break? the luck number */}
        <section style={{ borderBottom: "none", paddingTop: 6, paddingBottom: 20 }}>
          <h2>
            <span className="num">02</span>So how far must we check? (the luck number)
          </h2>
          <p>
            Add up every even number&apos;s tiny failure chance and ask: how far do
            you have to check before you&apos;re near-certain nothing&apos;s out
            there? That threshold is the &ldquo;luck number.&rdquo;
          </p>
          <WillItBreak />
        </section>

        {/* drag to the astronomical — cumulative fail total */}
        <section style={{ borderBottom: "none", paddingTop: 6, paddingBottom: 20 }}>
          <h2>
            <span className="num">03</span>Drag it to the astronomical
          </h2>
          <p>
            Now go past what any computer could check — up to{" "}
            <code className="kbd">10^10000</code>. Watch each number&apos;s fail
            chance get added onto the running cumulative total, and watch that
            total refuse to budge.
          </p>
          <BreakOdds />
        </section>
      </div>
    </main>
  );
}
