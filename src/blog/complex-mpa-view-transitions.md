---
tags: post
layout: "layouts/article.njk"
title: "Complex MPA View Transitions"
date: "2023-10-24"
highlightSyntax: true
meta:
  description: The one about CSS transitions that Tyler procrastinated on for 3 months
  image: /blog/assets/post-image-complex-view-transitions-social.jpg
---

<p class="note-update">
  <strong>Update October 6, 2024:</strong> Some of this is outdated. See “<a href="https://tylergaw.com/blog/view-transition-at-rule/">CSS View Transition At-Rule</a>”.
</p>
<p></p>
<p class="note-special">
  <strong>Note:</strong> At the time of this post, view transitions are still an emerging standard. Examples may not work for you. To use in Chrome or Arc, enable two feature flags:
  <code>chrome://flags#view-transition</code> and <code>chrome://flags#view-transition-on-navigation</code>
</p>

<p class="entry-intro">
  In my <a href="https://tylergaw.com/blog/view-transitions-first-experiments-mpa/">previous post</a> on the topic, I wrote about what I was learning about view transitions and shared <a href="https://github.com/tylergaw/mpa-view-transitions-sandbox">examples</a> of different transitions. At the end of that post, I also wrote about wanting to come up with interesting transitions on this site. A few months back, I spent a few hours across a couple days adding fun transitions to most of the project pages and the about page. They’re live now, if you’re using a browser with view transitions supported and enabled.
</p>

For this post, I’ll talk about these more complex page transitions by going into detail about the [StreetCred](https://tylergaw.com/work/streetcred) page, and share tricks I’m picking up along the way.

Before getting into it, here’s a video showing all the transitions.

<figure>
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/view-transitions-preview.mp4" controls></video>
    <figcaption>fig 1: A preview of each page’s transitions.</figcaption>
</figure>

As you can see in the video, the transitions are on the hero section of each page. Those hero sections are some of the most visually interesting sections of the site, and since they’re at the top, it makes them an ideal candidate for layering on view transitions.

Full page transitions are OK, but they also make a site feel like a PowerPoint. The only time I’m likely to use full page transitions is if I’m making a web-based slide deck. Even then, using only full page animations can feel flat. Animating multiple elements in an orchestrated way is a better way to use motion to create interesting effects. So, that’s what I’ve done. Let’s get into it.

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

Looking at the StreetCred page hero, we can already see opportunities for motion. I’ve had some type of motion in mind for it since I designed it years back. I could see each element moving independently in a way that gave each its own kind of story.

<figure>
  <picture>
    <img src="https://stuff.tylergaw.com/post-complex-view-transitions/streetcred-transitions-overview.jpg" alt="The hero section of tylergaw.com/work/streetcred showing the elements we'll animate." />
  </picture>
  <figcaption>fig 2: The StreetCred hero at rest.</figcaption>
</figure>

Let’s get the styles in place that will allow us to animate each element when the page loads. There are six elements we want to animate: the logo, the main device, the app screen, and the three smaller app details positioned above the main device. In the markup, each of those is a separate element with a class.

For each of those rulesets, we’ll apply a unique `view-transition-name`. For example:

<pre><code class="language-css">.streetcred__graphic-main {
  ...
  view-transition-name: streetcred-graphic-main;
}</code></pre>

We repeat that for each element. I’ll leave out the other elements here for brevity. The full stylesheet is [available on Github](https://github.com/tylergaw/tylergaw.com/blob/main/src/css/modules/pages/work/streetcred.css).

When adding motion, it’s important to work in a way where the motion isn’t required. Animations should be additive. All content and graphics must be available without transitions or animations. That could be because the current browser doesn’t support them, or because the user has opted to reduce motion on their machine. Either way, we’ll use a `prefers-reduced-motion: no-preference` media query to only apply animations if the user hasn’t opted out.

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
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/work-transitions-0.mp4" controls></video>
    <figcaption>fig 3: The foundation, a basic fade-in transition.</figcaption>
</figure>

Nothing spectacular, but we have a working transition for each element. Now, we can break this up by element to create a composition. We’ll do this in parts.

For the first part, we’ll animate the main device and app screen as follows:

1. No elements are visible as the page loads
2. The main device fades in and floats up into position. On the device we see the purple background / StreetCred logo splash screen
3. The app screen fades in with a subtle scale up

Here’s the completed animation with all other elements hidden.

<figure>
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/work-transitions-1.mp4" controls></video>
    <figcaption>fig 4: The main device and app screen animation.</figcaption>
</figure>

That looks solid. Notice we navigated to the StreetCred page from another page. Look at what happens if we refresh the page though.

<figure>
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/work-transitions-1-refresh.mp4" controls></video>
    <figcaption>fig 5: The main device and app screen animation on page refresh looking wrong.</figcaption>
</figure>

Wait, that’s not right. See how the device and app screen are already visible. It’s like they’re at the end of their animation. We can see some movement, so we know the animation is still happening. So what’s the problem? We’re animating the `view-transition-new` snapshot, but the `view-transition-old` snapshot is still visible in its final position. This is a common problem. Here’s a trick I use to fix it that we’ll use on all the pages. When we have animations like this, where elements aren’t visible on the screen and then transition in, we have to hide the old view transition snapshot. To do that, we target the `::view-transition-old` selector for each of our named view transitions.

<pre><code class="language-css">::view-transition-old(streetcred-graphic-main),
::view-transition-old(streetcred-graphic-main-img) {
  display: none;
}</code></pre>

We need to hide the old snapshot for all six elements. The complete ruleset ends up being:

<pre><code class="language-css">::view-transition-old(streetcred-title),
::view-transition-old(streetcred-graphic-main),
::view-transition-old(streetcred-graphic-main-img),
::view-transition-old(streetcred-graphic-board),
::view-transition-old(streetcred-graphic-poi),
::view-transition-old(streetcred-graphic-cubes) {
  display: none;
}</code></pre>

It’s repetitive, but we set it once and forget it. This isn’t to say the old snapshot in `::view-transition-old` is useless, only that I don’t have a use for it in these transitions. I’m still figuring out exactly how to use them. I **think** they could be useful if I decided I wanted some type of outro transition when leaving the page.

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

These are both typical `keyframes` rulesets, with a small timing trick that I’ll explain shortly. `graphicMain` animates the opacity and Y translation of the main device to make it appear. `graphicMainImg` animates the opacity and scale of the app screen to give that splash-screen-to-app-initialized effect.

Now, the timing trick. Watch the transition again. Notice the slight delay before the main device starts to transition? I’m finding that a delay of 200 milliseconds or so helps sell these types of page transitions. Without it, the motion starts as soon as the page loads, and feels like it gets lost in the surrounding page changes. This isn’t a one-size-fits all setting, and I’m not yet convinced I have the timing right on all the pages. It’s something I’ll keep tweaking.

The first thing I tried to create the delay, was `animation-delay`. I found out quick that it could work, but would require more effort to use while also respecting our `prefers-reduced-motion` media query. The reason for that is we would have to apply the “off-screen” styles to the snapshot element along with the animation to make sure the snapshot isn’t visible during the delay. I tried a few different approaches with `animation-delay`, but I couldn’t make it work. Things just got...weird with it. So, I tried a different approach.

Notice the `0%,50%` and `0%,75%` in the keyframes. Those delay property interpolation until 50% and 75% of the animation duration, respectively. That way, at the start of the animation, the elments are invisible because they have their `opacity` set to `0`. We couple that with the duration of the animations, `0.5s` and `0.9s`. I write those as seconds in CSS, but here, easier to say `200ms` and `900ms`. So that means from `0ms to 100ms` or 50% of the total duration, and `0ms to 675ms` or 75% of the total duration, the elements are invisible, off screen. It takes a bit of math to work those out, but it also doesn’t need to be exact. When I build these, I just feel out both the percentages and the durations until I find what works.

Next up, we’ll transition the three smaller app details that sit above the main device. For each of these, we want them to do a fade with a bit of a float and scale up into place. Starting with the leaderboard.

<figure>
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/work-transitions-2.mp4" controls></video>
    <figcaption>fig 6: The leaderboard detail transitioning into place.</figcaption>
</figure>

We follow a similar pattern as with the previous elements. Again, in our `prefers-reduce-motion` media query we apply a keyframe animation to the new snapshot:

<pre><code class="language-css">@media (prefers-reduced-motion: no-preference) {
   ...
  ::view-transition-new(streetcred-graphic-board) {
    animation: graphicDetail var(--duration, 1.2s) ease;
  }
}</code></pre>

Notice this time we’re using a custom property, `--duration`, to set the animation duration. We’ll take advantage of that for later elements. Then, the `graphicDetails` animation is:

<pre><code class="language-css">@keyframes graphicDetail {
  0%,
  80% {
    opacity: 0;
    transform: scale(0.5) translateY(180px);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}</code></pre>

Again, we’re using the `0%,80` timing trick. The property changes get our fade in, scale, and float up into place. Notice the order. The element starts scaled and translated down, then transitions to normal scale and translation. Here’s a tangent about how I think about these types of animations. Imagine you have a bowling ball attached to a rope that’s tied to a rafter in the ceiling. Then the bowling ball is hoisted up to the ceiling while keeping the rope taut and the ball is fastend to the ceiling with another piece of rope. That’s the `0% to 80%` position of the animation. To start the animation, we cut the second piece of rope that had the ball secured to the ceiling, allowing the bowling ball to swing down until comes to a resting or, `100%`, position.

From here, we can transition the other two app details. They’re similar to the leaderboard, so we can reuse the `graphicDetail`.

<figure>
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/work-transitions-3.mp4" controls></video>
    <figcaption>fig 7: The POI and cubes details transitioning into place.</figcaption>
</figure>

Notice they don’t all transition in at the same time, and they don’t wait for each other to finish before starting. That helps sell it. We want that slight overlap in timing to make the compisition more interesting. To do that, we apply the same `graphicDetail` animation to the POI and cubes details, but we customize the `--duration` custom property.

<pre><code class="language-css">@media (prefers-reduced-motion: no-preference) {
   ...
  ::view-transition-new(streetcred-graphic-board),
  ::view-transition-new(streetcred-graphic-poi),
  ::view-transition-new(streetcred-graphic-cubes) {
    animation: graphicDetail var(--duration, 1.2s) ease;
  }
  ::view-transition-new(streetcred-graphic-poi) {
    --duration: 1.4s;
  }
  ::view-transition-new(streetcred-graphic-cubes) {
    --duration: 1.6s;
  }
}</code></pre>

Since we’re using the same `0%,80%` stops on the `graphicDetail` keyframes, setting a different duration on each snapshot causes them to start and end at different times.

The last element we need to transition is the StreetCred title. It’s the ending, the “ta-da!”, like a movie trailer or teaser, tie a bow on the whole thing with the name.

<figure>
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/work-transitions-4.mp4" controls></video>
    <figcaption>fig 8: The title transitioning into place.</figcaption>
</figure>

This follows the same patterns as the other elements. Apply an animation with our timing trick to the new snapshot, set the properties we want to transition, and watch it go. It doesn’t wait for the three detail elements to complete. It starts transitioning in the final milliseconds of the last one, with a light whisping into place to complete the composition.

## The other pages

The other project pages and the about page follow the same patterns. They’re less complex, but all have multiple elements that transition in to make an interesting composition.

<figure>
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/work-transitions-5.mp4" controls></video>
    <figcaption>fig 9: The Limbo project hero transition</figcaption>
</figure>

The speed and duration of each transition is meant to reflect to overall tone of the project. The Groundwork is notably less snappy than the others to give it a bit of an airy, “ahhhh”-choir feel.

<figure>
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/work-transitions-6.mp4" controls></video>
    <figcaption>fig 10: The Groundwork project hero transition</figcaption>
</figure>

<figure>
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/work-transitions-7.mp4" controls></video>
    <figcaption>fig 11: The Building OS X Apps with JavaScript project hero transition</figcaption>
</figure>

<figure>
  <video src="https://stuff.tylergaw.com/post-complex-view-transitions/work-transitions-8.mp4" controls></video>
    <figcaption>fig 12: The about page hero transition</figcaption>
</figure>

Worth mentioning again that this is just CSS with a touch of HTML. Also worth pointing out that very little of this is specific to CSS view transitions. 90% of this is CSS keyframes coupled with principles of good animation.
