---
title: "Understanding Vectors Spaces and Basis in Linear Algebra"
date: "2024-01-15"
excerpt: "A comprehensive introduction to vectors space and basis, their properties, and applications in linear algebra."
tags: ["math", "linear-algebra", "vectors-space","vector-basis"]
---

# Vectors Spaces and Basis 

## **Section 1.2 — Vector Space**

A **vector space** is a mathematical structure that allows us to work with objects called **vectors**, similar to how we work with numbers. Vectors can represent multiple measurements, arranged as tuples:

$\mathbf{x} = (x_1, x_2, \dots, x_n)$

### Operations on Vectors

Vectors support two key operations:

1. **Vector addition**:

$\mathbf{x} + \mathbf{y} = (x_1 + y_1, \dots, x_n + y_n)$

2. **Scalar multiplication**:

$c \mathbf{x} = (c x_1, \dots, c x_n), \quad c \in \mathbb{R}$

**Geometric interpretation:**

* Addition → translation
* Scalar multiplication → stretching or squeezing
  
  Plot:)
  
<Figure
  src="/v1/content/math/linear-algebra/math.linear-algebra.vector-add-mul-geom.png"
  alt="Vector operation"
  caption="Fig1: Visualizing vector operations"
  width="500"
/>
  
  ```py
  import numpy as np
  import matplotlib.pyplot as plt
  
  # Define vectors
  x = np.array([2, 1])
  y = np.array([1, 3])
  c = 1.5  # scalar
  
  # Origin
  origin = np.array([0, 0])
  
  # Create plot
  plt.figure(figsize=(6,6))
  plt.axis('equal')
  plt.grid(True, which='both', linestyle='--', alpha=0.5)
  
  # Plot vectors
  plt.quiver(*origin, *(c*x), color='purple', scale=1, scale_units='xy', angles='xy', label=r'$c\mathbf{x}$')
  plt.quiver(*origin, *x, color='blue', scale=1, scale_units='xy', angles='xy', label=r'$\mathbf{x}$')
  plt.quiver(*origin, *y, color='green', scale=1, scale_units='xy', angles='xy', label=r'$\mathbf{y}$')
  plt.quiver(*origin, *(x+y), color='red', scale=1, scale_units='xy', angles='xy', label=r'$\mathbf{x+y}$')
  
  # Labels
  plt.xlim(-1, 6)
  plt.ylim(-1, 6)
  plt.xlabel('X')
  plt.ylabel('Y')
  plt.title('Vector Addition and Scalar Multiplication')
  plt.legend()
  plt.show()
  
  ```

> Note: Vector multiplication like $\mathbf{x} \mathbf{y} = (x_1 y_1, \dots, x_n y_n)$ exists algebraically but generally **has no geometric meaning**.

---

### Definition: Vector Space

A **vector space** is a tuple $(V, F, +, \cdot)$ where:

* $V$ = set of vectors
* $F$ = field of scalars (usually $\mathbb{R}$ or $\mathbb{C}$)
* $+$ = vector addition: $V \times V \to V$
* $\cdot$ = scalar multiplication: $F \times V \to V$

### Properties

**Vector addition:**

1. Commutative: $\mathbf{x} + \mathbf{y} = \mathbf{y} + \mathbf{x}$
2. Associative: $\mathbf{x} + (\mathbf{y} + \mathbf{z}) = (\mathbf{x} + \mathbf{y}) + \mathbf{z}$
3. Null vector exists: $\exists \mathbf{0} \in V$ s.t. $\mathbf{x} + \mathbf{0} = \mathbf{x}$
4. Additive inverse: $\forall \mathbf{x} \in V, \exists -\mathbf{x} \in V$ s.t. $\mathbf{x} + (-\mathbf{x}) = \mathbf{0}$

**Scalar multiplication:**

1. Associative: $a(b \mathbf{x}) = (ab)\mathbf{x}$
2. Distributive over vectors: $a(\mathbf{x} + \mathbf{y}) = a\mathbf{x} + a\mathbf{y}$
3. Identity: $1 \mathbf{x} = \mathbf{x}$

---

## Examples of Vector Spaces

### 1. Euclidean space $\mathbb{R}^n$

$\mathbb{R}^n = {(x_1, \dots, x_n) \mid x_i \in \mathbb{R}}$

* Common example: $\mathbb{R}^2$ (plane) or $\mathbb{R}^3$ (3D space)
* Addition and scalar multiplication are defined componentwise

```python
# Python example: vector addition and scalar multiplication
import numpy as np

x = np.array([1, 2])
y = np.array([3, 4])
c = 2

x + y        # array([4, 6])
c * x        # array([2, 4])
```

---

### 2. Space of polynomials $\mathbb{R}[x]$

$$
\mathbb{R}[x] = \left\{ p(x) = \sum_{i=0}^n p_i x^i \;\middle|\; p_i \in \mathbb{R},\ n \ge 0 \right\}
$$

* Addition: $(p+q)(x) = \sum_i (p_i + q_i)x^i$
* Scalar multiplication: $(c p)(x) = \sum_i c p_i x^i$

> Polynomials can also be thought of as tuples of coefficients:
> $p(x) = p_0 + p_1 x + \dots + p_n x^n \leftrightarrow (p_0, \dots, p_n)$

---

### 3. Space of continuous functions $C([0,1])$

$C([0,1]) = {f : [0,1] \to \mathbb{R} \mid f \text{ is continuous}}$

* Vector addition: $(f+g)(x) = f(x) + g(x)$
* Scalar multiplication: $(cf)(x) = c f(x)$

> Functions are also vectors! Spaces of functions are crucial in advanced mathematics, e.g., in functional analysis and neural networks.

---

Euclidean vs polynomial vs function vector spaces visually:

<Figure
  src="/v1/content/math/linear-algebra/math.linear-algebra.different-spaces.png"
  alt="Euclidean vs polynomial vs function vector spaces"
  caption="Fig2: Visualizing Euclidean vs polynomial vs function vector spaces"
/>

---

```py
import numpy as np
import matplotlib.pyplot as plt

# --- 1. Euclidean Space (R^2) ---
plt.figure(figsize=(15, 4))

plt.subplot(1, 3, 1)
origin = np.array([0, 0])
vectors = np.array([[2, 1], [1, 2], [2.5, 2]])

for v in vectors:
    plt.quiver(*origin, *v, angles='xy', scale_units='xy', scale=1)

plt.xlim(0, 3)
plt.ylim(0, 3)
plt.title(r'$\mathbb{R}^2$: Euclidean Space')
plt.xlabel('x₁')
plt.ylabel('x₂')
plt.grid(True, linestyle='--', alpha=0.5)
plt.gca().set_aspect('equal')

# --- 2. Polynomial Space (R[x]) ---
plt.subplot(1, 3, 2)
x = np.linspace(-1, 1, 200)
p1 = 1 + 2*x                   # degree 1
p2 = 1 - 3*x + 2*x**2          # degree 2
p3 = 2 - x + 0.5*x**3          # degree 3

plt.plot(x, p1, label=r'$p_1(x)=1+2x$')
plt.plot(x, p2, label=r'$p_2(x)=1-3x+2x^2$')
plt.plot(x, p3, label=r'$p_3(x)=2-x+0.5x^3$')
plt.title(r'$\mathbb{R}[x]$: Polynomial Space')
plt.xlabel('x')
plt.ylabel('p(x)')
plt.legend()
plt.grid(True, linestyle='--', alpha=0.5)

# --- 3. Function Space (C([0,1])) ---
plt.subplot(1, 3, 3)
x = np.linspace(0, 1, 300)
f1 = np.sin(2*np.pi*x)
f2 = np.cos(2*np.pi*x)
f3 = np.exp(-3*x)

plt.plot(x, f1, label=r'$f_1(x)=\sin(2\pi x)$')
plt.plot(x, f2, label=r'$f_2(x)=\cos(2\pi x)$')
plt.plot(x, f3, label=r'$f_3(x)=e^{-3x}$')
plt.title(r'$C([0,1])$: Function Space')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.legend()
plt.grid(True, linestyle='--', alpha=0.5)

plt.tight_layout()
plt.show()
```

### Key Intuition

* Think of vectors as arrows starting from the **origin** (null vector)
* Vector spaces generalize geometric intuition to more abstract settings
* $\mathbb{R}^n$ is the canonical example, but vector spaces include polynomials, functions, and more

---

## **Section 1.3 — The Basis**

Although a vector space may contain infinitely many vectors, we can describe **all of them** using only a few **fundamental vectors** — called a **basis**.

---

### 🧩 Idea

In $\mathbb{R}^n$, there exist $n$ special vectors:

$$
\mathbf{e}_1 = (1, 0, \dots, 0), \quad
\mathbf{e}_2 = (0, 1, \dots, 0), \quad
\dots, \quad
\mathbf{e}_n = (0, 0, \dots, 1)
$$

These are called the **standard basis vectors**.

Every vector $\mathbf{x} = (x_1, x_2, \dots, x_n)$ in $\mathbb{R}^n$ can be written as a **linear combination** of these basis vectors:

$$
\mathbf{x} = \sum_{i=1}^{n} x_i \mathbf{e}_i, \quad x_i \in \mathbb{R}
$$

Example in $\mathbb{R}^2$:

$$
\mathbf{e}_1 = (1, 0), \quad \mathbf{e}_2 = (0, 1)
$$

Then, for $\mathbf{x} = (3, 2)$:

$$
\mathbf{x} = 3\mathbf{e}_1 + 2\mathbf{e}_2
$$

---

### 🧠 Why This Matters

* The coordinates $(x_1, \dots, x_n)$ **depend on the chosen basis**.
* A **basis** provides a **reference system** for representing vectors.
* Changing the basis changes the coordinates, but **not the vector itself**.

Hence, a **basis** acts as a **skeleton** of the vector space — it *spans* the entire space and provides a way to uniquely express every vector.

---

### 🧮 Formal Definition

A set of vectors ${ \mathbf{b}_1, \mathbf{b}_2, \dots, \mathbf{b}_k } \subseteq V$ is a **basis** of a vector space $V$ if:

1. **Spanning property:** Every $\mathbf{v} \in V$ can be written as
   $$\mathbf{v} = c_1 \mathbf{b}_1 + \dots + c_k \mathbf{b}_k$$
2. **Linear independence:**
   $$c_1 \mathbf{b}_1 + \dots + c_k \mathbf{b}_k = \mathbf{0} \Rightarrow c_1 = c_2 = \dots = c_k = 0$$

If $V = \mathbb{R}^n$, then the standard basis has $n$ vectors and $\dim(V) = n$.

---

### 📊 Python Visualization — Standard Basis in $\mathbb{R}^2$

<Figure
  src="/v1/content/math/linear-algebra/math.linear-algebra.basis-01.png"
  alt="Vector basis"
  caption="Fig1: Visualizing vector basis"
  width="500"
/>

```python
import numpy as np
import matplotlib.pyplot as plt

# Basis vectors
e1 = np.array([1, 0])
e2 = np.array([0, 1])
x = 3*e1 + 2*e2  # target vector

origin = np.array([0, 0])

plt.figure(figsize=(6,6))
plt.axis('equal')
plt.grid(True, linestyle='--', alpha=0.5)

# Plot basis and vector
plt.quiver(*origin, *e1, color='red', angles='xy', scale_units='xy', scale=1, label=r'$\mathbf{e}_1$')
plt.quiver(*origin, *e2, color='blue', angles='xy', scale_units='xy', scale=1, label=r'$\mathbf{e}_2$')
plt.quiver(*origin, *x, color='green', angles='xy', scale_units='xy', scale=1, label=r'$\mathbf{x}=3\mathbf{e}_1+2\mathbf{e}_2$')

# Display
plt.xlim(-1, 4.5)
plt.ylim(-1, 3.5)
plt.xlabel('$x_1$')
plt.ylabel('$x_2$')
plt.title('Standard Basis and Vector Representation in $\\mathbb{R}^2$')
plt.legend()
plt.show()
```

---

🎯 Interpretation:

* Red and blue arrows → standard basis vectors $\mathbf{e}_1$, $\mathbf{e}_2$
* Green arrow → $\mathbf{x}$ represented as a combination of basis vectors

Visually, $\mathbf{x}$ lies at the **end of the parallelogram** formed by scaling and adding $\mathbf{e}_1$ and $\mathbf{e}_2$.

Here’s a **structured, cohesive note** (with math, explanations, and Python visualization) for the section

---

