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

Like a lot of other folks right now, I'm excited about the in-development [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). I'm extra excited about using it without JavaScript for multi-page apps/sites. [Dave's excellent post](https://daverupert.com/2023/05/getting-started-view-transitions/) got me set up with the basics. I've spent the last day or so experimenting, playing, and learning as much about the topic as I can.

As I'm learning, I'm putting together a [repo of example transitions](https://github.com/tylergaw/mpa-view-transitions-sandbox) and a [site with the live examples](https://mpa-view-transitions-sandbox.netlify.app/).

<p class="note-special">
  <strong>Note:</strong> At the time of this post, view transitions are still very much a work in progress. That means examples may not work for you or will break. You also have to enable two feature flags in Chrome and Arc
  `chrome://flags#view-transition` and `chrome://flags#view-transition-on-navigation`
</p>

## What am I learning?

If you're looking for details on initial setup, see [Dave's post](https://daverupert.com/2023/05/getting-started-view-transitions/) and [Jeremy's post](https://adactio.com/journal/20195). What I'll share here are the “ah-ha!” or “that's interesting” moments. Things that I could only get to by getting in and playing around with different use cases. For new features like this you have to get your hands on it to get a feel for what you can do.

### You can scope transition selectors

You can customize view transitions using CSS by targeting pseudo-elements. There are five of them in a tree structure:

<figure>
<pre><code class="language-css">::view-transition
└─ ::view-transition-group()
   └─ ::view-transition-image-pair()
      ├─ ::view-transition-old()
      └─ ::view-transition-new()</code></pre>
  <figcaption>fig 1: Source <a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API#the_view_transition_process">developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API#the_view_transition_process</a></figcaption>
</figure>

I haven't done anything with `::view-transition-group` or `::view-transition-image-pair` yet so I can't speak to what's possible with them. So far, `::view-transition-old` and `::view-transition-new` have been my work horses. From the MDN docs:

> `::view-transition-old` is the screenshot of the old page view, and `::view-transition-new` is the live representation of the new page view.

In examples, I'd only seen those selectors used by themselves like:

<pre><code class="language-css">::view-transition-old(root),
::view-transition-new(root) {/*...*/}</code></pre>

I wondered, "Can I scope these further?". Yes, you can. You can use any id, class, or other valid attribute selector for more specific targeting. This was an “ah-ha!”. I guess it shouldn't have been. These are standard pseudo elements like `::before` or `::after`. Something about new additions to CSS that gives them a bit of mysterious vibe to me. Takes me a bit to realize I can work with them in familiar ways.

So, why is scoping cool? You can use scoping to have unique transitions. Could be unique per-page, per-project, per-brand, and so on. Unique transitions per-page was the first one I've played with.

For this example, I wanted each of four pages to all slide in and out of the screen from a different direction. From right to left, bottom to top, left to right, and top to bottom. A live example is at [mpa-view-transitions-sandbox.netlify.app/unique-page-slide/](https://mpa-view-transitions-sandbox.netlify.app/unique-page-slide/). If you haven't enabled the feature flags to see that, here's a video:

<figure>
<video src="https://p197.p4.n0.cdn.getcloudapp.com/items/JruejBeP/b38a000f-102d-4147-a0c5-34e311fc2043.mp4?source=viewer&v=80324ae5755f4a11b3e1c97f989e499a" controls></video>
  <figcaption>fig 2: Live example available <a href="https://mpa-view-transitions-sandbox.netlify.app/unique-page-slide/">mpa-view-transitions-sandbox.netlify.app/unique-page-slide</a></figcaption>
</figure>

This is a toy example, but it shows how powerful scoping transitions can be. Let's look at the HTML and CSS to make this happen. The [full code](https://github.com/tylergaw/mpa-view-transitions-sandbox/tree/main/unique-page-slide) for is on Github.

After initial setup of adding the transitions `meta` tag to every page, we need an attribute to use for scoping.

<pre><code class="language-html">&lt;html data-page="home"&gt;...&lt;/html&gt;
&lt;html data-page="one"&gt;...&lt;/html&gt;
&lt;html data-page="two"&gt;...&lt;/html&gt;
&lt;html data-page="three"&gt;...&lt;/html&gt;</code></pre>

This doesn't have to be a data attribute. Could be a class or id or any other attribute. These will use the `root` transition, so the attribute does need to be on the `html`, or root, element.

With the data attribute in place, we can use it to scope our `-old` and `-new` pseudo elements for each page:

<pre><code class="language-css">[data-page="home"]::view-transition-old(root) {...}
[data-page="home"]::view-transition-new(root) {...}
[data-page="one"]::view-transition-old(root) {...}
[data-page="one"]::view-transition-new(root) {...}
/* And so on for the other pages */</code></pre>

What that let's use do is customize the transition for in and out for every page. For page one, we want to see the page slide in from the bottom to the top:

<pre><code class="language-css">[data-page="one"]::view-transition-new(root) {
  animation: slideUp 0.3s;
}</code></pre>

`slideUp` is a `@keyframes` declaration that starts the page off the screen to the bottom and then animates it to the top:

<pre><code class="language-css">@keyframes slideUp {
  from { transform: translateY(100vh) }
  to { transform: translateY(0) }
}</code></pre>

---

- That's not just for root selectors. Can scope any named view transition
- Can transition to an element with a named transition that isn't on the previous page
- Sequencing is tricky
  - animation-delay doesn't quite work because
  - but you can use keyframes percentages to delay animation
