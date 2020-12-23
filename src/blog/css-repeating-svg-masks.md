---
tags: post
layout: "layouts/article.njk"
title: "CSS: Flexible Repeating SVG Masks"
date: "2020-03-14"
highlightSyntax: true
meta:
  description: This started with a literal dream about CSS, then a Sunday morning of messing around.
  image: /articles/assets/post-image-repeating-masks-social.png
  card: summary
---

<p class="entry-intro">
  This is a technique I used recently to create a flexible,
  repeating pattern using SVG with CSS <code>mask</code>. There are live
  examples in this post and they’re available as a
  <a href="https://codepen.io/tylergaw/pen/mdJpdVm">CodePen</a>.
</p>

<p>
  The need came from something I designed at <a href="https://streetcred.co">work</a>.
  I gave the bottom of the header on each page a little squiggle to make it a bit
  more interesting than a straight line. Along with that, I designed a <a href="https://streetcred.co/patterns#color">color system</a>
  for each type of page. Common pages parade in purple, company content is true blue,
  blog posts read in red, and contests own orange. With StreetCred I’ve been
  throwing a rainbow of bright colors to see what’s fun and what sticks.
</p>
<figure>
  <picture>
    <source srcset="https://tylergaw.com/articles/assets/post-image-repeating-masks-streetcred-banner.webp" type="image/webp">
    <source srcset="https://tylergaw.com/articles/assets/post-image-repeating-masks-streetcred-banner.png" type="image/jpeg">
    <img src="https://tylergaw.com/articles/assets/post-image-repeating-masks-streetcred-banner.png" alt="A screenshot of a purple, blue, red, and orange banner from the StreetCred website." />
  </picture>
  <figcaption>fig 1: Banner squiggles from <a href="https://streetcred.co">streetcred.co</a></figcaption>
</figure>
<p>
  Along with the current colors, we’re getting ready to ship new features that
  use even more colors. We’ll make pages for those and they’ll need themed banner
  squiggles. We need a flexible way to do that.
</p>

<h2>How Should This Work?</h2>
<p>
  For the design, I needed a seamless, horizontally repeating pattern. I needed
  SVG so it was crisp at any size. I wanted a single SVG image that
  I could color using CSS. Because we could have n-number of colors, creating
  a new SVG for every color wasn’t a future-facing option. The squiggly banner using this
  approach is live on <a href="https://streetcred.co">streetcred.co</a>. Let’s
  look at an isolated demo to see how the pieces fit together.
</p>

<h2>Creating the Demo SVG</h2>
<p>
  First, I made a quick doodle of a squiggly line in Sketch using the vector tool.
  The important part was to make sure the line was seamless when repeated horizontally.
  I did that by making sure
  the first point and last point were at the same location on the y-axis. And
  that the bezier curves leading to them was flat when it reached the
  edge of the artboard. This is a simple shape, so it was easy to eyeball.
  A more complex design would involve more work.
</p>

<figure>
  <picture>
    <source srcset="https://tylergaw.com/articles/assets/post-image-repeating-masks-creating-svg.webp" type="image/webp">
    <source srcset="https://tylergaw.com/articles/assets/post-image-repeating-masks-creating-svg.png" type="image/png">
    <img src="https://tylergaw.com/articles/assets/post-image-repeating-masks-creating-svg.png" alt="A screenshot in Sketch app showing the demo squiggle vector being created.">
  </picture>

  <figcaption>fig 2: Creating the demo SVG in Sketch</figcaption>
</figure>

<p>
  To test if the shape is seamless I just duplicated the artboard and dragged it
  into place. Nothing fancy again, a quick eyeball is enough for this.
</p>

<p>
  When I create graphics for SVG use, I simplify them as much as possible.
  For this, I expanded the stroke. That way instead of exporting a <code>path</code>
  with a <code>stroke</code>, I end up with a <code>path</code> with a <code>fill</code>.
  In my experience, filled shapes are more flexible when you’re working with them
  in browsers. Helps avoid scaling issues with <code>stroke</code>s. SVG prep is a
  deep topic that I plan to write more about in the future.
</p>

<p>
  Exporting SVG from Sketch leaves a lot of crud in that we don’t need. My next
  stop is <a href="https://jakearchibald.github.io/svgomg/">SVGOMG</a>. After
  optimizing we end up with an SVG with a single <code>path</code> element. I
  truncated the value of the <code>d</code> attribute for brevity.
</p>

<pre><code class="language-svg">&lt;svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 75"&gt;
  &lt;path id="squiggle" d="M12 19.778C12 1.318..." /&gt;
&lt;/svg&gt;
</code></pre>

<p>
  We’ll use the <code>id</code> attribute as a reference in CSS. Notice we don’t need
  presentational attributes like <code>fill</code>. SVG provides the
  shape. CSS handles the color.
</p>

<h2>The Code</h2>
<p>
  The HTML is a single <code>div</code>. The CSS is three properties.
</p>

<pre><code class="language-html">&lt;div class="repeater"&gt;&lt;/div&gt;</code></pre>

<pre><code class="language-css">.repeater {
  background-color: red;
  /* This fixed height is only for demo, your use cases might not need it */
  height: 75px;
  mask-image: url("/path/to/repeater.svg#squiggle");
}</code></pre>

<p>
  As of this writing, this CSS works in Firefox, but not in Chrome, Safari,
  or Edge. WebKit/Blink browsers still require vendor-prefixed <code>mask</code>
  properties. We don’t want to have to repeat the path to the image. Let’s store
  it in a custom property to make it reusable.
</p>

<pre><code class="language-css">.repeater {
  background-color: red;
  /* This fixed height is only for demo, your use cases might not need it */
  height: 75px;
  --svg: url("/path/to/repeater.svg#squiggle");
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
}</code></pre>

<p>
  With the prefixed version of <code>mask-image</code> in place, this works in all current
  versions of Chrome, Firefox, Safari, and Edge.
</p>

<figure>
  <style>
    .demo-repeater {
      background-color: red;
      /* This fixed height is only for demo, your use cases might not need it */
      height: 75px;
      --svg: url("https://tylergaw-assets.s3.amazonaws.com/inline-masks/repeater.svg#squiggle");
      -webkit-mask-image: var(--svg);
      mask-image: var(--svg);
    }
  </style>
  <div class="demo-repeater"></div>
  <figcaption>fig 3: A live demo of the technique. The CSS is inline for inspection.</figcaption>
</figure>

<h3>What did we do?</h3>
<p>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image"><code>mask-image</code></a>
  is doing the heavy lifting here. We’re giving it a reference to an external
  SVG file and the <code>id</code> attribute of the <code>path</code> we want.
  Mask is hiding anything in our <code>div</code> that doesn’t intersect
  with that shape. So we see the <code>background-color</code> only where the
  <code>path</code> is.
</p>
<p>
  <code>mask</code> is like CSS <code>bacground</code>. It has a <code>mask-repeat</code>
  property that defaults to <code>repeat</code>. Check the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/mask-repeat">MDN docs</a>
  for more that.
</p>

<h3>What else?</h3>
<p>
  With a functional foundation in place, we can have fun with it. We can style the underlying <code>div</code> any
  way we want to create different effects. We can change the color.
</p>
<pre><code class="language-css">.repeater--orange {
  background-color: orange;
}</code></pre>

<figure>
  <style>
    .demo-repeater--orange {
      background-color: orange;
    }
  </style>
  <div class="demo-repeater demo-repeater--orange"></div>
  <figcaption>fig 4: A live demo of the technique showing that we can change the color with CSS.</figcaption>
</figure>
<p>
  We can take that further by setting a background image.
</p>

<pre><code class="language-css">.repeater--gradient {
  background: transparent linear-gradient(90deg, red, purple, blue, green);
}</code></pre>

<figure>
  <style>
    .demo-repeater--gradient {
      background: transparent linear-gradient(90deg, red, purple, blue, green);
    }
  </style>
  <div class="demo-repeater demo-repeater--gradient"></div>
  <figcaption>fig 5: A live demo of the technique showing that we can use a background image</figcaption>
</figure>

<p>
  Changing the background color and image is fun, we can also change the height
  of the <code>div</code> to produce something different.
</p>

<pre><code class="language-css">.repeater--sized {
  height: 18px;
}</code></pre>

<figure>
  <style>
    .demo-repeater--sized {
      height: 12px;
    }
  </style>
  <div class="demo-repeater demo-repeater--sized"></div>
  <figcaption>fig 6: A live demo of the technique showing that we can change the size</figcaption>
</figure>

<p>
  We can change the color, bacground-image, and height. Let’s introduce the
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/mask-size"><code>mask-size</code></a> property to squish the SVG into a type
  of texture.
</p>

<pre><code class="language-css">.repeater--textured {
  --texture-lines: 10;
  --mask-size: calc(250px / var(--texture-lines));
  -webkit-mask-size: var(--mask-size);
  mask-size: var(--mask-size);
}</code></pre>

<figure>
  <style>
    .demo-repeater--textured {
      --texture-lines: 10;
      --mask-size: calc(250px / var(--texture-lines));
      -webkit-mask-size: var(--mask-size);
      mask-size: var(--mask-size);
    }
  </style>
  <div class="demo-repeater demo-repeater--textured"></div>
  <figcaption>fig 7: A live demo of the technique showing that we can use mask-size to produce a texture</figcaption>
</figure>

<p>
  Again, we’re using a custom property to not have to repeat the size value. We’re
  using <code>calc</code> here as a convenience. <code>250px</code> is the height
  of the <code>viewbox</code> of the SVG. We divide that by the number of rows
  we want to make sure we don’t have partial rows.
</p>

<p>
  We can also change the position of the mask using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/mask-position"><code>mask-position</code></a>.
  And, if we can change a value with CSS, that means we can change it over time.
  Change over time equals motion.
</p>

<pre><code class="language-css">@keyframes move {
  to {
    --pos: 150%;
    -webkit-mask-position: var(--pos);
    mask-position: var(--pos);
  }
}
.repeater--animated {
  animation: move 0.6s infinite linear alternate;
}</code></pre>

<figure>
  <style>
    @keyframes move {
      to {
        --pos: 150%;
        -webkit-mask-position: var(--pos);
        mask-position: var(--pos);
      }
    }

    .demo-repeater--animated {
      animation: move 0.6s infinite linear alternate;
    }

  </style>
  <div class="demo-repeater demo-repeater--animated"></div>
  <figcaption>fig 8: A live demo of the technique showing that we can animate the mask position.</figcaption>
</figure>

<p>
  These are toy examples, but they show that with a few building blocks we can
  construct a lot of variations. With more complex SVG images and more CSS, we can use this
  technique to produce all sorts of fun stuff. And be future-flexible while
  doing it.
</p>
