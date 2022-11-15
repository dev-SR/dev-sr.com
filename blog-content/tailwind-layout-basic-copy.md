---
title: 'First steps with GPT-3 for frontend developers'
date: 2022-10-29
updated: 2022-10-29
tags: [tailwind, react-tailwind]
description: 'This is my first post on my new blog'
author: 'John Doe'
poster_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80'
---

<Container>

Earlier this year, I've been fortunate enough to get access to the beta of the [OpenAI](https://openai.com/) **GPT-3 API**. I saw many people throughout 2020 and early 2021 starting pretty impressive projects and even companies around this API, so it's a euphemism to say that it piqued my interest. I wanted to get my hands on it ASAP and **start experimenting and building** things like [some of the cool people on Twitter](https://twitter.com/jsngr).

The problem, however, is that **I didn't know where to start**, or even what to do with GPT-3. When I logged into the playground the first time, I was just presented with a barebone text input and a toolbar filled with sliders, that was it 😅! Thus, I figured this was yet another perfect opportunity to **write the guide I wished I had when I got started** and share the steps I took to achieve my goals and everthing I learned along the way.

In this article, we'll take a look together at **the fundamentals of GPT-3** illustrated through some interactive widgets ⚡️, and most importantly at my attempts to **build my own custom summarization model!** In the end, I'll also guide you on how to use the API beyond the playground, so you'll have all the tools to start building amazing AI-powered apps 🚀.

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