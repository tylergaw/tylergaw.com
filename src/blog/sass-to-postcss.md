---
tags: post
layout: "layouts/article.njk"
highlightSyntax: true
title: "From Sass to PostCSS"
date: "2016-12-28"
meta:
  description: Making the switch from the long time go-to Sass, to a new PostCSS/cssnext styling setup.
---

<p class="entry-intro">
  Sass has been my go-to for years. But for a while now, I've wanted to try a new styling setup with PostCSS and the cssnext plugin. I love the idea of writing future CSS syntax today and using tooling more aligned with other tools I'm used to. This personal site is a perfect test bed to try this new setup.
</p>
<p>
  The first step I took was an inventory of my Sass usage. I needed to know what features I was using to make sure I found a replacement in the new setup. Here's a list of what I was using on this project:
</p>
<ul>
  <li>partial imports</li>
  <li>variables</li>
  <li>nesting</li>
  <li>mixins</li>
  <li>extend</li>
  <li>placeholder classes</li>
  <li><code>darken</code> and <code>rgba</code> color functions</li>
  <li>compression</li>
</ul>

<h2>Preparing</h2>
<p>
  Before getting to new syntax or other fun I needed to do some yak shaving. The project was using a file structure typical for Sass usage. I used the leading underscore naming convention for partials. And included the required <code>scss</code> extension. I used two directories to loosely organize Sass files. <code>modules</code> housed Sass that didn't produce CSS. Things like variables, placeholder classes, and mixins. <code>partials</code> housed all CSS-producing Sass.
</p>
<p>
  This was the beginning file structure:
</p>
<pre><code class="language-none">css/
  scss/
    modules/
      _module.scss
      ...
    partials/
      _partial.scss
      ...
    tylergaw.scss
</code></pre>
<p>
  Each Sass partial gets imported in <code>tylergaw.scss</code>.
</p>

<pre><code class="language-scss">@import "modules/setup";
@import "modules/reset";
@import "modules/fonts";
</code></pre>

<p>
  I reorganized and renamed the files. I first changed the extension from <code>scss</code> to <code>css</code>. Instead of doing it a file at a time, I used a Bash script:
</p>
<pre><code class="language-bash">for f in *.scss; do git mv -- "$f" "${f%.scss}.css"; done;
</code></pre>

<p>
  Because the leading underscore is from the Sass world I also removed that. I couldn't figure a way to do it with Bash so I removed it from each file by hand. <i>(note to self; learn how to Bash better)</i>
</p>
<p>
  The last step was to move all the CSS files to the <code>modules</code> directory and remove the <code>partials</code> directory. I decided referring to all CSS as modules made more sense than trying to split them along the modules/partials line.
</p>

<h2>Build setup</h2>
<p>
  I started with the <a href="https://github.com/postcss/postcss-cli">PostCSS CLI</a>. I added a temporary build script to <code>package.json</code>:
</p>
<pre><code class="language-json">"scripts": {
  "postcss": "postcss -o public/css/tylergaw.css src/css/tylergaw.css"
}</code></pre>
<p>
  Without changing any styles I compiled the CSS:
</p>
<pre><code class="language-json">npm run postcss</code></pre>
<p>
  It worked! Sorta. I didn't get errors in the console, but it left me with a naked page on the <a href="http://css-naked-day.github.io/">wrong day</a>.
</p>
<figure>
  <img src="https://tylergaw.com/articles/assets/post-image-postcss-1.png" alt="A screenshot of tylergaw.com missing all styles" />
  <figcaption>
    Results of the first PostCSS build
  </figcation>
</figure>
<p>
  With the build process functional I could now work to get the styles back in order.
</p>

<p>
   Looking at the console in Chrome I saw a stack of 404s. This revealed the first missing feature; <code>@import</code> inlining. <code>tylergaw.css</code> contains only <code>@import</code>s for each CSS module. The browser saw those and did what it knows to do. It attempted to load each module via an HTTP request. My build process only copies the single CSS file, not each module. Because of that, the browser couldn't find them.
</p>

<p>
  I could change the build process to make default <code>@import</code>s work, but that would be inefficient. I needed a replacement for Sass style <code>@import</code> inlining.
</p>

<h2>The first plugin</h2>
<p>
  To get Sass-style <code>@import</code>s I used the <code>postcss-import</code> plugin. After installing the module via npm I updated the build script to use it:
</p>

<pre><code class="language-json">"scripts": {
  "postcss": "postcss -u postcss-import -o public/css/tylergaw.css src/css/tylergaw.css"
}</code></pre>
<p>
  And ran the script again with <code>npm run postcss</code>. The single CSS file contains all the modules and the site now has partial styling.
</p>

<figure>
  <img src="https://tylergaw.com/articles/assets/post-image-postcss-2.png" alt="A screenshot of tylergaw.com with partial styles" />
  <figcaption>
    Results of the PostCSS build using postcss-import plugin
  </figcation>
</figure>

<h3>Will this be in a future CSS?</h3>
<p>
  The inlining of <code>@import</code>s was huge when it showed up in Sass. It's changed how we're able to organize styles for the better. I'm not sure this functionality will ever be native in though. It seems like we'll always need a build step for this type of functionality. Which doesn't seem all that bad.
</p>
<p>
  I imagine the <code>postcss-import</code> plugin will be a staple for all my future PostCSS setups. My guess is this will be true for other folks too. This quote from the plugin author sounds right on:
</p>
<blockquote>
  <p>
    This plugin should probably be used as the first plugin of your list. This way, other plugins will work on the AST as if there were only a single file to process, and will probably work as you can expect.
  </p>
  <cite>
    <a href="https://github.com/postcss/postcss-import#postcss-import">
      postcss-import
    </a>
  </cite>
</blockquote>

<h2>cssnext</h2>
<p>
  <a href="https://cssnext.github.io/">cssnext</a> is a PostCSS plugin for compiling future CSS syntax to syntax that works today. It's important to note that it's not a different language like Sass or Less. The features it offers are in-progress CSS specs. Some for features already showing up in browsers today. Others in beginning stages of the specification process.
</p>
<p>
  I used cssnext to fill in the rest of the gaps left by missing Sass features.
</p>

<h3>Vendor prefixes</h3>
<p>
  I built this site before I knew about <a href="https://github.com/postcss/autoprefixer">Autoprefixer</a>. I used <a href="https://github.com/tylergaw/tylergaw.com/blob/pre-postcss/src/css/scss/modules/_prefixed.scss">custom Sass mixins</a> to handle adding the needed prefixes. cssnext includes Autoprefixer, so I was able to remove that entire mixins module.
</p>

<h3>Variables</h3>
<p>
  Next I changed the Sass variables to CSS custom properties. In <a href="https://github.com/tylergaw/tylergaw.com/blob/pre-postcss/src/css/scss/modules/_setup.scss">_setup.scss</a> I had:
</p>
<pre><code class="language-scss">$grey: #1e1e1d;
$yellow: #ffad15;
$offwhite: #f8f8f8;
$darkerwhite: darken($offwhite, 15);</code></pre>
<p>
  This isn't all the Sass vars I was using, but it's the main ones. The rest are in individual modules.
</p>
<p class="note-special">
  <b>Note:</b> The “custom properties” vs. “variables” distinction. CSS custom properties are only valid for property values. They can't be used in selectors, property names, or media query values.
</p>
<p>
  The updated <code>setup.css</code>:
</p>
<pre><code class="language-css">:root {
  --white: #fff;
  --grey: #1e1e1d;
  --yellow: #ffad15;
  --offwhite: #f8f8f8;
  ...
}</code></pre>
<p>
  and an example of updated usage:
</p>
<pre><code class="language-css">a {
  color: var(--yellow);
}</code></pre>

<p>
  Apart from syntax, CSS custom properties work the same as Sass variables. Because of limited browser support, properties are still compiled out. In the above example, the compiled value is <code>color: #ffad15</code>.
</p>

<h3>Color functions</h3>
<p>
  In the previous example, I left out one variable; <code>$darkerwhite: darken($offwhite, 15);</code>. This is another Sass feature I needed a replacement for. There's a <a href="https://drafts.csswg.org/css-color/#modifying-colors">draft spec</a> for a CSS <code>color</code> function. cssnext includes this function today and it's super cool. Here's <code>setup.css</code> with a <code>darkerwhite</code> custom property created with the <code>color</code> function and <code>shade</code> adjuster:
</p>
<pre><code class="language-css">:root {
  ...
  --offwhite: #f8f8f8;
  --darkerwhite: color(var(--offwhite) shade(20%));
  ...
}</code></pre>
<p>
  The <code>color</code> function provides a bunch of <a href="https://github.com/postcss/postcss-color-function#list-of-color-adjuster">adjusters</a>. You can use multiple adjusters in a single usage:
</p>
<pre><code class="language-css">background-color: color(#d32c3f shade(40%) alpha(40%));</code></pre>
<p>
  compiles to:
</p>
<pre><code class="language-css">background-color: rgba(127, 26, 38, 0.4);</code></pre>

<p>
  To reiterate. Right now cssnext compiles the result of <code>color()</code> to hex or rgba values. When the <code>color</code> function arrives in browsers, the compilation won't be necessary. The color manipulation can happen at runtime.
</p>

<h3>Nesting</h3>
<p>
  Nesting is an indispensable feature introduced by CSS preprocessors. A must for any comfortable styling setup. Tab Atkins has a <a href="http://tabatkins.github.io/specs/css-nesting/">spec</a> in-progress for CSS nesting and cssnext makes it available today.
</p>
<p>
  This was mostly legwork. The CSS syntax for nesting includes a leading <code>&</code> before nested blocks. For example, the following is a Sass snippet from my Projects page:
</p>
<pre><code class="language-scss">.projects-list {
  ...

li {
& > div {...}
}

a {
...

    &:hover,
    &:focus {...}

    &::after {...}

}

@media (min-width: 640px) {...}
}</code></pre>

<p>
  For CSS nesting, I changed that to:
</p>
<pre><code class="language-css">.projects-list {
  ...

& li {
& > div {...}
}

& a {
...

    &:hover,
    &:focus {...}

    &::after {...}

}

@media (min-width: 640px) {...}
}</code></pre>

<p>
  Basic nesting requires the leading <code>&</code>. Pseudo classes and selectors are the same in Sass and CSS. Media queries don't need a leading <code>&</code>.
</p>
<p>
  Also worth noting is <code>@nest</code>. As mentioned in the <a href="https://cssnext.github.io/features/#nesting">docs</a>, complex nesting requires <code>@nest</code> instead of <code>&</code>. I didn't have any use cases for it on this project, but may in the future.
</p>

<h3>Extend and Placeholder classes</h3>

<p>
  I was using Sass <code>@extend</code> and placeholder classes for common styles. Here's an example usage responsible for styling Futura headings:
</p>
<pre><code class="language-scss">%futura {
  font-family: 'futura-pt', helvetica, sans-serif;
}

%futura-heading {
@extend %futura;
font-weight: 700;
line-height: 1.1;
text-transform: uppercase;
}</code></pre>

<p>
  and an example usage:
</p>
<pre><code class="language-scss">.my-heading {
  @extend %futura-heading;
}</code></pre>

<p>
  We looked at CSS custom properties usage earlier. There's a related in-progress <a href="http://tabatkins.github.io/specs/css-apply-rule/">spec</a> for the <code>@apply</code> rule. <code>@apply</code> allows you to store a set of properties and reference them in selectors. I used <code>@apply</code> in place of Sass's <code>extend</code>.
</p>
<p>
  Back in <code>setup.css</code> I added the updated Futura heading properties:
</p>

<pre><code class="language-css">:root {
  ...

  --franklin: {
    font-family: 'futura-pt', helvetica, sans-serif;
  };

  --franklin-heading: {
    @apply --franklin;
    font-weight: 700;
    line-height: 1.1;
    text-transform: uppercase;
  };
}</code></pre>

<p>
  and an example usage:
</p>

<pre><code class="language-scss">.my-heading {
  @apply --franklin-heading;
}</code></pre>

<p>
  <code>@apply</code> is not <code>extend</code>. In the current form in cssnext, <code>@apply</code> copies the properties and values to each rule. This is a small project so that's OK. On larger projects the extra properties may cause too much bloat. At that time it would probably be best to use a common class name to get similar results.
</p>

<p>
  At this point I had the site looking as it did before the changes. The Projects page was an exception. On it I used a different color for each project tile. Next I'll describe how styling that correctly without Sass required more work and more typing.
</p>

<figure>
  <img src="https://tylergaw.com/articles/assets/post-image-postcss-3.png" alt="A screenshot of tylergaw.com/projects" />
  <figcaption>
    The colorful tiles of the Projects page
  </figcation>
</figure>

<h2>Mixins with arguments</h2>

<p>
  To make writing the projects styles easier I used a Sass mixin. The mixin took a single argument, the color for the tile. Here's the <code>project-block</code> mixin:
</p>

<pre><code class="language-scss">@mixin project-block ($c) {
  background-color: $c;

  a {
    color: $c;

    &:hover {
      background-color: $c;
      color: $offwhite);
    }
  }
}</code></pre>
<p>
  and example usage:
</p>
<pre><code class="language-scss">.p-jribbble {
  @include project-block(#ff0066);
}</code></pre>

<p>
  At the time of this writing, I couldn't find a way to mimic this functionality in CSS. Custom property sets with <code>@apply</code> aren't functions, so you can't pass them arguments. In the future, it might be possible to use custom selectors for argument magic. The <a href="https://drafts.csswg.org/css-extensions/#declarative-custom-selector">draft spec</a> has a complex example that looks promising. Right now, I'll admit, I don't fully understand how it works.
</p>

<p>
  That didn't mean I was out of luck. The CSS I write is longer than the Sass, but not by much. I also made use of another in-progress CSS feature; the <a href="https://drafts.csswg.org/selectors-4/#matches">matches</a> selector.
</p>

<p>
  Here's an example of the CSS replacement for the <code>project-block</code> mixin:
</p>
<pre><code class="language-css">.p-jribbble,
.p-jribbble a:matches(:hover, :focus) {
  background-color: var(--color-jrb);

& a {
color: var(--color-jrb);
}
}</code></pre>

<p>
  The color variables are in a <code>:root</code> scope earlier in the file. cssnext compiles the above CSS to:
</p>
<pre><code class="language-css">.p-jribbble,
.p-jribbble a:hover,
.p-jribbble a:focus {
  background-color: #ff0066
}

.p-jribbble a,
.p-jribbble a:hover a,
.p-jribbble a:focus a {
color: #ff0066;
}</code></pre>

<p>
  The last two selectors <code>...a a:hover</code> and <code>...a a:focus</code> won't match any elements. They're unecessary, but aside from a few more bytes they don't hurt anything. I preferred nesting the <code>a</code> selector for code readability.
</p>

<h2>More PostCSS</h2>
<p>
  With the styles back in proper order, I decided to take advantage of more PostCSS plugins. I used <a href="https://github.com/hail2u/node-css-mqpacker">css mqpacker</a> to combine media queries that share the same query. I also used <a href="http://cssnano.co/">cssnano</a> for code optimization.
</p>
<p>
  This is where I'm looking forward to using a PostCSS setup. With Sass I felt locked in to the features in the current version. Because PostCSS works as a collection of plugins, it's extendible. If I have a specific need, I can write a plugin for it. The potential there is exciting.
</p>

<h2>I'm sold</h2>
<p>
  After working with this setup for a few days, I'm all in. Making the switch from Sass syntax to new CSS syntax has been easy. And that's after five or six years of using Sass on every project I worked on.
</p>
<p>
  I enjoy the shift in thinking this brings. cssnext has a similar approach to CSS as <a href="https://babeljs.io/">Babel</a> has to JavaScript. They both allow you to write the language as it is and as it will be in the future.
</p>
