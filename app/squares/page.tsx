import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prime squares & last digits — a checked finding",
  description:
    "Why the last two digits of a prime squared usually add to a prime — verified at 60%, and it turns out to have nothing to do with primes.",
};

const ENDINGS: [string, string, boolean][] = [
  ["01", "0 + 1 = 1", false],
  ["09", "0 + 9 = 9", false],
  ["21", "2 + 1 = 3", true],
  ["29", "2 + 9 = 11", true],
  ["41", "4 + 1 = 5", true],
  ["49", "4 + 9 = 13", true],
  ["61", "6 + 1 = 7", true],
  ["69", "6 + 9 = 15", false],
  ["81", "8 + 1 = 9", false],
  ["89", "8 + 9 = 17", true],
];

export default function SquaresPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">A checked finding</p>
          <h1 style={{ fontSize: "clamp(28px,4.5vw,42px)" }}>
            Why a prime squared usually has last two digits that{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              add to a prime
            </em>
            .
          </h1>
          <p className="lede">
            The observation is real — about 60% of primes have it. But the reason
            is a surprise: it has almost nothing to do with primes. All figures
            below were computed and verified.
          </p>
        </div>

        {/* 1 — true, but not about primes */}
        <section style={{ borderBottom: "none", paddingTop: 20 }}>
          <h2>
            <span className="num">01</span>It&apos;s true — 60% — but not about primes
          </h2>
          <p>
            Take a prime p, square it, add the last two digits of p², and ask if
            that sum is prime. It happens ~60% of the time. But the exact same 60%
            shows up for numbers that aren&apos;t prime at all:
          </p>
          <div className="ptable-scroll" style={{ maxWidth: 460 }}>
            <table className="ptable">
              <thead>
                <tr>
                  <th>set of numbers</th>
                  <th>prime digit-sum</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>primes only</td>
                  <td className="cell-good">60.0%</td>
                </tr>
                <tr>
                  <td>any number ending 1, 3, 7, 9</td>
                  <td className="cell-good">60.0%</td>
                </tr>
                <tr>
                  <td>composites ending 1, 3, 7, 9</td>
                  <td className="cell-good">60.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="callout">
            <span className="tag">the real variable</span>
            The only thing that matters is that the number ends in{" "}
            <strong>1, 3, 7, or 9</strong> — which every prime above 5 does.{" "}
            <code className="kbd">21</code>, <code className="kbd">33</code>,{" "}
            <code className="kbd">49</code> (all composite) obey the rule exactly
            like <code className="kbd">23</code>, <code className="kbd">31</code>,{" "}
            <code className="kbd">47</code>.
          </div>
        </section>

        {/* 2 — the sum is forced to be odd */}
        <section style={{ borderBottom: "none", paddingTop: 10 }}>
          <h2>
            <span className="num">02</span>The digit-sum is forced to be odd
          </h2>
          <p>
            A number not divisible by 2 or 5 squares to one of exactly{" "}
            <strong>ten</strong> possible last-two-digit endings:
          </p>
          <div className="ptable-scroll" style={{ maxWidth: 420 }}>
            <table className="ptable">
              <thead>
                <tr>
                  <th>p² ends in…</th>
                  <th>digits add to</th>
                </tr>
              </thead>
              <tbody>
                {ENDINGS.map(([v, sum, prime]) => (
                  <tr key={v}>
                    <td style={{ fontFamily: "var(--mono)" }}>…{v}</td>
                    <td className={prime ? "cell-good" : ""}>
                      {sum}
                      {prime ? "  ✔ prime" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>Every one of them shares two features:</p>
          <div className="callout good">
            <span className="tag">the two locked digits</span>
            <ul className="clean" style={{ marginTop: 6 }}>
              <li>
                The <strong>units digit is always 1 or 9</strong> (odd) — since
                1², 9² end in 1 and 3², 7² end in 9.
              </li>
              <li>
                The <strong>tens digit is always even</strong> (0, 2, 4, 6, 8) — a
                standing quirk of squares.
              </li>
            </ul>
            So the sum is always <strong>even + odd = odd</strong>. It can only be
            one of <code className="kbd">1, 3, 5, 7, 9, 11, 13, 15, 17</code>.
          </div>
        </section>

        {/* 3 — punchline */}
        <section style={{ borderBottom: "none", paddingTop: 10, paddingBottom: 20 }}>
          <h2>
            <span className="num">◆</span>Small odd numbers are mostly prime
          </h2>
          <p>
            That&apos;s the whole trick. The sum is pinned to a small odd number
            between 1 and 17 — and in that little range the primes dominate:
          </p>
          <div className="math">
            {`prime sums:      3, 5, 7, 11, 13, 17   ← six
non-prime sums:  1, 9, 15              ← three (and 9 lands twice)`}
          </div>
          <p>
            Primes spread evenly across all ten endings (~10% each), so you hit a
            prime sum six times out of ten:
          </p>
          <div className="callout">
            <span className="tag">in one sentence</span>
            Squaring a number that ends in 1/3/7/9 forces its last two digits to
            add to a <strong>small odd number (1–17)</strong>, and small odd
            numbers are prime more often than not — so ≈<strong>60%</strong> land
            on a prime. The &ldquo;primes&rdquo; in the observation are a
            coincidence; the cause is the arithmetic of last digits.
          </div>
          <p className="muted" style={{ fontSize: 15 }}>
            Same flavour as the <Link href="/pattern">N−1 = (k+1)p</Link> finding:
            a real pattern, but once you chase it down the &ldquo;prime&rdquo; part
            evaporates and something simpler is doing the work.
          </p>
        </section>
      </div>
    </main>
  );
}
