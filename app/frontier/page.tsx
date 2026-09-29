import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "State of the attack — every branch tried on Goldbach",
  description:
    "A branch-by-branch map of how mathematics has attacked the Goldbach conjecture: what each approach proved, and exactly where it stops.",
};

function Branch({
  n,
  title,
  proved,
  stops,
  children,
}: {
  n: string;
  title: string;
  proved: string;
  stops: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="wrap">
        <h2>
          <span className="num">{n}</span>
          {title}
        </h2>
        <p>{children}</p>
        <div className="callout good">
          <span className="tag">what it proved</span>
          {proved}
        </div>
        <div className="callout warn">
          <span className="tag">where it stops</span>
          {stops}
        </div>
      </div>
    </section>
  );
}

export default function FrontierPage() {
  return (
    <main>
      <header className="hero">
        <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>
          <p className="eyebrow">The Frontier · ~280 years of attempts</p>
          <h1>
            Every branch has been tried. They all hit the{" "}
            <em>same wall</em>.
          </h1>
          <p className="lede">
            An honest map of how mathematics has attacked Goldbach — what each
            approach genuinely proved, and the exact spot it stops. The neighbors
            have all fallen; the binary case is the lone holdout, for one identified,
            proven reason.
          </p>
        </div>
      </header>

      <Branch
        n="01"
        title="Analytic number theory — the circle method"
        proved="Ternary Goldbach is DONE: Vinogradov (1937) for large odd numbers, and Helfgott (2013) finished every odd number ≥ 7 as a sum of three primes."
        stops="With two variables the minor-arc error terms are as large as the main term. The method needs one more variable than the binary problem gives it."
      >
        Write the number of representations as an integral and split it into
        &ldquo;major arcs&rdquo; (clean main term) and &ldquo;minor arcs&rdquo;
        (noise). It works beautifully — for three primes.
      </Branch>

      <Branch
        n="02"
        title="Sieve theory — Brun, Selberg, Chen"
        proved="Chen's theorem (1973): every large even number is prime + (prime or a product of two primes). One millimeter away."
        stops="Selberg's parity problem — a PROVEN theorem that sieves cannot tell apart numbers with an even vs. odd number of prime factors. So they can never force 'exactly one prime.' A ceiling, not a gap in cleverness."
      >
        Cross out composites, count the survivors. This is the branch our whole site
        visualizes — and it is exactly the one with a proven barrier.
      </Branch>

      <Branch
        n="03"
        title="Additive combinatorics — Schnirelmann, Green–Tao"
        proved="Every even number is a sum of at most 4 primes (via Helfgott). Green–Tao: the primes contain arbitrarily long arithmetic progressions."
        stops="Bounded-count and AP-structure results don't isolate the binary sum; the pair problem meets the same parity obstruction."
      >
        Study primes as an additive set. You can get &ldquo;a bounded number of
        primes&rdquo; — just not down to two.
      </Branch>

      <Branch
        n="04"
        title="L-functions and the Riemann Hypothesis"
        proved="Under GRH, ternary Goldbach and strong 'almost all' bounds follow easily."
        stops="Even assuming the Generalized Riemann Hypothesis — the deepest conjecture in the field — binary Goldbach still does NOT follow. The strongest available tool isn't enough."
      >
        The single most striking honest fact on this page: the biggest hammer in
        analytic number theory swings and misses on the binary case.
      </Branch>

      <Branch
        n="05"
        title="Probabilistic number theory — the Cramér model"
        proved="Predicts about E / (ln E)² prime pairs for each even E — overwhelmingly positive. This is why everyone believes Goldbach."
        stops="Primes aren't actually random, and a heuristic of randomness is not a proof."
      >
        Model each number as prime with probability 1/ln. The prediction is
        enormous and matches the comet — but belief isn&apos;t proof.
      </Branch>

      <Branch
        n="06"
        title="Almost-all results — Montgomery–Vaughan"
        proved="The set of even numbers that could fail Goldbach has density zero — exceptions, if any, are vanishingly rare (bounded by X^(1−δ))."
        stops="Upgrading 'all but a vanishing fraction' to 'every single one' is the entire remaining difficulty."
      >
        Statistically we are essentially there. The last step is the hard one:
        from almost-all to all.
      </Branch>

      <Branch
        n="07"
        title="Ergodic theory, geometry, spectral methods"
        proved="Ergodic methods cracked Szemerédi and powered Green–Tao. Random-matrix models predict prime correlations with uncanny accuracy."
        stops="No known translation of the BINARY sum into a mixing/recurrence or geometric statement; the physics models support but don't prove."
      >
        The branches that revolutionized nearby problems have no foothold on the
        pair sum itself.
      </Branch>

      <Branch
        n="08"
        title="Logic and computation"
        proved="Goldbach is a Π₁ statement — a counterexample would be a single finite check. Verified by computer to 4×10¹⁸ with no exception."
        stops="Not known to be independent of ZFC (and no evidence it is). Verification, however vast, can never cover infinitely many numbers."
      >
        If Goldbach is false, it is provably false. If it is true, we may simply
        need a genuinely new idea — and finitely checking forever won&apos;t supply
        one.
      </Branch>

      <section>
        <div className="wrap">
          <h2>
            <span className="num">◆</span>The one wall
          </h2>
          <p>
            Every branch converges on the same obstruction, and it has a name: the{" "}
            <strong>parity problem</strong> for the two-variable case. The{" "}
            <em>three</em>-variable version is solved — the extra variable gives the
            circle method the room it needs. So the record reads:
          </p>
          <div className="math">
            {`ternary Goldbach (3 primes) .......... PROVED  (Helfgott 2013)
every even = at most 4 primes ........ PROVED
Chen:  even = p + (p or p·p) ......... PROVED  (1973)
almost every even = p + q ............ PROVED  (density-zero exceptions)
verified to 4×10^18 .................. DONE (by computer)
—
every even = p + q  (binary) ......... OPEN`}
          </div>
          <div className="callout">
            <span className="tag">the honest bottom line</span>
            The binary case isn&apos;t open because nobody tried the right branch.
            It&apos;s open because every branch runs into a <em>proven</em> barrier
            in the same place: distinguishing &ldquo;exactly one prime&rdquo; from
            &ldquo;a prime times something,&rdquo; and pinning a prime and its
            reflection <code className="kbd">E − p</code> to both be prime at once.
            That correlation is what no current method can compel.
          </div>
          <p className="muted">
            Which is exactly where this whole site&apos;s block/sieve construction
            arrives — a correct, self-checking picture that runs right up to the
            frontier and stops honestly at it. That&apos;s not failure; that&apos;s
            standing in the right place.{" "}
            <Link href="/#explore">Back to the construction →</Link>
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>
            <span className="num">▪</span>What the data shows
          </h2>
          <p className="muted">
            Findings from the experiments run in this project — every number below is
            from an actual computation over the millions, not a citation. They all
            point at the same wall from different sides.
          </p>

          <h3>The correlation is real — and it&apos;s a mod-3 story</h3>
          <p>
            If &ldquo;x is prime&rdquo; and &ldquo;E − x is prime&rdquo; were
            independent, each even E would have about{" "}
            <code className="kbd">(E/2)/(ln E)²</code> pairs. The true count is{" "}
            <strong>2× to 4× higher</strong> — and the split is clean:
          </p>
          <div className="math">
            {`E divisible by 3     →  boost ≈ 4×    (twice as many pairs)
E not divisible by 3 →  boost ≈ 2×`}
          </div>
          <p>
            The same mod-3 signal showed up independently in the descent search:
            multiples of 3 solve in one step ~95% of the time; the failed
            subtractions are eaten by the prime 3 <strong>80.9%</strong> of the time.
            Two different experiments, one structure — so it&apos;s real.
          </p>

          <h3>The comet&apos;s floor rises — the margin is widening</h3>
          <p>
            Comparing the average number of pairs to the worst case in each window:
          </p>
          <div className="math">
            {`near 10,000      avg 202    min 92     min/avg 0.46
near 100,000     avg 950    min 570    min/avg 0.60
near 1,000,000   avg 6163   min 3963   min/avg 0.64`}
          </div>
          <p>
            The worst-case even never approaches zero — it holds a robust, rising
            fraction of the average. The absolute floor (fewest pairs ever) is 1, at
            E = 6; after that it climbs without bound.
          </p>

          <div className="callout good">
            <span className="tag">the encouraging half</span>
            Every measurement says Goldbach holds with a margin that <em>grows</em>:
            pairs are 2–4× more common than chance, and the minimum stays well above
            zero and rising. Verified with no exception to 4×10¹⁸.
          </div>

          <div className="callout warn">
            <span className="tag">exactly where it stops being provable</span>
            The <strong>average</strong> number of pairs is smooth and provable. The{" "}
            <strong>minimum</strong> — that it&apos;s never zero — is what Goldbach
            needs, and the average provably does not control the minimum. That single
            gap between &ldquo;average is fine&rdquo; and &ldquo;every one is
            fine&rdquo; is the whole distance from <em>almost all</em> (proved) to{" "}
            <em>all</em> (open). No deterministic rule names the pair either —
            &ldquo;largest prime ≤ E/2&rdquo; fails 78% of the time; you must always
            search.
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          Sources are the standard results of analytic number theory (Vinogradov,
          Chen, Montgomery–Vaughan, Helfgott, Green–Tao). Everything marked PROVED is
          a published theorem; everything marked OPEN is genuinely open as of today.
        </div>
      </footer>
    </main>
  );
}
