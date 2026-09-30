import Link from "next/link";
import type { Metadata } from "next";
import CoveringGame from "../CoveringGame";
import CoveringGrowth from "../CoveringGrowth";
import CoveringBand from "../CoveringBand";
import CoveringJacobsthal from "../CoveringJacobsthal";

export const metadata: Metadata = {
  title: "Covering systems — how much of the number line can odd patterns catch?",
  description:
    "Pick one remainder for each of 3, 5, 7, 9, 11 and try to cover every integer. The best you can ever do is 65.37% — and the reason why is the open Erdős–Selfridge odd-covering conjecture.",
};

export default function CoveringPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">A checked finding · covering systems</p>
          <h1 style={{ fontSize: "clamp(28px,4.5vw,42px)" }}>
            Can repeating patterns catch{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              every
            </em>{" "}
            integer?
          </h1>
          <p className="lede">
            Give each odd number a remainder — 0 mod 3, 1 mod 5, and so on — and
            every integer it hits lights up. Try to leave no gaps. With{" "}
            <code className="kbd">3, 5, 7, 9, 11</code> the best you can ever cover
            is <strong>65.37%</strong>, and the leftover holes never close. That
            small, exact ceiling is a doorway to a problem that&apos;s still open
            after 75 years.
          </p>
        </div>

        <section style={{ borderBottom: "none", paddingTop: 16 }}>
          <CoveringGame />
        </section>

        <div className="upage-head" style={{ paddingTop: 8 }}>
          <h2 style={{ fontSize: "clamp(22px,3.5vw,30px)" }}>
            Past 11 — keep adding steps, watch the gaps{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>stall</em>.
          </h2>
          <p className="lede" style={{ fontSize: 16 }}>
            Eleven was only where the picture stopped fitting on screen, not where
            the math stops. Add bigger odd steps and the gaps shrink — but slower
            and slower, even after the coverage budget sails past 1. That stall is
            the clearest face of the open problem.
          </p>
        </div>

        <section style={{ borderBottom: "none", paddingTop: 8 }}>
          <CoveringGrowth />
        </section>

        <div className="upage-head" style={{ paddingTop: 8 }}>
          <h2 style={{ fontSize: "clamp(22px,3.5vw,30px)" }}>
            The overlap-free trick:{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              1 − 1/√c
            </em>
          </h2>
          <p className="lede" style={{ fontSize: 16 }}>
            Take only the odd steps in a band <code className="kbd">(x/c, x]</code>{" "}
            — none divides another, so the nested-overlap waste vanishes and the
            coverage has an exact closed form that doesn&apos;t depend on x. It
            climbs toward 100% as the band widens, but only reaches it in the
            limit — and getting there drags the small overlapping steps back in.
          </p>
        </div>

        <section style={{ borderBottom: "none", paddingTop: 8 }}>
          <CoveringBand />
        </section>

        <div className="upage-head" style={{ paddingTop: 8 }}>
          <h2 style={{ fontSize: "clamp(22px,3.5vw,30px)" }}>
            Where the doodle actually leads:{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              a prime, forced
            </em>
          </h2>
          <p className="lede" style={{ fontSize: 16 }}>
            Push the band idea to its edge and the survivors turn out to be exactly
            the primes — so the question becomes whether the small-prime multiples
            can ever cover the whole interval. They can&apos;t, with room to spare.
            The margin even grows. And yet it&apos;s still not a new proof — here is
            the honest reason why.
          </p>
        </div>

        <section style={{ borderBottom: "none", paddingTop: 8 }}>
          <CoveringJacobsthal />
        </section>

        <section style={{ borderBottom: "none", paddingTop: 6, paddingBottom: 20 }}>
          <p className="muted" style={{ fontSize: 15 }}>
            Covering systems were introduced by Erdős in 1950. The version above
            — all moduli <em>odd</em>, distinct, and &gt; 1 — is{" "}
            <a
              href="https://www.erdosproblems.com/7"
              target="_blank"
              rel="noreferrer"
            >
              Erdős Problem #7
            </a>
            , and whether any such covering exists at all is still unknown.
            Hough&apos;s 2015 theorem showed the smallest modulus in <em>any</em>{" "}
            covering is bounded (later sharpened to ≤ 616,000 by Balister–Bollobás–
            Morris–Sahasrabudhe–Tiba), and a 2026 Lean-verified result pushed the
            odd case past lcm 10,000. The exact 65.37% here isn&apos;t in the
            literature — it&apos;s just a finite computation nobody bothered to
            tabulate. It rhymes with the rest of the site: the{" "}
            <Link href="/worstcase">worst-case hunter</Link> asks where Goldbach is
            weakest; this asks where odd remainders run out of room.
          </p>
        </section>
      </div>
    </main>
  );
}
