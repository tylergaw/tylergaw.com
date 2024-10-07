---
tags: post
layout: "layouts/article.njk"
title: "CSS View Transition At-Rule"
date: "2024-10-06"
highlightSyntax: true
meta:
  description: Updates to MPA view transitions and the at-rule
  card: summary
  image: /images/social-summary.png
---

Last year [I wrote](https://tylergaw.com/blog/view-transitions-first-experiments-mpa/) about [MPA view transitions](https://tylergaw.com/blog/complex-mpa-view-transitions/). Since then, the spec has been expanded and browser support has improved slightly.

## The @view-transition at-rule

[`@view-transitions`](https://developer.mozilla.org/en-US/docs/Web/CSS/@view-transition) is a new transitions-related at-rule. For multi-page transitions it’s required. This is a breaking change to existing multi-page transitions. Any site, include this one, that had existing multi-page transitions no longer work without `@view-transition`.

In section 2.1.1. “Activation” of [CSS View Transitions Module Level 2](https://www.w3.org/TR/css-view-transitions-2/#activating-cross-document-view-transition) (emphasis added)

> In cross-document view transition, what triggers a view transition is a navigation between two documents, as long as the following conditions are met:
>
> - Both documents are of the same origin;
> - The page is visible throughout the entire course of the navigatiion;
> - the navigation is initiated by the page, e.g. by clicking a link or submitting a form, or is a traverse navigation (back/forward). This excludes, for example, navigations initiated by the URL bar;
> - the navigation didn’t include cross-origin redirects; and
> - **both documents opted in to cross-document view transitions, using the @view-transition rule.**

This is a small change. For both pages, this rule needs to be in the CSS:

<pre><code class="language-css">@view-transition {
  navigation: auto;
}</code></pre>

Right now, the value of `navigation` can be `auto` or `none`. Unclear if the possible values will change in the future, but it’s possible. The spec mentions that `@view-transition` can be nested inside other at-rules like `@media` or `@supports`. I haven’t tried this yet, but that could be a good way to only enable or disable transitions under certain conditions. For example, we could default to not having transitions and only enable them if the user has not opted for reduced-motion:

<pre><code class="language-css">/* Default to no transitions, (you could also just leave this rule out) */
@view-transition {
  navigation: none;
}
/* If no preference for reduced motion, enable transitions */
@media (prefers-reduced-motion: no-preference) {
  @view-transition {
    navigation: auto;
  }
}</code></pre>

This is likely preferable to putting a bunch of view transition pseudo selectors in `@media (prefers-reduced-motion: no-preference)` blocks like I’m [currently doing](https://tylergaw.com/blog/complex-mpa-view-transitions/).

## Browser Support Improvements

Previously, two feature flags were required in Chrome/Arc to enable multi-page transitions. `chrome://flags#view-transition` and `chrome://flags#view-transition-on-navigation`. It seems `view-transition` has been removed. I don’t have details on why or when, but it doesn’t show up anymore. `view-transition-on-navigation` now defaults to being on, so if you’re in Chrome, transitions should just work.

Overall support is still limited. In my testing these still only work in Chrome and Arc. No Firefox or Safari. I did get [an issue](https://github.com/tylergaw/mpa-view-transitions-sandbox/issues/2) about my transitions demos being broken that said transitions work in Safari Tech Preview 18, but I haven’t tested there yet.

Great to see these features moving forward. I’m keeping the [sandbox](https://github.com/tylergaw/mpa-view-transitions-sandbox) up to date. Thanks to folks that emailed and created an issue there about things being broken. Keep those coming.
