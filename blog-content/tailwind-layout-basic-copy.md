---
title: 'Basic Response Layout with Tailwind CSS'
date: 2022-10-29
tags: [tailwind, react-tailwind]
description: 'This is my first post on my new blog'
author: 'John Doe'
url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
---

<Container>

## Content

- [Content](#content)
- [First get's your hands dirty with basic css concepts](#first-gets-your-hands-dirty-with-basic-css-concepts)
	- [Controlling max and min width of a div](#controlling-max-and-min-width-of-a-div)
	- [Centering a div with max-width](#centering-a-div-with-max-width)
- [Responsive Design with Tailwind CSS](#responsive-design-with-tailwind-css)


## First get's your hands dirty with basic css concepts

### Controlling max and min width of a div



### Centering a div with max-width



## Responsive Design with Tailwind CSS

Tailwind provides five breakpoints by default, inspired by common device resolutions:


| Breakpoint prefix | Minimum width | CSS |
| ----------------- | ------------- | --- |
| `sm`              | 640px         |     |
| `md`              | 768px         |     |
| `lg`              | 1024px        |     |
| `xl`              | 1280px        |     |
| `2xl`             | 1536px        |     |

By default, Tailwind uses a **mobile-first breakpoint system**. What this means is that **unprefixed** utilities (like `uppercase`) *take effect on all screen sizes*, while **prefixed** utilities (like `md:uppercase`) only *take effect at the specified breakpoint and above*.

Therefore, don't use `sm:` to target **mobile devices**. Use **unprefixed utilities** to target mobile, and override them at larger breakpoints

</Container>