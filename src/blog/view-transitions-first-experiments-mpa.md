---
tags: post
layout: "layouts/article.njk"
title: "First Experiments with View Transitions for Multi-page Apps"
date: "2023-05-26"
highlightSyntax: true
meta:
  description: Iterating colormix.style beyond an MVP.
  card: summary
  image: /blog/assets/post-image-colormix-refresh-social.png
---

Like a lot of other people right now, I'm excited about the in-development [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). I'm extra excited about using it without JavaScript for multi-page sites. [Dave's excellent post](https://daverupert.com/2023/05/getting-started-view-transitions/) got me set up with the basics. I've spent the last day or so experimenting, playing, and learning as much about the topic as I can.

As I'm learning, I'm putting together a [repo of example transitions](https://github.com/tylergaw/mpa-view-transitions-sandbox) and a [site with the live examples](https://mpa-view-transitions-sandbox.netlify.app/).

<p class="note-special">
  <strong>Note:</strong> At the time of this post, view transitions are still very much a work in progress. That means browser support is limited. Examples may not work for you or might break. To use in Chrome or Arc, enable two feature flags:
  <code>chrome://flags#view-transition</code> and <code>chrome://flags#view-transition-on-navigation</code>
</p>

## What am I learning?

If you're looking for an intro to view transitions or details on initial setup, see [Dave's post](https://daverupert.com/2023/05/getting-started-view-transitions/) and [Jeremy's post](https://adactio.com/journal/20195). I'm assuming some prior knowledge with this post. What I'll share here are the “ah-ha!” or “that's interesting” moments. Things that I could only discover by getting in and playing around with different use cases. For new features like this you have to get your hands on it to get a feel for what you can do.

### You can scope transition selectors

Pseudo-elements are the CSS hook to customize transitions. There are five of them in a tree structure:

<figure>
<pre><code class="language-css">::view-transition
└─ ::view-transition-group()
   └─ ::view-transition-image-pair()
      ├─ ::view-transition-old()
      └─ ::view-transition-new()</code></pre>
  <figcaption>fig 1: Source <a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API#the_view_transition_process">developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API#the_view_transition_process</a></figcaption>
</figure>

Browsers generate this set of elements for the root and all named view transitions. I haven't done anything with `::view-transition-group` or `::view-transition-image-pair` yet so I can't speak to what's possible with them. So far, I've used `::view-transition-old` and `::view-transition-new`. From the MDN docs:

> `::view-transition-old` is the screenshot of the old page view, and `::view-transition-new` is the live representation of the new page view.

In examples, I'd only seen those selectors used by themselves like:

<pre><code class="language-css">::view-transition-old(root),
::view-transition-new(root) {/*...*/}</code></pre>

I wondered, "can I scope these further?". Turns out, yes, I can. You can use any id, class, or other valid attribute selector for more specific targeting. This was an “ah-ha!”. I guess it shouldn't have been. These are standard pseudo elements like `::before` or `::after`. Something about new additions to CSS that gives them a bit of mysterious vibe to me. Takes me a bit to realize I can work with them in familiar, standard ways.

So, why is scoping cool? In short, you can use scoping to have unique transitions. Could be unique per-page, per-project, per-brand, and so on. Unique transitions per-page was the first one I tried.

For this example, I wanted each of four pages to all slide in and out of the screen from a different direction. From right to left, bottom to top, left to right, and top to bottom. You can see a live example at [mpa-view-transitions-sandbox.netlify.app/unique-page-slide/](https://mpa-view-transitions-sandbox.netlify.app/unique-page-slide/). If you haven't enabled the feature flags to see that, here's a video:

<figure>
<video src="https://p197.p4.n0.cdn.getcloudapp.com/items/JruejBeP/b38a000f-102d-4147-a0c5-34e311fc2043.mp4?source=viewer&v=80324ae5755f4a11b3e1c97f989e499a" controls></video>
  <figcaption>fig 2: Live example available <a href="https://mpa-view-transitions-sandbox.netlify.app/unique-page-slide/">mpa-view-transitions-sandbox.netlify.app/unique-page-slide</a></figcaption>
</figure>

This is a toy example, but it shows how powerful scoping transitions can be. Let's look at the HTML and CSS to make this happen. The [full code](https://github.com/tylergaw/mpa-view-transitions-sandbox/tree/main/unique-page-slide) is on Github.

After initial setup of adding the transitions `meta` tag to every page `<meta name="view-transition" content="same-origin" />`, we need an attribute to use for scoping.

<pre><code class="language-html">&lt;html data-page="home"&gt;...&lt;/html&gt;
&lt;html data-page="one"&gt;...&lt;/html&gt;
&lt;html data-page="two"&gt;...&lt;/html&gt;
&lt;html data-page="three"&gt;...&lt;/html&gt;</code></pre>

This doesn't have to be a data attribute, only my preference. Could be a class or id or any other attribute. These will use the `root` transition, so the attribute does need to be on the `html`, or root, element.

With the data attributes in place, we can use them in CSS to scope our `-old` and `-new` pseudo elements for each page:

<pre><code class="language-css">[data-page="home"]::view-transition-old(root) {...}
[data-page="home"]::view-transition-new(root) {...}
[data-page="one"]::view-transition-old(root) {...}
[data-page="one"]::view-transition-new(root) {...}
/* ...and so on for the other pages */</code></pre>

This lets us customize the transition in and out for every page. Let's look at Page 1. When we navigate to Page 1, we want to see the entire page slide in from the bottom to the top. We target the `-new` element for this:

<pre><code class="language-css">[data-page="one"]::view-transition-new(root) {
  animation: slideUp 0.3s;
}</code></pre>

`slideUp` is a `@keyframes` declaration that starts the page off the screen to the bottom and then animates it to the top:

<pre><code class="language-css">@keyframes slideUp {
  from { transform: translateY(100vh) }
  to { transform: translateY(0) }
}</code></pre>

When we navigate away from Page 1, we want to see it continue on its path by sliding out to the top. We target the `-old` element for this:

<pre><code class="language-css">[data-page="one"]::view-transition-old(root) {
  animation: slideOutUp 0.3s;
}</code></pre>

Again, `slideOutUp` is a `@keyframes` declaration. I'll leave the code out for brevity. The [full stylesheet](https://github.com/tylergaw/mpa-view-transitions-sandbox/blob/main/unique-page-slide/unique-page-slide.css) is on Github.

We follow this same pattern for the other pages. For each, we set a custom animation on the `view-transition-new` and `view-transition-old` pseudo elements. The animations use a different `transform` and different values to get the transition we're after.

Scoping isn't limited to the `root` transition. The same concept works for named transitions. I don't have a working example, but lets say we have a content element on each page that we want to transition. The transition is the same on most pages, but we have certain ones we want a different transition. It might look something like this:

<pre><code class="language-css">::view-transition-new(content) {
  animation: standard 0.2s;
}

.special-page::view-transition-new(content) {
  animation: special 0.4s;
}</code></pre>

I haven't explored scoping named transitions much yet, but it feels like it opens up a lot of possibilities.

---

- Can transition to an element with a named transition that isn't on the previous page
- Sequencing is tricky
  - animation-delay doesn't quite work because
  - but you can use keyframes percentages to delay animation
