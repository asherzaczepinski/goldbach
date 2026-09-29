import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The N−1 = (k+1)p pattern — a checked finding",
  description:
    "Your q = kp + 1 observation, reframed as N − 1 = (k+1)p and tested to one million: what it is, the numbers, and where it connects to Sophie Germain primes and Dirichlet.",
};

const TABLE: [string, string, string][] = [
  ["4 – 100", "17 / 49", "34.7%"],
  ["4 – 1,000", "198 / 499", "39.7%"],
  ["4 – 10,000", "1,914 / 4,999", "38.3%"],
  ["4 – 100,000", "17,750 / 49,999", "35.5%"],
  ["4 – 1,000,000", "163,078 / 499,999", "32.6%"],
];

export default function PatternPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">A checked finding</p>
          <h1 style={{ fontSize: "clamp(28px,4.5vw,42px)" }}>
            Your pattern, reframed:{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              N − 1 = (k+1)p
            </em>
            .
          </h1>
          <p className="lede">
            You noticed that some Goldbach pairs have the bigger prime equal to
            the smaller one times something, plus one. That turns out to be a real
            number-theory statement — just not a universal one. Every figure below
            was computed and verified up to one million.
          </p>
        </div>

        {/* 1 — the reframing */}
        <section style={{ borderBottom: "none", paddingTop: 20 }}>
          <h2>
            <span className="num">01</span>The reframing
          </h2>
          <p>Your condition is a Goldbach pair with an extra shape:</p>
          <div className="math">N = p + q,   q = k·p + 1   (p, q prime)</div>
          <p>Substitute the second into the first:</p>
          <div className="math">N = p + (k·p + 1) = (k+1)·p + 1</div>
          <div className="callout">
            <span className="tag">the clean form</span>
            <div
              className="math"
              style={{ margin: 0, border: "none", paddingLeft: 0, fontSize: 20 }}
            >
              N − 1 = (k+1)·p
            </div>
            So your question is exactly:{" "}
            <strong>
              does N − 1 have a prime factor p such that N − p is also prime?
            </strong>
          </div>
        </section>

        {/* 2 — the numbers */}
        <section style={{ borderBottom: "none", paddingTop: 10 }}>
          <h2>
            <span className="num">02</span>The numbers (verified)
          </h2>
          <p>
            Counting the even numbers that have at least one such pair, over
            growing ranges:
          </p>
          <div className="ptable-scroll" style={{ maxWidth: 460 }}>
            <table className="ptable">
              <thead>
                <tr>
                  <th>range of even N</th>
                  <th>have the property</th>
                  <th>share</th>
                </tr>
              </thead>
              <tbody>
                {TABLE.map(([r, c, pct]) => (
                  <tr key={r}>
                    <td>{r}</td>
                    <td className="cell-good">{c}</td>
                    <td>{pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="callout warn">
            <span className="tag">so it is not universal</span>
            It holds for a big minority — never all. And the share slowly{" "}
            <em>falls</em> as N grows (≈38% at ten thousand, ≈33% at a million).
            There is even a run of <strong>32 consecutive</strong> even numbers
            with no such pair: 649,200 through 649,262.
          </div>
          <p style={{ marginTop: 18 }}>Two quick examples:</p>
          <div className="callout good">
            <span className="tag">works · 100</span>
            <div className="math" style={{ margin: 0, border: "none", paddingLeft: 0 }}>
              {`100 = 3 + 97,   97 = 3·32 + 1
(and 100 − 1 = 99 = 3 · 33)`}
            </div>
          </div>
          <div className="callout warn">
            <span className="tag">fails · 102</span>
            No prime factor of 101 (which is prime) lands a prime partner —{" "}
            <strong>102</strong> has no pair of this form at all.
          </div>
        </section>

        {/* 3 — sophie germain */}
        <section style={{ borderBottom: "none", paddingTop: 10 }}>
          <h2>
            <span className="num">03</span>The multiplier can never be an odd prime
          </h2>
          <p>
            For N &gt; 4 both p and q are odd, so q − 1 is even. Since p is odd,{" "}
            <code className="kbd">k = (q − 1) / p</code> must be even. So if you
            ask for k itself to be prime, the only option is:
          </p>
          <div className="math">k = 2,   i.e.   q = 2p + 1</div>
          <div className="callout good">
            <span className="tag">a known structure appears</span>
            Those are exactly the <strong>Sophie Germain</strong> prime pairs —{" "}
            <code className="kbd">p</code> and <code className="kbd">2p + 1</code>{" "}
            both prime. Your condition has one of the classic prime patterns
            hiding inside it.
          </div>
        </section>

        {/* 4 — factorization link + infinite family */}
        <section style={{ borderBottom: "none", paddingTop: 10 }}>
          <h2>
            <span className="num">04</span>Tied to the factorization of N − 1
          </h2>
          <p>
            When <code className="kbd">k + 1</code> is also prime,{" "}
            <code className="kbd">N − 1 = p·r</code> is a product of two primes —
            so each prime factor can give its own pair. Take 120:
          </p>
          <div className="math">
            {`119 = 7 · 17

120 = 7 + 113,    113 = 7·16 + 1
120 = 17 + 103,   103 = 17·6 + 1`}
          </div>
          <p>
            Both prime factors of N − 1 produce a valid pair. Your Goldbach
            representation is wired directly to the factorization of N − 1.
          </p>

          <h3>An infinite family (so it&apos;s not just small-number luck)</h3>
          <p>
            Fix <code className="kbd">p = 3</code>. The condition becomes{" "}
            <code className="kbd">q = 3k + 1</code>, i.e.{" "}
            <code className="kbd">q ≡ 1 (mod 3)</code>. Every such prime q gives a
            valid even number <code className="kbd">N = q + 3</code>. By{" "}
            <strong>Dirichlet&apos;s theorem</strong> there are infinitely many
            primes <code className="kbd">q ≡ 1 (mod 3)</code> — so infinitely many
            N satisfy your pattern.
          </p>
        </section>

        {/* 5 — why it falls */}
        <section style={{ borderBottom: "none", paddingTop: 10 }}>
          <h2>
            <span className="num">05</span>Why the share drifts down
          </h2>
          <p>
            For each candidate prime p you need a prime{" "}
            <code className="kbd">q ≡ 1 (mod p)</code> — a prime in a specific
            arithmetic progression. As N grows there are more p&apos;s to try, but
            each <code className="kbd">q ≡ 1 (mod p)</code> condition is more
            restrictive. The heuristic pull is gently downward — consistent with
            the measured 38% → 33% slide, not toward 100%.
          </p>
        </section>

        {/* 6 — verdict */}
        <section style={{ borderBottom: "none", paddingTop: 10, paddingBottom: 20 }}>
          <h2>
            <span className="num">◆</span>The honest verdict
          </h2>
          <div className="callout">
            <span className="tag">did you find something?</span>
            Yes — a <em>legitimate</em> observation, not a new theorem. The
            equivalence{" "}
            <code className="kbd">N − 1 = (k+1)p</code> is real and gives the idea
            genuine structure, linking a Goldbach pair of N to a factorization of
            N − 1, and touching Sophie Germain primes and Dirichlet. But since it
            holds for only ~⅓ of even N (and provably not all), the original
            &ldquo;always such a pair&rdquo; form is disproved.
          </div>
          <p className="muted" style={{ fontSize: 15 }}>
            The precise open-ended question it leaves:{" "}
            <strong>
              for which even N does some prime p | (N − 1) also make N − p prime?
            </strong>{" "}
            Characterising the successes and failures — and whether the share
            approaches a recognisable constant — is where a real computational
            investigation would go next. Related raw views:{" "}
            <Link href="/comet">the comet</Link>,{" "}
            <Link href="/firstprimes">first primes</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
