---
title: "Understanding Vectorsin Linear Algebra"
date: "2024-01-15"
excerpt: "A comprehensive introduction to vectors, their properties, and applications in linear algebra."
tags: ["math", "linear-algebra", "vectors","vector"]
---



# Vectors Introduction

## **Vector Space**

A **vector space** is a mathematical structure that allows us to work with objects called `vectors`, similar to how we work with numbers. Vectors can represent multiple measurements, arranged as tuples:

$\mathbf{x} = (x_1, x_2, \dots, x_n)$

### Operations on `Vectors`

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

### Examples of Vector Spaces

#### 1. Euclidean space $\mathbb{R}^n$

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

#### 2. Space of polynomials $\mathbb{R}[x]$

$$
\mathbb{R}[x] = \left\{ p(x) = \sum_{i=0}^n p_i x^i \;\middle|\; p_i \in \mathbb{R},\ n \ge 0 \right\}
$$

* Addition: $(p+q)(x) = \sum_i (p_i + q_i)x^i$
* Scalar multiplication: $(c p)(x) = \sum_i c p_i x^i$

> Polynomials can also be thought of as tuples of coefficients:
> $p(x) = p_0 + p_1 x + \dots + p_n x^n \leftrightarrow (p_0, \dots, p_n)$

---

#### 3. Space of continuous functions $C([0,1])$

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

## **The Basis**

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

### 📊 Python Visualization — Standard Basis

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


Perfect — let’s make this section **fully cohesive**, precise, and conceptually connected — both mathematically and visually.
We’ll integrate your code and notation style consistently with proper KaTeX math, smooth explanations, and logical flow.

---

## **Linear Combinations and Independence**

In the previous section, we introduced the concept of a **basis** — a minimal set of vectors that can represent any vector in a space.
Now, we will explore how such representations are formed through **linear combinations**, and how to distinguish between **linearly independent** and **dependent** sets of vectors.

---

### Linear Combinations

Given vectors $\mathbf{v}_1, \mathbf{v}_2, \dots, \mathbf{v}_n$ in a vector space $V$ and scalars $x_1, x_2, \dots, x_n \in \mathbb{R}$,
a **linear combination** is any vector of the form:

$$
\mathbf{v} = \sum_{i=1}^{n} x_i \mathbf{v}_i
$$

This simply means we can construct new vectors by **scaling and adding** existing ones.

A **trivial linear combination** is when all coefficients are zero:
$$
x_1 = x_2 = \dots = x_n = 0 \quad \Rightarrow \quad \mathbf{v} = \mathbf{0}
$$

---

### 🧭 Linear Independence and Dependence


#### Understanding the Core Concept

When we study vectors, we often ask:

> “Do these vectors bring *new directions* into the space, or can some of them be built from others?”

This question lies at the heart of **linear independence** and **dependence**.

Take any set of vectors
$$
[v_1, v_2, \dots, v_n]
$$
in a vector space. We can combine them linearly using scalars
$$
(c_1, c_2, \dots, c_n):
$$

$$
c_1v_1 + c_2v_2 + \dots + c_nv_n = 0
$$

where $0$ is the **zero vector**.
The goal is to find what values of $c_1$, $c_2$, $\dots$, $c_n$$ make this true.

---

**Linear Independence:**

Vectors are **linearly independent** if the *only* solution is:

$$
c_1 = c_2 = \dots = c_n = 0
$$

This means none of the vectors can be expressed as a combination of the others.
Each vector adds a unique direction — together, they span a larger space.

---

**Linear Dependence**

Vectors are **linearly dependent** if there exists a solution where **at least one** coefficient is **non-zero**:

$$
c_1v_1 + c_2v_2 + \dots + c_nv_n = 0, \quad \text{with some } c_i \neq 0
$$

That indicates one or more vectors can be expressed using others —
so the set doesn’t bring new directions or new dimensions.

---


#### 🎨 Visualization — Independence vs Dependence


<Figure
src="/v1/content/math/linear-algebra/linear-dep-indep.png"
alt="Vector Independence vs Dependence"
caption="Fig1: Visualizing Vector Independence vs Dependence"
width="500"
/>

```python
import numpy as np
import matplotlib.pyplot as plt

plt.figure(figsize=(8, 4))

# --- Left: Independent vectors ---
plt.subplot(1, 2, 1)
v1 = np.array([1, 0])
v2 = np.array([0.5, 1])

plt.quiver(0, 0, *v1, angles='xy', scale_units='xy', scale=1, color='r', label=r'$\mathbf{v}_1$')
plt.quiver(0, 0, *v2, angles='xy', scale_units='xy', scale=1, color='b', label=r'$\mathbf{v}_2$')

plt.title("Linearly Independent")
plt.xlim(-0.5, 2)
plt.ylim(-0.5, 2)
plt.grid(True, linestyle='--', alpha=0.5)
plt.axis('equal')
plt.legend()

# --- Right: Dependent vectors ---
plt.subplot(1, 2, 2)
v1 = np.array([1, 0])
v2 = np.array([2, 0])  # multiple of v1

# Slight offset for visibility
offset = np.array([0, 0.005])

plt.quiver(0, 0, *v1, angles='xy', scale_units='xy', scale=1, color='r', label=r'$\mathbf{v}_1$')
plt.quiver(*offset, *v2, angles='xy', scale_units='xy', scale=1, color='b', alpha=0.7, label=r'$\mathbf{v}_2 = 2\mathbf{v}_1$')

plt.plot([0, 2], [0.05, 0.05], 'k--', alpha=0.3)

plt.title("Linearly Dependent")
plt.xlim(-0.5, 2.5)
plt.ylim(-0.2, 0.6)
plt.grid(True, linestyle='--', alpha=0.5)
plt.axis('equal')
plt.legend()

plt.tight_layout()
plt.show()
```

#### 🧩 Example 1 — Linear Independence

Show that the vectors

$$
v_1 = (1, 2, -1), \quad v_2 = (2, 1, 3), \quad v_3 = (3, 5, 2)
$$
are **linearly independent**.

---

Step 1: Write the general combination

For linear independence, start with:
$$
c_1 v_1 + c_2 v_2 + c_3 v_3 = 0
$$

Substitute the given vectors:
$$
c_1(1,2,-1) + c_2(2,1,3) + c_3(3,5,2) = (0,0,0)
$$

---

Step 2: Expand each coordinate

Combine corresponding components:

$$
(c_1 + 2c_2 + 3c_3,; 2c_1 + c_2 + 5c_3,; -c_1 + 3c_2 + 2c_3) = (0,0,0)
$$

This gives a system of equations:

$$
\begin{cases}
c_1 + 2c_2 + 3c_3 = 0 \\
2c_1 + c_2 + 5c_3 = 0 \\

* c_1 + 3c_2 + 2c_3 = 0
\end{cases}
$$

---

Step 3: Write as an augmented matrix

$$
\begin{bmatrix}
1 & 2 & 3 & | & 0 \\
2 & 1 & 5 & | & 0 \\
-1 & 3 & 2 & | & 0
\end{bmatrix}
$$

We’ll use **row reduction** (Gaussian elimination).

---

Step 4: Row reduce

1️⃣ Eliminate below the first pivot (the 1 in row 1):

$$
R_2 \to R_2 - 2R_1 \quad,\quad R_3 \to R_3 + R_1
$$

$$
\begin{bmatrix}
1 & 2 & 3 & | & 0 \\
0 & -3 & -1 & | & 0 \\
0 & 5 & 5 & | & 0
\end{bmatrix}
$$

2️⃣ Make the pivot in row 2 a 1 (divide by -3):

$$
R_2 \to \frac{1}{-3}R_2
\Rightarrow
\begin{bmatrix}
1 & 2 & 3 & | & 0 \\
0 & 1 & \frac{1}{3} & | & 0 \\
0 & 5 & 5 & | & 0
\end{bmatrix}
$$

3️⃣ Eliminate the second column entries above and below pivot 2:

$$
R_1 \to R_1 - 2R_2,\quad R_3 \to R_3 - 5R_2
$$

$$
\begin{bmatrix}
1 & 0 & \frac{7}{3} & | & 0 \\
0 & 1 & \frac{1}{3} & | & 0 \\
0 & 0 & \frac{10}{3} & | & 0
\end{bmatrix}
$$

4️⃣ Final step — simplify the last row:

$$
R_3 \to \frac{3}{10}R_3
\Rightarrow
\begin{bmatrix}
1 & 0 & \frac{7}{3} & | & 0 \\
0 & 1 & \frac{1}{3} & | & 0 \\
0 & 0 & 1 & | & 0
\end{bmatrix}
$$

---

Step 5: Interpret the result

The matrix now shows:
$$
\begin{cases}
c_1 + \frac{7}{3}c_3 = 0 \\
c_2 + \frac{1}{3}c_3 = 0 \\
c_3 = 0
\end{cases}
$$

From the last equation, $c_3 = 0$.
Then $c_2 = 0$ and $c_1 = 0$.

✅ Only the **trivial solution** exists → **the vectors are linearly independent.**

---

Geometrically, In 3D space:

* $v_1, v_2, v_3$ point in **different directions**,
* None of them lies on the same plane as a combination of the other two,
* So they **span the entire 3D space**.



#### 🧩 Example 2 — Linear Dependence

Check whether the vectors
$$
v_1 = (1, 2, 3), \quad v_2 = (2, 4, 6), \quad v_3 = (1, 1, 1)
$$
are **linearly dependent**.

---

**Step 1: Write the condition for dependence**

Start with the general equation:
$$
c_1 v_1 + c_2 v_2 + c_3 v_3 = 0
$$

Substitute the given vectors:

$$
c_1(1,2,3) + c_2(2,4,6) + c_3(1,1,1) = (0,0,0)
$$

---

**Step 2: Expand component-wise**

$$
(c_1 + 2c_2 + c_3, ; 2c_1 + 4c_2 + c_3, ; 3c_1 + 6c_2 + c_3) = (0,0,0)
$$

This gives:
$$
\begin{cases}
c_1 + 2c_2 + c_3 = 0 \\
2c_1 + 4c_2 + c_3 = 0 \\
3c_1 + 6c_2 + c_3 = 0
\end{cases}
$$

---

**Step 3: Write the augmented matrix**

$$
\begin{bmatrix}
1 & 2 & 1 & | & 0 \\
2 & 4 & 1 & | & 0 \\
3 & 6 & 1 & | & 0
\end{bmatrix}
$$

---

**Step 4: Row reduce**

1️⃣ Eliminate below the first pivot:

$$
R_2 \to R_2 - 2R_1, \quad R_3 \to R_3 - 3R_1
$$

$$
\begin{bmatrix}
1 & 2 & 1 & | & 0 \\
0 & 0 & -1 & | & 0 \\
0 & 0 & -2 & | & 0
\end{bmatrix}
$$

2️⃣ Simplify the second and third rows:

$$
R_3 \to R_3 - 2R_2
\Rightarrow
\begin{bmatrix}
1 & 2 & 1 & | & 0 \\
0 & 0 & -1 & | & 0 \\
0 & 0 & 0 & | & 0
\end{bmatrix}
$$

---

*Step 5: Interpret the result*

From the reduced system:
$$
\begin{cases}
c_1 + 2c_2 + c_3 = 0 \\

-c_3 = 0
  \end{cases}
$$

So $c_3 = 0$, and the first equation becomes $c_1 = -2c_2$.

Here $c_2$ is **free**, meaning we can choose any non-zero value for it.

Let’s pick $c_2 = 1$:
$$
c_1 = -2, \quad c_2 = 1, \quad c_3 = 0
$$

Since not all coefficients are zero, this is a **non-trivial solution**.

✅ Therefore, the vectors are **linearly dependent.**


Notice something simple:
$$
v_2 = 2v_1
$$

That means $v_2$ lies on the same line as $v_1$ — no new direction is added.
So $v_1$ and $v_2$ are already dependent, and $v_3$ doesn’t change that.



#### Determinant Shortcut (for 3 vectors in ℝ³):

If you place the vectors as rows or columns of a $3 \times 3$ matrix:
$$
A = [v_1 \ v_2 \ v_3]
$$

Then:

* If $\det(A) \neq 0$ → **Independent**
* If $\det(A) = 0$ → **Dependent**

A nonzero determinant means the vectors form a 3D volume (a non-flat parallelepiped),
while zero determinant means they lie in a lower dimension (plane or line).

---

#### 💡 Key Insights

* **Independence** → no redundancy in the set.
* **Dependence** → some vectors are redundant or repeat directions.
* Always start from $c_1v_1 + \dots + c_nv_n = 0$.
* Use **row reduction** or **determinants** to test quickly.

---

Excellent direction — this is the bridge between *theory* and *machine learning math*.
Let’s make it **intuitive but still mathematically grounded**, so you see *how linear independence shows up directly inside ML equations* and how dependence breaks them.

---

#### ⚙️ **Mathematical View of Linear Independence in Machine Learning**

We’ll go through the key ML contexts where the math literally depends on independence — starting from simple regression to more advanced methods like PCA.

---

##### **1. Linear Regression: Why Independence Matters**

A linear regression model is:

$$
y = Xw + \epsilon
$$

where

* $X$ = data matrix (rows = samples, columns = features)
* $w$ = weights (parameters the model learns)
* $\epsilon$ = noise term

The solution for $w$ using the **least squares method** is:

$$
w = (X^T X)^{-1} X^T y
$$

🧩 What happens here

* The matrix $X^T X$ is invertible **only if** the columns of $X$ (the features) are **linearly independent**.
* If they are dependent, $X^T X$ becomes **singular** (`determinant = 0`) → can’t be inverted.

That’s a direct mathematical sign of feature dependence.

---

✅ Example

Let’s take two features:

$$
x_1 = [1, 2, 3]^T, \quad x_2 = [2, 4, 6]^T
$$

and output

$$
y = [3, 6, 9]^T
$$

Form matrix $X = [x_1 ; x_2]$:

$$
X =
\begin{bmatrix}
1 & 2 \\
2 & 4 \\
3 & 6
\end{bmatrix}
$$

Compute:

$$
X^T X =
\begin{bmatrix}
14 & 28 \\
28 & 56
\end{bmatrix}
$$

Now find the determinant:

$$
\det(X^T X) = (14)(56) - (28)(28) = 784 - 784 = 0
$$

🚫 **Singular matrix → can’t invert → no unique solution for $w$**.

So mathematically, **feature dependence** → **model instability**.

🧠 Why:

Because $x_2 = 2x_1$. The model cannot tell which feature actually influences $y$; both represent the same direction.

---

##### **2. PCA (Principal Component Analysis): Creating Independent Directions**

PCA is fundamentally about **finding new directions (axes)** that are **linearly independent and orthogonal**, while preserving as much variance from the original data as possible.
In other words, PCA converts **dependent** (correlated) features into **independent** (uncorrelated) principal components.

---

**Step 1 — Compute the Covariance Matrix**

Given mean-centered data $X$ (each column is a feature):

$$
\Sigma = \frac{1}{n} X^T X
$$

If the original features are **dependent**, the covariance matrix $\Sigma$ will have **redundant rows and columns** — meaning its rank is less than the number of features.
This implies some features can be expressed as linear combinations of others.

---

**Step 2 — Eigen Decomposition**

$$
\Sigma v_i = \lambda_i v_i
$$

Here:

* Each **eigenvector** $v_i$ defines a new **principal direction**.
* Each **eigenvalue** $\lambda_i$ represents how much variance lies along that direction.

All eigenvectors $v_i$ are **orthogonal (linearly independent)** by construction.

* $v_1$: direction of **maximum variance**
* $v_2$: next direction of variance, **orthogonal** to $v_1$, and so on.

---

**Step 3 — Transform Data**

$$
Z = X V
$$

* $V$ = matrix of eigenvectors (principal directions)
* $Z$ = transformed data in the **PCA space**

Now, the columns of $Z$ are **linearly independent** — meaning they’re **uncorrelated** and represent unique patterns in the data.

---

**🧩 Mathematical Example 1 — Dependent Features (Linearly Dependent Data)**

Let’s take:

$$
X =
\begin{bmatrix}
1 & 2 \\
2 & 4 \\
3 & 6
\end{bmatrix}
$$

Notice $x_2 = 2x_1$, so both columns are perfectly correlated — one is a scaled copy of the other.

---

**Step 1 — Mean Centering**

Compute mean of each feature:
$$
\mu_1 = 2, \quad \mu_2 = 4
$$

Centered matrix:
$$
X_c =
\begin{bmatrix}
-1 & -2 \\
0 & 0 \\
1 & 2
\end{bmatrix}
$$

---

**Step 2 — Covariance Matrix**

$$
\Sigma = \frac{1}{3} X_c^T X_c =
\frac{1}{3}
\begin{bmatrix}
(-1)^2 + 0^2 + 1^2 & (-1)(-2) + 0(0) + 1(2) \\
(-2)(-1) + 0(0) + 2(1) & (-2)^2 + 0^2 + 2^2
\end{bmatrix}
=
\frac{1}{3}
\begin{bmatrix}
2 & 4 \\
4 & 8
\end{bmatrix}
$$

$$
\Sigma =
\begin{bmatrix}
0.67 & 1.33 \\
1.33 & 2.67
\end{bmatrix}
$$

---

**Step 3 — Eigen Decomposition**

Solve $\det(\Sigma - \lambda I) = 0$:

$$
\begin{vmatrix}
0.67 - \lambda & 1.33 \\
1.33 & 2.67 - \lambda
\end{vmatrix} = 0
$$

$$
(0.67 - \lambda)(2.67 - \lambda) - (1.33)^2 = 0
$$

$$
\lambda^2 - 3.34\lambda + 0 = 0 \Rightarrow
\lambda_1 = 3.34,; \lambda_2 = 0
$$

---

**Step 4 — Interpretation**

* Only **one non-zero eigenvalue** → rank = 1
* PCA finds **one principal component**, meaning all data lies on a **single line**.
* The second direction (zero variance) carries no new information.

Hence, PCA automatically compresses 2D data to **1D**, removing the redundant axis.

---

**🧭 Geometric Meaning**

All points lie along the line $x_2 = 2x_1$.
PCA finds that exact direction and discards the orthogonal one.
The single eigenvector (principal component) captures **all variance**.


**🧩 Example 2 — Independent Features (Linearly Independent Data)**

Now take a truly independent dataset:

$$
X =
\begin{bmatrix}
1 & 0 \\
0 & 1 \\
-1 & 0 \\
0 & -1
\end{bmatrix}
$$

Here, the two features vary independently — neither can be expressed as a combination of the other.

---

**Step 1 — Mean Centering**

The mean of each column is $(0, 0)$, so $X_c = X$.

---

**Step 2 — Covariance Matrix**

$$
\Sigma = \frac{1}{4} X^T X =
\frac{1}{4}
\begin{bmatrix}
1^2 + 0^2 + (-1)^2 + 0^2 & 1(0) + 0(1) + (-1)(0) + 0(-1) \\
0(1) + 1(0) + 0(-1) + (-1)(0) & 0^2 + 1^2 + 0^2 + (-1)^2
\end{bmatrix}
$$

$$
\Sigma = \frac{1}{4}
\begin{bmatrix}
2 & 0 \\
0 & 2
\end{bmatrix}
=
\begin{bmatrix}
0.5 & 0 \\
0 & 0.5
\end{bmatrix}
$$

---

**Step 3 — Eigen Decomposition**

$$
\Sigma v_i = \lambda_i v_i
$$

The eigenvalues are:

$$
\lambda_1 = 0.5, \quad \lambda_2 = 0.5
$$

with eigenvectors:
$$
v_1 = \begin{bmatrix}1 \ 0\end{bmatrix}, \quad
v_2 = \begin{bmatrix}0 \ 1\end{bmatrix}
$$

---

**Step 4 — Interpretation**

* Both eigenvalues are equal → variance is evenly spread along both axes.
* PCA directions are the same as original axes — already **orthogonal and independent**.
* No compression occurs because both components carry unique variance.

---

**🧭 Geometric Meaning**

Points are symmetrically spread along both axes — forming a perfect square around the origin.
PCA doesn’t rotate or compress the data since features are already uncorrelated and independent.

---

**📘 Summary**

| Case            | Covariance Matrix $\Sigma$                               | Eigenvalues | PCA Behavior    | Meaning                               |
| --------------- | -------------------------------------------------------- | ----------- | --------------- | ------------------------------------- |
| **Dependent**   | $\begin{bmatrix}0.67 & 1.33 \\ 1.33 & 2.67\end{bmatrix}$ | (3.34, 0)   | Reduces to 1D   | One true direction of variance        |
| **Independent** | $\begin{bmatrix}0.5 & 0 \\ 0 & 0.5\end{bmatrix}$         | (0.5, 0.5)  | Keeps both axes | Both dimensions unique and orthogonal |

---

These two mathematical cases show exactly what PCA does:

* In **dependent data**, it collapses redundant features.
* In **independent data**, it preserves both axes since they already carry independent variance.

Would you like me to add a **compact visual sketch** (with annotated vectors) to sit beside these math examples for intuitive reinforcement?


🔍 **Visualizing Dependence vs Independence with PCA**

Below, we illustrate this concept with two datasets:

1. **Dependent Dataset** — where feature 2 ≈ 2 × feature 1 (strong correlation).
2. **Independent Dataset** — where both features vary freely (no correlation).

PCA is applied to both, showing how it behaves in each case.

---

**Python Visualization Code**

<Figure
  src="/v1/content/math/linear-algebra/pca-lin-dep-indep.png"
  alt="Linear independence and dependence on PCA"
  caption="Fig1: Visualizing Linear independence and dependence on PCA"
/>

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
import seaborn as sns

plt.style.use('seaborn-v0_8')
sns.set_palette("husl")
np.random.seed(42)
n_samples = 200

# ---- Dependent dataset ----
x1_dep = np.random.randn(n_samples)
x2_dep = 2 * x1_dep + np.random.randn(n_samples) * 0.4
X_dep = np.column_stack([x1_dep, x2_dep])
X_dep_centered = X_dep - X_dep.mean(axis=0)
pca_dep = PCA().fit(X_dep_centered)
Z_dep = pca_dep.transform(X_dep_centered)

# ---- Independent dataset ----
x1_ind = np.random.randn(n_samples)
x2_ind = np.random.randn(n_samples)
X_ind = np.column_stack([x1_ind, x2_ind])
X_ind_centered = X_ind - X_ind.mean(axis=0)
pca_ind = PCA().fit(X_ind_centered)
Z_ind = pca_ind.transform(X_ind_centered)

# ---- Helper function ----
def plot_pca(axs, X, X_centered, pca, title_prefix, color):
    eigenvectors = pca.components_
    eigenvalues = pca.explained_variance_

    # Original data
    ax1 = axs[0]
    ax1.scatter(X[:, 0], X[:, 1], alpha=0.7, c=color, edgecolor='k', s=60)
    corr = np.corrcoef(X.T)[0,1]
    ax1.text(0.05, 0.95, f'Correlation = {corr:.3f}', transform=ax1.transAxes,
             bbox=dict(boxstyle="round", facecolor='wheat'), fontsize=11)
    ax1.set_title(f'{title_prefix} Data\nCorrelation = {corr:.2f}', fontsize=13, fontweight='bold')
    ax1.set_xlabel('Feature 1 (x₁)')
    ax1.set_ylabel('Feature 2 (x₂)')
    ax1.grid(True, alpha=0.3)
    ax1.set_aspect('equal')

    # PCA directions
    ax2 = axs[1]
    ax2.scatter(X_centered[:, 0], X_centered[:, 1], alpha=0.7, c=color, edgecolor='k', s=60)
    scale = 2.5
    for i, (eigvec, eigval) in enumerate(zip(eigenvectors, eigenvalues)):
        vec = eigvec * np.sqrt(eigval) * scale
        ax2.arrow(0, 0, vec[0], vec[1], head_width=0.3, head_length=0.3,
                  fc=['red', 'green'][i], ec=['red', 'green'][i], linewidth=2.5,
                  label=f'PC{i+1} (var={eigval:.2f})')
        ax2.text(vec[0]*1.15, vec[1]*1.15, f'PC{i+1}', color=['red', 'green'][i],
                 fontsize=12, fontweight='bold')
    ax2.legend()
    ax2.set_title(f'{title_prefix} PCA Axes (Orthogonal Directions)', fontsize=13, fontweight='bold')
    ax2.grid(True, alpha=0.3)
    ax2.set_aspect('equal')

    # Transformed data
    ax3 = axs[2]
    ax3.scatter(pca.transform(X_centered)[:, 0],
                pca.transform(X_centered)[:, 1],
                alpha=0.7, c='darkorange', edgecolor='k', s=60)
    ax3.axhline(0, color='gray', linewidth=1, linestyle='--')
    ax3.axvline(0, color='gray', linewidth=1, linestyle='--')
    ax3.set_title(f'{title_prefix} PCA Space\nLinearly Independent PCs', fontsize=13, fontweight='bold')
    ax3.set_xlabel('PC1')
    ax3.set_ylabel('PC2')
    ax3.grid(True, alpha=0.3)
    ax3.text(0.05, 0.95, 
             f'PC1: {pca.explained_variance_ratio_[0]:.1%}\nPC2: {pca.explained_variance_ratio_[1]:.1%}',
             transform=ax3.transAxes, bbox=dict(boxstyle="round", facecolor='lightgreen'), fontsize=11)

# ---- Plot side by side ----
fig, axes = plt.subplots(2, 3, figsize=(18, 10))
plot_pca(axes[0], X_dep, X_dep_centered, pca_dep, 'Dependent', 'steelblue')
plot_pca(axes[1], X_ind, X_ind_centered, pca_ind, 'Independent', 'orchid')
fig.suptitle("PCA Visualization — Dependent vs Independent Features", fontsize=16, fontweight='bold')
plt.tight_layout(rect=[0, 0, 1, 0.97])
plt.show()
```

**Visual Summary**

| Dataset         | Correlation | PCA Variance Split   | PCA Interpretation                   |
| --------------- | ----------- | -------------------- | ------------------------------------ |
| **Dependent**   | ≈ +0.95     | PC1 ≈ 99%, PC2 ≈ 1%  | One dominant axis, strong redundancy |
| **Independent** | ≈ 0         | PC1 ≈ 50%, PC2 ≈ 50% | Balanced, orthogonal, no redundancy  |

---

**🧩 Intuition**

* **Dependent data** lies close to a single straight line → effectively **1D**. PCA collapses it onto one principal direction (rank 1).
* **Independent data** spreads across both axes → true **2D variance**. PCA simply rotates the space so the directions are orthogonal and independent.
