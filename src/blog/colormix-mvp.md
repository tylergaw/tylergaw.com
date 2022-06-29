---
tags: post
layout: "layouts/article.njk"
title: "Visualizing CSS color-mix"
date: "2022-06-29"
meta:
  description: An MVP UI for seeing the results of CSS color-mix
  card: summary
---

<p>
  TL;DR: <a href="https://www.colormix.site">colormix.site</a> and <a href="https://github.com/tylergaw/colormix.site"> github.com/tylergaw/colormix.site</a>
</p>
<p>
  Way back in 2017, I <a href="https://tylergaw.com/blog/introducing-colorme/">built ColorMe</a> for working with a proposed CSS color function. That proposal didn't end up sticking, so that <code>color</code> function is no longer valid. ColorMe is still a useful color picker though.
</p>
<p>
  Now, in 2022, there's a proposal for a new CSS color function. This version is named <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix"><code>color-mix</code></a>. It's part of the <a href="https://drafts.csswg.org/css-color-5/#color-mix">CSS Color Module Level 5</a> spec. It allows you to mix two colors in a given colorspace in CSS. That's very cool.
</p>
<p>
  Similar to the deprecated color function, I wanted a quick way to see the results and code snippet for <code>color-mix</code>. <strong>So I built a new tool to do just that; <a href="https://www.colormix.site">colormix.site</a></strong>. 
</p>
<figure>
  <picture>
    <img src="https://tylergaw.com/blog/articles/assets/post-image-colormix-mvp-screenshot.jpg" alt="A screenshot of colormix.site" />
  </picture>
  <figcaption>fig 1: <a href="https://www.colormix.site">colormix.site</a> MVP</figcaption>
</figure>

<h2>What does it do?</h2>
<p>
  This is an MVP and something I'll keep working on. For now, it provides the basic functionality of <code>color-mix</code>. It allows you to pick two colors, set the percentage mix for each color, select a colorspace, and see the results and CSS snippet to produce it.
</p>

<h2>Support</h2>
<p>
  Unless you're in the habit of fiddling with browser feature flags, this likely won't work completely for you. <code>color-mix</code> is only available in a couple browsers and those require a feature flag to be enabled. At the time of this writing, it's latest Firefox and Safari. Check <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix#browser_compatibility">MDN Browser compatibility</a> for details on how to enable it.
</p>

<p>
  As always, I have a list of to-dos I want to get done and I want to write more about what I've learned researching and working with <code>color-mix</code>. This is a prompt and reminder for myself to do that. Let me know if you use ColorMix and find it useful or run into issues.
</p>