---
tags: post
layout: "layouts/article.njk"
title: "Refreshing Colormix"
date: "2023-05-16"
meta:
  description: Iterating colormix.style beyond an MVP.
  card: summary
  image: /blog/assets/post-image-colormix-refresh-social.png
---

[Last summer](https://tylergaw.com/blog/colormix-mvp/), I built a tool to help visualize the CSS `color-mix` function. [colormix.style](https://www.colormix.style) lets you mix two colors in a given color space and generates the CSS snippet needed to do that with `color-mix`.

For the MVP, I was focused on building the bare minimum to get the idea across. Since then, browser support for `color-mix` as improved. More people are experimenting with and [writing about](https://developer.chrome.com/articles/high-definition-css-color-guide/) `color-mix` and the huge amount of new color-related features in CSS. And, my understanding of `color-mix` and more importantly how new CSS color capabilities work as expanded.

With all that, I’m taking the time to iterate [colormix.style](https://www.colormix.style) beyond an MVP into a more robust, more useful tool.

## What’s changed

To be able to make the larger functionality and usable improvements I wanted, the first thing I needed to do was take another stab at the overall UI. I had an idea for what I wanted when I designed the MVP, a spartan UI where every bit of the UI was part of the tool. That idea can work, but I didn't execute on it well enough. It also felt like my original design had put too much emphasis on the color input vs the output. The two color inputs, while important, aren't the main idea. The output of `color-mix` is.

With those things in mind, step one was to sit down and reimagine the UI.

### MVP design

<figure>
  <picture>
    <img src="https://tylergaw.com/blog/assets/post-image-colormix-mvp-screenshot.jpg" alt="A screenshot of colormix.style" />
  </picture>
  <figcaption>fig 1: <a href="https://www.colormix.style">colormix.style</a> MVP design that was functional, but left a lot of room for improvement.</figcaption>
</figure>

The basic utility was there, but it just wasn't what I knew it could be. As I used it more, and thought about more functionality I wanted to include, this design wasn't going to work going forward. Also, aesthetically it wasn't at the level of completeness or fidelity that I wanted.

### Refreshed design

<figure>
  <picture>
    <img src="/blog/assets/post-image-colormix-refresh-after.jpg" alt="A screenshot of colormix.style showing the improved design" />
  </picture>
  <figcaption>fig 2: <a href="https://www.colormix.style">colormix.style</a> Improved design</figcaption>
</figure>
