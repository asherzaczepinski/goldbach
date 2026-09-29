import Link from "next/link";

const TOPICS: { href: string; title: string; blurb: string; tag: string }[] = [
  {
    href: "/proof",
    title: "The block proof",
    blurb: "The folded-strip attempt on Goldbach — holes, factors, and where it honestly stops.",
    tag: "essay",
  },
  {
    href: "/pairings",
    title: "Pairings",
    blurb: "Split an even number into every pairing and knock out the composites.",
    tag: "interactive",
  },
  {
    href: "/firstprimes",
    title: "First primes",
    blurb: "For every even number, its list of first primes. 100 → 3, 11, 17, 29, 41, 47.",
    tag: "interactive",
  },
  {
    href: "/comet",
    title: "The comet",
    blurb: "Every even number vs its Goldbach-pair count — the famous banded comet.",
    tag: "plot",
  },
  {
    href: "/primes",
    title: "Primes",
    blurb: "Every prime as an Ulam spiral or grid, up to 10 million. Watch the diagonals.",
    tag: "plot",
  },
  {
    href: "/differences",
    title: "Differences",
    blurb: "Prime gaps, then the gaps between gaps, then between those — stacked bars.",
    tag: "plot",
  },
  {
    href: "/sieve",
    title: "Unit-block sieve",
    blurb: "Carve the odds into primes, then rebuild the even number from two of them.",
    tag: "interactive",
  },
  {
    href: "/buckets",
    title: "Buckets",
    blurb: "Primes as buckets poured in pairs to fill each even number exactly.",
    tag: "interactive",
  },
  {
    href: "/bases",
    title: "Bases",
    blurb: "The same Goldbach pairs written in base 2, 3, and 4 — identical truth.",
    tag: "interactive",
  },
  {
    href: "/room",
    title: "Always room",
    blurb: "Sieve the window, watch the third of the space that always survives.",
    tag: "interactive",
  },
  {
    href: "/pattern",
    title: "The N−1 = (k+1)p pattern",
    blurb: "Your q = kp+1 idea, checked to a million — where it holds, and where it connects.",
    tag: "finding",
  },
  {
    href: "/squares",
    title: "Prime squares & last digits",
    blurb: "Why a prime squared usually has last two digits adding to a prime — and why it isn't about primes.",
    tag: "finding",
  },
  {
    href: "/luck",
    title: "Lucky primes?",
    blurb: "Do 3, 5, 7 get luckier at making Goldbach pairs as N grows? Turns out it's a dead heat.",
    tag: "finding",
  },
  {
    href: "/worstcase",
    title: "Worst-case hunter",
    blurb: "An equation (N = 2^k) for the even numbers most likely to break Goldbach — and the odds there.",
    tag: "finding",
  },
  {
    href: "/path",
    title: "My path",
    blurb: "Everything tried this far — the conjectures, with honest verdicts.",
    tag: "notes",
  },
  {
    href: "/frontier",
    title: "State of the attack",
    blurb: "~280 years of attempts on Goldbach, and where the frontier sits today.",
    tag: "essay",
  },
];

export default function Home() {
  return (
    <main>
      <div className="wrap">

        <div className="home-head">
          <p className="eyebrow">Goldbach &amp; the primes</p>
          <h1>Pick a topic.</h1>
          <p className="lede">
            A hub of small interactive pages exploring the Goldbach conjecture and
            the primes. Choose one to dive in.
          </p>
        </div>

        <div className="home-grid">
          {TOPICS.map((t) => (
            <Link key={t.href} href={t.href} className="home-card">
              <span className="home-card-tag">{t.tag}</span>
              <span className="home-card-title">{t.title}</span>
              <span className="home-card-blurb">{t.blurb}</span>
              <span className="home-card-go">open →</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
