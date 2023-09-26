---
tags: post
layout: "layouts/article.njk"
title: "The Native Node Test Runner is Great"
date: "2023-09-26"
highlightSyntax: true
meta:
  description: The one where Tyler is probably more excited than he should be about the node test runner
  image: /blog/assets/post-image-node-test-runner.jpg
---

<b>TL;DR:</b> There’s a [native test runner in node](https://nodejs.org/docs/latest-v20.x/api/test.html). It’s great. You should use it on your next project.

Things like this just feel good. Any time you can switch from using an external dependency to something built-in feels like taking off heavy winter boots. If you haven’t used it yet, node’s [native test runner in node](https://nodejs.org/docs/latest-v20.x/api/test.html) is excellent. It’s available in node verions `16.17+`, `18+`, and `20+`. I’ve been using it on a couple small projects recently and so far it’s done everything I need a test runner to do and just feels right.

I set up a [demo repo](https://github.com/tylergaw/node-test-runner-demo) to show how I’m using it. There’s not much there, and that’s the point. I have two scripts in `package.json`:

<pre><code class="language-bash">"test": "node --test",
"test:watch": "node --test --watch ."
</code></pre>

In `add.js` I have a single function that requires two arguments.

<pre><code class="language-javascript">export default function add(a, b) {
  if (!a || !b) {
    throw Error("The add function requires 2 arguments");
  }

  return a + b;
}</code></pre>

Then in `add.test.js` I import a few native modules and write tests like normal:

<pre><code class="language-javascript">import { describe, it } from "node:test";
import assert from "node:assert/strict";
import add from "./add.js";

describe("The add function", () => {
  it("#add throws without two arguments", () => {
    assert.throws(() => {
      add();
    }, Error);

    assert.throws(() => {
      add(2);
    }, Error);
  });

  it("#add returns the expected result", () => {
    assert.equal(add(5, 4), 9);
  });
});</code></pre>

I use the strict assert. Which is `===` instead of `==`. That’s not a requirement, just a preference.

For one off tests and for a CI, I run `npm test`. When I’m working locally I keep `npm test:watch` running. The docs for the [runner](https://nodejs.org/docs/latest-v20.x/api/test.html) and for [assert](https://nodejs.org/api/assert.html) are clutch.

This just feels light and correct and I think it’s great. That’s all.
