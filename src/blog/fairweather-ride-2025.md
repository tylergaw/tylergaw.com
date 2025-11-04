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
  Side projects are an exercise in fun. An opportunity to try out new things. Things that are slow, don’t scale, manual. Many things that would be deemed “not best practice” in day-to-day work. Following that, I started work on it back in March and slowly picked at it for about five months. It’s been live since mid August. I started this post then to share a few of the interesting bits about it, but just getting back to finish it now, in November. So it goes.
</p>

## HTML, CSS, and JS

Build processes have their place. I’m a fan of a lot of that tooling for other projects. This project setup, though, is on purpose, as bare bones as possible. This is a single page made with;

- <code>index.html</code>
- <code>site.css</code>
- <code>site.js</code>
- <code>rides.json</code>
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
  <figcaption>fig 2. Look at these beauties. Optic, Macabre, Method, and ADHD</figcaption>
</figure>

For the title, I wanted to do an ink-bleed style. Where edges of characters bleed into each other when they’re close, so I needed a chunky font. Optic has that nice balance of chunk, with just a touch of blobbiness to set the foundation. More on the ink-bleed SVG effect below.

Method is just a solid sans-serif. I use both the book and regular variants. It provides a balance to the surrounding chaos of the other, ultra-processed type and graphics. It doesn’t get away fully untreated though. For the intro text I apply an SVG filter to give it a worn, blobby look.

ADHD! What an oddball. I love it. In most cases, I cycle through three of its four variants; “hyperactive”, “distracted”, and “impulsive” with an <code>@keyframes</code> animation. Either always or on hover/focus to add to the overall movement of the design.

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

I use some base layout styles on the parent <code>div</code> to get the overall shape. Then use a combination of a transform and SVG filters to morph the text into semi-random, animated blobs.

<pre><code class="language-css">.divider-content {
  filter: url("#heading-blur") url("#edge-noise-animated");
  font-size: 1rem;
  font-family: "adhd-focused";
  transform: scaleX(1.25);
  white-space: nowrap;
}</code></pre>

ADHD focused works well here because it’s chunky. That way, as the transform and filters are mangling the text, it stays intact enough to still be visible. A thinner font would break down too much. More on the SVG filters below.

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

On its own, Macabre wasn’t doing exactly what I wanted it to for the headings. So I started breaking some rules. Stretched it vertically with a transform. Squeezed it horizontally with another. Then applied the, now familiar, SVG filters to rough it up and animate it. The falloff isn’t anything tricky. It’s the heading text repeated a few times, then manually sized, scaled, rotated, and transformed using <code>nth-of-type</code> to move each repetition into place.

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

Somehow I’ve never designed or built a site that uses the common full width, full height hero video. As I was looking around for design ideas, I came across [Gander’s beautiful site](https://takeagander.com). It has one of those big videos on the homepage. That convinced me I needed one for this.

The immediate question was; “what’s the video of?”. I didn’t just want random clips of myself riding around Manhattan in jorts. Maybe that’s for a future project. I went to the Internet Archive and quickly found some fun clips of kids riding bikes, from some PSA from the 80s. That helped set the tone. I tracked down a handful more videos of various lengths of bicycle-related material mostly from the 80s and 90s. I restrained my search to older video clips to help keep a worn feel to everything.

I used After Effects to piece things together. There’s only a few “effects” in the ~25 second clip. I mostly used it as a non-linear editor. Largely because I’m most familiar and fastest with it. It was also nice to have the effects tools handy in the few cases where I needed them.

<figure>
  <picture>
    <img
      src="https://stuff.tylergaw.com/post-fairweather-ride-2025/fairweather-ae.jpg"
      alt="A screenshot of the hero video After Effects workspace."
    />
  </picture>
  <figcaption>fig 6. Piecing together the hero video in After Effects</figcaption>
</figure>

## Strava Data

I track my rides with Strava. Most of them with the iPhone app, but I finally caved and got a Garmin Forerunner 255 a few months back. As I was doing longer rides, I realized quickly my iPhone 13 battery couldn’t last more than about 45 miles.

For my stats, I get data from the Strava API. It works, but it kinda sucks. To request personal ride data from the API, you have to use a Bearer token. The only way to get that is to do an OAuth process. Strava doesn’t offer any type of app token for programmatic access, at least that I could find. There are ways to use their refresh tokens to make it work, but it wasn’t worth it for this project. So, I do it manually. It only takes about 2 mins. I use Insomnia to generate the authorization URL. Go to it in a browser. Log in. Then copy the needed code from the callback URL. Once I have that, I plop it back in Insomnia where I make the request to <code>/athlete/activities</code>. It’s dumb, but it works.

Once I have the data as JSON, I manually copy and paste it into the <code>rides.json</code> file. Instead of using <code>fetch</code> to get the data, I use a JSON module import assertion in <code>site.js</code>.

<pre><code class="language-js">import dataRaw from "./data/rides.json" with { type: "json" };</code></pre>

A request to get the data would work just as well here. I just reached for the import assertion first because it was a few less characters. From there it’s nothing fancy. Some data cleanup, summing, formatting, and HTML string building. Everything happens in <code>[site.js](https://github.com/tylergaw/fairweather-ride/blob/main/static/site.js)</code>.

## Ride Maps

The most interesting data about each ride is where I went. Luckily, the Strava API returns a polyline for each ride. The polyline contains the coordinates for the route I took, so I wanted a map. These don’t need to be interactive—zoomable, pannable—maps. They just need to show the route. Mapbox offers just the thing for this, the [Static Images API](https://docs.mapbox.com/api/maps/static-images/). You set the <code>src</code> of an <code>img</code> element to the static API URL and include a few parameters, including an encoded polyline, and it returns an image. I knew this was a thing, but I hadn’t had a need for it until this. Pretty fun.

<pre><code class="language-js">`https://api.mapbox.com/styles/v1/mapbox/${style}/static/path-${strokeWidth}+${strokeColor}-1(${encodedPolyline})/auto/${size}?attribution=false&padding=${padding}&access_token=${mapboxToken}`;</code></pre>

The date and mileage aren’t part of the static map, they’re text elements styled and layered on top of the <code>img</code>.

<figure>
  <picture>
    <img
      src="https://stuff.tylergaw.com/post-fairweather-ride-2025/fairweather-maps.jpg"
      alt="A screenshot of part of the ride maps."
    />
  </picture>
  <figcaption>fig 7. A static map for each ride via the Mapbox API</figcaption>
</figure>

## SVG Filters

OK, this stuff is very cool. If you can’t tell, I’m not a fan of straight lines or smooth edges. Just in general, but with this design I wanted the absolute minimum of them. The last thing I’d want is for someone to describe the design as “simple and clean”. That is at best a boring compliment and at worst an active put down.

To avoid yucky straight lines, I’m using SVG filters to rough stuff up and in some cases animate it in a kind of squigglevision style. I started down this path while figuring out the ink-bleed for the title. I won’t go into the full background of filters here. It’s a deep pool that I don’t even fully understand. I know just enough to piece a few together and fiddle with the knobs to get what I’m after. Basically, they let you do cool shit to HTML elements via SVG and CSS that you otherwise can’t.

For the title, I start with standard-ish markup.

<pre><code class="language-html">&lt;div class="title-effected"&gt;
  &lt;span class="title-fair"&gt;Fairweather&lt;/span&gt;
  &lt;span class="title-ride"&gt;Ride&lt;/span&gt;
&lt;/div&gt;</pre></code>

The extra <code>span</code>s are in place for other styling. I apply the filters to the parent <code>div</code>.

<pre><code class="language-css">.title-effected {
  filter: url("#title-blobs") url("#edge-noise-animated");
}</pre></code>

The filters themselves are in <code>index.html</code> within a <code>defs</code> element. This creates the ink-bleed style:

<pre><code class="language-html">&lt;filter id="title-blobs"&gt;
  &lt;feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" /&gt;
  &lt;feColorMatrix
    in="blur"
    mode="matrix"
    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 12 -5"
    result="title-blobs"
  /&gt;
  &lt;feBlend in="SourceGraphic" in2="title-blobs" /&gt;
&lt;/filter&gt;</pre></code>

When I was reading about the filters in this one, I needed to play around quite a bit. I ended up building a [collection of CodePens](https://codepen.io/collection/rBNGEK) for them if you’re interested in seeing different ways to do this and a few other cool effects.

With a few value tweaks and different layering of filters you can quickly build up very interesting effects. [Ana](https://thebabydino.github.io/) is the go-to for knowledge and examples on how to use filters.

For the squigglevision, in the title and throughout, I’m using <code>feTurbulence</code>, along with <code>animate</code> and <code>feDisplacementMap</code>. I use this same one for most of it.

<pre><code class="language-html">&lt;filter id="edge-noise-animated"&gt;
  &lt;feTurbulence
    type="turbulence"
    baseFrequency="0.05"
    numOctaves="3"
    result="turbulence"
    seed="0"
  &gt;
    &lt;animate
      attributeName="seed"
      values="0;20"
      dur="2s"
      repeatCount="indefinite"
    /&gt;
  &lt;/feTurbulence&gt;
  &lt;feDisplacementMap
    in="SourceGraphic"
    in2="turbulence"
    scale="3"
    xChannelSelector="R"
    yChannelSelector="B"
  /&gt;
&lt;/filter&gt;</pre></code>

I have a few different blur filters for different text. They use the same filters, but with different values, depending on the size of the text. Larger text needs blurred more, smaller less. This is one detail of filters I wish was a bit smoother. I wish I could pass attribute values to a filter via query param (or any other mechanism). Something like this:

<pre><code class="language-css">filter: url("#general-blur?stdDeviation=5&type=discrete")</pre></code>

**The above code is not real**. As far as I know, there’s no way to do this. You just have to make a copy of each filter with different values.

I have similar filters applied to text, the bike illustrations, and element containers. It helps give an overall handmade feel that I’m after. And it’s very cool to not have to make one of graphics or introduce JS to make it happen.

<p class="offset-no-indent">
  As I hit publish on this, I’m at 940 miles for the year. The weather is turning cold quickly in NYC. My plan is to knock out the last 60 miles within the next week to make sure I get it done. 🤞
</p>
