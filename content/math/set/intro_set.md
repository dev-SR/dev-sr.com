---
title: "Understanding Vectors in Linear Algebra"
date: "2024-01-15"
excerpt: "A comprehensive introduction to vectors, their properties, and applications in linear algebra."
tags: ["math", "linear-algebra", "vectors"]
---

# 🧮 Basics of Set Theory

## C.1 What is a Set?

A **set** is a *collection of distinct objects* (called *elements*).

**Example:**  
$S = \{\text{red}, \text{green}, \heartsuit\}$

### Subsets

- $A \subseteq B$ means every element of $A$ is in $B$ (subset).

- $A \subset B$ means $A$ is a *proper subset* of $B$ ($A \subseteq B$ and $A \neq B$).

**Example:**  
If $A = \{1,2\}$ and $B = \{1,2,3\}$, then $A \subset B$.

### Set-builder Notation

Define a set by a property its elements satisfy:  

$
 \text{Even numbers} = \{ n \in \mathbb{Z} : n \bmod 2 = 0 \}  
$

**Python analogy:**

```python
even_numbers = {n for n in range(10) if n % 2 == 0}
# {0, 2, 4, 6, 8}
```

### Power Set

The **power set** of $A$ is the set of all subsets of $A$:  
  $
2^A = \{ B : B \subseteq A \}  
$

**Example:**  
If $A = \{1, 2\}$, then $2^A = \{\emptyset, \{1\}, \{2\}, \{1,2\}\}$.

---

## C.2 Operations on Sets

### Union, Intersection, and Difference

Let $A$ and $B$ be sets.

- **Union:** $A \cup B = \{x : x \in A \text{ or } x \in B\}$

- **Intersection:** $A \cap B = \{x : x \in A \text{ and } x \in B\}$

- **Difference:** $A \setminus B = \{x : x \in A \text{ and } x \notin B\}$

**Example:**  
If $A = \{1,2,3\}$ and $B = \{3,4,5\}$, then  
$A \cup B = \{1,2,3,4,5\}$,  
$A \cap B = \{3\}$,  
$A \setminus B = \{1,2\}$.

---

### Properties

For all sets $A, B, C$:

- **Associative:**  
  $(A \cup B) \cup C = A \cup (B \cup C)$  
  $(A \cap B) \cap C = A \cap (B \cap C)$

- **Commutative:**  
  $A \cup B = B \cup A$,  
  $A \cap B = B \cap A$

- **Distributive:**  
  $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$  
  $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$

---

### De Morgan’s Laws

$  
A \setminus (B \cup C) = (A \setminus B) \cap (A \setminus C)  
$  
$  
A \setminus (B \cap C) = (A \setminus B) \cup (A \setminus C)  
$

**Example:**  
Let $A = \{1,2,3,4,5\}$, $B = \{1,3\}$, $C = \{3,4\}$.  
Then $A \setminus (B \cup C) = \{2,5\}$ and  
$(A \setminus B) \cap (A \setminus C) = \{2,5\}$ ✔️

---

## C.3 Cartesian Product

For sets $A$ and $B$, their **Cartesian product** is:  
$  
A \times B = \{ (a,b) : a \in A,, b \in B \}  
$

**Example:**  
If $A = \{1,2\}$ and $B = \{x,y\}$, then  
$A \times B = \{(1,x),(1,y),(2,x),(2,y)\}$.

> Note: $A \times B \neq B \times A$ and the operation is not associative.

**Machine Learning Example:**  
The **Iris dataset** is a subset of $\mathbb{R}^4$, where each point (sample) is a 4-dimensional vector  
$(\text{sepal length}, \text{sepal width}, \text{petal length}, \text{petal width})$.

---

## C.4 Cardinality of Sets

The **cardinality** $|A|$ represents the *number of elements* in a set.

**Example:**  
$|{4,6,42}| = 3$

For infinite sets:  
$  
|\mathbb{Z}| = |\mathbb{Q}|, \quad |\mathbb{Z}| \ne |\mathbb{R}|, \quad |\mathbb{R}| = |\mathbb{R}^2|  
$

---

### Comparing Cardinalities

Let $A$ and $B$ be sets.

- $|A| = |B|$ if there exists a **bijective** function $f : A \to B$

- $|A| \le |B|$ if there exists an **injective** function $f : A \to B$

- $|A| < |B|$ if $f$ is injective but **not surjective**

**Example:**  
Let $A = \{0,1\}$ and $B = \{2,3,4\}$.  
$f(0) = 2$, $f(1) = 3$ → injective but not surjective → $|A| < |B|$.

---

### Countable Sets

A set $A$ is **countable** if $|A| \le |\mathbb{N}|$.

**Example:**  
$\mathbb{Z}$ is countable, since it can be enumerated as  
$0, 1, -1, 2, -2, 3, -3, \dots$

### Theorem: Union and Product of Countable Sets

If $A_1, A_2, \dots$ are countable, then

- $A_1 \times A_2$ is countable,

- $\displaystyle \bigcup_{n=1}^{\infty} A_n$ is countable.

---

### Infinite Cardinalities

Two important infinite cardinalities:

- **Countably Infinite:**  
  $|\mathbb{Z}| = \aleph_0$ (Aleph-null)

- **Continuum:**  
  $|\mathbb{R}| = \mathfrak{c}$

Thus,  
$  
\aleph_0 < \mathfrak{c}  
$
