---
tags: post
layout: "layouts/article.njk"
title: "CSS Scroll-Driven Write-on Text Effect"
date: "2023-07-19"
highlightSyntax: true
meta:
  description: Using CSS scroll-driven animations to produce a write-on text effect.
  card: summary
  image: /images/social-summary.png
---

<p class="entry-intro">
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations">CSS scroll-driven animations</a> are a new feature that's in early days of rolling out to browsers. In short, they’re everything we love about CSS animations, but with a timeline based on scroll position instead of automatic timeline.
</p>

This is my first time tinkering with them and so far they’re super fun. Being able to accomplish these effects with zero JavaScript is huge. This write-on text effect is something I’ve <a href="https://archive.tylergaw.com/css-write-on">experimented with before</a>. Trying it with scroll animations was one of the first things that popped into my head.

<p class="note-special">
  <strong>Note:</strong> At the time of this post, CSS scroll-driven animations support is limited to Chrome 116+ which is only in Chrome Canary.
</p>

Here’s the demo. It’s not perfect, but workable. A proper write-on text effect would
have the actual stroke of the letters written out instead of just a reveal like this.

<div class="codepen" 
  data-height="600" 
  data-default-tab="css,result" 
  data-slug-hash="dyQeJwJ" 
  data-user="tylergaw" 
  style="height: 600px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 1px solid; margin: 1em 0;">
  <span>See the Pen <a href="https://codepen.io/tylergaw/pen/dyQeJwJ">
  CSS scroll-driven text write-on</a> by Tyler Gaw (<a href="https://codepen.io/tylergaw">@tylergaw</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</div>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

And a video showing the effect if you don't want to mess with Chrome Canary.

<figure>
  <video src="https://p197.p4.n0.cdn.getcloudapp.com/items/RBuJmk1m/a4a420c1-4fd9-4a3b-848e-2f7582300919.mp4?source=viewer&v=bf40343d6e3cd9c35bd789a249dde455" controls></video>
</figure>

While it takes time to figure out the nuances of how scroll animations work, this demo is fairly straightforward to accomplish. I’m animating the width of a `clip-path` `polygon` to reveal each line of text. Instead of the animation running immediately, the progress of it is tied to the scroll position of the `p` element for the line of the poem.

The full code is available in the [CodePen](https://codepen.io/tylergaw/pen/dyQeJwJ), the core bits are as follows:

<pre><code class="language-css">@keyframes write {
  0% { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
}

main p {
  animation: write linear both;
  view-timeline-name: --written-text;
  view-timeline-axis: block;
  animation-timeline: --written-text;
  animation-range: entry-crossing 30% contain 45%;
}</code></pre>

1. Declare a `@keyframes` animation named `write` that increases the width of a `clip-path` from 0 to 100%.
2. Apply the `write` animation to each `p`
3. Give the timeline a unique name, `--written-text`, and set that as the `animation-timline`. This overrides the standard, automatic `animation` timeline
4. Using `animation-range`, refine how the animation progresses related to the scroll position of each `p`

That last point for `animation-range`, that’s where I spent the most time. And where we have the most control over each animation. There’s a ton of different possible variations. Luckily [Bramus](https://www.bram.us/) made an [excellent tool to visualize it](https://scroll-driven-animations.style/tools/view-timeline/ranges).

This is just one effect that’s possible with scroll-driven animations. Another very welcome addition to CSS. If you’re looking for an intro to them, again Bramus has you covered with [“Animate elements on scroll with Scroll-driven animations”](https://developer.chrome.com/articles/scroll-driven-animations/).
