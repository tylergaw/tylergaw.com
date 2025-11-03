---
tags: post
layout: "layouts/article.njk"
title: "Fairweather Ride 2025"
date: "2025-11-03"
highlightSyntax: true
meta:
  description: A blog post about a silly website about Tyler and his bike.
  image: /blog/assets/post-image-fairweather-ride-2025.jpg
---

<p class="entry-intro">For 2025 I set a goal to ride 1,000 miles on my bike. I’ve been biking with some regularity for a little over a decade now. In that time, I’ve never set a yearly mileage goal. Only small monthly goals. Which, before this year, I only hit once. Early this year, I decided it would be fun to work towards a goal way beyond what I’d ever done. Just to see if I could do it. And, of course, if I’m doing something like this, I’m gonna build a website for it.</p>

<figure>
  <picture>
    <a href="https://bikes.tylergaw.com">
      <img src="https://stuff.tylergaw.com/post-fairweather-ride-2025/fairweather-ride-intro.jpg" alt="A screenshot of the hero section of the Fairweather Ride site showing the title, subtitle, and still of the hero video." />
    </a>
  </picture>
  <figcaption>fig 1. <a href="https://bikes.tylergaw.com">Fairweather Ride 2025</a></figcaption>
</figure>

<p class="drop-capped">
  Side projects are an exercise in fun. An opportunity to try out new things. Things that are slow, don’t scale, manual. Many things that would be deemed “not best practice” in day-to-day work. That’s where I was starting from with this. I started work on it back in March and slowly picked at it for about five months. It’s been live since mid August. I started this post then to share a few of the interesting bits about it, but just getting back to finish it now, in November. So it goes.
</p>

## HTML, CSS, and JS

Build processes have their place. I’m a fan of a lot of that tooling for other projects. This project setup, though, is on purpose, as bare bones as possible. This is a single page made with;

- <code>index.html</code>
- <code>site.css</code>
- <code>site.js</code>
- <code>data.json</code>
- <code>splitting.js</code>
- and a handful of fonts, images, and a video.

I **almost** got away without a <code>package.json</code> and no external JS dependencies. I use a single dependency to make local development easier, <code>live-server</code>. Outside of that, these files get plopped on Netlify and run as they are. Just a good ole webpage. That is still 100% acceptable and good in 2025! Don’t let anyone tell you any different. The source is at [github.com/tylergaw/fairweather-ride](https://github.com/tylergaw/fairweather-ride).

## Typography

Like many designs, the backbone of this one is its typography. From the start, I knew I wanted a design that used a lot of fonts. Too many fonts. Fonts that clashed. I ended up using four; [Optic](https://www.futurefonts.com/loveletters/optic), [Method](https://www.futurefonts.com/typeji/method), [ADHD](https://capitalics.wtf/en/font/adhd), and [Macabre](https://www.futurefonts.com/dave-coleman/macabre).

Three of the four came from [Future Fonts](https://www.futurefonts.com/). It’s my go-to when starting a new project. The fourth, ADHD, is from [capitalics](https://capitalics.wtf/). Can’t remember how I found them, but they do fantastic work. If you visit their site, and compulsively buy fonts, prepare to spend some money.

<figure>
  <picture>
    <a href="https://bikes.tylergaw.com">
      <img src="https://stuff.tylergaw.com/post-fairweather-ride-2025/fairweather-fonts.png" alt="A sample of the four fonts used on the site. Each font represented by it’s name set in the font/variant." />
    </a>
  </picture>
  <figcaption>fig 2. Looks at these beauties. Optic, Macabre, Method, and ADHD</figcaption>
</figure>

For the title, I wanted to do an ink-bleed style. Where edges of characters bleed into each other when they’re close, so I needed a chunky font. Optic has that nice balance of chunk, with just a touch of blobbiness to set the foundation. More on the ink-bleed SVG effect below.

Method is just a solid sans-serif. I use both the book and regular variants. It provides a balance to the surrounding chaos of the other, ultra-processed type and graphics. It doesn’t get away fully untreated though. For the intro text I apply an SVG filter to give it a worn, blobby look.

ADHD! What an oddball. I love it. In most cases, I cycle through three of its four variants; “hyperactive”, “distracted”, and “impulsive” with an <code>@keyframes</code> animation. Either always or on hover/focus to had to the overall movement of the design.

<pre><code class="language-css">@keyframes adhd {
  0% { font-family: "adhd-hyperactive"; }
  50% { font-family: "adhd-distracted"; }
  100% { font-family: "adhd-impulsive"; }
}</code></pre>

### ADHD Section Dividers

Here’s a fun detail. There are three blobby, shaky, dividers between sections.

<figure>
  <video autoplay muted loop playsinline>
    <source
      src="https://stuff.tylergaw.com/post-fairweather-ride-2025/fairweather-section-divider.mp4"
      type="video/mp4"
    />
  </video>
  <figcaption>fig 3. One of the section dividers isolated.</figcaption>
</figure>

These started as solid, grey lines. **How boring**. I didn’t want to use an image, or come up with some generated SVG. So, to create the semi-randomness, I’m using text. The markup for each divider is two <code>div</code>s with random, mostly gibberish words and phrases.

<pre><code class="language-css">&lt;div class="divider" aria-hidden="true"&gt;
  &lt;div class="divider-content"&gt;
    1,000 miles fairweather ride bikes bikes bikes fuck cars 1,000 miles...
  &lt;/div&gt;
&lt;/div&gt;</code></pre>

I use some base layout styles on the parent <code>div</code> to get the overall shape. Then use a combination a transform and svg filters to morph the text into semi-random, animated blobs.

<pre><code class="language-css">.divider-content {
  filter: url("#heading-blur") url("#edge-noise-animated");
  font-size: 1rem;
  font-family: "adhd-focused";
  transform: scaleX(1.25);
  white-space: nowrap;
}</code></pre>

ADHD focused works well here because it’s chunky. That way, as the transform and filters are mangling the text, it stays intact enough to still be visible. A thinner font would break down too much. More on the svg filters below.

To illustrate what’s happening further, here’s a divider with the transform and filters disabled.

<figure>
  <picture>
    <img
      src="https://stuff.tylergaw.com/post-fairweather-ride-2025/fairweather-section-divider-disabled.png"
      alt="A screenshot showing a section divider with CSS transforms and filters off to reveal it’s just text."
    />
  </picture>
  <figcaption>fig 4. An example of a section divider without being transformed and filtered.</figcaption>
</figure>

I saw Macabre on Future Fonts and bought it immediately without a use in mind. I tried it out in early designs for this, but it didn’t seem to work. Felt too much at home in a horror movie poster for what I was going for. Then I started working on section headings and, similar to the dividers, the fonts I was trying felt too boring. I pulled in Macabre because it felt so far away from the rest of the design. This is a helpful way to break out of a design rut.

On its own, Macabre wasn’t doing exactly what I wanted it to for the headings. So I started breaking some rules. Stretched it vertically with a transform. Squeezed it horizontally with another. Then applied the, now familiar, svg filters to rough it up and animate it. The falloff isn’t anything tricky. It’s the heading text repeated a few times, then manually sized, scaled, rotated, and transformed using <code>nth-of-type</code> to move each repetition into place.

<figure>
  <video autoplay muted loop playsinline>
    <source
      src="https://stuff.tylergaw.com/post-fairweather-ride-2025/fairweather-heading.mp4"
      type="video/mp4"
    />
  </video>
  <figcaption>fig 5. A section heading set in Macabre, then poked, prodded, and animated with CSS</figcaption>
</figure>

## The Hero Loop

Somehow I’ve never design or built a site that uses the common full width, full height hero video. As I was looking around for design ideas, I came across [Gander’s beautiful site](https://takeagander.com). It has one of those big videos on the homepage. That convinced me I needed one for this.

The immediate question was; “what’s the video of?”. I didn’t just want random clips of myself riding around Manhattan in jorts. Maybe that’s for a future project. I went to the Interet Archive and quickly found some fun clips of kids riding bikes, from some PSA from the 80s. That helped set the tone. I tracked down a handful more videos of various lengths of bicycle-related material mostly from the 80s and 90s. I restrained my search older video clips to help keep a worn feel to everything.

I used After Effects to piece things together. There’s only a few “effects” in the ~25 second clip. I mostly used it has a non-linear editor. Largely because I’m most familiar and fastest with it. It was also nice to have the effects tools handy in the few cases where I needed them.

<figure>
  <picture>
    <img
      src="https://stuff.tylergaw.com/post-fairweather-ride-2025/fairweather-ae.jpg"
      alt="A screenshot of the hero video After Effects workspace."
    />
  </picture>
  <figcaption>fig 5. Piecing together the hero video in After Effects</figcaption>
</figure>

## Strava Data

About that good dat-er

## Static Maps

Neat little maps that should just be static images, but whatever

## SVG Filters

Make all the things a mess
