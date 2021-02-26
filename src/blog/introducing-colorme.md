---
tags: post
layout: "layouts/article.njk"
highlightSyntax: true
title: "Introducing: ColorMe"
date: "2017-01-05"
meta:
  description: ColorMe allows you to visualize The CSS Color Function.
  image: /articles/assets/post-image-colorme-social.png
---

<p class="entry-intro">
  <a href="https://colorme.io">ColorMe</a> is a site I built to make working with the <a href="https://drafts.csswg.org/css-color/#modifying-colors">CSS Color Function</a> easier. It provides a UI for applying adjusters to a base color and gives a visual of the adjustments. The excellent <a href="http://jim-nielsen.com/sassme/" target="_blank">SassMe</a> was my inspiration.
</p>

<p>
  The Color Function is a CSS feature in editor's draft stage of specification. This means it will be a while before it lands in any browser. That doesn't mean you can't use the proposed syntax today though. You can use the <a href="https://github.com/postcss/postcss-color-function">color function</a> PostCSS plugin. That plugin is also included in <a href="http://cssnext.io/features/#color-function">cssnext</a> if you want access to more future-facing CSS. The plugin uses the <a href="https://github.com/ianstormtaylor/css-color-function">css-color-function</a> package for its parsing and converting.
</p>
<p>
  I <a href="https://tylergaw.com/articles/sass-to-postcss">wrote</a> about switching this site to PostCSS. That was my first encounter with the color function. After years of using color transform functions in Sass it's easy to see how powerful a native CSS color function will be.
</p>
<p>
  There are more detailed <a href="https://topaxi.codes/modifying-css-colors-with-the-color-function/"> articles</a> about the color function. I'll give a brief overview of it here. On its own, <code>color</code> doesn't do anything with the given base color:
</p>
<pre><code class="language-css">color(#ea3333) /* output is the same as input */</code></pre>
<p>
  The power of the function is in adjusters. These are transformations applied to the base color. The current draft spec lists 15 available adjusters; <code>alpha</code>, <code>rgb</code>, <code>red</code>, <code>green</code>, <code>blue</code>, <code>hue</code>, <code>saturation</code>, <code>lightness</code>, <code>whiteness</code>, <code>blackness</code>, <code>tint</code>, <code>shade</code>, <code>blend</code>, <code>blenda</code>, and <code>contrast</code>.
</p>
<p>
  The <code>color</code> function allows you to apply one or more adjusters to the given base color:
</p>
<pre><code class="language-css">color(#ea3333 alpha(90%) saturation(75%) shade(20%)) /* rgba(182, 47, 47, 0.9) */</code></pre>
<p>
  Many of the adjusters also have short names:
</p>
<pre><code class="language-css">color(#ea3333 a(90%) s(75%) shade(20%)) /* rgba(182, 47, 47, 0.9) */</code></pre>
<p>
  Like Sass, using the CSS Color Function in code can be difficult visualize. Colors are easier to work with when you can see them. That's why SassMe is so darn useful. And that's why I thought we needed the same for CSS.
</p>
<figure>
  <a href="https://colorme.io">
    <img src="https://tylergaw.com/articles/assets/post-image-colorme-screenshot-1.png" alt="A screenshot of colorme.io" />
  </a>
  <figcaption>
   This is <a href="https://colorme.io">ColorMe.io</a>
  </figcation>
</figure>

<h2>Building It</h2>
<p>
  ColorMe is a React app. I used the wonderful <a href="https://github.com/facebookincubator/create-react-app">create-react-app</a> to get started.
</p>
<p>
  Before getting any UI in place I needed to see a first thing work. I needed to convert color function strings to rgb(a) strings. For that I used the <code>css-color-function</code> package. I started by importing the package and logging results of its use:
</p>
<pre><code class="language-js">import colorFn from 'css-color-function';
console.log(colorFn.convert('color(red alpha(50%))')); // rgba(255, 0, 0, 0.5)</code></pre>
<p>
  No major breakthrough, but that's how I get myself going. Just get one win no matter how small. From there it was a matter of building up functionality piece by piece.
</p>
<p>
  The workhorse of the project is the <a href="https://github.com/tylergaw/colorme/blob/2017-01-05T17.19.10/src/utils/color.js">color utils</a>. All color calculations happen there. When you enter a base color, the app <a href="https://github.com/tylergaw/colorme/blob/2017-01-05T17.19.10/src/utils/color.js#L10">breaks it apart</a> into individual color properties. Those properties are initial values for the adjusters. I used <a href="https://github.com/Qix-/color">this color package</a> to parse the base color string.
</p>
<p>
  Because the color utils do so much I took the time to write <a href="https://github.com/tylergaw/colorme/blob/develop/src/utils/__tests__/color.test.js">decent test coverage</a>. Writing tests isn't something I jump at doing (<i>read as: I get distracted, just wanna draw pictures, or go outside, or anything else. Please don't make me write tests!</i>). But it felt necessary for this and did save me a few headaches during refactoring.
</p>

<h2>Deploying It</h2>
<p>
  When I'm ready to release updates to ColorMe I run <code>npm run release</code>. That command creates a new Git tag and pushes it to GitHub. Travis then runs the tests. When Travis sees the build is for a tag it executes <a href="https://github.com/tylergaw/colorme/blob/2017-01-03T23.50.13/scripts/deploy.sh">deploy.sh</a>. That script does a production-ready build with <code>npm run build</code> and then syncs the artifacts to AWS S3. This is a similar build process that I wrote about in more detail in <a href="https://tylergaw.com/articles/rewriting-day-player-for-sketch-40">“Rewriting Day Player for Sketch 40+”</a>.
</p>

<h2>Try it out</h2>
<p>
  It's still early days for the CSS Color Function. It's a promising feature with momentum behind it. My hope is that more folks will start using it and giving feedback. We'll see the spec continue to evolve and sooner or later get implemented by browsers.
</p>
<p>
  Take <a href="https://colorme.io">ColorMe</a> for a spin. If you find bugs or have ideas, feel free to add <a href="https://github.com/tylergaw/colorme/issues">issues</a>.
</p>
