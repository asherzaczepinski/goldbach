# Forum post draft #2 — Math Stack Exchange

**Suggested tags:** `number-theory`, `prime-numbers`, `prime-gaps`, `reference-request`, `modular-arithmetic`

<!-- All established MSE tags. "Goldbach" not needed here. 5 tags max. -->

---

**Title:**
> Modular preservation in powered prime-gap sums: is this known, and what happens modulo the "non-forced" primes?

---

**Body:**

Let $p_n$ be the $n$-th prime, $g_i = p_{i+1}-p_i$ the consecutive gaps, and for an
integer $k\ge 1$ define the **powered prime-gap partial sum**

$$A_k(n) \;=\; 2 + \sum_{i=1}^{n} g_i^{\,k}.$$

For $k=1$ this telescopes to $A_1(n)=p_{n+1}$. For $k>1$ the values quickly stop
being prime — but some residue information survives exactly.

**Elementary observation.** If $q$ is prime and $(q-1)\mid(k-1)$, then for all $n$,

$$A_k(n)\equiv p_{n+1}\pmod q.$$

*Proof.* When $(q-1)\mid(k-1)$, Fermat gives $x^{k}\equiv x\pmod q$ for every
integer $x$ (both sides are $0$ when $q\mid x$). Hence $g_i^{k}\equiv g_i$, and

$$A_k(n)\equiv 2+\sum_i g_i = 2+(p_{n+1}-2)=p_{n+1}\pmod q. \qquad\square$$

So each such $q$ is an **automatically excluded** prime factor of $A_k(n)$ once
$p_{n+1}>q$. Two consequences:

- For **odd** $k>1$, $2=(3-1)\mid(k-1)$, so $3\nmid A_k(n)$ eventually; for **even**
  $k$ *no* odd prime is forced (a clean even/odd split before any probabilistic input).
- Choosing $k = \operatorname{lcm}\{q-1 : q\le B\}+1$ makes $A_k(n)$ agree with
  $p_{n+1}$ modulo **every** prime $q\le B$, so $A_k(n)$ has no prime factor $\le B$
  once $p_{n+1}>B$ — a finite sieve encoded in the exponent.

Restricting to the forced primes $Q_k=\{q \text{ odd prime}: (q-1)\mid(k-1)\}$
suggests a local enrichment factor $C(k)=\prod_{q\in Q_k} \tfrac{q}{q-1}$
(e.g. $C(3)=\tfrac32,\ C(5)=\tfrac{15}{8},\ C(61)=\prod\to 2.739$). For instance at
$k=61$ the forced primes are $2,3,5,7,11,13,31,61$, whose product is
$2\cdot3\cdot5\cdot7\cdot11\cdot13\cdot31\cdot61 = 56{,}786{,}730$, and
$A_{61}(n)\equiv p_{n+1}$ modulo that.

**My questions.**

1. This identity is immediate from Fermat + telescoping, so I assume it is
   essentially folklore — but is the specific "modular-shadow" packaging (or the
   $C(k)$ enrichment / exponent-encoded sieve) written down anywhere I can cite?
2. The real difficulty is what happens **modulo the primes $q$ with
   $(q-1)\nmid(k-1)$**, which the identity says nothing about. For fixed $k$ and
   such a $q$, is it known (or expected) that $q \mid A_k(n)$ with asymptotic
   frequency $1/q$ — i.e. that the $A_k(n)$ are equidistributed mod $q$? That
   seems to need input on correlations between consecutive gaps.

I found "sums of powers of consecutive gaps" already exists in the literature, so
the object isn't new; I'm asking specifically about the modular-preservation angle
and question (2). Pointers appreciated.

---

### Notes before posting
- The identity is genuinely elementary — leading with that (as above) is the
  honest move and pre-empts "this is trivial" comments; it turns the post into a
  clean reference-request + one real open question.
- If a commenter says question (2) is research-level, that's a signal to move it to
  **MathOverflow** — but MSE is the right first stop for the reference-request.
- Double-check the product $56{,}786{,}730$ if you cite it (your PDF draft had
  $567{,}867{,}300$, which is 10× too large).
