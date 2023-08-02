---
tags: post
layout: "layouts/article.njk"
title: "Complex MPA View Transitions"
date: "2023-08-02"
highlightSyntax: true
meta:
  description: Adding unique view transitions to multiple page elements.
  image: /blog/assets/post-image-complex-view-transitions-social.jpg
---

<p class="note-special">
  <strong>Note:</strong> At the time of this post, view transitions are still an emerging standard. Examples may not work for you. To use in Chrome or Arc, enable two feature flags:
  <code>chrome://flags#view-transition</code> and <code>chrome://flags#view-transition-on-navigation</code>
</p>

<p class="entry-intro">
  In my <a href="https://tylergaw.com/blog/view-transitions-first-experiments-mpa/">previous post</a> on the topic, I wrote about what I was learning about view transitions and shared <a href="https://github.com/tylergaw/mpa-view-transitions-sandbox">examples</a> of different transitions.
</p>

At the end of that post, I also wrote about wanting to come up with interesting transitions on this site. I spent a handful of hours across a couple days adding fun transitions to most of the project pages and the about page. They’re live now, if you’re using a browser with view transitions supported and enabled.

In this post, I’ll talk about these more complex page transitions by going into detail about the [StreetCred](https://tylergaw.com/work/streetcred) page, and share tricks I’m picking up along the way.

Before getting into detail, here’s a video showing the transitions.

<figure>
  <video src="https://p197.p4.n0.cdn.getcloudapp.com/items/YEu4eROB/3b0bcdc7-8c71-4bd6-8617-be653fdf5c8c.mp4?source=viewer&v=acf26640c255428d3dc7767940d0893d" controls></video>
    <figcaption>fig 1: A preview of each page’s transitions</figcaption>
</figure>

As you can see in the video, the transitions are on the hero section of each page. The heroes are some of the most visually interesting sections of the site. And at the top, so makes them an ideal candidate for layering on transitions.

Full page transitions are OK, but they also make a site feel like a Powerpoint. The only time I’m likely to use full page transitions is if I am making a web-based slide deck. Even then, using only full page animations can feel flat. Animating multiple elements in an orchestrated way is a better way to use motion to create fun and interesting effects. So, that’s what I’ve done. Let’s get into it.

## Setting the stage

First, we need to enable view transitions by adding the `meta` element to the `head` of all pages:

<pre><code class="language-html">&lt;meta name="view-transition" content="same-origin"&gt;</code></pre>

Next, since we want don’t want the default full-page fades, we turn them off with this CSS:

<pre><code class="language-css">::view-transition-old(*),
::view-transition-new(*) {
  animation: none;
  mix-blend-mode: normal;
}</code></pre>

That snippet clears the browser defaults for both the old and new transition snapshots. This gets us to a baseline where we’ve enabled transitions, but they don’t have a visual effect. I see this snippet, or one very near it, ending up in most of our normalize or reset styles.

## Building the animation

Looking at the StreetCred page hero, we can already see opportunities for motion. I’ve had some type of motion in mind for it since I designed it a couple years back. I could see each element moving independently in a way that gave each its own story in a way.

<figure>
  <picture>
    <img src="/blog/assets/post-image-streetcred-transitions-overview.jpg" alt="The hero section of tylergaw.com/work/streetcred showing the elements we'll animate." />
  </picture>
  <figcaption>fig 2: The StreetCred hero we’ll animate</figcaption>
</figure>

Let’s get the styles in place that will allow us to animate each element when the page loads. There are six elements we want to animate. The logo, the main device, the app screen, and the three smaller app details positioned above the main device. In the markup, each of those is a separate element with a class.

For each of those rulesets, we’ll apply a unique `view-transition-name`.

<pre><code class="language-css">.streetcred__graphic-main {
  ...
  view-transition-name: streetcred-graphic-main;
}</code></pre>

We repeat that for each element. I’ll leave out the other elements here for brevity. The full stylesheet is [available on Github](https://github.com/tylergaw/tylergaw.com/blob/main/src/css/modules/pages/work/streetcred.css).

When adding motion, it’s important to work in a way where the motion isn’t required. Animations should be additive. All content and graphics have to be available without transitions or animations. That could be because the current browser doesn’t support them. Or could be because the user has opted to reduce motion on their machine. Either way, we’ll use a `prefers-reduced-motion: no-preference` media query to only apply animations if the user hasn’t opted out.

To get a foundation in place, let’s add a basic fade-in for all elements by targeting the `view-transition-new` pseudo element.

<pre><code class="language-css">@keframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@media (prefers-reduced-motion: no-preference) {
  ::view-transition-new(streetcred-title),
  ::view-transition-new(streetcred-graphic-main),
  ::view-transition-new(streetcred-graphic-main-img),
  ::view-transition-new(streetcred-graphic-board),
  ::view-transition-new(streetcred-graphic-poi),
  ::view-transition-new(streetcred-graphic-cubes) {
    animation: fadeIn 0.5s ease;
}</code></pre>

<figure>
  <video src="https://p197.p4.n0.cdn.getcloudapp.com/items/NQupWBl6/f98cee57-9f19-427e-affa-18a443e08c44.mp4?source=viewer&v=37bf2ce9ddf92a2b982bb593eb3ccee1" controls></video>
    <figcaption>fig 3: The foundation, a basic fade-in transition</figcaption>
</figure>

Nothing spectacular, but we have a working transition for each element. Now we can break this up by element to create a sequenced animation. We’ll do this in parts.

For the first part, we’ll animate the main device and app screen as follows:

1. No elements are visible as the page loads
2. The main device fades in and floats up into position. On the device we see the purple background / StreetCred logo splash screen
3. The app screen fades in with a subtle scale up

Here’s the completed animation with all other elements hidden.

<figure>
  <video src="https://p197.p4.n0.cdn.getcloudapp.com/items/6quJbXpm/ef819e1a-fa66-4f22-bcfa-58483e401f2c.mp4?source=viewer&v=3d3748f9cb494a2eefbe9eddf07f437b" controls></video>
    <figcaption>fig 4: The main app device and screen animation</figcaption>
</figure>

That looks solid. Notice we navigated to the StreetCred page from another page. But, look at what happens if we refresh the page.

<figure>
  <video src="https://p197.p4.n0.cdn.getcloudapp.com/items/12uk7bWz/268d42d5-c718-4297-ab90-1f11f9d71d2e.mp4?source=viewer&v=120ad397951df7e3fb9169ef8e7dd240" controls></video>
    <figcaption>fig 5: The main app device and screen animation on page refresh</figcaption>
</figure>

Wait, that’s not right. See how the device and screen are already visible. Like they’re at the end of their animation. We can see some movement, so we know the animation is still happening, so what’s the problem? We’re animating the `view-transition-new` snapshot, but the `view-transition-old` snapshot is still visible in it’s final position. Here’s a trick I learned to fix that. We’ll use it on all the pages. When we have animations like this, where elements aren’t on the screen and then transition in, we have to hide the old view transition snapshot. To do that, we target the `::view-transition-old` selector for each of our named view transitions.

<pre><code class="language-css">::view-transition-old(streetcred-graphic-main),
::view-transition-old(streetcred-graphic-main-img) {
  display: none;
}</code></pre>

We need to hide old snapshot for all six elements. The complete ruleset ends up being:

<pre><code class="language-css">::view-transition-old(streetcred-title),
::view-transition-old(streetcred-graphic-main),
::view-transition-old(streetcred-graphic-main-img),
::view-transition-old(streetcred-graphic-board),
::view-transition-old(streetcred-graphic-poi),
::view-transition-old(streetcred-graphic-cubes) {
  display: none;
}</code></pre>

It’s repetitive, but we set it once and forget about it. This isn’t to say the old snapshot is useless. If we decide in the future we also want an outro transition, we’d use `::view-transition-old` to do it.

Back to the rest of the animation. In our `prefers-reduced-motion` media query, we apply new animations to the `streetcred-graphic-main` and `streetcred-graphic-main-img` view transitions.

<pre><code class="language-css">@media (prefers-reduced-motion: no-preference) {
   ::view-transition-new(streetcred-graphic-main) {
    animation: graphicMain 0.5s ease;
   }

   ::view-transition-new(streetcred-graphic-main-img) {
     animation: graphicMainImg 0.9s ease;
   }
}</code></pre>

And the `graphicMain` and `graphicMainImg` keyframes:

<pre><code class="language-css">@keyframes graphicMain {
  0%, 50% {
    opacity: 0;
    translate: 0 100px;
  }

  100% {
    opacity: 1;
    translate: 0;
  }
}

@keyframes graphicMainImg {
  0%, 75% {
    opacity: 0;
    scale: 0.9;
  }

  100% {
    opacity: 1;
    scale: 1;
  }
}</code></pre>

These are both typical `keyframes` rulesets, with a small timing trick that I’ll explain shortly. `graphicMain` animates the opacity and Y translation of the main device. `graphicMainImg` animates the opacity and scale of the app screen.

---

First thing, notice the slight delay before the main device starts to transition? I’m finding that a slight delay helps sell these types of page transitions. Without it, the motion feels like it gets lost in the surrounding page change. A few milliseconds of rest before any element starts moving seems to be plenty.
