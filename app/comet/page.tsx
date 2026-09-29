import Link from "next/link";
import type { Metadata } from "next";
import CometPlot from "../CometPlot";

export const metadata: Metadata = {
  title: "The Goldbach comet — bands by prime factors",
  description:
    "Scatter every even number against its Goldbach-pair count. The dots split into bands driven by how many distinct small prime factors each number has.",
};

export default function CometPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">Interactive · The Goldbach comet</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            The bands you{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              intuited
            </em>
            , made visible.
          </h1>
          <p className="lede">
            Every even number E is a dot: how far right is E, how high up is its
            number of Goldbach pairs. Instead of a fuzzy cloud, the dots snap into
            clean <strong>bands</strong> — and the color reveals the cause. The
            more distinct small prime factors E has, the higher its band. The
            multiples of 3 form the top stripe; the powers of 2 hug the floor.
            This is the famous <em>Goldbach comet</em>.
          </p>
        </div>

        <CometPlot />

        <p className="muted" style={{ padding: "40px 0 60px", fontSize: 15 }}>
          This is the Hardy–Littlewood prediction drawn in dots:{" "}
          <code className="kbd">
            g(E) ≈ 2·C₂ · E/(ln E)² · ∏(q−1)/(q−2)
          </code>{" "}
          over odd primes <code className="kbd">q | E</code>. Each small factor
          multiplies the count — factor 3 nearly doubles it — which is exactly the
          banding. See <Link href="/firstprimes">first primes</Link> for the raw
          lists behind each dot.
        </p>
      </div>
    </main>
  );
}
