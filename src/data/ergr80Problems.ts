export type ErdosProblemStatus = "open" | "solved" | "disproved";

export interface ErdosProblemCard {
  id: number;
  status: ErdosProblemStatus;
  prize: number | null;
  text: string;
}

export const ergr80Stats = {
  "total": 303,
  "open": 166,
  "solved": 137,
  "withPrize": 21
} as const;

export const ergr80PrizeDistribution = {
  "$500": 9,
  "$1000": 2,
  "$5000": 1,
  "$100": 4,
  "$25": 1,
  "none": 282,
  "$250": 3,
  "$10": 1
} as const;

export const ergr80Problems: ErdosProblemCard[] = [
  {
    "id": 1,
    "status": "open",
    "prize": 500,
    "text": "If $A\\subseteq \\{1,\\ldots,N\\}$ with $\\lvert A\\rvert=n$ is such that the subset sums $\\sum_{a\\in S}a$ are distinct for all $S\\subseteq A$ then\\[N \\gg 2^{n}.\\]"
  },
  {
    "id": 2,
    "status": "solved",
    "prize": 1000,
    "text": "Can the smallest modulus of a covering system be arbitrarily large?"
  },
  {
    "id": 3,
    "status": "open",
    "prize": 5000,
    "text": "If $A\\subseteq \\mathbb{N}$ has $\\sum_{n\\in A}\\frac{1}{n}=\\infty$ then must $A$ contain arbitrarily long arithmetic progressions?"
  },
  {
    "id": 6,
    "status": "solved",
    "prize": 100,
    "text": "Let $d_n=p_{n+1}-p_n$. Are there infinitely many $n$ such that $d_n<d_{n+1}<d_{n+2}$?"
  },
  {
    "id": 7,
    "status": "open",
    "prize": 25,
    "text": "Is there a distinct covering system all of whose moduli are odd?"
  },
  {
    "id": 8,
    "status": "solved",
    "prize": null,
    "text": "For any finite colouring of the integers is there a covering system all of whose moduli are monochromatic?"
  },
  {
    "id": 9,
    "status": "open",
    "prize": null,
    "text": "Let $A$ be the set of all odd integers $\\geq 1$ not of the form $p+2^{k}+2^l$ (where $k,l\\geq 0$ and $p$ is prime). Is the upper density of $A$ positive?"
  },
  {
    "id": 10,
    "status": "open",
    "prize": null,
    "text": "Is there some $k$ such that every large integer is the sum of a prime and at most $k$ powers of 2?"
  },
  {
    "id": 11,
    "status": "open",
    "prize": null,
    "text": "Is every large odd integer $n$ the sum of a squarefree number and a power of 2?"
  },
  {
    "id": 18,
    "status": "open",
    "prize": 250,
    "text": "We call $m$ practical if every integer $1\\leq n<m$ is the sum of distinct divisors of $m$. If $m$ is practical then let $h(m)$ be such that $h(m)$ many divisors always suffice. Are there infinitely many practical $m$ such that\\[h(m) < (\\log\\log m)^{O(1)}?\\] Is it true that $h(n!)<n^{o(1)}$? Or perhaps even $h(n!)<(\\log n)^{O(1)}$?"
  },
  {
    "id": 28,
    "status": "open",
    "prize": 500,
    "text": "If $A\\subseteq \\mathbb{N}$ is such that $A+A$ contains all but finitely many integers then $\\limsup 1_A\\ast 1_A(n)=\\infty$."
  },
  {
    "id": 29,
    "status": "solved",
    "prize": 100,
    "text": "Is there an explicit construction of a set $A\\subseteq \\mathbb{N}$ such that $A+A=\\mathbb{N}$ but $1_A\\ast 1_A(n)=o(n^\\epsilon)$ for every $\\epsilon>0$?"
  },
  {
    "id": 34,
    "status": "solved",
    "prize": null,
    "text": "For any permutation $\\pi\\in S_n$ of $\\{1,\\ldots,n\\}$ let $S(\\pi)$ count the number of distinct consecutive sums, that is, sums of the shape $\\sum_{u\\leq i\\leq v}\\pi(i)$. Is it true that\\[S(\\pi) = o(n^2)\\] for all $\\pi\\in S_n$?"
  },
  {
    "id": 37,
    "status": "solved",
    "prize": null,
    "text": "We say that $A\\subset \\mathbb{N}$ is an essential component if $d_s(A+B)>d_s(B)$ for every $B\\subset \\mathbb{N}$ with $0<d_s(B)<1$ where $d_s$ is the Schnirelmann density. Can a lacunary set $A\\subset\\mathbb{N}$ be an essential component?"
  },
  {
    "id": 39,
    "status": "open",
    "prize": 500,
    "text": "Is there an infinite Sidon set $A\\subset \\mathbb{N}$ such that\\[\\lvert A\\cap \\{1\\ldots,N\\}\\rvert \\gg_\\epsilon N^{1/2-\\epsilon}\\] for all $\\epsilon>0$?"
  },
  {
    "id": 41,
    "status": "open",
    "prize": 500,
    "text": "Let $A\\subset\\mathbb{N}$ be an infinite set such that the triple sums $a+b+c$ are all distinct for $a,b,c\\in A$ (aside from the trivial coincidences). Is it true that\\[\\liminf \\frac{\\lvert A\\cap \\{1,\\ldots,N\\}\\rvert}{N^{1/3}}=0?\\]"
  },
  {
    "id": 46,
    "status": "solved",
    "prize": null,
    "text": "Does every finite colouring of the integers have a monochromatic solution to $1=\\sum \\frac{1}{n_i}$ with $2\\leq n_1<\\cdots <n_k$?"
  },
  {
    "id": 47,
    "status": "solved",
    "prize": 100,
    "text": "If $\\delta>0$ and $N$ is sufficiently large in terms of $\\delta$, and $A\\subseteq\\{1,\\ldots,N\\}$ is such that $\\sum_{a\\in A}\\frac{1}{a}>\\delta \\log N$ then must there exist $S\\subseteq A$ such that $\\sum_{n\\in S}\\frac{1}{n}=1$?"
  },
  {
    "id": 48,
    "status": "solved",
    "prize": null,
    "text": "Are there infinitely many integers $n,m$ such that $\\phi(n)=\\sigma(m)$?"
  },
  {
    "id": 52,
    "status": "open",
    "prize": 250,
    "text": "Let $A$ be a finite set of integers. Is it true that for every $\\epsilon>0$\\[\\max( \\lvert A+A\\rvert,\\lvert AA\\rvert)\\gg_\\epsilon \\lvert A\\rvert^{2-\\epsilon}?\\]"
  },
  {
    "id": 53,
    "status": "solved",
    "prize": null,
    "text": "Let $A$ be a finite set of integers. Is it true that, for every $k$, if $\\lvert A\\rvert$ is sufficiently large depending on $k$, then there are least $\\lvert A\\rvert^k$ many integers which are either the sum or product of distinct elements of $A$?"
  },
  {
    "id": 66,
    "status": "open",
    "prize": 500,
    "text": "Is there $A\\subseteq \\mathbb{N}$ such that\\[\\lim_{n\\to \\infty}\\frac{1_A\\ast 1_A(n)}{\\log n}\\] exists and is $\\neq 0$?"
  },
  {
    "id": 67,
    "status": "solved",
    "prize": 500,
    "text": "If $f:\\mathbb{N}\\to \\{-1,+1\\}$ then is it true that for every $C>0$ there exist $d,m\\geq 1$ such that\\[\\left\\lvert \\sum_{1\\leq k\\leq m}f(kd)\\right\\rvert > C?\\]"
  },
  {
    "id": 69,
    "status": "solved",
    "prize": null,
    "text": "Is\\[\\sum_{n\\geq 2}\\frac{\\omega(n)}{2^n}\\] irrational? (Here $\\omega(n)$ counts the number of distinct prime divisors of $n$.)"
  },
  {
    "id": 109,
    "status": "solved",
    "prize": null,
    "text": "Any $A\\subseteq \\mathbb{N}$ of positive upper density contains a sumset $B+C$ where both $B$ and $C$ are infinite."
  },
  {
    "id": 137,
    "status": "open",
    "prize": null,
    "text": "We say that $N$ is powerful if whenever $p\\mid N$ we also have $p^2\\mid N$. Let $k\\geq 3$. Can the product of any $k$ consecutive positive integers ever be powerful?"
  },
  {
    "id": 138,
    "status": "open",
    "prize": 500,
    "text": "Let the van der Waerden number $W(k)$ be such that whenever $N\\geq W(k)$ and $\\{1,\\ldots,N\\}$ is $2$-coloured there must exist a monochromatic $k$-term arithmetic progression. Improve the bounds for $W(k)$ - for example, prove that $W(k)^{1/k}\\to \\infty$."
  },
  {
    "id": 140,
    "status": "solved",
    "prize": 500,
    "text": "Let $r_3(N)$ be the size of the largest subset of $\\{1,\\ldots,N\\}$ which does not contain a non-trivial $3$-term arithmetic progression. Prove that $r_3(N)\\ll N/(\\log N)^C$ for every $C>0$."
  },
  {
    "id": 144,
    "status": "solved",
    "prize": 250,
    "text": "The density of integers which have two divisors $d_1,d_2$ such that $d_1<d_2<2d_1$ exists and is equal to $1$."
  },
  {
    "id": 148,
    "status": "open",
    "prize": null,
    "text": "Let $F(k)$ be the number of solutions to\\[1= \\frac{1}{n_1}+\\cdots+\\frac{1}{n_k},\\] where $1\\leq n_1<\\cdots<n_k$ are distinct integers. Find good estimates for $F(k)$."
  },
  {
    "id": 168,
    "status": "open",
    "prize": null,
    "text": "Let $F(N)$ be the size of the largest subset of $\\{1,\\ldots,N\\}$ which does not contain any set of the form $\\{n,2n,3n\\}$. What is\\[\\lim_{N\\to \\infty}\\frac{F(N)}{N}?\\] Is this limit irrational?"
  },
  {
    "id": 169,
    "status": "open",
    "prize": null,
    "text": "Let $k\\geq 3$ and $f(k)$ be the supremum of $\\sum_{n\\in A}\\frac{1}{n}$ as $A$ ranges over all sets of positive integers which do not contain a $k$-term arithmetic progression. Estimate $f(k)$. Is\\[\\lim_{k\\to \\infty}\\frac{f(k)}{\\log W(k)}=\\infty\\] where $W(k)$ is the van der Waerden number?"
  },
  {
    "id": 171,
    "status": "solved",
    "prize": null,
    "text": "Is it true that for every $\\epsilon>0$ and integer $t\\geq 1$, if $N$ is sufficiently large and $A$ is a subset of $[t]^N$ of size at least $\\epsilon t^N$ then $A$ must contain a combinatorial line $P$ (a set $P=\\{p_1,\\ldots,p_t\\}$ where for each coordinate $1\\leq j\\leq t$ the $j$th coordinate of $p_i$ is either $i$ or constant)."
  },
  {
    "id": 172,
    "status": "open",
    "prize": null,
    "text": "Is it true that in any finite colouring of $\\mathbb{N}$ there exist arbitrarily large finite $A$ such that all sums and products of distinct elements in $A$ are the same colour?"
  },
  {
    "id": 173,
    "status": "open",
    "prize": null,
    "text": "In any $2$-colouring of $\\mathbb{R}^2$, for all but at most one triangle $T$, there is a monochromatic congruent copy of $T$."
  },
  {
    "id": 174,
    "status": "open",
    "prize": null,
    "text": "A finite set $A\\subset \\mathbb{R}^n$ is called Ramsey if, for any $k\\geq 1$, there exists some $d=d(A,k)$ such that in any $k$-colouring of $\\mathbb{R}^d$ there exists a monochromatic copy of $A$. Characterise the Ramsey sets in $\\mathbb{R}^n$."
  },
  {
    "id": 175,
    "status": "solved",
    "prize": null,
    "text": "Show that, for any $n\\geq 5$, the binomial coefficient $\\binom{2n}{n}$ is not squarefree."
  },
  {
    "id": 176,
    "status": "open",
    "prize": null,
    "text": "Let $N(k,\\ell)$ be the minimal $N$ such that for any $f:\\{1,\\ldots,N\\}\\to\\{-1,1\\}$ there must exist a $k$-term arithmetic progression $P$ such that\\[\\left\\lvert \\sum_{n\\in P}f(n)\\right\\rvert\\geq \\ell.\\] Find good upper bounds for $N(k,\\ell)$. Is it true that for any $c>0$ there exists some $C>1$ such that\\[N(k,ck)\\leq C^k?\\] What about\\[N(k,2)\\leq C^k\\] or\\[N(k,\\sqrt{k})\\leq C^k?\\]"
  },
  {
    "id": 177,
    "status": "open",
    "prize": null,
    "text": "Find the smallest $h(d)$ such that the following holds. There exists a function $f:\\mathbb{N}\\to\\{-1,1\\}$ such that, for every $d\\geq 1$,\\[\\max_{P_d}\\left\\lvert \\sum_{n\\in P_d}f(n)\\right\\rvert\\leq h(d),\\] where $P_d$ ranges over all finite arithmetic progressions with common difference $d$."
  },
  {
    "id": 178,
    "status": "solved",
    "prize": null,
    "text": "Let $A_1,A_2,\\ldots$ be an infinite collection of infinite sets of integers, say $A_i=\\{a_{i1}<a_{i2}<\\cdots\\}$. Does there exist some $f:\\mathbb{N}\\to\\{-1,1\\}$ such that\\[\\max_{m, 1\\leq i\\leq d} \\left\\lvert \\sum_{1\\leq j\\leq m} f(a_{ij})\\right\\rvert \\ll_d 1\\] for all $d\\geq 1$?"
  },
  {
    "id": 179,
    "status": "solved",
    "prize": null,
    "text": "Let $1\\leq k<\\ell$ be integers and define $F_k(N,\\ell)$ to be minimal such that every set $A\\subset \\mathbb{N}$ of size $N$ which contains at least $F_k(N,\\ell)$ many $k$-term arithmetic progressions must contain an $\\ell$-term arithmetic progression. Find good upper bounds for $F_k(N,\\ell)$. Is it true that\\[F_3(N,4)=o(N^2)?\\] Is it true that for every $\\ell>3$\\[\\lim_{N\\to \\infty}\\frac{\\log F_3(N,\\ell)}{\\log N}=2?\\]"
  },
  {
    "id": 186,
    "status": "solved",
    "prize": null,
    "text": "Let $F(N)$ be the maximal size of $A\\subseteq \\{1,\\ldots,N\\}$ which is 'non-averaging', so that no $n\\in A$ is the arithmetic mean of at least two elements in $A$. What is the order of growth of $F(N)$?"
  },
  {
    "id": 187,
    "status": "open",
    "prize": null,
    "text": "Find the best function $f(d)$ such that, in any 2-colouring of the integers, at least one colour class contains an arithmetic progression with common difference $d$ of length $f(d)$ for infinitely many $d$."
  },
  {
    "id": 188,
    "status": "open",
    "prize": null,
    "text": "What is the smallest $k$ such that $\\mathbb{R}^2$ can be red/blue coloured with no pair of red points unit distance apart, and no $k$-term arithmetic progression of blue points with distance $1$?"
  },
  {
    "id": 189,
    "status": "solved",
    "prize": null,
    "text": "If $\\mathbb{R}^2$ is finitely coloured then must there exist some colour class which contains the vertices of a rectangle of every area?"
  },
  {
    "id": 190,
    "status": "solved",
    "prize": null,
    "text": "Let $H(k)$ be the smallest $N$ such that in any finite colouring of $\\{1,\\ldots,N\\}$ (into any number of colours) there is always either a monochromatic $k$-term arithmetic progression or a rainbow arithmetic progression (i.e. all elements are different colours). Estimate $H(k)$. Is it true that\\[H(k)^{1/k}/k \\to \\infty\\] as $k\\to\\infty$?"
  },
  {
    "id": 191,
    "status": "solved",
    "prize": null,
    "text": "Let $C>0$ be arbitrary. Is it true that, if $n$ is sufficiently large depending on $C$, then in any $2$-colouring of $\\binom{\\{2,\\ldots,n\\}}{2}$ there exists some $X\\subseteq \\{2,\\ldots,n\\}$ such that $\\binom{X}{2}$ is monochromatic and\\[\\sum_{x\\in X}\\frac{1}{\\log x}\\geq C?\\]"
  },
  {
    "id": 192,
    "status": "solved",
    "prize": null,
    "text": "Let $A=\\{a_1,a_2,\\ldots\\}\\subset \\mathbb{R}^d$ be an infinite sequence such that $a_{i+1}-a_i$ is a positive unit vector (i.e. is of the form $(0,0,\\ldots,1,0,\\ldots,0)$). For which $d$ must $A$ contain a three-term arithmetic progression?"
  },
  {
    "id": 193,
    "status": "open",
    "prize": null,
    "text": "Let $S\\subseteq \\mathbb{Z}^3$ be a finite set and let $A=\\{a_1,a_2,\\ldots,\\}\\subset \\mathbb{Z}^3$ be an infinite $S$-walk, so that $a_{i+1}-a_i\\in S$ for all $i$. Must $A$ contain three collinear points?"
  },
  {
    "id": 194,
    "status": "solved",
    "prize": null,
    "text": "Let $k\\geq 3$. Must any ordering of $\\mathbb{R}$ contain a monotone $k$-term arithmetic progression, that is, some $x_1<\\cdots<x_k$ which forms an increasing or decreasing $k$-term arithmetic progression?"
  },
  {
    "id": 195,
    "status": "open",
    "prize": null,
    "text": "What is the largest $k$ such that in any permutation of $\\mathbb{Z}$ there must exist a monotone $k$-term arithmetic progression $x_1<\\cdots<x_k$?"
  },
  {
    "id": 196,
    "status": "open",
    "prize": null,
    "text": "Must every permutation of $\\mathbb{N}$ contain a monotone 4-term arithmetic progression? In other words, given a permutation $x$ of $\\mathbb{N}$ must there be indices with either $i<j<k<l$ or $i>j>k>l$ such that $x_i,x_j,x_k,x_l$ are an arithmetic progression?"
  },
  {
    "id": 197,
    "status": "open",
    "prize": null,
    "text": "Can $\\mathbb{N}$ be partitioned into two sets, each of which can be permuted to avoid monotone 3-term arithmetic progressions?"
  },
  {
    "id": 198,
    "status": "solved",
    "prize": null,
    "text": "If $A\\subset \\mathbb{N}$ is a Sidon set then must the complement of $A$ contain an infinite arithmetic progression?"
  },
  {
    "id": 199,
    "status": "solved",
    "prize": null,
    "text": "If $A\\subset \\mathbb{R}$ does not contain a 3-term arithmetic progression then must $\\mathbb{R}\\backslash A$ contain an infinite arithmetic progression?"
  },
  {
    "id": 200,
    "status": "open",
    "prize": null,
    "text": "Does the longest arithmetic progression of primes in $\\{1,\\ldots,N\\}$ have length $o(\\log N)$?"
  },
  {
    "id": 201,
    "status": "open",
    "prize": null,
    "text": "Let $G_k(N)$ be such that any set of $N$ integers contains a subset of size at least $G_k(N)$ which does not contain a $k$-term arithmetic progression. Determine the size of $G_k(N)$. How does it relate to $R_k(N)$, the size of the largest subset of $\\{1,\\ldots,N\\}$ without a $k$-term arithmetic progression? Is it true that\\[\\lim_{N\\to \\infty}\\frac{R_3(N)}{G_3(N)}=1?\\]"
  },
  {
    "id": 202,
    "status": "solved",
    "prize": null,
    "text": "Let $n_1&##60;\\cdots &##60; n_r\\leq N$ with associated $a_i\\pmod{n_i}$ such that the congruence classes are disjoint (that is, every integer is $\\equiv a_i\\pmod{n_i}$ for at most one $1\\leq i\\leq r$). How large can $r$ be in terms of $N$?"
  },
  {
    "id": 203,
    "status": "open",
    "prize": null,
    "text": "Is there an integer $m\\geq 1$ with $(m,6)=1$ such that none of $2^k3^\\ell m+1$ are prime, for any $k,\\ell\\geq 0$?"
  },
  {
    "id": 204,
    "status": "solved",
    "prize": null,
    "text": "Are there $n$ such that there is a covering system with moduli the divisors of $n$ which is 'as disjoint as possible'? That is, for all $d\\mid n$ with $d>1$ there is an associated $a_d$ such that every integer is congruent to some $a_d\\pmod{d}$, and if there is some integer $x$ with\\[x\\equiv a_d\\pmod{d}\\textrm{ and }x\\equiv a_{d'}\\pmod{d'}\\] then $(d,d')=1$."
  },
  {
    "id": 205,
    "status": "solved",
    "prize": null,
    "text": "Is it true that all sufficiently large $n$ can be written as $2^k+m$ for some $k\\geq 0$, where $\\Omega(m)<\\log\\log m$? (Here $\\Omega(m)$ is the number of prime divisors of $m$ counted with multiplicity.) What about $<\\epsilon \\log\\log m$? Or some more slowly growing function?"
  },
  {
    "id": 206,
    "status": "solved",
    "prize": null,
    "text": "Let $x>0$ be a real number. For any $n\\geq 1$ let\\[R_n(x) = \\sum_{i=1}^n\\frac{1}{m_i}<x\\] be the maximal sum of $n$ distinct unit fractions which is $<x$. Is it true that, for almost all $x$, for sufficiently large $n$, we have\\[R_{n+1}(x)=R_n(x)+\\frac{1}{m},\\] where $m$ is minimal such that $m$ does not appear in $R_n(x)$ and the right-hand side is $<x$? (That is, are the best underapproximations eventually always constructed in a 'greedy' fashion?)"
  },
  {
    "id": 220,
    "status": "solved",
    "prize": 500,
    "text": "Let $n\\geq 1$ and\\[A=\\{a_1<\\cdots <a_{\\phi(n)}\\}=\\{ 1\\leq m<n : (m,n)=1\\}.\\] Is it true that\\[\\sum_{1\\leq k<\\phi(n)}(a_{k+1}-a_k)^2 \\ll \\frac{n^2}{\\phi(n)}?\\]"
  },
  {
    "id": 241,
    "status": "open",
    "prize": 100,
    "text": "Let $f(N)$ be the maximum size of $A\\subseteq \\{1,\\ldots,N\\}$ such that the sums $a+b+c$ with $a,b,c\\in A$ are all distinct (aside from the trivial coincidences). Is it true that\\[f(N)\\sim N^{1/3}?\\]"
  },
  {
    "id": 242,
    "status": "open",
    "prize": null,
    "text": "For every $n>2$ there exist distinct integers $1\\leq x<y<z$ such that\\[\\frac{4}{n} = \\frac{1}{x}+\\frac{1}{y}+\\frac{1}{z}.\\]"
  },
  {
    "id": 243,
    "status": "open",
    "prize": null,
    "text": "Let $1\\leq a_1<a_2<\\cdots$ be a sequence of integers such that\\[\\lim_{n\\to \\infty}\\frac{a_n}{a_{n-1}^2}=1\\] and $\\sum\\frac{1}{a_n}\\in \\mathbb{Q}$. Then, for all sufficiently large $n\\geq 1$,\\[a_n = a_{n-1}^2-a_{n-1}+1.\\]"
  },
  {
    "id": 245,
    "status": "solved",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{N}$ be an infinite set such that $\\lvert A\\cap \\{1,\\ldots,N\\}\\rvert=o(N)$. Is it true that\\[\\limsup_{N\\to \\infty}\\frac{\\lvert (A+A)\\cap \\{1,\\ldots,N\\}\\rvert}{\\lvert A\\cap \\{1,\\ldots,N\\}\\rvert}\\geq 3?\\]"
  },
  {
    "id": 247,
    "status": "open",
    "prize": null,
    "text": "Let $1\\leq a_1<a_2<\\cdots$ be a sequence of integers such that\\[\\limsup \\frac{a_n}{n}=\\infty.\\] Is\\[\\sum_{n=1}^\\infty \\frac{1}{2^{a_n}}\\] transcendental?"
  },
  {
    "id": 248,
    "status": "solved",
    "prize": null,
    "text": "Are there infinitely many $n$ such that, for all $k\\geq 1$,\\[\\omega(n+k) \\ll k?\\](Here $\\omega(n)$ is the number of distinct prime divisors of $n$.)"
  },
  {
    "id": 249,
    "status": "open",
    "prize": null,
    "text": "Is\\[\\sum_n \\frac{\\phi(n)}{2^n}\\] irrational? Here $\\phi$ is the Euler totient function."
  },
  {
    "id": 250,
    "status": "solved",
    "prize": null,
    "text": "Is\\[\\sum \\frac{\\sigma(n)}{2^n}\\] irrational? (Here $\\sigma(n)$ is the sum of divisors function.)"
  },
  {
    "id": 251,
    "status": "open",
    "prize": null,
    "text": "Is\\[\\sum \\frac{p_n}{2^n}\\] irrational? (Here $p_n$ is the $n$th prime.)"
  },
  {
    "id": 252,
    "status": "open",
    "prize": null,
    "text": "Let $k\\geq 1$ and $\\sigma_k(n)=\\sum_{d\\mid n}d^k$. Is\\[\\sum \\frac{\\sigma_k(n)}{n!}\\] irrational?"
  },
  {
    "id": 257,
    "status": "open",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{N}$ be an infinite set. Is\\[\\sum_{n\\in A}\\frac{1}{2^n-1}\\] irrational?"
  },
  {
    "id": 258,
    "status": "solved",
    "prize": null,
    "text": "Let $a_1,a_2,\\ldots$ be a sequence of positive integers with $a_n\\to \\infty$. Is\\[\\sum_{n} \\frac{\\tau(n)}{a_1\\cdots a_n}\\] irrational, where $\\tau(n)$ is the number of divisors of $n$?"
  },
  {
    "id": 259,
    "status": "solved",
    "prize": null,
    "text": "Is the sum\\[\\sum_{n} \\mu(n)^2\\frac{n}{2^n}\\] irrational?"
  },
  {
    "id": 260,
    "status": "open",
    "prize": null,
    "text": "Let $a_1<a_2<\\cdots$ be an increasing sequence such that $a_n/n\\to \\infty$. Is the sum\\[\\sum_n \\frac{a_n}{2^{a_n}}\\] irrational?"
  },
  {
    "id": 261,
    "status": "open",
    "prize": null,
    "text": "Are there infinitely many $n$ such that there exists some $t\\geq 2$ and distinct integers $a_1,\\ldots,a_t\\geq 1$ such that\\[\\frac{n}{2^n}=\\sum_{1\\leq k\\leq t}\\frac{a_k}{2^{a_k}}?\\] Is this true for all $n$? Is there a rational $x$ such that\\[x = \\sum_{k=1}^\\infty \\frac{a_k}{2^{a_k}}\\] has at least $2^{\\aleph_0}$ solutions?"
  },
  {
    "id": 262,
    "status": "solved",
    "prize": null,
    "text": "Suppose $a_1<a_2<\\cdots$ is a sequence of integers such that for all integer sequences $t_n$ with $t_n\\geq 1$ the sum\\[\\sum_{n=1}^\\infty \\frac{1}{t_na_n}\\] is irrational. How slowly can $a_n$ grow?"
  },
  {
    "id": 263,
    "status": "open",
    "prize": null,
    "text": "Let $a_n$ be an increasing sequence of positive integers such that for every sequence of positive integers $b_n$ with $b_n/a_n\\to 1$ the sum\\[\\sum\\frac{1}{b_n}\\] is irrational. Is $a_n=2^{2^n}$ such a sequence? Must such a sequence satisfy $a_n^{1/n}\\to \\infty$?"
  },
  {
    "id": 264,
    "status": "open",
    "prize": null,
    "text": "Let $a_n$ be a sequence of positive integers such that for every bounded sequence of integers $b_n$ (with $a_n+b_n\\neq 0$ and $b_n\\neq 0$ for all $n$) the sum\\[\\sum \\frac{1}{a_n+b_n}\\] is irrational. Are $a_n=2^n$ or $a_n=n!$ examples of such a sequence?"
  },
  {
    "id": 265,
    "status": "open",
    "prize": null,
    "text": "Let $1\\leq a_1<a_2<\\cdots$ be an increasing sequence of integers. How fast can $a_n\\to \\infty$ grow if\\[\\sum\\frac{1}{a_n}\\quad\\textrm{and}\\quad\\sum\\frac{1}{a_n-1}\\] are both rational?"
  },
  {
    "id": 266,
    "status": "solved",
    "prize": null,
    "text": "Let $a_n$ be an infinite sequence of positive integers such that $\\sum \\frac{1}{a_n}$ converges. There exists some integer $t\\geq 1$ such that\\[\\sum \\frac{1}{a_n+t}\\] is irrational."
  },
  {
    "id": 267,
    "status": "open",
    "prize": null,
    "text": "Let $F_1=F_2=1$ and $F_{n+1}=F_n+F_{n-1}$ be the Fibonacci sequence. Let $n_1<n_2<\\cdots $ be an infinite sequence with $n_{k+1}/n_k \\geq c>1$. Must\\[\\sum_k\\frac{1}{F_{n_k}}\\] be irrational?"
  },
  {
    "id": 268,
    "status": "solved",
    "prize": null,
    "text": "Let $X\\subseteq \\mathbb{R}^3$ be the set of all points of the shape\\[\\left( \\sum_{n\\in A} \\frac{1}{n},\\sum_{n\\in A}\\frac{1}{n+1},\\sum_{n\\in A} \\frac{1}{n+2}\\right)\\] as $A\\subseteq\\mathbb{N}$ ranges over all infinite sets with $\\sum_{n\\in A}\\frac{1}{n}<\\infty$. Does $X$ contain an open set?"
  },
  {
    "id": 269,
    "status": "open",
    "prize": null,
    "text": "Let $P$ be a finite set of primes with $\\lvert P\\rvert \\geq 2$ and let $\\{a_1<a_2<\\cdots\\}=\\{ n\\in \\mathbb{N} : \\textrm{if }p\\mid n\\textrm{ then }p\\in P\\}$. Is the sum\\[\\sum_{n=1}^\\infty \\frac{1}{[a_1,\\ldots,a_n]},\\] where $[a_1,\\ldots,a_n]$ is the lowest common multiple of $a_1,\\ldots,a_n$, irrational?"
  },
  {
    "id": 270,
    "status": "solved",
    "prize": null,
    "text": "Let $f(n)\\to \\infty$ as $n\\to \\infty$. Is it true that\\[\\sum_{n\\geq 1} \\frac{1}{(n+1)\\cdots (n+f(n))}\\] is irrational?"
  },
  {
    "id": 271,
    "status": "open",
    "prize": null,
    "text": "Let $A(n)=\\{a_0<a_1<\\cdots\\}$ be the sequence defined by $a_0=0$ and $a_1=n$, and for $k\\geq 1$ define $a_{k+1}$ as the least positive integer such that there is no three-term arithmetic progression in $\\{a_0,\\ldots,a_{k+1}\\}$. Can the $a_k$ be explicitly determined? How fast do they grow?"
  },
  {
    "id": 272,
    "status": "open",
    "prize": null,
    "text": "Let $N\\geq 1$. What is the largest $t$ such that there are $A_1,\\ldots,A_t\\subseteq \\{1,\\ldots,N\\}$ with $A_i\\cap A_j$ a non-empty arithmetic progression for all $i\\neq j$?"
  },
  {
    "id": 273,
    "status": "open",
    "prize": null,
    "text": "Is there a covering system all of whose moduli are of the form $p-1$ for some primes $p\\geq 5$?"
  },
  {
    "id": 274,
    "status": "open",
    "prize": null,
    "text": "If $G$ is a group then can there exist an exact covering of $G$ by more than one cosets of different sizes? (i.e. each element is contained in exactly one of the cosets)"
  },
  {
    "id": 275,
    "status": "solved",
    "prize": null,
    "text": "If a finite system of $r$ congruences $\\{ a_i\\pmod{n_i} : 1\\leq i\\leq r\\}$ (the $n_i$ are not necessarily distinct) covers $2^r$ consecutive integers then it covers all integers."
  },
  {
    "id": 276,
    "status": "open",
    "prize": null,
    "text": "Is there an infinite Lucas sequence $a_0,a_1,\\ldots$ where $a_{n+2}=a_{n+1}+a_n$ for $n\\geq 0$ such that all $a_k$ are composite, and yet no integer has a common factor with every term of the sequence?"
  },
  {
    "id": 277,
    "status": "solved",
    "prize": null,
    "text": "Is it true that, for every $c$, there exists an $n$ such that $\\sigma(n)>cn$ but there is no covering system whose moduli all distinct divisors of $n$ (which are $>1$)?"
  },
  {
    "id": 278,
    "status": "open",
    "prize": null,
    "text": "Let $A=\\{n_1<\\cdots<n_r\\}$ be a finite set of positive integers. What is the maximum density of integers covered by a suitable choice of congruences $a_i\\pmod{n_i}$? Is the minimum density achieved when all the $a_i$ are equal?"
  },
  {
    "id": 279,
    "status": "open",
    "prize": null,
    "text": "Let $k\\geq 3$. Is there a choice of congruence classes $a_p\\pmod{p}$ for every prime $p$ such that all sufficiently large integers can be written as $a_p+tp$ for some prime $p$ and integer $t\\geq k$?"
  },
  {
    "id": 280,
    "status": "solved",
    "prize": null,
    "text": "Let $n_1<n_2<\\cdots $ be an infinite sequence of integers with associated $a_k\\pmod{n_k}$, such that for some $\\epsilon>0$ we have $n_k>(1+\\epsilon)k\\log k$ for all $k$. Then\\[\\#\\{ m<n_k : m\\not\\equiv a_i\\pmod{n_i} \\textrm{ for }1\\leq i\\leq k\\}\\neq o(k).\\]"
  },
  {
    "id": 281,
    "status": "solved",
    "prize": null,
    "text": "Let $n_1<n_2<\\cdots$ be an infinite sequence such that, for any choice of congruence classes $a_i\\pmod{n_i}$, the set of integers not satisfying any of the congruences $a_i\\pmod{n_i}$ has density $0$. Is it true that for every $\\epsilon>0$ there exists some $k$ such that, for every choice of congruence classes $a_i$, the density of integers not satisfying any of the congruences $a_i\\pmod{n_i}$ for $1\\leq i\\leq k$ is less than $\\epsilon$?"
  },
  {
    "id": 282,
    "status": "open",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{N}$ be an infinite set and consider the following greedy algorithm for a rational $x\\in (0,1)$: choose the minimal $n\\in A$ such that $n\\geq 1/x$ and repeat with $x$ replaced by $x-\\frac{1}{n}$. If this terminates after finitely many steps then this produces a representation of $x$ as the sum of distinct unit fractions with denominators from $A$. Does this process always terminate if $x$ has odd denominator and $A$ is the set of odd numbers? More generally, for which pairs $x$ and $A$ does this process terminate?"
  },
  {
    "id": 283,
    "status": "solved",
    "prize": null,
    "text": "Let $p:\\mathbb{Z}\\to \\mathbb{Z}$ be a polynomial whose leading coefficient is positive and such that there exists no $d\\geq 2$ with $d\\mid p(n)$ for all $n\\geq 1$. Is it true that, for all sufficiently large $m$, there exist integers $1\\leq n_1<\\cdots <n_k$ such that\\[1=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}\\] and\\[m=p(n_1)+\\cdots+p(n_k)?\\]"
  },
  {
    "id": 284,
    "status": "solved",
    "prize": null,
    "text": "Let $f(k)$ be the maximal value of $n_1$ such that there exist $n_1<n_2<\\cdots <n_k$ with\\[1=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}.\\] Is it true that\\[f(k)=(1+o(1))\\frac{k}{e-1}?\\]"
  },
  {
    "id": 285,
    "status": "solved",
    "prize": null,
    "text": "Let $f(k)$ be the minimal value of $n_k$ such that there exist $n_1<n_2<\\cdots <n_k$ with\\[1=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}.\\] Is it true that\\[f(k)=(1+o(1))\\frac{e}{e-1}k?\\]"
  },
  {
    "id": 286,
    "status": "solved",
    "prize": null,
    "text": "Let $k\\geq 2$. Is it true that there exists an interval $I$ of width $(e-1+o(1))k$ and integers $n_1<\\cdots<n_k\\in I$ such that\\[1=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}?\\]"
  },
  {
    "id": 287,
    "status": "open",
    "prize": null,
    "text": "Let $k\\geq 2$. Is it true that, for any distinct integers $1<n_1<\\cdots <n_k$ such that\\[1=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}\\] we must have $\\max(n_{i+1}-n_i)\\geq 3$?"
  },
  {
    "id": 288,
    "status": "open",
    "prize": null,
    "text": "Is it true that there are only finitely many pairs of intervals $I_1,I_2$ such that\\[\\sum_{n_1\\in I_1}\\frac{1}{n_1}+\\sum_{n_2\\in I_2}\\frac{1}{n_2}\\in \\mathbb{N}?\\]"
  },
  {
    "id": 289,
    "status": "open",
    "prize": null,
    "text": "Is it true that, for all sufficiently large $k$, there exist finite intervals $I_1,\\ldots,I_k\\subset \\mathbb{N}$, distinct, not overlapping or adjacent, with $\\lvert I_i\\rvert \\geq 2$ for $1\\leq i\\leq k$ such that\\[1=\\sum_{i=1}^k \\sum_{n\\in I_i}\\frac{1}{n}?\\]"
  },
  {
    "id": 290,
    "status": "solved",
    "prize": null,
    "text": "Let $a\\geq 1$. Must there exist some $b>a$ such that\\[\\sum_{a\\leq n\\leq b}\\frac{1}{n}=\\frac{r_1}{s_1}\\textrm{ and }\\sum_{a\\leq n\\leq b+1}\\frac{1}{n}=\\frac{r_2}{s_2},\\] with $(r_i,s_i)=1$ and $s_2<s_1$? If so, how does this $b(a)$ grow with $a$?"
  },
  {
    "id": 291,
    "status": "open",
    "prize": null,
    "text": "Let $n\\geq 1$ and define $L_n$ to be the least common multiple of $\\{1,\\ldots,n\\}$ and $a_n$ by\\[\\sum_{1\\leq k\\leq n}\\frac{1}{k}=\\frac{a_n}{L_n}.\\] Is it true that $(a_n,L_n)=1$ and $(a_n,L_n)>1$ both occur for infinitely many $n$?"
  },
  {
    "id": 292,
    "status": "solved",
    "prize": null,
    "text": "Let $A$ be the set of $n\\in \\mathbb{N}$ such that there exist $1\\leq m_1<\\cdots <m_k=n$ with $\\sum\\tfrac{1}{m_i}=1$. Explore $A$. In particular, does $A$ have density $1$?"
  },
  {
    "id": 293,
    "status": "open",
    "prize": null,
    "text": "Let $k\\geq 1$ and let $v(k)$ be the minimal integer which does not appear as some $n_i$ in a solution to\\[1=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}\\] with $1\\leq n_1<\\cdots <n_k$. Estimate the growth of $v(k)$."
  },
  {
    "id": 294,
    "status": "solved",
    "prize": null,
    "text": "Let $N\\geq 1$ and let $t(N)$ be the least integer $t$ such that there is no solution to\\[1=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}\\] with $t=n_1<\\cdots <n_k\\leq N$. Estimate $t(N)$."
  },
  {
    "id": 295,
    "status": "open",
    "prize": null,
    "text": "Let $N\\geq 1$ and let $k(N)$ denote the smallest $k$ such that there exist $N\\leq n_1<\\cdots <n_k$ with\\[1=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}.\\] Is it true that\\[\\lim_{N\\to \\infty} k(N)-(e-1)N=\\infty?\\]"
  },
  {
    "id": 296,
    "status": "solved",
    "prize": null,
    "text": "Let $N\\geq 1$ and let $k(N)$ be maximal such that there are $k$ disjoint $A_1,\\ldots,A_k\\subseteq \\{1,\\ldots,N\\}$ with $\\sum_{n\\in A_i}\\frac{1}{n}=1$ for all $i$. Estimate $k(N)$. Is it true that $k(N)=o(\\log N)$?"
  },
  {
    "id": 297,
    "status": "solved",
    "prize": null,
    "text": "Let $N\\geq 1$. How many $A\\subseteq \\{1,\\ldots,N\\}$ are there such that $\\sum_{n\\in A}\\frac{1}{n}=1$?"
  },
  {
    "id": 298,
    "status": "solved",
    "prize": null,
    "text": "Does every set $A\\subseteq \\mathbb{N}$ of positive density contain some finite $S\\subset A$ such that $\\sum_{n\\in S}\\frac{1}{n}=1$?"
  },
  {
    "id": 299,
    "status": "solved",
    "prize": null,
    "text": "Is there an infinite sequence $a_1<a_2<\\cdots $ such that $a_{i+1}-a_i=O(1)$ and no finite sum of $\\frac{1}{a_i}$ is equal to $1$?"
  },
  {
    "id": 300,
    "status": "solved",
    "prize": null,
    "text": "Let $A(N)$ denote the maximal cardinality of $A\\subseteq \\{1,\\ldots,N\\}$ such that $\\sum_{n\\in S}\\frac{1}{n}\\neq 1$ for all $S\\subseteq A$. Estimate $A(N)$."
  },
  {
    "id": 301,
    "status": "open",
    "prize": null,
    "text": "Let $f(N)$ be the size of the largest $A\\subseteq \\{1,\\ldots,N\\}$ such that there are no solutions to\\[\\frac{1}{a}= \\frac{1}{b_1}+\\cdots+\\frac{1}{b_k}\\] with distinct $a,b_1,\\ldots,b_k\\in A$? Estimate $f(N)$. In particular, is it true that $f(N)=(\\tfrac{1}{2}+o(1))N$?"
  },
  {
    "id": 302,
    "status": "open",
    "prize": null,
    "text": "Let $f(N)$ be the size of the largest $A\\subseteq \\{1,\\ldots,N\\}$ such that there are no solutions to\\[\\frac{1}{a}= \\frac{1}{b}+\\frac{1}{c}\\] with distinct $a,b,c\\in A$? Estimate $f(N)$. In particular, is $f(N)=(\\tfrac{1}{2}+o(1))N$?"
  },
  {
    "id": 303,
    "status": "solved",
    "prize": null,
    "text": "Is it true that in any finite colouring of the integers there exists a monochromatic solution to\\[\\frac{1}{a}=\\frac{1}{b}+\\frac{1}{c}\\] with distinct $a,b,c$?"
  },
  {
    "id": 304,
    "status": "open",
    "prize": null,
    "text": "For integers $1\\leq a<b$ let $N(a,b)$ denote the minimal $k$ such that there exist integers $1<n_1<\\cdots<n_k$ with\\[\\frac{a}{b}=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}.\\] Estimate $N(b)=\\max_{1\\leq a<b}N(a,b)$. Is it true that $N(b) \\ll \\log\\log b$?"
  },
  {
    "id": 305,
    "status": "solved",
    "prize": null,
    "text": "For integers $1\\leq a<b$ let $D(a,b)$ be the minimal value of $n_k$ such that there exist integers $1\\leq n_1<\\cdots <n_k$ with\\[\\frac{a}{b}=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}.\\] Estimate $D(b)=\\max_{1\\leq a<b}D(a,b)$. Is it true that\\[D(b) \\ll b(\\log b)^{1+o(1)}?\\]"
  },
  {
    "id": 306,
    "status": "open",
    "prize": null,
    "text": "Let $a/b\\in \\mathbb{Q}_{>0}$ with $b$ squarefree. Are there integers $1<n_1<\\cdots<n_k$, each the product of two distinct primes, such that\\[\\frac{a}{b}=\\frac{1}{n_1}+\\cdots+\\frac{1}{n_k}?\\]"
  },
  {
    "id": 307,
    "status": "open",
    "prize": null,
    "text": "Are there two finite sets of primes $P,Q$ such that\\[1=\\left(\\sum_{p\\in P}\\frac{1}{p}\\right)\\left(\\sum_{q\\in Q}\\frac{1}{q}\\right)?\\]"
  },
  {
    "id": 308,
    "status": "solved",
    "prize": null,
    "text": "Let $N\\geq 1$. What is the smallest integer not representable as the sum of distinct unit fractions with denominators from $\\{1,\\ldots,N\\}$? Is it true that the set of integers representable as such has the shape $\\{1,\\ldots,m\\}$ for some $m$?"
  },
  {
    "id": 309,
    "status": "solved",
    "prize": null,
    "text": "Let $N\\geq 1$. How many integers can be written as the sum of distinct unit fractions with denominators from $\\{1,\\ldots,N\\}$? Are there $o(\\log N)$ such integers?"
  },
  {
    "id": 310,
    "status": "solved",
    "prize": null,
    "text": "Let $\\alpha >0$ and $N\\geq 1$. Is it true that for any $A\\subseteq \\{1,\\ldots,N\\}$ with $\\lvert A\\rvert \\geq \\alpha N$ there exists some $S\\subseteq A$ such that\\[\\frac{a}{b}=\\sum_{n\\in S}\\frac{1}{n}\\] with $a\\leq b =O_\\alpha(1)$?"
  },
  {
    "id": 311,
    "status": "open",
    "prize": null,
    "text": "Let $\\delta(N)$ be the minimal non-zero value of $\\lvert 1-\\sum_{n\\in A}\\frac{1}{n}\\rvert$ as $A$ ranges over all subsets of $\\{1,\\ldots,N\\}$. Is it true that\\[\\delta(N)=e^{-(c+o(1))N}\\] for some constant $c\\in (0,1)$?"
  },
  {
    "id": 312,
    "status": "open",
    "prize": null,
    "text": "Does there exist some $c>0$ such that, for any $K>1$, whenever $A$ is a sufficiently large finite multiset of positive integers with $\\sum_{n\\in A}\\frac{1}{n}>K$ there exists some $S\\subseteq A$ such that\\[1-e^{-cK} < \\sum_{n\\in S}\\frac{1}{n}\\leq 1?\\]"
  },
  {
    "id": 313,
    "status": "open",
    "prize": null,
    "text": "Are there infinitely many solutions to\\[\\frac{1}{p_1}+\\cdots+\\frac{1}{p_k}=1-\\frac{1}{m},\\] where $m\\geq 2$ is an integer and $p_1<\\cdots<p_k$ are distinct primes?"
  },
  {
    "id": 314,
    "status": "solved",
    "prize": null,
    "text": "Let $n\\geq 1$ and let $m$ be minimal such that $\\sum_{n\\leq k\\leq m}\\frac{1}{k}\\geq 1$. We define\\[\\epsilon(n) = \\sum_{n\\leq k\\leq m}\\frac{1}{k}-1.\\] How small can $\\epsilon(n)$ be? Is it true that\\[\\liminf n^2\\epsilon(n)=0?\\]"
  },
  {
    "id": 315,
    "status": "solved",
    "prize": null,
    "text": "Let $u_1=1$ and $u_{n+1}=u_n(u_n+1)$, so that $\\sum_{k\\geq 1}\\frac{1}{u_k+1}$ and $u_k=\\lfloor c_0^{2^k}+1\\rfloor$ for $k\\geq 1$, where\\[c_0=\\lim u_n^{1/2^n}=1.264085\\cdots.\\] Let $a_1<a_2<\\cdots $ be any other sequence with $\\sum \\frac{1}{a_k}=1$. Is it true that\\[\\liminf a_n^{1/2^n}<c_0=1.264085\\cdots?\\]"
  },
  {
    "id": 316,
    "status": "solved",
    "prize": null,
    "text": "Is it true that if $A\\subset \\mathbb{N}\\backslash\\{1\\}$ is a finite set with $\\sum_{n\\in A}\\frac{1}{n}<2$ then there is a partition $A=A_1\\sqcup A_2$ such that\\[\\sum_{n\\in A_i}\\frac{1}{n}<1\\] for $i=1,2$?"
  },
  {
    "id": 317,
    "status": "open",
    "prize": null,
    "text": "Is there some constant $c>0$ such that for every $n\\geq 1$ there exists some $\\delta_k\\in \\{-1,0,1\\}$ for $1\\leq k\\leq n$ with\\[0< \\left\\lvert \\sum_{1\\leq k\\leq n}\\frac{\\delta_k}{k}\\right\\rvert < \\frac{c}{2^n}?\\] Is it true that for sufficiently large $n$, for any $\\delta_k\\in \\{-1,0,1\\}$,\\[\\left\\lvert \\sum_{1\\leq k\\leq n}\\frac{\\delta_k}{k}\\right\\rvert > \\frac{1}{[1,\\ldots,n]}\\] whenever the left-hand side is not zero?"
  },
  {
    "id": 318,
    "status": "solved",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{N}$ be an infinite arithmetic progression and $f:A\\to \\{-1,1\\}$ be a non-constant function. Must there exist a finite non-empty $S\\subset A$ such that\\[\\sum_{n\\in S}\\frac{f(n)}{n}=0?\\] What about if $A$ is an arbitrary set of positive density? What if $A$ is the set of squares excluding $1$?"
  },
  {
    "id": 319,
    "status": "open",
    "prize": null,
    "text": "What is the size of the largest $A\\subseteq \\{1,\\ldots,N\\}$ such that there is a function $\\delta:A\\to \\{-1,1\\}$ such that\\[\\sum_{n\\in A}\\frac{\\delta_n}{n}=0\\] and\\[\\sum_{n\\in A'}\\frac{\\delta_n}{n}\\neq 0\\] for all non-empty $A'\\subsetneq A$?"
  },
  {
    "id": 320,
    "status": "open",
    "prize": null,
    "text": "Let $S(N)$ count the number of distinct sums of the form $\\sum_{n\\in A}\\frac{1}{n}$ for $A\\subseteq \\{1,\\ldots,N\\}$. Estimate $S(N)$."
  },
  {
    "id": 321,
    "status": "open",
    "prize": null,
    "text": "What is the size of the largest $A\\subseteq \\{1,\\ldots,N\\}$ such that all sums $\\sum_{n\\in S}\\frac{1}{n}$ are distinct for $S\\subseteq A$?"
  },
  {
    "id": 322,
    "status": "open",
    "prize": null,
    "text": "Let $k\\geq 3$ and $A\\subset \\mathbb{N}$ be the set of $k$th powers. What is the order of growth of $1_A^{(k)}(n)$, i.e. the number of representations of $n$ as the sum of $k$ many $k$th powers? Does there exist some $c>0$ and infinitely many $n$ such that\\[1_A^{(k)}(n) >n^c?\\]"
  },
  {
    "id": 323,
    "status": "open",
    "prize": null,
    "text": "Let $1\\leq m\\leq k$ and $f_{k,m}(x)$ denote the number of integers $\\leq x$ which are the sum of $m$ many nonnegative $k$th powers. Is it true that\\[f_{k,k}(x) \\gg_\\epsilon x^{1-\\epsilon}\\] for all $\\epsilon>0$? Is it true that if $m<k$ then\\[f_{k,m}(x) \\gg x^{m/k}\\] for sufficiently large $x$?"
  },
  {
    "id": 324,
    "status": "open",
    "prize": null,
    "text": "Does there exist a polynomial $f(x)\\in\\mathbb{Z}[x]$ such that all the sums $f(a)+f(b)$ with $a<b$ nonnegative integers are distinct?"
  },
  {
    "id": 325,
    "status": "open",
    "prize": null,
    "text": "Let $k\\geq 3$ and $f_{k,3}(x)$ denote the number of integers $\\leq x$ which are the sum of three nonnegative $k$th powers. Is it true that\\[f_{k,3}(x) \\gg x^{3/k}\\] or even $\\gg_\\epsilon x^{3/k-\\epsilon}$?"
  },
  {
    "id": 326,
    "status": "open",
    "prize": null,
    "text": "Does there exist $A=\\{a_1<a_2<\\cdots\\}\\subset \\mathbb{N}$ which is a minimal basis of order $2$ (i.e. every large integer is the sum of $2$ elements from $A$, and no proper subset of $A$ has this property), such that\\[\\lim_{k\\to \\infty}\\frac{a_k}{k^2}=c\\] for some $c\\neq 0$?"
  },
  {
    "id": 327,
    "status": "open",
    "prize": null,
    "text": "Suppose $A\\subseteq \\{1,\\ldots,N\\}$ is such that if $a,b\\in A$ and $a\\neq b$ then $a+b\\nmid ab$. Can $A$ be 'substantially more' than the odd numbers? What if $a,b\\in A$ with $a\\neq b$ implies $a+b\\nmid 2ab$? Must $\\lvert A\\rvert=o(N)$?"
  },
  {
    "id": 328,
    "status": "solved",
    "prize": null,
    "text": "Suppose $A\\subseteq\\mathbb{N}$ and $C>0$ is such that $1_A\\ast 1_A(n)\\leq C$ for all $n\\in\\mathbb{N}$. Can $A$ be partitioned into $t$ many subsets $A_1,\\ldots,A_t$ (where $t=t(C)$ depends only on $C$) such that $1_{A_i}\\ast 1_{A_i}(n)<C$ for all $1\\leq i\\leq t$ and $n\\in \\mathbb{N}$?"
  },
  {
    "id": 329,
    "status": "open",
    "prize": null,
    "text": "Suppose $A\\subseteq \\mathbb{N}$ is a Sidon set. How large can\\[\\limsup_{N\\to \\infty}\\frac{\\lvert A\\cap \\{1,\\ldots,N\\}\\rvert}{N^{1/2}}\\] be?"
  },
  {
    "id": 330,
    "status": "solved",
    "prize": null,
    "text": "Does there exist a minimal basis with positive density, say $A\\subset\\mathbb{N}$, such that for any $n\\in A$ the (upper) density of integers which cannot be represented without using $n$ is positive?"
  },
  {
    "id": 331,
    "status": "solved",
    "prize": null,
    "text": "Let $A,B\\subseteq \\mathbb{N}$ such that for all large $N$\\[\\lvert A\\cap \\{1,\\ldots,N\\}\\rvert \\gg N^{1/2}\\] and\\[\\lvert B\\cap \\{1,\\ldots,N\\}\\rvert \\gg N^{1/2}.\\] Is it true that there are infinitely many solutions to $a_1-a_2=b_1-b_2\\neq 0$ with $a_1,a_2\\in A$ and $b_1,b_2\\in B$?"
  },
  {
    "id": 332,
    "status": "open",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{N}$ and $D(A)$ be the set of those numbers which occur infinitely often as $a_1-a_2$ with $a_1,a_2\\in A$. What conditions on $A$ are sufficient to ensure $D(A)$ has bounded gaps?"
  },
  {
    "id": 333,
    "status": "solved",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{N}$ be a set of density zero. Does there exist a $B$ such that $A\\subseteq B+B$ and\\[\\lvert B\\cap \\{1,\\ldots,N\\}\\rvert =o(N^{1/2})\\] for all large $N$?"
  },
  {
    "id": 334,
    "status": "open",
    "prize": null,
    "text": "Find the best function $f(n)$ such that every $n$ can be written as $n=a+b$ where both $a,b$ are $f(n)$-smooth (that is, are not divisible by any prime $p>f(n)$.)"
  },
  {
    "id": 335,
    "status": "open",
    "prize": null,
    "text": "Let $d(A)$ denote the density of $A\\subseteq \\mathbb{N}$. Characterise those $A,B\\subseteq \\mathbb{N}$ with positive density such that\\[d(A+B)=d(A)+d(B).\\]"
  },
  {
    "id": 336,
    "status": "open",
    "prize": null,
    "text": "For $r\\geq 2$ let $h(r)$ be the maximal finite $k$ such that there exists a basis $A\\subseteq \\mathbb{N}$ of order $r$ (so every large integer is the sum of at most $r$ integers from $A$) and exact order $k$ (so every large integer is the sum of exactly $k$ integers from $A$). Find the value of\\[\\lim_r \\frac{h(r)}{r^2}.\\]"
  },
  {
    "id": 337,
    "status": "solved",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{N}$ be an additive basis (of any finite order) such that $\\lvert A\\cap \\{1,\\ldots,N\\}\\rvert=o(N)$. Is it true that\\[\\lim_{N\\to \\infty}\\frac{\\lvert (A+A)\\cap \\{1,\\ldots,N\\}\\rvert}{\\lvert A\\cap \\{1,\\ldots,N\\}\\rvert}=\\infty?\\]"
  },
  {
    "id": 338,
    "status": "open",
    "prize": null,
    "text": "The restricted order of a basis is the least integer $t$ (if it exists) such that every large integer is the sum of at most $t$ distinct summands from $A$. What are necessary and sufficient conditions that this exists? Can it be bounded (when it exists) in terms of the order of the basis? What are necessary and sufficient conditions that this is equal to the order of the basis?"
  },
  {
    "id": 339,
    "status": "solved",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{N}$ be a basis of order $r$. Must the set of integers representable as the sum of exactly $r$ distinct elements from $A$ have positive lower density?"
  },
  {
    "id": 340,
    "status": "open",
    "prize": null,
    "text": "Let $A=\\{1,2,4,8,13,21,31,45,66,81,97,\\ldots\\}$ be the greedy Sidon sequence: we begin with $1$ and iteratively include the next smallest integer that preserves the Sidon property (i.e. there are no non-trivial solutions to $a+b=c+d$). What is the order of growth of $A$? Is it true that\\[\\lvert A\\cap \\{1,\\ldots,N\\}\\rvert \\gg N^{1/2-\\epsilon}\\] for all $\\epsilon>0$ and large $N$?"
  },
  {
    "id": 341,
    "status": "open",
    "prize": null,
    "text": "Let $A=\\{a_1<\\cdots<a_k\\}$ be a finite set of positive integers and extend it to an infinite sequence $\\overline{A}=\\{a_1<a_2<\\cdots \\}$ by defining $a_{n+1}$ for $n\\geq k$ to be the least integer exceeding $a_n$ which is not of the form $a_i+a_j$ with $i,j\\leq n$. Is it true that the sequence of differences $a_{m+1}-a_m$ is eventually periodic?"
  },
  {
    "id": 342,
    "status": "open",
    "prize": null,
    "text": "With $a_1=1$ and $a_2=2$ let $a_{n+1}$ for $n\\geq 2$ be the least integer $>a_n$ which can be expressed uniquely as $a_i+a_j$ for $i<j\\leq n$. What can be said about this sequence? Do infinitely many pairs $a,a+2$ occur? Does this sequence eventually have periodic differences? Is the density $0$?"
  },
  {
    "id": 343,
    "status": "solved",
    "prize": null,
    "text": "If $A\\subseteq \\mathbb{N}$ is a multiset of integers such that\\[\\lvert A\\cap \\{1,\\ldots,N\\}\\rvert\\gg N\\] for all $N$ then must $A$ be subcomplete? That is, must\\[P(A) = \\left\\{\\sum_{n\\in B}n : B\\subseteq A\\textrm{ finite }\\right\\}\\] contain an infinite arithmetic progression?"
  },
  {
    "id": 344,
    "status": "solved",
    "prize": null,
    "text": "If $A\\subseteq \\mathbb{N}$ is a set of integers such that\\[\\lvert A\\cap \\{1,\\ldots,N\\}\\rvert\\gg N^{1/2}\\] for all $N$ then must $A$ be subcomplete? That is, must\\[P(A) = \\left\\{\\sum_{n\\in B}n : B\\subseteq A\\textrm{ finite }\\right\\}\\] contain an infinite arithmetic progression?"
  },
  {
    "id": 345,
    "status": "open",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{N}$ be a complete sequence, and define the threshold of completeness $T(A)$ to be the least integer $m$ such that all $n\\geq m$ are in\\[P(A) = \\left\\{\\sum_{n\\in B}n : B\\subseteq A\\textrm{ finite }\\right\\}\\](the existence of $T(A)$ is guaranteed by completeness). Is it true that there are infinitely many $k$ such that $T(n^k)>T(n^{k+1})$?"
  },
  {
    "id": 346,
    "status": "open",
    "prize": null,
    "text": "Let $A=\\{1\\leq a_1< a_2<\\cdots\\}$ be a set of integers such that $A\\backslash B$ is complete for any finite subset $B$ and $A\\backslash B$ is not complete for any infinite subset $B$. (Here 'complete' means all sufficiently large integers can be written as a sum of distinct members of the sequence.)Is it true that if $a_{n+1}/a_n \\geq 1+\\epsilon$ for some $\\epsilon>0$ and all $n$ then\\[\\lim_n \\frac{a_{n+1}}{a_n}=\\frac{1+\\sqrt{5}}{2}?\\]"
  },
  {
    "id": 347,
    "status": "solved",
    "prize": null,
    "text": "Is there a sequence $A=\\{a_1\\leq a_2\\leq \\cdots\\}$ of integers with\\[\\lim \\frac{a_{n+1}}{a_n}=2\\] such that\\[P(A')= \\left\\{\\sum_{n\\in B}n : B\\subseteq A'\\textrm{ finite }\\right\\}\\] has density $1$ for every cofinite subsequence $A'$ of $A$?"
  },
  {
    "id": 348,
    "status": "open",
    "prize": null,
    "text": "For what values of $0\\leq m<n$ is there a complete sequence $A=\\{a_1\\leq a_2\\leq \\cdots\\}$ of integers such that $A$ remains complete after removing any $m$ elements, but $A$ is not complete after removing any $n$ elements?"
  },
  {
    "id": 349,
    "status": "open",
    "prize": null,
    "text": "For what values of $t,\\alpha \\in (0,\\infty)$ is the sequence $\\lfloor t\\alpha^n\\rfloor$ complete (that is, all sufficiently large integers are the sum of distinct integers of the form $\\lfloor t\\alpha^n\\rfloor$)?"
  },
  {
    "id": 350,
    "status": "solved",
    "prize": null,
    "text": "If $A\\subset\\mathbb{N}$ is a finite set of integers which is dissociated (that is, all of the subset sums are distinct) then\\[\\sum_{n\\in A}\\frac{1}{n}<2.\\]"
  },
  {
    "id": 351,
    "status": "solved",
    "prize": null,
    "text": "Let $p(x)\\in \\mathbb{Q}[x]$ with positive leading coefficient. Is it true that\\[A=\\{ p(n)+1/n : n\\in \\mathbb{N}\\}\\] is strongly complete, in the sense that, for any finite set $B$,\\[\\left\\{\\sum_{n\\in X}n : X\\subseteq A\\backslash B\\textrm{ finite }\\right\\}\\] contains all sufficiently large integers?"
  },
  {
    "id": 354,
    "status": "open",
    "prize": null,
    "text": "Let $\\alpha,\\beta\\in \\mathbb{R}_{>0}$ such that $\\alpha/\\beta$ is irrational. Is the multiset\\[\\{ \\lfloor \\alpha\\rfloor,\\lfloor 2\\alpha\\rfloor,\\lfloor 4\\alpha\\rfloor,\\ldots\\}\\cup \\{ \\lfloor \\beta\\rfloor,\\lfloor 2\\beta\\rfloor,\\lfloor 4\\beta\\rfloor,\\ldots\\}\\] complete? That is, can all sufficiently large natural numbers $n$ be written as\\[n=\\sum_{s\\in S}\\lfloor 2^s\\alpha\\rfloor+\\sum_{t\\in T}\\lfloor 2^t\\beta\\rfloor\\] for some finite $S,T\\subset \\mathbb{N}$? What if $2$ is replaced by some $\\gamma\\in(1,2)$?"
  },
  {
    "id": 355,
    "status": "solved",
    "prize": null,
    "text": "Is there a lacunary sequence $A\\subseteq \\mathbb{N}$ (so that $A=\\{a_1<a_2<\\cdots\\}$ and there exists some $\\lambda>1$ such that $a_{n+1}/a_n\\geq \\lambda$ for all $n\\geq 1$) such that\\[\\left\\{ \\sum_{a\\in A'}\\frac{1}{a} : A'\\subseteq A\\textrm{ finite}\\right\\}\\] contains all rationals in some open interval?"
  },
  {
    "id": 356,
    "status": "solved",
    "prize": null,
    "text": "Is there some $c>0$ such that, for all sufficiently large $n$, there exist integers $a_1<\\cdots<a_k\\leq n$ such that there are at least $cn^2$ distinct integers of the form $\\sum_{u\\leq i\\leq v}a_i$?"
  },
  {
    "id": 357,
    "status": "open",
    "prize": null,
    "text": "Let $1\\leq a_1<\\cdots <a_k\\leq n$ be integers such that all sums of the shape $\\sum_{u\\leq i\\leq v}a_i$ are distinct. Let $f(n)$ be the maximal such $k$. How does $f(n)$ grow? Is $f(n)=o(n)$?"
  },
  {
    "id": 358,
    "status": "solved",
    "prize": null,
    "text": "Let $A=\\{a_1<\\cdots\\}$ be an infinite sequence of integers. Let $f(n)$ count the number of solutions to\\[n=\\sum_{u\\leq i\\leq v}a_i.\\] Is there such an $A$ for which $f(n)\\to \\infty$ as $n\\to \\infty$? Or even where $f(n)\\geq 2$ for all large $n$?"
  },
  {
    "id": 359,
    "status": "open",
    "prize": null,
    "text": "Let $a_1<a_2<\\cdots$ be an infinite sequence of integers such that $a_1=n$ and $a_{i+1}$ is the least integer which is not a sum of consecutive earlier $a_j$s. What can be said about the density of this sequence? In particular, in the case $n=1$, can one prove that $a_k/k\\to \\infty$ and $a_k/k^{1+c}\\to 0$ for any $c>0$?"
  },
  {
    "id": 360,
    "status": "solved",
    "prize": null,
    "text": "Let $f(n)$ be minimal such that $\\{1,\\ldots,n-1\\}$ can be partitioned into $f(n)$ classes so that $n$ cannot be expressed as a sum of distinct elements from the same class. How fast does $f(n)$ grow?"
  },
  {
    "id": 361,
    "status": "open",
    "prize": null,
    "text": "Let $c>0$ and $n$ be some large integer. What is the size of the largest $A\\subseteq \\{1,\\ldots,\\lfloor cn\\rfloor\\}$ such that $n$ is not a sum of a subset of $A$? Does this depend on $n$ in an irregular way?"
  },
  {
    "id": 362,
    "status": "solved",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{N}$ be a finite set of size $N$. Is it true that, for any fixed $t$, there are\\[\\ll \\frac{2^N}{N^{3/2}}\\] many $S\\subseteq A$ such that $\\sum_{n\\in S}n=t$? If we further ask that $\\lvert S\\rvert=l$ (for any fixed $l$) then is the number of solutions\\[\\ll \\frac{2^N}{N^2},\\] with the implied constant independent of $l$ and $t$?"
  },
  {
    "id": 363,
    "status": "solved",
    "prize": null,
    "text": "Is it true that there are only finitely many collections of disjoint intervals $I_1,\\ldots,I_n$ of size $\\lvert I_i\\rvert \\geq 4$ for $1\\leq i\\leq n$ such that\\[\\prod_{1\\leq i\\leq n}\\prod_{m\\in I_i}m\\] is a square?"
  },
  {
    "id": 364,
    "status": "open",
    "prize": null,
    "text": "Are there any triples of consecutive positive integers all of which are powerful (i.e. if $p\\mid n$ then $p^2\\mid n$)?"
  },
  {
    "id": 365,
    "status": "open",
    "prize": null,
    "text": "Do all pairs of consecutive powerful numbers $n$ and $n+1$ come from solutions to Pell equations? In other words, must either $n$ or $n+1$ be a square? Is the number of such $n\\leq x$ bounded by $(\\log x)^{O(1)}$?"
  },
  {
    "id": 366,
    "status": "open",
    "prize": null,
    "text": "Are there any $2$-full $n$ such that $n+1$ is $3$-full? That is, if $p\\mid n$ then $p^2\\mid n$ and if $p\\mid n+1$ then $p^3\\mid n+1$."
  },
  {
    "id": 367,
    "status": "open",
    "prize": null,
    "text": "Let $B_2(n)$ be the $2$-full part of $n$ (that is, $B_2(n)=n/n'$ where $n'$ is the product of all primes that divide $n$ exactly once). Is it true that, for every fixed $k\\geq 1$,\\[\\prod_{n\\leq m<n+k}B_2(m) \\ll n^{2+o(1)}?\\] Or perhaps even $\\ll_k n^2$?"
  },
  {
    "id": 368,
    "status": "open",
    "prize": null,
    "text": "How large is the largest prime factor of $n(n+1)$?"
  },
  {
    "id": 369,
    "status": "solved",
    "prize": null,
    "text": "Let $\\epsilon>0$ and $k\\geq 2$. Is it true that, for all sufficiently large $n$, there is a sequence of $k$ consecutive integers in $\\{1,\\ldots,n\\}$ all of which are $n^\\epsilon$-smooth?"
  },
  {
    "id": 370,
    "status": "solved",
    "prize": null,
    "text": "Are there infinitely many $n$ such that the largest prime factor of $n$ is $<n^{1/2}$ and the largest prime factor of $n+1$ is $<(n+1)^{1/2}$?"
  },
  {
    "id": 371,
    "status": "open",
    "prize": null,
    "text": "Let $P(n)$ denote the largest prime factor of $n$. Show that the set of $n$ with $P(n)<P(n+1)$ has density $1/2$."
  },
  {
    "id": 372,
    "status": "solved",
    "prize": null,
    "text": "Let $P(n)$ denote the largest prime factor of $n$. There are infinitely many $n$ such that $P(n)>P(n+1)>P(n+2)$."
  },
  {
    "id": 373,
    "status": "open",
    "prize": null,
    "text": "Show that the equation\\[n! = a_1!a_2!\\cdots a_k!,\\] with $n-1>a_1\\geq a_2\\geq \\cdots \\geq a_k\\geq 2$, has only finitely many solutions."
  },
  {
    "id": 374,
    "status": "open",
    "prize": null,
    "text": "For any $m\\in \\mathbb{N}$, let $F(m)$ be the minimal $k\\geq 2$ (if it exists) such that there are $a_1<\\cdots <a_k=m$ with $a_1!\\cdots a_k!$ a square. Let $D_k=\\{ m : F(m)=k\\}$. What is the order of growth of $\\lvert D_k\\cap\\{1,\\ldots,n\\}\\rvert$ for $3\\leq k\\leq 6$? For example, is it true that $\\lvert D_6\\cap \\{1,\\ldots,n\\}\\rvert \\gg n$?"
  },
  {
    "id": 375,
    "status": "open",
    "prize": null,
    "text": "Is it true that for any $n,k\\geq 1$, if $n+1,\\ldots,n+k$ are all composite then there are distinct primes $p_1,\\ldots,p_k$ such that $p_i\\mid n+i$ for $1\\leq i\\leq k$?"
  },
  {
    "id": 376,
    "status": "open",
    "prize": null,
    "text": "Are there infinitely many $n$ such that $\\binom{2n}{n}$ is coprime to $105$?"
  },
  {
    "id": 377,
    "status": "open",
    "prize": null,
    "text": "Is there some absolute constant $C>0$ such that\\[\\sum_{p\\leq n}1_{p\\nmid \\binom{2n}{n}}\\frac{1}{p}\\leq C\\] for all $n$ (where the summation is restricted to primes $p\\leq n$)?"
  },
  {
    "id": 378,
    "status": "solved",
    "prize": null,
    "text": "Let $r\\geq 0$. Does the density of integers $n$ for which $\\binom{n}{k}$ is squarefree for at least $r$ values of $1\\leq k<n$ exist? Is this density $>0$?"
  },
  {
    "id": 379,
    "status": "solved",
    "prize": null,
    "text": "Let $S(n)$ denote the largest integer such that, for all $1\\leq k<n$, the binomial coefficient $\\binom{n}{k}$ is divisible by $p^{S(n)}$ for some prime $p$ (depending on $k$). Is it true that\\[\\limsup S(n)=\\infty?\\]"
  },
  {
    "id": 380,
    "status": "solved",
    "prize": null,
    "text": "We call an interval $[u,v]$ 'bad' if the greatest prime factor of $\\prod_{u\\leq m\\leq v}m$ occurs with an exponent greater than $1$. Let $B(x)$ count the number of $n\\leq x$ which are contained in at least one bad interval. Is it true that\\[B(x)\\sim \\#\\{ n\\leq x: P(n)^2\\mid n\\},\\] where $P(n)$ is the largest prime factor of $n$?"
  },
  {
    "id": 382,
    "status": "open",
    "prize": null,
    "text": "Let $u\\leq v$ be such that the largest prime dividing $\\prod_{u\\leq m\\leq v}m$ appears with exponent at least $2$. Is it true that $v-u=v^{o(1)}$? Can $v-u$ be arbitrarily large?"
  },
  {
    "id": 383,
    "status": "open",
    "prize": null,
    "text": "Is it true that for every $k$ there are infinitely many primes $p$ such that the largest prime divisor of\\[\\prod_{0\\leq i\\leq k}(p^2+i)\\] is $p$?"
  },
  {
    "id": 384,
    "status": "solved",
    "prize": null,
    "text": "If $1<k<n-1$ then $\\binom{n}{k}$ is divisible by a prime $p<n/2$ (except $\\binom{7}{3}=5\\cdot 7$)."
  },
  {
    "id": 385,
    "status": "open",
    "prize": null,
    "text": "Let\\[F(n) = \\max_{\\substack{m<n\\\\ m\\textrm{ composite}}} m+p(m),\\] where $p(m)$ is the least prime divisor of $m$. Is it true that $F(n)>n$ for all sufficiently large $n$? Does $F(n)-n\\to \\infty$ as $n\\to\\infty$?"
  },
  {
    "id": 386,
    "status": "open",
    "prize": null,
    "text": "Let $2\\leq k\\leq n-2$. Can $\\binom{n}{k}$ be the product of consecutive primes infinitely often? For example\\[\\binom{21}{2}=2\\cdot 3\\cdot 5\\cdot 7.\\]"
  },
  {
    "id": 387,
    "status": "open",
    "prize": null,
    "text": "Is there an absolute constant $c>0$ such that, for all $1\\leq k< n$, the binomial coefficient $\\binom{n}{k}$ has a divisor in $(cn,n]$?"
  },
  {
    "id": 388,
    "status": "open",
    "prize": null,
    "text": "Can one classify all solutions of\\[\\prod_{1\\leq i\\leq k_1}(m_1+i)=\\prod_{1\\leq j\\leq k_2}(m_2+j)\\] where $k_1,k_2>3$ and $m_1+k_1\\leq m_2$? Are there only finitely many solutions?"
  },
  {
    "id": 389,
    "status": "open",
    "prize": null,
    "text": "Is it true that for every $n\\geq 1$ there is a $k$ such that\\[n(n+1)\\cdots(n+k-1)\\mid (n+k)\\cdots (n+2k-1)?\\]"
  },
  {
    "id": 390,
    "status": "open",
    "prize": null,
    "text": "Let $f(n)$ be the minimal $m$ such that\\[n! = a_1\\cdots a_k\\] with $n< a_1<\\cdots <a_k=m$. Is there (and what is it) a constant $c$ such that\\[f(n)-2n \\sim c\\frac{n}{\\log n}?\\]"
  },
  {
    "id": 391,
    "status": "solved",
    "prize": null,
    "text": "Let $t(n)$ be maximal such that there is a representation\\[n!=a_1\\cdots a_n\\] with $t(n)=a_1\\leq \\cdots \\leq a_n$. Obtain good bounds for $t(n)/n$. In particular, is it true that\\[\\lim \\frac{t(n)}{n}=\\frac{1}{e}?\\] Furthermore, does there exist some constant $c>0$ such that\\[\\frac{t(n)}{n} \\leq \\frac{1}{e}-\\frac{c}{\\log n}\\] for infinitely many $n$?"
  },
  {
    "id": 392,
    "status": "solved",
    "prize": null,
    "text": "Let $A(n)$ denote the least value of $t$ such that\\[n!=a_1\\cdots a_t\\] with $a_1\\leq \\cdots \\leq a_t\\leq n^2$. Is it true that\\[A(n)=\\frac{n}{2}-\\frac{n}{2\\log n}+o\\left(\\frac{n}{\\log n}\\right)?\\]"
  },
  {
    "id": 393,
    "status": "open",
    "prize": null,
    "text": "Let $f(n)$ denote the minimal $m\\geq 1$ such that\\[n! = a_1\\cdots a_t\\] with $a_1<\\cdots <a_t=a_1+m$. What is the behaviour of $f(n)$?"
  },
  {
    "id": 394,
    "status": "open",
    "prize": null,
    "text": "Let $t_k(n)$ denote the least $m$ such that\\[n\\mid m(m+1)(m+2)\\cdots (m+k-1).\\] Is it true that\\[\\sum_{n\\leq x}t_2(n)\\ll \\frac{x^2}{(\\log x)^c}\\] for some $c>0$? Is it true that, for $k\\geq 2$,\\[\\sum_{n\\leq x}t_{k+1}(n) =o\\left(\\sum_{n\\leq x}t_k(n)\\right)?\\]"
  },
  {
    "id": 396,
    "status": "open",
    "prize": null,
    "text": "Is it true that for every $k$ there exists $n$ such that\\[\\prod_{0\\leq i\\leq k}(n-i) \\mid \\binom{2n}{n}?\\]"
  },
  {
    "id": 397,
    "status": "solved",
    "prize": null,
    "text": "Are there only finitely many solutions to\\[\\prod_i \\binom{2m_i}{m_i}=\\prod_j \\binom{2n_j}{n_j}\\] with the $m_i,n_j$ distinct?"
  },
  {
    "id": 398,
    "status": "open",
    "prize": null,
    "text": "Are the only solutions to\\[n!=x^2-1\\] when $n=4,5,7$?"
  },
  {
    "id": 399,
    "status": "solved",
    "prize": null,
    "text": "Is it true that there are no solutions to\\[n! = x^k\\pm y^k\\] with $x,y,n\\in \\mathbb{N}$, with $xy>1$ and $k>2$?"
  },
  {
    "id": 400,
    "status": "open",
    "prize": null,
    "text": "For any $k\\geq 2$ let $g_k(n)$ denote the maximum value of\\[(a_1+\\cdots+a_k)-n\\] where $a_1,\\ldots,a_k$ are integers such that $a_1!\\cdots a_k! \\mid n!$. Can one show that\\[\\sum_{n\\leq x}g_k(n) \\sim c_k x\\log x\\] for some constant $c_k$? Is it true that there is a constant $c_k$ such that for almost all $n<x$ we have\\[g_k(n)=c_k\\log x+o(\\log x)?\\]"
  },
  {
    "id": 401,
    "status": "solved",
    "prize": null,
    "text": "Is there some function $f(r)$ such that $f(r)\\to \\infty$ as $r\\to\\infty$, such that, for infinitely many $n$, there exist $a_1,a_2$ with\\[a_1+a_2> n+f(r)\\log n\\] such that $a_1!a_2! \\mid n!2^n3^n\\cdots p_r^n$?"
  },
  {
    "id": 402,
    "status": "solved",
    "prize": null,
    "text": "Prove that, for any finite set $A\\subset\\mathbb{N}$, there exist $a,b\\in A$ such that\\[\\mathrm{gcd}(a,b)\\leq a/\\lvert A\\rvert.\\]"
  },
  {
    "id": 403,
    "status": "solved",
    "prize": null,
    "text": "Does the equation\\[2^m=a_1!+\\cdots+a_k!\\] with $a_1<a_2<\\cdots <a_k$ have only finitely many solutions?"
  },
  {
    "id": 404,
    "status": "open",
    "prize": null,
    "text": "For which integers $a\\geq 1$ and primes $p$ is there a finite upper bound on those $k$ such that there are $a=a_1<\\cdots<a_n$ with\\[p^k \\mid (a_1!+\\cdots+a_n!)?\\] If $f(a,p)$ is the greatest such $k$, how does this function behave? Is there a prime $p$ and an infinite sequence $a_1<a_2<\\cdots$ such that if $p^{m_k}$ is the highest power of $p$ dividing $\\sum_{i\\leq k}a_i!$ then $m_k\\to \\infty$?"
  },
  {
    "id": 405,
    "status": "solved",
    "prize": null,
    "text": "Let $p$ be an odd prime. Is it true that the equation\\[(p-1)!+a^{p-1}=p^k\\] has only finitely many solutions?"
  },
  {
    "id": 406,
    "status": "open",
    "prize": null,
    "text": "Is it true that there are only finitely many powers of $2$ which have only the digits $0$ and $1$ when written in base $3$?"
  },
  {
    "id": 407,
    "status": "solved",
    "prize": null,
    "text": "Let $w(n)$ count the number of solutions to\\[n=2^a+3^b+2^c3^d\\] with $a,b,c,d\\geq 0$ integers. Is it true that $w(n)$ is bounded by some absolute constant?"
  },
  {
    "id": 408,
    "status": "open",
    "prize": null,
    "text": "Let $\\phi(n)$ be the Euler totient function and $\\phi_k(n)$ be the iterated $\\phi$ function, so that $\\phi_1(n)=\\phi(n)$ and $\\phi_k(n)=\\phi(\\phi_{k-1}(n))$. Let\\[f(n) = \\min \\{ k : \\phi_k(n)=1\\}.\\] Does $f(n)/\\log n$ have a distribution function? Is $f(n)/\\log n$ almost always constant? What can be said about the largest prime factor of $\\phi_k(n)$ when, say, $k=\\log\\log n$?"
  },
  {
    "id": 409,
    "status": "open",
    "prize": null,
    "text": "How many iterations of $n\\mapsto \\phi(n)+1$ are needed before a prime is reached? Can infinitely many $n$ reach the same prime? What is the density of $n$ which reach any fixed prime?"
  },
  {
    "id": 410,
    "status": "open",
    "prize": null,
    "text": "Let $\\sigma_1(n)=\\sigma(n)$, the sum of divisors function, and $\\sigma_k(n)=\\sigma(\\sigma_{k-1}(n))$. Is it true that for all $n\\geq 2$\\[\\lim_{k\\to \\infty} \\sigma_k(n)^{1/k}=\\infty?\\]"
  },
  {
    "id": 411,
    "status": "open",
    "prize": null,
    "text": "Let $g_1=g(n)=n+\\phi(n)$ and $g_k(n)=g(g_{k-1}(n))$. For which $n$ and $r$ is it true that $g_{k+r}(n)=2g_k(n)$ for all large $k$?"
  },
  {
    "id": 412,
    "status": "open",
    "prize": null,
    "text": "Let $\\sigma_1(n)=\\sigma(n)$, the sum of divisors function, and $\\sigma_k(n)=\\sigma(\\sigma_{k-1}(n))$. Is it true that, for every $m,n\\geq 2$, there exist some $i,j$ such that $\\sigma_i(m)=\\sigma_j(n)$?"
  },
  {
    "id": 413,
    "status": "open",
    "prize": null,
    "text": "Let $\\omega(n)$ count the number of distinct primes dividing $n$. Are there infinitely many $n$ such that, for all $m<n$, we have $m+\\omega(m) \\leq n$? Can one show that there exists an $\\epsilon>0$ such that there are infinitely many $n$ where $m+\\epsilon \\omega(m)\\leq n$ for all $m<n$?"
  },
  {
    "id": 414,
    "status": "open",
    "prize": null,
    "text": "Let $h_1(n)=h(n)=n+\\tau(n)$ (where $\\tau(n)$ counts the number of divisors of $n$) and $h_k(n)=h(h_{k-1}(n))$. Is it true, for any $m,n$, there exist $i$ and $j$ such that $h_i(m)=h_j(n)$?"
  },
  {
    "id": 415,
    "status": "open",
    "prize": null,
    "text": "For any $n$ let $F(n)$ be the largest $k$ such that any of the $k!$ possible ordering patterns appears in some sequence of $\\phi(m+1),\\ldots,\\phi(m+k)$ with $m+k\\leq n$. Is it true that\\[F(n)=(c+o(1))\\log\\log\\log n\\] for some constant $c$? Is the first pattern which fails to appear always\\[\\phi(m+1)>\\phi(m+2)>\\cdots >\\phi(m+k)?\\] Is it true that the 'natural' ordering which mimics what happens to $\\phi(1),\\ldots,\\phi(k)$ is the most likely to appear?"
  },
  {
    "id": 416,
    "status": "open",
    "prize": null,
    "text": "Let $V(x)$ count the number of $n\\leq x$ such that $\\phi(m)=n$ is solvable. Does $V(2x)/V(x)\\to 2$? Is there an asymptotic formula for $V(x)$?"
  },
  {
    "id": 417,
    "status": "open",
    "prize": null,
    "text": "Let\\[V'(x)=\\#\\{\\phi(m) : 1\\leq m\\leq x\\}\\] and\\[V(x)=\\#\\{\\phi(m) \\leq x : 1\\leq m\\}.\\] Does $\\lim V(x)/V'(x)$ exist? Is it $>1$?"
  },
  {
    "id": 418,
    "status": "solved",
    "prize": null,
    "text": "Are there infinitely many positive integers not of the form $n-\\phi(n)$?"
  },
  {
    "id": 419,
    "status": "solved",
    "prize": null,
    "text": "If $\\tau(n)$ counts the number of divisors of $n$, then what is the set of limit points of\\[\\frac{\\tau((n+1)!)}{\\tau(n!)}?\\]"
  },
  {
    "id": 420,
    "status": "open",
    "prize": null,
    "text": "If $\\tau(n)$ counts the number of divisors of $n$ then let\\[F(f,n)=\\frac{\\tau((n+\\lfloor f(n)\\rfloor)!)}{\\tau(n!)}.\\] Is it true that\\[\\lim_{n\\to \\infty}F((\\log n)^C,n)=\\infty\\] for large $C$? Is it true that $F(\\log n,n)$ is everywhere dense in $(1,\\infty)$? More generally, if $f(n)\\leq \\log n$ is a monotonic function such that $f(n)\\to \\infty$ as $n\\to \\infty$, then is $F(f,n)$ everywhere dense?"
  },
  {
    "id": 421,
    "status": "open",
    "prize": null,
    "text": "Is there a sequence $1\\leq d_1<d_2<\\cdots$ with density $1$ such that all products $\\prod_{u\\leq i\\leq v}d_i$ are distinct?"
  },
  {
    "id": 422,
    "status": "open",
    "prize": null,
    "text": "Let $f(1)=f(2)=1$ and for $n>2$\\[f(n) = f(n-f(n-1))+f(n-f(n-2)).\\] Does $f(n)$ miss infinitely many integers? What is its behaviour?"
  },
  {
    "id": 423,
    "status": "open",
    "prize": null,
    "text": "Let $a_1=1$ and $a_2=2$ and for $k\\geq 3$ choose $a_k$ to be the least integer $>a_{k-1}$ which is the sum of at least two consecutive terms of the sequence. What is the asymptotic behaviour of this sequence?"
  },
  {
    "id": 424,
    "status": "open",
    "prize": null,
    "text": "Let $a_1=2$ and $a_2=3$ and continue the sequence by appending to $a_1,\\ldots,a_n$ all possible values of $a_ia_j-1$ with $i\\neq j$. Is it true that the set of integers which eventually appear has positive density?"
  },
  {
    "id": 425,
    "status": "open",
    "prize": null,
    "text": "Let $F(n)$ be the maximum possible size of a subset $A\\subseteq\\{1,\\ldots,N\\}$ such that the products $ab$ are distinct for all $a<b$. Is there a constant $c$ such that\\[F(n)=\\pi(n)+(c+o(1))n^{3/4}(\\log n)^{-3/2}?\\] If $A\\subseteq \\{1,\\ldots,n\\}$ is such that all products $a_1\\cdots a_r$ are distinct for $a_1<\\cdots <a_r$ then is it true that\\[\\lvert A\\rvert \\leq \\pi(n)+O(n^{\\frac{r+1}{2r}})?\\]"
  },
  {
    "id": 427,
    "status": "solved",
    "prize": null,
    "text": "Is it true that, for every $n$ and $d$, there exists $k$ such that\\[d \\mid p_{n+1}+\\cdots+p_{n+k},\\] where $p_r$ denotes the $r$th prime?"
  },
  {
    "id": 428,
    "status": "open",
    "prize": null,
    "text": "Is there a set $A\\subseteq \\mathbb{N}$ such that, for infinitely many $n$, all of $n-a$ are prime for all $a\\in A$ with $0<a<n$ and\\[\\liminf\\frac{\\lvert A\\cap [1,x]\\rvert}{\\pi(x)}>0?\\]"
  },
  {
    "id": 429,
    "status": "solved",
    "prize": null,
    "text": "Is it true that, if $A\\subseteq \\mathbb{N}$ is sparse enough and does not cover all residue classes modulo $p$ for any prime $p$, then there exists some $n$ such that $n+a$ is prime for all $a\\in A$?"
  },
  {
    "id": 430,
    "status": "open",
    "prize": null,
    "text": "Fix some integer $n$ and define a decreasing sequence in $[1,n)$ by $a_1=n-1$ and, for $k\\geq 2$, letting $a_k$ be the greatest integer in $[1,a_{k-1})$ such that all of the prime factors of $a_k$ are $>n-a_k$. Is it true that, for sufficiently large $n$, not all of this sequence can be prime?"
  },
  {
    "id": 431,
    "status": "open",
    "prize": null,
    "text": "Are there two infinite sets $A$ and $B$ such that $A+B$ agrees with the set of prime numbers up to finitely many exceptions?"
  },
  {
    "id": 432,
    "status": "open",
    "prize": null,
    "text": "Let $A,B\\subseteq \\mathbb{N}$ be two infinite sets. How dense can $A+B$ be if all elements of $A+B$ are pairwise relatively prime?"
  },
  {
    "id": 433,
    "status": "solved",
    "prize": null,
    "text": "If $A\\subset \\mathbb{N}$ is a finite set then let $G(A)$ denote the greatest integer which is not expressible as a finite sum of elements from $A$ (with repetitions allowed). Let\\[g(k,n)=\\max G(A)\\] where the maximum is taken over all $A\\subseteq \\{1,\\ldots,n\\}$ of size $\\lvert A\\rvert=k$ which has no common divisor. Is it true that\\[g(k,n)\\sim \\frac{n^2}{k-1}?\\]"
  },
  {
    "id": 434,
    "status": "solved",
    "prize": null,
    "text": "Let $k\\leq n$. What choice of $A\\subseteq \\{1,\\ldots,n\\}$ (with $\\mathrm{gcd}(A)=1$) of size $\\lvert A\\rvert=k$ maximises the number of integers not representable as the sum of finitely many elements from $A$ (with repetitions allowed)? Is it $\\{n,n-1,\\ldots,n-k+1\\}$?"
  },
  {
    "id": 435,
    "status": "solved",
    "prize": null,
    "text": "Let $n\\in\\mathbb{N}$ with $n\\neq p^k$ for any prime $p$ and $k\\geq 0$. What is the largest integer not of the form\\[\\sum_{1\\leq i<n}c_i\\binom{n}{i}\\] where the $c_i\\geq 0$ are integers?"
  },
  {
    "id": 436,
    "status": "open",
    "prize": null,
    "text": "If $p$ is a prime and $k,m\\geq 2$ then let $r(k,m,p)$ be the minimal $r$ such that $r,r+1,\\ldots,r+m-1$ are all $k$th power residues modulo $p$. Let\\[\\Lambda(k,m)=\\limsup_{p\\to \\infty} r(k,m,p).\\] Is it true that $\\Lambda(k,2)$ is finite for all $k$? Is $\\Lambda(k,3)$ finite for all odd $k$? How large are they?"
  },
  {
    "id": 437,
    "status": "solved",
    "prize": null,
    "text": "Let $1\\leq a_1<\\cdots<a_k\\leq x$. How many of the partial products $a_1,a_1a_2,\\ldots,a_1\\cdots a_k$ can be squares? Is it true that, for any $\\epsilon>0$, there can be more than $x^{1-\\epsilon}$ squares?"
  },
  {
    "id": 438,
    "status": "solved",
    "prize": null,
    "text": "How large can $A\\subseteq \\{1,\\ldots,N\\}$ be if $A+A$ contains no square numbers?"
  },
  {
    "id": 439,
    "status": "solved",
    "prize": null,
    "text": "Is it true that, in any finite colouring of the integers, there must be two integers $x\\neq y$ of the same colour such that $x+y$ is a square? What about a $k$th power?"
  },
  {
    "id": 440,
    "status": "solved",
    "prize": null,
    "text": "Let $A=\\{a_1<a_2<\\cdots\\}\\subseteq \\mathbb{N}$ be infinite and let $A(x)$ count the number of indices for which $\\mathrm{lcm}(a_i,a_{i+1})\\leq x$. Is it true that $A(x) \\ll x^{1/2}$? How large can\\[\\liminf \\frac{A(x)}{x^{1/2}}\\] be?"
  },
  {
    "id": 441,
    "status": "solved",
    "prize": null,
    "text": "Let $N\\geq 1$. What is the size of the largest $A\\subset \\{1,\\ldots,N\\}$ such that $[a,b]\\leq N$ for all $a,b\\in A$, where $[a,b]$ is the least common multiple of $a$ and $b$? Is it attained by choosing all integers in $[1,(N/2)^{1/2}]$ together with all even integers in $[(N/2)^{1/2},(2N)^{1/2}]$?"
  },
  {
    "id": 442,
    "status": "solved",
    "prize": null,
    "text": "Is it true that if $A\\subseteq\\mathbb{N}$ is such that\\[\\frac{1}{\\log\\log x}\\sum_{n\\in A\\cap [1,x)}\\frac{1}{n}\\to \\infty\\] then\\[\\left(\\sum_{n\\in A\\cap [1,x)}\\frac{1}{n}\\right)^{-2} \\sum_{\\substack{a,b\\in A\\cap (1,x]\\\\ a<b}}\\frac{1}{\\mathrm{lcm}(a,b)}\\to \\infty?\\]"
  },
  {
    "id": 443,
    "status": "solved",
    "prize": null,
    "text": "Let $m,n\\geq 1$. What is\\[\\# \\{ k(m-k) : 1\\leq k\\leq m/2\\} \\cap \\{ l(n-l) : 1\\leq l\\leq n/2\\}?\\] Can it be arbitrarily large? Is it $\\leq (mn)^{o(1)}$ for all sufficiently large $m,n$?"
  },
  {
    "id": 444,
    "status": "solved",
    "prize": null,
    "text": "Let $A\\subseteq\\mathbb{N}$ be infinite and $d_A(n)$ count the number of $a\\in A$ which divide $n$. Is it true that, for every $k$,\\[\\limsup_{x\\to \\infty} \\frac{\\max_{n<x}d_A(n)}{\\left(\\sum_{n\\in A\\cap[1,x)}\\frac{1}{n}\\right)^k}=\\infty?\\]"
  },
  {
    "id": 445,
    "status": "open",
    "prize": null,
    "text": "Is it true that, for any $c>1/2$, if $p$ is a sufficiently large prime then, for any $n\\geq 0$, there exist $a,b\\in(n,n+p^c)$ such that $ab\\equiv 1\\pmod{p}$?"
  },
  {
    "id": 446,
    "status": "solved",
    "prize": null,
    "text": "Let $\\delta(n)$ denote the density of integers which are divisible by some integer in $(n,2n)$. What is the growth rate of $\\delta(n)$? If $\\delta_1(n)$ is the density of integers which have exactly one divisor in $(n,2n)$ then is it true that $\\delta_1(n)=o(\\delta(n))$?"
  },
  {
    "id": 448,
    "status": "solved",
    "prize": null,
    "text": "Let $\\tau(n)$ count the divisors of $n$ and $\\tau^+(n)$ count the number of $k$ such that $n$ has a divisor in $[2^k,2^{k+1})$. Is it true that, for all $\\epsilon>0$,\\[\\tau^+(n) < \\epsilon \\tau(n)\\] for almost all $n$?"
  },
  {
    "id": 449,
    "status": "solved",
    "prize": null,
    "text": "Let $r(n)$ count the number of $d_1,d_2$ such that $d_1\\mid n$ and $d_2\\mid n$ and $d_1<d_2<2d_1$. Is it true that, for every $\\epsilon>0$,\\[r(n) < \\epsilon \\tau(n)\\] for almost all $n$, where $\\tau(n)$ is the number of divisors of $n$?"
  },
  {
    "id": 450,
    "status": "open",
    "prize": null,
    "text": "How large must $y=y(\\epsilon,n)$ be such that the number of integers in $(x,x+y)$ with a divisor in $(n,2n)$ is at most $\\epsilon y$?"
  },
  {
    "id": 451,
    "status": "open",
    "prize": null,
    "text": "Estimate $n_k$, the smallest integer $>2k$ such that $\\prod_{1\\leq i\\leq k}(n_k-i)$ has no prime factor in $(k,2k)$."
  },
  {
    "id": 452,
    "status": "open",
    "prize": null,
    "text": "Let $\\omega(n)$ count the number of distinct prime factors of $n$. What is the size of the largest interval $I\\subseteq [x,2x]$ such that $\\omega(n)>\\log\\log n$ for all $n\\in I$?"
  },
  {
    "id": 453,
    "status": "solved",
    "prize": null,
    "text": "Is it true that, for all sufficiently large $n$, there exists some $i<n$ such that\\[p_n^2 < p_{n+i}p_{n-i},\\] where $p_k$ is the $k$th prime?"
  },
  {
    "id": 454,
    "status": "open",
    "prize": null,
    "text": "Let\\[f(n) = \\min_{i<n} (p_{n+i}+p_{n-i}),\\] where $p_k$ is the $k$th prime. Is it true that\\[\\limsup_n (f(n)-2p_n)=\\infty?\\]"
  },
  {
    "id": 455,
    "status": "open",
    "prize": null,
    "text": "Let $q_1<q_2<\\cdots$ be a sequence of primes such that\\[q_{n+1}-q_n\\geq q_n-q_{n-1}.\\] Must\\[\\lim_n \\frac{q_n}{n^2}=\\infty?\\]"
  },
  {
    "id": 456,
    "status": "open",
    "prize": null,
    "text": "Let $p_n$ be the smallest prime $\\equiv 1\\pmod{n}$ and let $m_n$ be the smallest integer such that $n\\mid \\phi(m_n)$. Is it true that $m_n<p_n$ for almost all $n$? Does $p_n/m_n\\to \\infty$ for almost all $n$? Are there infinitely many primes $p$ such that $p-1$ is the only $n$ for which $m_n=p$?"
  },
  {
    "id": 457,
    "status": "solved",
    "prize": null,
    "text": "Is there some $\\epsilon>0$ such that there are infinitely many $n$ where all primes $p\\leq (2+\\epsilon)\\log n$ divide\\[\\prod_{1\\leq i\\leq \\log n}(n+i)?\\]"
  },
  {
    "id": 458,
    "status": "open",
    "prize": null,
    "text": "Let $[1,\\ldots,n]$ denote the least common multiple of $\\{1,\\ldots,n\\}$. Is it true that, for all $k\\geq 1$,\\[[1,\\ldots,p_{k+1}-1]< p_k[1,\\ldots,p_k]?\\]"
  },
  {
    "id": 459,
    "status": "solved",
    "prize": null,
    "text": "Let $f(u)$ be the largest $v$ such that no $m\\in (u,v)$ is composed entirely of primes dividing $uv$. Estimate $f(u)$."
  },
  {
    "id": 460,
    "status": "open",
    "prize": null,
    "text": "Let $a_0=0$ and $a_1=1$, and in general define $a_k$ to be the least integer $>a_{k-1}$ for which $(n-a_k,n-a_i)=1$ for all $0\\leq i<k$. Does\\[\\sum_{0<a_i< n}\\frac{1}{a_i}\\to \\infty\\] as $n\\to \\infty$? What about if we restrict the sum to those $i$ such that $n-a_j$ is divisible by some prime $\\leq a_j$, or the complement of such $i$?"
  },
  {
    "id": 461,
    "status": "open",
    "prize": null,
    "text": "Let $s_t(n)$ be the $t$-smooth component of $n$ - that is, the product of all primes $p$ (with multiplicity) dividing $n$ such that $p<t$. Let $f(n,t)$ count the number of distinct possible values for $s_t(m)$ for $m\\in [n+1,n+t]$. Is it true that\\[f(n,t)\\gg t\\](uniformly, for all $t$ and $n$)?"
  },
  {
    "id": 462,
    "status": "open",
    "prize": null,
    "text": "Let $p(n)$ denote the least prime factor of $n$. There is a constant $c>0$ such that\\[\\sum_{\\substack{n<x\\\\ n\\textrm{ not prime}}}\\frac{p(n)}{n}\\sim c\\frac{x^{1/2}}{(\\log x)^2}.\\] Is it true that there exists a constant $C>0$ such that\\[\\sum_{x\\leq n\\leq x+Cx^{1/2}(\\log x)^2}\\frac{p(n)}{n} \\gg 1\\] for all large $x$?"
  },
  {
    "id": 463,
    "status": "open",
    "prize": null,
    "text": "Is there a function $f$ with $f(n)\\to \\infty$ as $n\\to \\infty$ such that, for all large $n$, there is a composite number $m$ such that\\[n+f(n)<m<n+p(m)?\\](Here $p(m)$ is the least prime factor of $m$.)"
  },
  {
    "id": 464,
    "status": "solved",
    "prize": null,
    "text": "Let $A=\\{n_1<n_2<\\cdots\\}\\subset \\mathbb{N}$ be a lacunary sequence (so there exists some $\\epsilon>0$ with $n_{k+1}\\geq (1+\\epsilon)n_k$ for all $k$). Must there exist an irrational $\\theta$ such that\\[\\{ \\|\\theta n_k\\| : k\\geq 1\\}\\] is not dense in $[0,1]$ (where $\\| x\\|$ is the distance to the nearest integer)?"
  },
  {
    "id": 465,
    "status": "solved",
    "prize": null,
    "text": "Let $N(X,\\delta)$ denote the maximum number of points $P_1,\\ldots,P_n$ which can be chosen in a circle of radius $X$ such that\\[\\| \\lvert P_i-P_j\\rvert \\| \\geq \\delta\\] for all $1\\leq i<j\\leq n$. (Here $\\|x\\|$ is the distance from $x$ to the nearest integer.)Is it true that, for any $0<\\delta<1/2$, we have\\[N(X,\\delta)=o(X)?\\] In fact, is it true that (for any fixed $\\delta>0$)\\[N(X,\\delta)<X^{1/2+o(1)}?\\]"
  },
  {
    "id": 466,
    "status": "solved",
    "prize": null,
    "text": "Let $N(X,\\delta)$ denote the maximum number of points $P_1,\\ldots,P_n$ which can be chosen in a circle of radius $X$ such that\\[\\| \\lvert P_i-P_j\\rvert \\| \\geq \\delta\\] for all $1\\leq i<j\\leq n$. (Here $\\|x\\|$ is the distance from $x$ to the nearest integer.)Is there some $\\delta>0$ such that\\[\\lim_{x\\to \\infty}N(X,\\delta)=\\infty?\\]"
  },
  {
    "id": 467,
    "status": "open",
    "prize": null,
    "text": "Prove the following for all large $x$: there is a choice of congruence classes $a_p$ for all primes $p\\leq x$ and a decomposition $\\{p\\leq x\\}=A\\sqcup B$ into two non-empty sets such that, for all $n<x$, there exist some $p\\in A$ and $q\\in B$ such that $n\\equiv a_p\\pmod{p}$ and $n\\equiv a_q\\pmod{q}$."
  },
  {
    "id": 468,
    "status": "open",
    "prize": null,
    "text": "For any $n$ let $D_n$ be the set of sums of the shape $d_1,d_1+d_2,d_1+d_2+d_3,\\ldots$ where $1<d_1<d_2<\\cdots$ are the divisors of $n$. What is the size of $D_n\\backslash \\cup_{m<n}D_m$? If $f(N)$ is the minimal $n$ such that $N\\in D_n$ then is it true that $f(N)=o(N)$? Perhaps just for almost all $N$?"
  },
  {
    "id": 469,
    "status": "open",
    "prize": null,
    "text": "Let $A$ be the set of all $n$ such that $n=d_1+\\cdots+d_k$ with $d_i$ distinct proper divisors of $n$, but this is not true for any $m\\mid n$ with $m<n$. Does\\[\\sum_{n\\in A}\\frac{1}{n}\\] converge?"
  },
  {
    "id": 470,
    "status": "open",
    "prize": 10,
    "text": "Call $n$ weird if $\\sigma(n)\\geq 2n$ and $n$ is not pseudoperfect, that is, it is not the sum of any set of its divisors. Are there any odd weird numbers? Are there infinitely many primitive weird numbers, i.e. those such that no proper divisor of $n$ is weird?"
  },
  {
    "id": 471,
    "status": "solved",
    "prize": null,
    "text": "Given a finite set of primes $Q=Q_0$, define a sequence of sets $Q_i$ by letting $Q_{i+1}$ be $Q_i$ together with all primes formed by adding three distinct elements of $Q_i$. Is there some initial choice of $Q$ such that the $Q_i$ become arbitrarily large?"
  },
  {
    "id": 472,
    "status": "open",
    "prize": null,
    "text": "Given some initial finite sequence of primes $q_1<\\cdots<q_m$ extend it so that $q_{n+1}$ is the smallest prime of the form $q_n+q_i-1$ for $n\\geq m$. Is there an initial starting sequence so that the resulting sequence is infinite?"
  },
  {
    "id": 473,
    "status": "solved",
    "prize": null,
    "text": "Is there a permutation $a_1,a_2,\\ldots$ of the positive integers such that $a_k+a_{k+1}$ is always prime?"
  },
  {
    "id": 475,
    "status": "open",
    "prize": null,
    "text": "Let $p$ be a prime. Given any finite set $A\\subseteq \\mathbb{F}_p\\backslash \\{0\\}$, is there always a rearrangement $A=\\{a_1,\\ldots,a_t\\}$ such that all partial sums $\\sum_{1\\leq k\\leq m}a_{k}$ are distinct, for all $1\\leq m\\leq t$?"
  },
  {
    "id": 476,
    "status": "solved",
    "prize": null,
    "text": "Let $A\\subseteq \\mathbb{F}_p$. Let\\[A\\hat{+}A = \\{ a+b : a\\neq b \\in A\\}.\\] Is it true that\\[\\lvert A\\hat{+}A\\rvert \\geq \\min(2\\lvert A\\rvert-3,p)?\\]"
  },
  {
    "id": 477,
    "status": "open",
    "prize": null,
    "text": "Is there a polynomial $f:\\mathbb{Z}\\to \\mathbb{Z}$ of degree at least $2$ and a set $A\\subset \\mathbb{Z}$ such that for any $n\\in \\mathbb{Z}$ there is exactly one $a\\in A$ and $b\\in \\{ f(k) : k\\in\\mathbb{Z}\\}$ such that $n=a+b$?"
  },
  {
    "id": 478,
    "status": "open",
    "prize": null,
    "text": "Let $p$ be a prime and\\[A_p = \\{ k! \\pmod{p} : 1\\leq k<p\\}.\\] Is it true that\\[\\lvert A_p\\rvert \\sim (1-\\tfrac{1}{e})p?\\]"
  },
  {
    "id": 479,
    "status": "open",
    "prize": null,
    "text": "Is it true that, for all $k\\neq 1$, there are infinitely many $n$ such that $2^n\\equiv k\\pmod{n}$?"
  },
  {
    "id": 480,
    "status": "solved",
    "prize": null,
    "text": "Let $x_1,x_2,\\ldots\\in [0,1]$ be an infinite sequence. Is it true that\\[\\inf_n \\liminf_{m\\to \\infty} n \\lvert x_{m+n}-x_m\\rvert\\leq 5^{-1/2}\\approx 0.447?\\]"
  },
  {
    "id": 481,
    "status": "solved",
    "prize": null,
    "text": "Let $a_1,\\ldots,a_r,b_1,\\ldots,b_r\\in \\mathbb{N}$ such that $\\sum_{i}\\frac{1}{a_i}>1$. For any finite sequence of $n$ (not necessarily distinct) integers $A=(x_1,\\ldots,x_n)$ let $T(A)$ denote the sequence of length $rn$ given by\\[(a_ix_j+b_i)_{1\\leq j\\leq n, 1\\leq i\\leq r}.\\] Prove that, if $A_1=(1)$ and $A_{i+1}=T(A_i)$, then there must be some $A_k$ with repeated elements."
  },
  {
    "id": 482,
    "status": "solved",
    "prize": null,
    "text": "Define a sequence by $a_1=1$ and\\[a_{n+1}=\\lfloor\\sqrt{2}(a_n+1/2)\\rfloor\\] for $n\\geq 1$. The difference $a_{2n+1}-2a_{2n-1}$ is the $n$th digit in the binary expansion of $\\sqrt{2}$. Find similar results for $\\theta=\\sqrt{m}$, and other algebraic numbers."
  },
  {
    "id": 540,
    "status": "solved",
    "prize": null,
    "text": "Is it true that if $A\\subseteq \\mathbb{Z}/N\\mathbb{Z}$ has size $\\gg N^{1/2}$ then there exists some non-empty $S\\subseteq A$ such that $\\sum_{n\\in S}n\\equiv 0\\pmod{N}$?"
  },
  {
    "id": 541,
    "status": "solved",
    "prize": null,
    "text": "Let $a_1,\\ldots,a_p$ be (not necessarily distinct) residues modulo $p$, such that there exists some $r$ so that if $S\\subseteq [p]$ is non-empty and\\[\\sum_{i\\in S}a_i\\equiv 0\\pmod{p}\\] then $\\lvert S\\rvert=r$. Must there be at most two distinct residues amongst the $a_i$?"
  },
  {
    "id": 586,
    "status": "solved",
    "prize": null,
    "text": "Is there a covering system such that no two of the moduli divide each other?"
  },
  {
    "id": 646,
    "status": "solved",
    "prize": null,
    "text": "Let $p_1,\\ldots,p_k$ be distinct primes. Are there infinitely many $n$ such that $n!$ is divisible by an even power of each of the $p_i$?"
  },
  {
    "id": 677,
    "status": "open",
    "prize": null,
    "text": "Let $M(n,k)=[n+1,\\ldots,n+k]$ be the least common multiple of $\\{n+1,\\ldots,n+k\\}$. Is it true that for all $m\\geq n+k$\\[M(n,k) \\neq M(m,k)?\\]"
  },
  {
    "id": 707,
    "status": "solved",
    "prize": 1000,
    "text": "Let $A\\subset \\mathbb{N}$ be a finite Sidon set. Is there some set $B$ with $A\\subseteq B$ which is perfect difference set modulo $p^2+p+1$ for some prime $p$?"
  },
  {
    "id": 1050,
    "status": "solved",
    "prize": null,
    "text": "Is\\[\\sum_{n=1}^\\infty \\frac{1}{2^n-3}\\] irrational?"
  },
  {
    "id": 1051,
    "status": "solved",
    "prize": null,
    "text": "Is it true that if $1\\leq a_1<a_2<\\cdots$ is a sequence of integers with\\[\\liminf a_n^{1/2^n}>1\\] then\\[\\sum_{n=1}^\\infty \\frac{1}{a_na_{n+1}}\\] is irrational?"
  },
  {
    "id": 1112,
    "status": "open",
    "prize": null,
    "text": "Let $1\\leq d_1<d_2$ and $k\\geq 3$. Does there exist an integer $r$ such that if $B=\\{b_1<\\cdots\\}$ is a lacunary sequence of positive integers with $b_{i+1}\\geq rb_i$ then there exists a sequence of positive integers $A=\\{a_1<\\cdots\\}$ such that\\[d_1\\leq a_{i+1}-a_i\\leq d_2\\] for all $i\\geq 1$ and $(kA)\\cap B=\\emptyset$, where $kA$ is the $k$-fold sumset?"
  },
  {
    "id": 1113,
    "status": "open",
    "prize": null,
    "text": "A positive odd integer $m$ such that none of $2^km+1$ are prime for $k\\geq 0$ is called a Sierpinski number. We say that a set of primes $P$ is a covering set for $m$ if every $2^km+1$ is divisible by some $p\\in P$. Are there Sierpinski numbers with no finite covering set of primes?"
  },
  {
    "id": 1180,
    "status": "solved",
    "prize": null,
    "text": "Let $\\epsilon>0$. Does there exist a constant $C_\\epsilon$ such that, for all primes $p$, every residue modulo $p$ is the sum of at most $C_\\epsilon$ many elements of\\[\\{ n^{-1} : 1\\leq n\\leq p^\\epsilon\\}\\] where $n^{-1}$ denotes the inverse of $n$ modulo $p$?"
  }
];
