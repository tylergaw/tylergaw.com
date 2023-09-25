---
tags: post
layout: "layouts/article.njk"
title: "CSS Trig Functions, CSS Typed OM, and Pulling on Threads"
date: "2023-09-25"
meta:
  description: The one where Tyler tries to parse trig functions but ends down the typed OM rabbit hole
  image: /blog/assets/post-image-css-type-om-social.jpg
---

<b>TL;DR:</b> I’m contributing to a [CSS Typed OM polyfill](https://github.com/tylergaw/css-typed-om) for browsers (and maybe jsdom).

It started off like it usually does; I had an idea. Dangerous, I know. I’d been learning about, tinkering with [CSS Trig functions](https://web.dev/css-trig-functions/). They’re very cool. Seems like there’s a lot of potential uses for them. My problem, though, is I can’t visualize them. I can put them in CSS and see the effect they have, but I have trouble being deliberate about the values I pass to them because I’m not sure what the result will be.

Take `cos(25deg)` for example. I know that will return a number between -1 and 1. But what number? The last time I used `cos`, `sin`, `tan`, et al was in my high school trig class over 20 years ago. I can’t picture it, so I need a way to actually see the result.

The idea is small. I want a tool where I can plop in any CSS trig function; `cos(25deg)`, `sin(pi / 5)`, `tan(0.125turn)`, etc. and see the number it produces. `0.9063077870366499`, `0.5877852522924731`, `0.9999999999999999`, and so on. Going further, I want the calculations to run exactly how CSS runs them. So, not a JavaScript approximation like `Math.cos`, `Math.sin`, `Math.tan`, etc. (I realize under the hood these might be similar or the same, but still)

Why a different tool, why not just apply functions to CSS properties and then use the inspector to see the value? Because you can’t see the exact value of just the trig function. You can do something like `width: calc(1px * cos(25deg))` then check the `width` value in the devtools computed styles panel and get close, but not exact. Also, `width: cos(25deg)` is invalid CSS and using a custom prop like `--v: cos(25deg)` doesn’t really work either because the custom prop value is stored as `cos(25deg)`. I want/need something else.

I started working on this. And by “started working” I mean I spent a half hour finding a domain name for this non-existent tool. At some point this thing might be at `https://cssfunctions.style`. Then, I actually built a rough proof of concept. It’s on [CodePen](https://codepen.io/tylergaw/pen/QWzdrWN?editors=1010) at the moment. Right now, it only handles a few trig functions, but it’s enough that it’s possible and what else I need to do to get it working enough for what I need. So, success? Sorta.

## CSS Typed OM

The key bit of code in the POC is `CSSStyleValue.parse`. That’s a feature of the [CSS Typed Object Model API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Typed_OM_API). A not new, but not very familiar Web API. At the time of this post, CSS Typed OM is implemented in Chrome, Edge, Safari, and Opera. But, not implemented at all in Firefox. Looking at the [Bugzilla ticket](https://bugzilla.mozilla.org/show_bug.cgi?id=1278697), it doesn’t look like it will be implemented any time soon. The ticket was opened seven years ago and the only recent activity is it being marked as unassigned.

A search led me to a [typed OM polyfill](https://github.com/csstools/css-typed-om) built by [Jonathan Neal](https://jonneal.dev/). He does a ton of excellent work, so I knew it was legit. And it was, but it’s dated. The last work was done 2018. Pull requests from over three years ago are still open. Then there’s the [familiar GitHub issue asking “Is this dead?”](https://github.com/csstools/css-typed-om/issues/9). That issue was opened three years ago and the last comment, before mine two days ago, was in 2022. So, safe to say the project in it’s orginal state is stalled.\*

<p class="note-special"><b>* Note:</b> That’s not a knock against Jonathan or the current owner of the repo at all. This is common. You start a project, get busy with other more pressing things, and then just don’t have the time or energy to work on it or even follow up on issues or pull requests. Check my repos and you’ll see this exact thing.</p>

I started playing around with the polyfill just to see how close it was or wasn’t to the spec. The foundation is super solid. I don’t know what the spec was like in 2018, but it seems like Jonathan got a ton of what was around then in place. Then I had another dangerous thought, maybe I can continue work on it? The code is all JavaScript and organized very well. It would be easy to see which features exist and which don’t. And there’s patterns in place to follow so there wouldn’t be a “blank page” problem.

So, I forked the repo, picked a small unimplemented feature and started working on an implementation. And, it worked. Which is both good and bad. Good because I may be able to get the polyfill to a point where I can use it in my trig functions tool. Bad because I’m letting myself completely nerd out on it. Which leads me to the last part of this.

## Pullin’ threads

It’s rare that you start work on a project and work on just the project. There’s always other “stuff” that you have to get into. Sometimes it’s to fix underlying issues, sometimes to shave a yak or shed a bike. But, it’s rare–at least in my case—to have a project where I’m able to let myself pull any thread and keep pulling it. Right now, though, I’m lucky (from some angles) because I don’t have a full time job. So for this project, I get to pull the threads and do the work that follows. Since I have the time, and it’s super interesting, I'm full on nerding out on this one.

With that, I’m already deep into work on [my fork](https://github.com/tylergaw/css-typed-om) of the polyfill. My goal is to get it fully functional. Or close enough. It may not have or need everything in the spec, but there’s no reason it can’t be a useful tool for unsupported browsers and, I think, jsdom. I did some early jsdom testing and it seems like it will work. There are some CSS things that just can’t happen without a browser, but most of the features can work.

A big chunk of work so far was documenting [feature implementation status](https://github.com/tylergaw/css-typed-om#feature-implementation-status). There’s still work to be done there, but I need to have some type of roadmap. Other than that, I’m just picking off features and working on them. I’m having so much fun because I’m getting to try out new tools and use JavaScript in a way that I don’t normally. I’m also taking time to deep read on the [draft spec for typed OM](https://drafts.css-houdini.org/css-typed-om). Definitely not the easiest thing to follow and gives me an even greater appreciation for everyone that implements specs in browsers.

As always, I’ll make a fairweather attempt to write about some of the interesting things I get into here as I build out the polyfill and when I get back to the original CSS functions project.
