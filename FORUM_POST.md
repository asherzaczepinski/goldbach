# Forum post draft — Math Stack Exchange

**Suggested tags:** `number-theory`, `prime-numbers`, `elementary-number-theory`, `reference-request`, `arithmetic-progressions`

<!-- note: MSE has no usable "goldbach-conjecture" tag (creating new tags needs 300 rep),
     so use the established tags above. Mention "Goldbach" in the title/body instead. -->


**Title:**
> Is this property of even numbers studied/named? "N−1 has a prime factor p with N−p prime"

---

**Body:**

I was playing with Goldbach pairs and noticed that in some of them the larger
prime is the smaller prime times an integer, plus one. That is, I looked at even
$N$ with a representation

$$N = p + q, \qquad q = kp + 1,$$

where $p, q$ are primes and $k$ is a positive integer.

Substituting the second equation into the first, this simplifies neatly:

$$N = p + (kp + 1) = (k+1)p + 1 \quad\Longrightarrow\quad \boxed{N - 1 = (k+1)\,p}.$$

So the condition is equivalent to:

> **There is a prime divisor $p \mid (N-1)$ such that $N - p$ is also prime.**

A couple of observations I was able to make:

- For $N > 4$, both $p$ and $q$ are odd, so $q - 1$ is even and $k = (q-1)/p$ must
  be **even**. Hence if $k$ is required to be prime, then $k = 2$, i.e. $q = 2p+1$
  — the **Sophie Germain** pairs.
- Fixing $p = 3$ gives $q \equiv 1 \pmod 3$, and every such prime $q$ yields a
  valid $N = q + 3$. By Dirichlet there are infinitely many such $q$, so infinitely
  many $N$ have the property.
- When $k+1$ is also prime, $N-1 = p\cdot r$ is a product of two primes and each
  factor can give a pair, e.g. $119 = 7\cdot 17$ gives both
  $120 = 7 + 113$ ($113 = 7\cdot 16 + 1$) and $120 = 17 + 103$ ($103 = 17\cdot 6 + 1$).

I checked how often even $N$ has the property:

| range of even $N$ | count with property | share |
|---|---|---|
| $4$–$100$        | $17 / 49$          | 34.7% |
| $4$–$1{,}000$    | $198 / 499$        | 39.7% |
| $4$–$10{,}000$   | $1{,}914 / 4{,}999$| 38.3% |
| $4$–$100{,}000$  | $17{,}750 / 49{,}999$ | 35.5% |
| $4$–$1{,}000{,}000$ | $163{,}078 / 499{,}999$ | 32.6% |

So it is common but not universal (e.g. $102$ fails, since $101$ is prime and
$102 - 101 = 1$), and the density seems to drift slowly downward. There is even a
run of 32 consecutive even numbers with no such representation, from $649{,}200$
to $649{,}262$.

**My questions:**

1. Is this property (equivalently: *a prime factor of $N-1$ whose complement
   $N - p$ is prime*) studied under any standard name, or does it appear in the
   literature?
2. Is anything known about the asymptotic density of even $N$ with the property
   — does the share tend to a limit, or to $0$?

I suspect this is a recombination of well-known ingredients (Goldbach
representations, primes in arithmetic progressions) rather than anything new, but
I couldn't find it stated in this exact form and would appreciate a pointer.

*(All counts above were computed directly and double-checked up to $10^6$.)*

---

### Notes before you post
- MSE renders the `$...$` LaTeX automatically — paste as-is.
- Keep it as **one** question; the "is it known + is the density studied" pair is fine.
- Tone is deliberately humble ("is this known?", "reference request") — that gets
  the best, least-hostile answers on MSE.
- For **r/math** instead: same text works, but r/math prefers discussion over
  reference-requests; lead with "I'm a student who noticed…" and expect
  pointers rather than a definitive answer.
