---
tags: post
layout: "layout-article.webc"
title: "P3 Color Bug with Repeating SVG Background Images"
date: "2026-07-14"
highlightSyntax: true
meta:
  description: Aw geez. There’s a bug in Chrome and Safari where SVGs that use Display P3 colors get changed to sRGB when set as repeating background images.
  image: /blog/assets/post-image-p3-svg-bug.jpg
---

<p class="entry-intro">
  Here’s a fun one. There’s a bug in Chrome and Safari where SVGs that use Display P3 colors get changed to sRGB when set as repeating background images.
</p>

<p class="no-drop-cap">
  First, a few details:
</p>

- Seeing this in Chrome 150 and Safari 26
- Firefox (as of 152) needs [silly config changes](https://zidhuss.tech/posts/p3-firefox-mac/) so I didn’t test there. Assuming it has the same issue
- This post is about Display P3, but the same applies to other wide gamut colors like oklch
- [Demo on CodePen](https://codepen.io/editor/tylergaw/pen/019f5dc8-ea9e-7395-bb62-0f2d8e674ab6)

<strong>Keep in mind, you have to be on a display that supports Display P3 colors to see this bug.</strong> It’s a bit tricky to show the problem in the CodePen or here because of that.

Take a simple SVG square with a red fill of `color(display-p3 1 0 0)`.

<pre><code class="language-html">&lt;svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"&gt;
  &lt;rect fill="color(display-p3 1 0 0)" width="300" height="300" /&gt;
&lt;/svg&gt;</code></pre>

<img src="https://stuff.tylergaw.com/post-p3-svg-bug/p3-test.svg" alt="A 300x300 pixel bright red square" width="300" height="300" />

This works as expected in supported browsers on supported displays as internal SVG and `img`. It shows up as the brightest red available in Display P3 color.

Things bug out when using it as a CSS background image <strong>that repeats</strong>. `background-repeat` is the culprit here. For example, this works fine:

<pre><code class="language-css">.this-works {
  width: 300px;
  height: 300px;
  background: url(/images/p3-test.svg) no-repeat;
}</code></pre>

The Display P3 red square displays as the background of `this-works`. But, if we set the background to repeat **and** set the size of the element where it will repeat, the image converts to sRGB.

<pre><code class="language-css">.this-breaks {
  width: 600px;
  height: 300px;
  background: url(/images/p3-test.svg) repeat;
}</code></pre>

This happens with `repeat`, `repeat-x`, and `repeat-y`. Or if you omit the repeat value since `repeat` is the default.

You can fiddle with it in [the CodePen](https://codepen.io/editor/tylergaw/pen/019f5dc8-ea9e-7395-bb62-0f2d8e674ab6). All it takes is for the width or height in the repeated direction to be one pixel more than the size of the image. That’s how we know repeat is the problem.

## Why This Happens

I couldn’t find an existing Chromium or WebKit bug about this, but I found a couple similar ones (listed below). Between those, some reading, and general knowledge of how browsers handle tiling I have an idea of what’s happening.

When a background image doesn’t repeat, browsers render the SVG directly into the final composited surface. So, colors display as expected.

When a background image repeats, browsers need to tile the image. They do so by rasterizing the SVG into an intermediate bitmap first, then “stamping” it across the element as needed. They create that bitmap as an sRGB buffer. That’s the problem. Display P3, or any other non-sRGB color, gets converted (clamped) to what sRGB is able to display. Which causes the bug here.

## This Is Only SVG

An interesting thing is this only happens with SVG. If you use a PNG with a Display P3 profile as the background image, P3 colors survive tiling. 

Seems like the root cause is when an SVG is rasterized into the tile buffer.

## A Workaround

I don’t really have a workaround. This is just broken. For my specific use case I think I can get away with using a PNG instead of an SVG. It’s a small enough element that I should be able to use a 2x version and scale it down to maintain crispness.

### Similar bugs

- [WebKit #231062](https://bugs.webkit.org/show_bug.cgi?id=231062) SVG images drawn onto a display-p3 canvas get flattened to sRGB. Same pattern, different context.
- [Chromium #40923665](https://issues.chromium.org/issues/40923665) WebGL `transferToImageBitmap` forgets the color space. Another case of an intermediate buffer losing wide gamut info.

<p class="offset-no-indent">
  I still need to file Chromium and WebKit bugs for this because all signs point to this being an actual bug. Also I might pull down the Chromium source and see if I can track down the actual line(s) of code at the root. If you’ve bumped into this or have more details, let me know.
</p>
