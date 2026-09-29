import Link from "next/link";
import type { Metadata } from "next";
import BucketGoldbach from "../BucketGoldbach";

export const metadata: Metadata = {
  title: "Buckets — Goldbach as water poured just right",
  description:
    "Primes as buckets that can't overflow or underflow, poured in pairs to fill each even number exactly.",
};

export default function BucketsPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">Part III · Interactive</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            Pour two primes into a bucket —{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>
              just right
            </em>
            , every time.
          </h1>
          <p className="lede">
            A prime is a bucket you can&apos;t fill with equal cups — every cup
            size overflows or underflows, so it&apos;s indivisible. Pick an even
            number and watch pairs of prime buckets pour together to fill it
            exactly: no spill, no shortfall. Each even number has its own count of
            pairs that work — and the count never hits zero.
          </p>
        </div>

        <BucketGoldbach />

        <p className="muted" style={{ padding: "40px 0 60px", fontSize: 15 }}>
          The comet never touching zero is exactly Goldbach — and proving it stays
          up for <em>every</em> bar forever is the open part (see the{" "}
          <Link href="/#explore">write-up</Link>). The buckets make the mechanism
          vivid; they can&apos;t cross that last gap, but nothing visual can.
        </p>
      </div>
    </main>
  );
}
