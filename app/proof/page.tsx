import Link from "next/link";
import BlockExplorer from "../BlockExplorer";

export default function Proof() {
  return (
    <main>
      <header className="hero">
        <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>
          <p className="eyebrow">The Block Proof · An Attempt on Goldbach</p>
          <h1>
            Fold the number line. Punch out the <em>composites</em>. See what
            survives.
          </h1>
          <p className="lede">
            A visual retelling of the folded-strip approach to the Goldbach
            conjecture — where every even <code className="kbd">E</code> becomes a
            row of columns, composites become holes, and a single surviving
            column is a proof for that number. It works beautifully… right up to
            the one inequality nobody can close.
          </p>
        </div>
      </header>

      {/* THE INTERACTIVE PIECE */}
      <section id="explore">
        <div className="wrap">
          <h2>
            <span className="num">00</span>The strip, live
          </h2>
          <p className="muted">
            Pick an even number. Each column is a pair{" "}
            <code className="kbd">(x, E−x)</code>. If <em>either</em> side is
            composite, that side is a hole. Goldbach holds for E the moment one
            column has no hole on either side.
          </p>
          <BlockExplorer />
        </div>
      </section>

      {/* PART II — SIEVE THE ODDS */}
      <section id="sieve">
        <div className="wrap">
          <h2>
            <span className="num">II</span>Sieve the odds, pair the survivors
          </h2>
          <p className="muted">
            A second, more tactile way to see it: draw every odd number below E
            as a pile of unit blocks, let each composite&apos;s smallest factor
            carve it into equal groups, and watch which piles survive as primes —
            then two survivors rebuild E. It lives on its own page.
          </p>
          <p style={{ marginTop: 20 }}>
            <Link
              href="/sieve"
              className="btn"
              style={{ display: "inline-block", textDecoration: "none" }}
            >
              ▶ Open the unit-block sieve
            </Link>
          </p>
        </div>
      </section>

      {/* 1 — THE FOLD */}
      <section>
        <div className="wrap">
          <h2>
            <span className="num">01</span>The fold
          </h2>
          <p>
            Take an even number <strong>E</strong>. Instead of scanning all the
            way to E, use only the left half of the folded strip:
          </p>
          <div className="math">3, 5, 7, … &lt; E/2</div>
          <p>
            Each block <strong>x</strong> is paired with its reflection{" "}
            <strong>E − x</strong>. A block is <em>solid</em> (■) when it is
            prime and a <em>hole</em> (×) when it is composite. Goldbach fails for
            E exactly when every single column carries at least one hole:
          </p>
          <div className="math">
            {`x        E-x
■   |     ×
×   |     ■
×   |     ×
■   |     ×
...
there can never be
■   |     ■`}
          </div>
          <p className="muted">
            One clean column — both sides prime — and you have written{" "}
            <code className="kbd">E = x + (E−x)</code>.
          </p>
        </div>
      </section>

      {/* 2 — LABEL HOLES BY SMALLEST FACTOR */}
      <section>
        <div className="wrap">
          <h2>
            <span className="num">02</span>Every hole has an owner
          </h2>
          <p>
            Label each hole by its <strong>smallest prime factor</strong>. That
            avoids all double-counting and gives each hole a single owner:
          </p>
          <div className="math">
            {`3 owns  x = 3q,  q ≥ 3
5 owns  x = 5q,  q ≥ 5,  3 ∤ q
7 owns  x = 7q,  q ≥ 7,  3 ∤ q, 5 ∤ q
p owns  x = pq,  q ≥ p,  q has no prime factor < p`}
          </div>
          <p>
            An immediate consequence: a prime <strong>p</strong> cannot punch a{" "}
            genuinely new hole until <strong>p²</strong>. Late primes arrive with
            almost no territory left.
          </p>
          <div className="callout">
            <span className="tag">the shrinking share</span>
            <div className="math" style={{ margin: 0, border: "none", paddingLeft: 0 }}>
              {`3 : ~ 1/3
5 : (1/5)(1 − 1/3)          = 2/15
7 : (1/7)(1 − 1/3)(1 − 1/5) = 8/105
11: (1/11)(1 − 1/3)(1 − 1/5)(1 − 1/7)
...`}
            </div>
          </div>
        </div>
      </section>

      {/* 3 — WHY PURE COUNTING FAILS */}
      <section>
        <div className="wrap">
          <h2>
            <span className="num">03</span>Why pure hole-counting can’t win
          </h2>
          <p>
            For failure, holes must cover every column:{" "}
            <code className="kbd">H_L + H_R ≥ L</code>. So a counting proof would
            need <em>fewer than half</em> the blocks to be composite. For large E
            that is simply false — primes thin out to density{" "}
            <code className="kbd">1 / log E</code>, so there are far more than
            enough holes to go around.
          </p>
          <div className="callout warn">
            <span className="tag">route eliminated</span>
            Pure hole counting cannot prove Goldbach. There are numerically
            enough holes to cover everything. The holes are just not{" "}
            <em>freely placeable</em> — and that is the whole game.
          </div>
        </div>
      </section>

      {/* 4 — TWO TRACKS */}
      <section>
        <div className="wrap">
          <h2>
            <span className="num">04</span>Positioning: the two tracks
          </h2>
          <p>
            A column is killed by prime <strong>p</strong> exactly when x or E−x
            is divisible by p:
          </p>
          <div className="math">x ≡ 0 (mod p)   or   x ≡ E (mod p)</div>
          <p>
            Two residue classes per prime — and if <code className="kbd">p | E</code>{" "}
            they collapse into one. So among any p consecutive blocks, at least{" "}
            <strong>p − 2</strong> escape p. The holes repeat on rigid,
            E-locked tracks; they cannot be slid around to plug gaps by hand.
          </p>
          <div className="callout good">
            <span className="tag">rigorous</span>
            Over a <strong>complete multiplication packet</strong>{" "}
            <code className="kbd">P = 3·5·7···p</code>, the number of surviving
            positions is
            <div className="math" style={{ marginBottom: 0 }}>
              {`C_p(E) = ∏(q−2)  [q ∤ E]  ·  ∏(q−1)  [q | E]   >  0`}
            </div>
            A full packet can <strong>never</strong> be entirely holed.
          </div>
        </div>
      </section>

      {/* 5 — THE SQUARE ROOT LAYERING */}
      <section>
        <div className="wrap">
          <h2>
            <span className="num">05</span>The square-root layering
          </h2>
          <p>
            Any composite <code className="kbd">x ≤ L</code> has a factor{" "}
            <code className="kbd">≤ √L</code>. So the first L blocks are decided by
            small primes only — and the structure nests:
          </p>
          <div className="math">E → E^(1/2) → E^(1/4) → E^(1/8) → …</div>
          <p>
            Every genuinely new hole from a prime <code className="kbd">p &gt; E^(1/4)</code>{" "}
            lands <em>above</em> √E. The early strip is controlled entirely by
            tiny primes; the heavy factor-complexity is geometrically pushed to
            the right.
          </p>
          <div className="math">
            {`0 -------------- √E -------------- E/2 -------------- E
        ↑
 large hole-makers CANNOT own anything here
                    ↑
              their new holes begin over here`}
          </div>
        </div>
      </section>

      {/* 6 — THE REDUCTION */}
      <section>
        <div className="wrap">
          <h2>
            <span className="num">06</span>The whole thing reduces to one line
          </h2>
          <p>
            Define <strong>g(E)</strong> as the first x ≥ 3 where neither x nor
            E−x is punched. After sieving through √E, an unpunched number below E
            must be prime. So:
          </p>
          <div className="math">
            {`g(E) < E/2   for every even E > 4
       ⟹   g(E) prime  and  E − g(E) prime
       ⟹   E = g(E) + (E − g(E))        ← Goldbach`}
          </div>
          <p>
            Equivalently, the <strong>Finite Two-Track Covering Bound</strong>:
            the linked tracks <code className="kbd">x ≡ 0, E (mod p)</code> for odd
            primes <code className="kbd">p ≤ √E</code> cannot cover the whole
            prefix <code className="kbd">[3, E/2]</code>.
          </p>
          <div className="callout">
            <span className="tag">even sharper form</span>
            A counterexample would force: for every prime{" "}
            <code className="kbd">q ≤ √E</code>, the number{" "}
            <code className="kbd">E − q</code> is composite. So the tracks{" "}
            <code className="kbd">q ≡ E (mod p)</code> would have to cover{" "}
            <em>every</em> prime <code className="kbd">q ≤ √E</code>. One uncovered
            prime finishes it. (But note: this stronger statement can fail even
            when Goldbach is true via a large prime — so it can’t just be
            assumed.)
          </div>
        </div>
      </section>

      {/* 7 — PROVED / NOT PROVED */}
      <section>
        <div className="wrap">
          <h2>
            <span className="num">07</span>Where it honestly stops
          </h2>
          <div className="callout good">
            <span className="tag">proved</span>
            <ul className="clean">
              <li>Every composite hole below E is generated by a prime ≤ √E.</li>
              <li>A prime p makes no genuinely new hole before p².</li>
              <li>
                New p-holes have the shape p·q with q ≥ p and q free of smaller
                factors.
              </li>
              <li>Between consecutive prime squares, no new hole-maker appears.</li>
              <li>In the folded strip, p-holes sit only on x ≡ 0, E (mod p).</li>
              <li>Over a complete packet, the tracks cannot cover everything.</li>
            </ul>
          </div>
          <div className="callout warn">
            <span className="tag">not proved</span>
            That the tracks cannot cover the <strong>particular finite prefix</strong>{" "}
            <code className="kbd">[3, E/2]</code>. Complete cycles guarantee gaps;
            finite prefixes can behave differently. The inclusion–exclusion error
            terms from all those track intersections can drown the positive main
            term — which is exactly the parity barrier where sieve methods stall
            (Chen’s theorem gets prime + almost-prime, and no further by these
            means).
          </div>
          <p className="muted">
            Empirically the openings appear absurdly early: sweeping every even{" "}
            E &lt; 20,000, no strip was ever fully covered, and the latest first
            survivor found was <code className="kbd">x = 173</code> at{" "}
            <code className="kbd">E = 7426</code> — try it in the explorer above.
            But computation is not proof. The missing piece is a{" "}
            <strong>finite-gap theorem</strong>, not another fact about
            multiplication.
          </p>
        </div>
      </section>
    </main>
  );
}
