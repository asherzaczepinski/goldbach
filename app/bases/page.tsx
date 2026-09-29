import Link from "next/link";
import type { Metadata } from "next";
import BasesGoldbach from "../BasesGoldbach";

export const metadata: Metadata = {
  title: "Bases — Goldbach in base 2, 3, 4",
  description:
    "Does Goldbach still hold in other number systems? The same prime pairs added in base 2, 3, and 4 — different digits, identical truth.",
};

export default function BasesPage() {
  return (
    <main>
      <div className="wrap">
        <div className="backbar">
          <Link href="/">← back</Link>
        </div>

        <div className="upage-head">
          <p className="eyebrow">Part IV · Interactive</p>
          <h1 style={{ fontSize: "clamp(30px,5vw,46px)" }}>
            Same fact, different{" "}
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>digits</em>.
          </h1>
          <p className="lede">
            You asked whether it still applies in base 2, 3, 4. It does — and
            here&apos;s the honest reason, shown rather than asserted: a base is
            just handwriting for a quantity. Watch the same Goldbach pair get added
            up correctly in each base.
          </p>
        </div>

        <BasesGoldbach />

        <p className="muted" style={{ padding: "36px 0 60px", fontSize: 15 }}>
          Bottom line: changing base can&apos;t make Goldbach easier or harder — it
          can&apos;t even change the question. The difficulty from the{" "}
          <Link href="/#explore">write-up</Link> lives in the numbers themselves,
          not in how we spell them.
        </p>
      </div>
    </main>
  );
}
