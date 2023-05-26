---
tags: post
layout: "layouts/article.njk"
title: "First Experiments with View Transitions for Multi-page Apps"
date: "2023-05-26"
highlightSyntax: true
meta:
  description: Experimenting and learning about view transitions for multi-page apps
  card: summary
  image: /images/social-summary.png
---

Like a lot of other people right now, I'm excited about the in-development [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). I'm extra excited about using it without JavaScript for multi-page apps (sites, whatever). [Dave's excellent post](https://daverupert.com/2023/05/getting-started-view-transitions/) got me set up with the basics. I've spent the last day or so experimenting, playing, and learning as much about the topic as I can.

As I'm learning, I'm putting together a [repo of example transitions](https://github.com/tylergaw/mpa-view-transitions-sandbox) and a [site with the live examples](https://mpa-view-transitions-sandbox.netlify.app/).

<p class="note-special">
  <strong>Note:</strong> At the time of this post, view transitions are still very much a work in progress. That means browser support is limited. Examples may not work for you or might break. To use in Chrome or Arc, enable two feature flags:
  <code>chrome://flags#view-transition</code> and <code>chrome://flags#view-transition-on-navigation</code>
</p>

## What am I learning?

If you're looking for an intro to view transitions or details on initial setup, see [Dave's post](https://daverupert.com/2023/05/getting-started-view-transitions/) and [Jeremy's post](https://adactio.com/journal/20195). I'm assuming some prior knowledge with this post. What I'll share here are the “ah-ha!” or “that's interesting” moments. Things that I could only discover by getting in and playing around with different use cases. For new features like this you have to get your hands on it to get a feel for what you can do.

### You can scope transition selectors

Pseudo-elements are the CSS hook to customize transitions. There are five of them in a tree structure. <a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API#the_view_transition_process">Source</a>.

<pre><code class="language-css">::view-transition
└─ ::view-transition-group()
   └─ ::view-transition-image-pair()
      ├─ ::view-transition-old()
      └─ ::view-transition-new()</code></pre>

Browsers generate this set of pseudo-elements for the root and all named view transitions. I haven't done anything with `::view-transition-group` or `::view-transition-image-pair` yet so I can't speak to what's possible with them. So far, I've used `::view-transition-old` and `::view-transition-new`.

From the MDN docs:

> `::view-transition-old` is the screenshot of the old page view, and `::view-transition-new` is the live representation of the new page view.

In examples, I'd only seen those selectors used by themselves like:

<pre><code class="language-css">::view-transition-old(root),
::view-transition-new(root) {/*...*/}</code></pre>

I wondered, “can these be scoped?”. Yeah they can. We can use any id, class, or other valid attribute selector for more specific scoping/targeting. This was an “ah-ha!” I guess it shouldn't have been. These are standard pseudo-elements, like `::before` or `::after`. Something about new additions to CSS gives them a bit of mysterious vibe to me. Takes me a bit to realize I can work with them in familiar, standard ways.

So, why is scoping cool? In short, you can use scoping to have unique transitions. Could be unique per-page, per-project, per-brand, and so on. Unique transitions per-page was the first one I tried.

For this example, I wanted each of four pages to all slide in and out of the screen from and to a different direction. From right to left, bottom to top, left to right, and top to bottom. You can see a live example at [mpa-view-transitions-sandbox.netlify.app/unique-page-slide/](https://mpa-view-transitions-sandbox.netlify.app/unique-page-slide/). If you haven't enabled the feature flags to see that, here's a video:

<figure>
<video src="https://p197.p4.n0.cdn.getcloudapp.com/items/JruejBeP/b38a000f-102d-4147-a0c5-34e311fc2043.mp4?source=viewer&v=80324ae5755f4a11b3e1c97f989e499a" controls></video>
  <figcaption>fig 1: Live example available <a href="https://mpa-view-transitions-sandbox.netlify.app/unique-page-slide/">mpa-view-transitions-sandbox.netlify.app/unique-page-slide</a></figcaption>
</figure>

This is a toy example, but it shows how powerful scoping transitions can be. Let's look at the HTML and CSS to make this happen. The [full code](https://github.com/tylergaw/mpa-view-transitions-sandbox/tree/main/unique-page-slide) is on Github.

After initial setup of adding the transitions `meta` tag to every page `<meta name="view-transition" content="same-origin" />`, we need an attribute to use for scoping.

<pre><code class="language-html">&lt;html data-page="home"&gt;...&lt;/html&gt;
&lt;html data-page="one"&gt;...&lt;/html&gt;
&lt;html data-page="two"&gt;...&lt;/html&gt;
&lt;html data-page="three"&gt;...&lt;/html&gt;</code></pre>

This doesn't have to be a data attribute, only my preference. Could be a class or id or any other attribute. These will use the `root` transition, so the attribute does need to be on the `html`, or root, element.

With the data attributes in place, we can use them in CSS to scope our `-old` and `-new` pseudo-elements for each page:

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

We follow this same pattern for the other pages. For each, we set a custom animation on the `view-transition-new` and `view-transition-old` pseudo-elements. The animations use a different `transform` and different values to get the transition we're after.

Scoping isn't limited to the `root` transition. The same concept works for named transitions. I don't have a working example, but lets say we have a content element on each page that we want to transition. The transition is the same on most pages, but we have certain ones we want a different transition. It might look something like this:

<pre><code class="language-css">::view-transition-new(content) {
  animation: standard 0.2s;
}

.special-page::view-transition-new(content) {
  animation: special 0.4s;
}</code></pre>

I haven't explored scoping named transitions much yet, but it feels like it opens up a lot of possibilities.

### Elements don't have to be on both pages to transition

This is a “that's interesting”. Also maybe a “duh” in hindsight, but took me a bit to figure out. To get an element to transition or “morph” between two pages, you give that element a transition name:

<pre><code class="language-html">&lt;div style="view-transition-name: content" /&gt;</code></pre>

If an element with that name is present on both the current page and the page you’re navigating to, the element will morph between the elements’ shape, size, color, etc. I thought this was the only way to transition elements. To have the element be on both pages and morph. That's not the case. You can transition an element in and out that only exists on the page you're navigating.

This is a little tough to explain in words, [here's an example](https://mpa-view-transitions-sandbox.netlify.app/grid-item-view/). And again, a video in case these aren't working for you yet.

<figure>
<video src="https://p197.p4.n0.cdn.getcloudapp.com/items/ApugQ4b1/69486edd-3fd5-4398-b8a2-9115f14837d4.mp4?source=viewer&v=401646be1fbea0cbcdf5bdbb8641d9a6" controls></video>
  <figcaption>fig 2: Live example available <a href="https://mpa-view-transitions-sandbox.netlify.app/unique-page-slide/">mpa-view-transitions-sandbox.netlify.app/grid-item-view</a></figcaption>
</figure>

The title, description, and graphic for each item exists on both the list and single item page. So, those elements morph between each page. The “All items” button is only on the single item pages. But, we're still able to give it a transition name and, in this case, a custom animation. A custom animation isn't required, but you likely don't want the default for something like this.

To do this, we set a `view-transition-name` in the HTML. This is a normal CSS property, so we could also set this on the `small` element in CSS. I just chose inline because I wasn't applying any other styles to it.

<pre><code class="language-html">&lt;small style="view-transition-name: all-items-link"&gt;
  &lt;a href="./"&gt;&lt; All items&lt;/a&gt;
&lt;/small&gt;</code></pre>

Then, in the CSS, we create a custom animation and apply it to our `-new` element for the transition name:

<pre><code class="language-css">::view-transition-new(all-items-link) {
  animation: itemsLinkIn 0.3s;
}</code></pre>

This gives a lot of control over how elements transition or, as I think about it, how they enter and exit the stage. [Full code](https://github.com/tylergaw/mpa-view-transitions-sandbox/tree/main/grid-item-view) for this example on Github.

## What’s next?

It’s early days for this. I only have a few hours of tinkering so far. It’s already clear just how powerful these can be and how well designed a spec and feature it is. A couple oddities aside, things just kind of work as expected.

Building these [isolated examples](https://mpa-view-transitions-sandbox.netlify.app/) is helpful to get the feel of things, and good for sharing what’s possible. But what will really open this up is to have specific design choices to go after. Meaning, having pages designed with transitions in mind and then trying to execute on those designs. You can only learn so much with contrived examples.

I’ve started exploring ideas on this site. I have a lot of detailed layouts and graphics thoughout. I’m working on designing transitions that aren’t just standard fades and wipes per page, but ones tailored to the contents of individual pages. I don’t have anything live yet, but this video shows some of the early ideas I've been playing with. Nothing sticking so far, I'm doing kinda out-there, garish things right now to stress test and see what works and what doesn’t.

<figure>
  <video src="https://p197.p4.n0.cdn.getcloudapp.com/items/2NupJ4mG/66ea8402-dd8b-460b-b3da-6fc7aba4f2b2.mp4?source=viewer&v=4f8a9c5dd92462027ef492faac87f7d9" controls></video>
  <figcaption>fig 3: Early transition design exploration on tylergaw.com</figcaption>
</figure>

It’s easy to see how far we can push this. And all of this is with <strong>HTML and CSS, no JavaScript</strong>. As with all design elements, it will take restraint to design compelling transitions that aren’t annoying. I’m certain we’ll go too far and have to reel it back it. So it goes.

Lastly, this is all additive. With every new web technology, we get the chorus of; “Yeah, but when will it be supported?” Today, it’s supported today in some browsers, but not all. If you look at any of the examples on a browser that does not support them, the pages still function just fine. The transitions are an extra that’s layered on top if and when your browser supports them. Another concrete example of progressive enhancement in practice.
