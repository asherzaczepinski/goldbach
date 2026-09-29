import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My path — the exploration so far",
  description:
    "A simple bulleted record of everything tried: the tabs built, the conjectures tested, and what turned out true, false, or just shallow.",
};

export default function PathPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">The exploration so far</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            My{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>path</em>{" "}
            through the primes.
          </h1>
          <p className="lede">
            Everything tried, plainly: the tools built, the hunches tested, and an
            honest verdict on each — true, false, or just shallow.
          </p>
        </div>

        {/* THE TABS */}
        <section style={{ paddingTop: 10 }}>
          <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <h2>
              <span className="num">01</span>The tabs I built
            </h2>
            <ul className="clean">
              <li>
                <Link href="/pairings">pairings</Link> — type an even number, see
                every odd + odd pairing that sums to it, and knock out any pairing
                whose first number is a multiple of a smaller odd. Split into
                three tables: neither works / one is off / both work.
              </li>
              <li>
                <Link href="/firstprimes">first primes</Link> — for every even
                number up to a max, its list of first primes (the smaller prime of
                each Goldbach pair). <code className="kbd">6 → [3]</code>,{" "}
                <code className="kbd">100 → [3, 11, 17, 29, 41, 47]</code>.
              </li>
              <li>
                <Link href="/comet">comet</Link> — scatter of every even number vs
                how many Goldbach pairs it has, colored by prime factors. The
                famous Goldbach comet, with its bands.
              </li>
              <li>
                <Link href="/primes">primes</Link> — every prime as an Ulam spiral
                (or grid), up to 10 million. The diagonal streaks appear.
              </li>
              <li>
                <Link href="/differences">differences</Link> — bar graphs of the
                prime gaps, then the gaps between gaps, then the gaps between
                those, stacked down.
              </li>
            </ul>
          </div>
        </section>

        {/* CONJECTURES */}
        <section>
          <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <h2>
              <span className="num">02</span>Things I wondered / conjectured
            </h2>

            <div className="callout good">
              <span className="tag">true — and the coolest</span>
              <strong>
                &ldquo;Do numbers with more factors get more Goldbach pairs?&rdquo;
              </strong>
              <div style={{ marginTop: 6 }}>
                Real and famous. More distinct <em>small</em> prime factors
                (especially 3) means more pairs — being divisible by 3 roughly{" "}
                <strong>doubles</strong> the count. That&apos;s what splits the{" "}
                <Link href="/comet">comet</Link> into bands. (Hardy–Littlewood.)
              </div>
            </div>

            <div className="callout warn">
              <span className="tag">false — a red herring</span>
              <strong>
                &ldquo;Even numbers with even digit sums → the primes/pairs also
                add to even?&rdquo;
              </strong>
              <div style={{ marginTop: 6 }}>
                About a 50/50 coin flip. Digit-sum parity isn&apos;t the cause —
                carries (each worth 9) scramble it.
              </div>
            </div>

            <div className="callout">
              <span className="tag">true — but shallow</span>
              <strong>
                &ldquo;count of first-primes + the first-primes themselves is
                even&rdquo;
              </strong>{" "}
              <span style={{ fontFamily: "var(--mono)", color: "var(--paper)" }}>
                (88 → 4 + 5 + 17 + 29 + 41 = 96)
              </span>
              <div style={{ marginTop: 6 }}>
                True for every even number bigger than 4 — but it&apos;s just
                because every Goldbach pair past 4 is two <em>odd</em> primes, and
                count + sum of any list of odds is always even. Only exception:{" "}
                <code className="kbd">4</code> (it uses the even prime 2).
              </div>
            </div>
          </div>
        </section>

        {/* PRIME QUESTIONS */}
        <section>
          <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <h2>
              <span className="num">03</span>Questions about the primes themselves
            </h2>
            <ul className="clean">
              <li>
                <strong>
                  &ldquo;Are the Ulam spiral diagonals still there at 10
                  million?&rdquo;
                </strong>{" "}
                — Yes. Short diagonal streaks appear at every scale, forever. Long
                single diagonals get rarer as primes thin out. (The 1963 Ulam
                spiral — very famous.)
              </li>
              <li>
                <strong>
                  &ldquo;What&apos;s the slope of the primes — exponential or
                  linear?&rdquo;
                </strong>{" "}
                — Neither. The n-th prime grows like{" "}
                <code className="kbd">n · ln(n)</code>, superlinear by just a log
                factor. The slope is about <code className="kbd">ln(n)</code>: ~8
                near the 1,000th prime, ~15.5 near the millionth. Logarithmically
                slow — nowhere near exponential.
              </li>
            </ul>
          </div>
        </section>

        {/* BIG PICTURE */}
        <section>
          <div className="wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
            <h2>
              <span className="num">04</span>Big picture
            </h2>
            <ul className="clean">
              <li>
                The real gold is the factor / comet effect — structure that&apos;s
                actually there.
              </li>
              <li>
                Two parity ideas turned out to be simple facts in disguise or coin
                flips — still useful: finding what <em>isn&apos;t</em> the cause
                narrows things down.
              </li>
              <li>
                The through-line: asking the right kind of questions and actually
                checking them against data.
              </li>
            </ul>
          </div>
        </section>

        <p className="muted" style={{ padding: "20px 0 60px", fontSize: 14 }}>
          Also saved as a plain-text file:{" "}
          <code className="kbd">MY_PATH.txt</code> in the project root.
        </p>
      </div>
    </main>
  );
}
