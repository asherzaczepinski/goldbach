#!/usr/bin/env python3
"""
Covering-systems search for a FIXED set of odd moduli.

The game: choose one residue a_n mod n for each modulus n in MODULI.  An integer
is "covered" if it satisfies at least one congruence x = a_n (mod n), and a
"hole" if it dodges all of them.  Everything repeats mod L = lcm(MODULI), so a
brute-force over 0..L-1 settles the infinite question exactly.

This script brute-forces every combination of residues, reports the best and
worst coverage, and dumps the structure of the holes that survive the optimum.

Default set {3,5,7,9,11}:
    * best coverage  = 2265 / 3465 = 151/231 ~ 65.37%   (a9 mod 3 != a3)
    * worst coverage = 2025 / 3465        ~ 58.44%       (a9 mod 3  = a3, 9 redundant)
    * the ONLY lever is 3 vs 9 (shared factor). For pairwise-coprime moduli the
      residue choice never changes the COUNT covered — CRT forces fixed overlaps.

Run:  python3 scripts/covering_search.py
      python3 scripts/covering_search.py 3 5 7 11 13   # any odd set you like
"""

from __future__ import annotations
import sys
from math import gcd
from functools import reduce
from itertools import product


def lcm(nums):
    return reduce(lambda a, b: a * b // gcd(a, b), nums, 1)


def coverage_count(moduli, residues, L):
    """How many of 0..L-1 are covered by the given residue choice."""
    covered = bytearray(L)
    for n, a in zip(moduli, residues):
        # mark every x = a (mod n)
        for x in range(a % n, L, n):
            covered[x] = 1
    return sum(covered), covered


def holes(moduli, residues, L):
    covered = coverage_count(moduli, residues, L)[1]
    return [x for x in range(L) if not covered[x]]


def search(moduli):
    moduli = sorted(set(moduli))
    L = lcm(moduli)
    print(f"moduli   = {moduli}")
    print(f"lcm      = {L}")
    print(f"sum 1/n  = {sum(1 / n for n in moduli):.6f}  "
          f"(< 1 means 100% coverage is impossible)")
    combos = 1
    for n in moduli:
        combos *= n
    print(f"combos   = {combos:,}")
    print()

    best = (-1, None)
    worst = (L + 1, None)
    for residues in product(*[range(n) for n in moduli]):
        c = coverage_count(moduli, residues, L)[0]
        if c > best[0]:
            best = (c, residues)
        if c < worst[0]:
            worst = (c, residues)

    for label, (c, res) in (("BEST", best), ("WORST", worst)):
        pct = 100 * c / L
        print(f"{label:5s}  residues {dict(zip(moduli, res))}")
        print(f"        covered {c}/{L} = {pct:.4f}%   holes {L - c}")
    print()

    # hole structure at the optimum
    hs = holes(moduli, best[1], L)
    print(f"holes at optimum: {len(hs)} residues mod {L}")
    print(f"  first 20: {hs[:20]}")
    # sanity: the closed-form survivor product
    survivors = 1
    seen_three = None
    # generic survivor formula for this specific shape (coprime parts remove 1 each;
    # a prime power p^k with its base prime p present removes 1 extra iff residues dodge)
    print()
    print("closed-form check (for {3,5,7,9,11}):")
    print("  survivors = (5/9)(4/5)(6/7)(10/11) = 80/231 -> "
          f"{80 * L // 231} holes, {L - 80 * L // 231} covered")


if __name__ == "__main__":
    args = [int(a) for a in sys.argv[1:]] or [3, 5, 7, 9, 11]
    if any(n % 2 == 0 for n in args):
        print("note: set includes an even modulus — covering becomes easy.\n")
    search(args)
