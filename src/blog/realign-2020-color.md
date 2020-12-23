---
tags: post
layout: "layouts/article.njk"
title: "Realign 2020: Color"
date: "2020-05-17"
highlightSyntax: true
meta:
  description: After almost a decade, this site now has a light mode. Also just more colorful.
  image: /articles/assets/post-image-realign-2020-color-social.png
---

<p class="entry-intro">
  This is part of my “<a href="https://tylergaw.com/articles/realign-2020"
    >Realign 2020</a
  >” series. In it, I document my process during a content and design realign of
  this site. I’ll update the site piece-by-piece as I post. The design and
  content will evolve through the series and beyond.
</p>

<p>
  Going into this, I didn’t know exactly what colors I wanted, but I knew I
  wanted a lot. I wanted my color usage to come across as deliberate. Planned.
  But at the same time unbounded. I wanted a design where no hue, shade, or tint
  is off limits or unwelcome.
</p>
<p>
  Along with new colors, I also added a light color scheme. Or “light mode.”
  Depending on your system color mode, this text is either muddy brown on
  off-white or off-white on charcoal. There's also an override button in the
  footer, in case you prefer one scheme over the other. More on that later in
  this post.
</p>

<h2>Choosing colors</h2>
<p>
  Choosing colors for a design is a lot of play. With this design I started with
  what I had in place already. A dark grey background
  <code class="color-swatch-code" style="--color: #292929;">#292929</code>,
  off-white text
  <code class="color-swatch-code" style="--color: #f8f8f8;">#f8f8f8</code>, and
  a pink accent color
  <code class="color-swatch-code" style="--color: #ff607f;">#ff607f</code>.
</p>

<h3>Toxic green</h3>
<p>
  The first color I worked with was the primary accent color. Its job is to make
  the palette come alive. It’s also the color of text links. Because of that,
  the color I used needed to meet a minimum WCAG color contrast ratio. I used
  high contrast ratios as guideposts during this process. This primary accent
  color was important to get just right.
</p>
<p>
  From the beginning, I saw yellows, greens, yellowish greens, and blue greens
  in my head. I went through the rainbow to try other hues, but it was clear
  this small section of the spectrum was where I'd find the color I wanted.
</p>
<p>
  The green couldn’t be a lime. That, with the off-white and charcoal, gave a
  campy/horror vibe that didn’t feel right. Towards yellow felt stale. I wanted
  an unnatural green. A weird green.
</p>
<p>
  My hair at the time was a strange mix of blue and emerald green. The result of
  one of my recent home dye jobs. I thought that could be a place to look. I
  didn't have a hex value so I did an image search for “emerald green.” When I
  found one that looked cool, I used an eyedropper to pick a hex. My process for
  color is definitely not a science.
</p>

<p>
  I don’t have the exact hex I started with, but it gave me a solid foundation
  to work from. It got me to a tiny sliver of the color spectrum. I had help
  getting to the final color. I mentioned before I need colors to meet certain
  contrast ratios. To do that I use the
  <a href="https://webaim.org/resources/contrastchecker/"
    >WebAIM contrast checker</a
  >. I compared the green with the charcoal background. I adjusted the hue and
  lightness by tiny amounts until I got sufficient contrast.
</p>
<p>
  Letting contrast ratios influence aesthetic decisions like that can be a
  little uncomfortable. As an experienced designer, I have a trained eye that I
  trust to choose colors that work well and look good. But, that’s not the whole
  story. My instincts towards subtlety often lead to colors that look fantastic,
  but are low in contrast. Low contrast text can be difficult for people to see.
  Color needs more than my instincts alone. So I let go of a bit of control.
</p>
<p>
  Letting go can produce great results. Results that make a design accessible
  and enjoyable to more people. And in this case, helped me get what I was
  looking for. This was the first color I got excited about in this process.
  This unnatural green. This weird green. This toxic green.
</p>
<figure>
  <div class="realign-color-fig realign-color-primary-accent"></div>
  <figcaption>
    fig 1: Primary accent color for the dark scheme, #00eb9b
  </figcaption>
</figure>

<h3>Boo</h3>
<p>
  Having a single accent color made me feel like I painted myself into a corner.
  It felt too formulaic. Also, the design before was using the accent color to
  highlight links, but then sometimes only as an accent with no interactivity. I
  needed to introduce at least one more accent color. One that I’d use only for
  embellishment. Toxic green would only be for links and other clickable
  elements.
</p>

<p>
  I went through the process again. A slow trial and error. Clicking around on
  the color picker. Looking for one that worked with that toxic green and the
  rest of the design. I landed on a muted blue.
</p>

<p>
  The blue itself had to look great, but the interplay between it and the other
  colors was most important.
</p>

<figure>
  <div class="realign-color-fig realign-color-primary-secondary-accent"></div>
  <figcaption>
    fig 2: Primary and secondary accent colors of the dark scheme; #00eb9b,
    #9db4ff
  </figcaption>
</figure>

<p>
  From here it was color confetti. I made a spotted, star dust-looking
  background texture in Sketch. At first it was all off-white flecks, but felt
  like it needed more. So I started picking colors at almost random to use for
  the dust. The hue is all over the spectrum, but I tried to keep them in a
  similar tone. This part was just fun.
</p>

<p>
  Now that I have a foundation of color in place, I can keep going with it. As I
  continue developing content, I can also iterate on the design. Finding more
  opportunities to introduce color as I move along.
</p>

<h2>Light mode</h2>
<p>
  In the last year or so it seems almost every site and app has announced their
  “dark mode.” This site has had light text on a dark background for almost a
  decade now. With this realign, I also wanted to provide an alternative color
  scheme. The alternative would be a light version.
</p>

<p>
  Dark and light schemes shouldn’t only the inverse of the other. They should be
  fully considered designs that stand on their own. The color selection process
  was the same as the others. Trial and error. Make sure the colors meet WCAG
  contrast ratios. Find combinations that work well together.
</p>

<figure>
  <div class="realign-color-fig realign-color-light-scheme"></div>
  <figcaption>
    fig 3: Text, primary, and secondary colors of the light scheme; #3f3d31,
    #c01458, c2d838
  </figcaption>
</figure>

<p>
  Like the dark scheme, the light scheme has a textured background. The shape
  and placement of the flecks are the same, but I chose different colors. Colors
  that fit the tone of the light accents and worked well on the off-white
  background.
</p>

<h3>Your choice</h3>
<p>
  A color mode you choose at your operating system level should not be the final
  say you have in the mode of a website or app. Preference over text and
  background color changes with context, time of day, and mood. For this site, I
  prefer the dark scheme. But, I don’t use dark mode on my system, macOS. Other
  folks will have different preferences.
</p>
<p>
  With that in mind, I included a color scheme toggle in the footer that
  remembers your preference. Not across devices, but in browser.
  <span class="realign-color-scheme-toggle-invite"
    >Give it a try with this button:
    <button class="realign-color-scheme-toggle">Switch scheme</button></span
  >
</p>
<h3>Mode code</h3>
<p>
  The code I used for this is a modified version of
  <a
    href="https://hankchizljaw.com/wrote/create-a-user-controlled-dark-or-light-mode/"
    >Andy Bell’s</a
  >. The logic for picking a color scheme goes like this. If you haven’t chosen
  a color scheme using the provided button, go with the system setting. If you
  have a system level dark mode set, you’ll see the dark scheme. Light mode,
  light scheme.
</p>
<p>
  If you’ve been to this site before and changed the scheme using the toggle
  button, that will be the scheme you see. If you have a system level dark mode
  set, but you’ve chosen the light scheme here, you’ll see the light scheme. The
  inverse is also true. This makes your local preference take precendence over
  system preference.
</p>
<p>
  An interesting thing I ended up doing with the code for the scheme picker is
  splitting it into two parts. I include the first part as an internal script
  right after the opening
  <code>body</code> tag. This code’s job is to determine the correct color
  scheme on page load. It checks <code>localStorage</code> for a
  <code>user-color-scheme</code> item. The value of that item will be the string
  <code>"light"</code> or <code>"dark"</code>. If found, that’s the color scheme
  displayed. If not, the code falls back to the system level color scheme. I’m
  able to determine the system level scheme from a CSS custom property named
  <code>"user-color-scheme"</code>. The default of that prop is
  <code>"dark"</code>. Using a <code>(prefers-color-scheme: light)</code> media
  query I set the prop value to <code>"light"</code>. This approach is from
  Andy’s example.
</p>
<p>
  The reason I include this as an internal script before the document loads is
  to avoid a flash of the other scheme. If I included this as an external script
  and waited for document load, you’d see that quick flash of incorrectly styled
  content. This makes the code a tiny bit harder to maintain, but it works fine
  for my purposes. I keep the code in
  <a
    href="https://github.com/tylergaw/tylergaw.com/blob/346982b2da07b2369b5bd2101c50488dfa246157/partials/scheme.js.html"
    >a partial</a
  >
  that I include in my handlebars templates. This isn’t perfect. I think the
  extra <code>scipt</code> is causing some other jitteriness on load, but it’ll
  do for now.
</p>
<p>
  The second part of the code is also in
  <a
    href="https://github.com/tylergaw/tylergaw.com/blob/346982b2da07b2369b5bd2101c50488dfa246157/partials/scripts.html#L10"
    >a partial</a
  >. I include this before the closing <code>body</code> tag. This code’s job is
  to make the scheme switcher button work. Because it’s in the footer, it can
  wait until the document loads. Andy’s post does a great job of explaining the
  approach so I won’t go into detail here about how it all works.
</p>
<p>
  Something I added in my implementation is code that responds to system level
  mode changes. Andy mentions it as a potential improvement:
</p>
<blockquote>
  <p>
    Observe changes to the user’s dark/light mode setting, probably via the
    prefers-color-scheme media query and update the default state accordingly
  </p>
  <cite>
    “<a
      href="https://hankchizljaw.com/wrote/create-a-user-controlled-dark-or-light-mode/#heading-wrapping-up"
      >Create a user controlled dark or light mode</a
    >”
  </cite>
</blockquote>
<p>
  This addition makes sure the button stays in sync with the system level
  setting. Without this code, the CSS-driven parts of the display update, but
  not the JS-driven parts, like the button.
</p>
<pre><code class="language-javascript">const mql = window.matchMedia("(prefers-color-scheme: light)");

mql.addListener((event) => {
console.group("System color scheme change");
const systemScheme = getCSSProp("--scheme-system");
const userScheme = localStorage.getItem(schemeKey);
console.info("System color scheme changed to", systemScheme);

if (!userScheme) {
console.info("No user color scheme chosen, using the system scheme");
} else {
console.info(`User choice takes preference, using the ${userScheme} scheme`);
}

updateSchemeBtn(userScheme || systemScheme);
console.groupEnd();
});</code></pre>

<p>
  I use a
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia"
    ><code>MediaQueryList</code></a
  >
  event to keep an eye on <code>prefers-color-scheme</code>. When it changes,
  the callback does the same <code>localStorage</code> and custom prop lookup
  that happens on page load.
</p>

<p>
  I left logging in place to announce changes and decisions made. I hadn’t used
  <code>console.group()</code> and <code>groupEnd()</code> before. They’re super
  helpful for keeping logs organized. If you want to see them in action, open
  the console and make changes to the local and system color schemes.
</p>

<figure>
  <picture>
    <source
      srcset="
        https://tylergaw.com/articles/assets/post-image-realign-2020-color-scheme-toggle-static.png
      "
      media="(prefers-reduced-motion: reduce)"
    />

    <img
      src="https://tylergaw.com/articles/assets/post-image-realign-2020-color-scheme-toggle.gif"
      alt="A looping animated gif where I’m changing the Appearance setting on macOS from Light to dark while looking at this site with the developer console open to show the logging output."
    />

  </picture>

  <figcaption>
    fig 4: Monitoring the effects of changing the appearance on macOS
  </figcaption>
</figure>

<h2>Code color</h2>
<p>
  If you’re reading this post on my site, you’ll see syntax highlighted code
  samples. Like the earlier <code>matchMedia</code> example.
  <a href="https://prismjs.com/">Prism</a> is my highlighter of choice. I’ve had
  a modified
  <a
    href="https://github.com/ericwbailey/a11y-syntax-highlighting/blob/master/dist/prism/a11y-dark.css"
    >dark a11y theme by Eric Bailey</a
  >
  in place for a couple years. For this update, I combined the dark and light
  a11y themes so they change with the rest of the scheme. I moved all the theme
  colors to CSS custom props and used similar selectors to choose the correct
  theme.
</p>
<p>
  This approach results in a bit a repetition, but gets the job done. You can
  see the full port on
  <a
    href="https://github.com/tylergaw/tylergaw.com/blob/cffe306ca5447e2b17cbe5ac8669a8d909837ee3/src/css/modules/prism-a11y.css"
    >GitHub in prism-a11y.css</a
  >.
</p>

<h2>Color naming</h2>
<p>
  I’ll end with another fun one. Have you ever tried to name colors? There are
  common names like red, green, and blue. But what’s
  <code class="color-swatch-code" style="--color: #c01458;">#c01458</code>’s
  name? If you’ve ever named color variables or custom properties you know the
  pain of naming colors. When I’ve done this before, I start out on the right
  foot. <code>red-bright</code>, <code>red-dark</code>, <code>grey</code>. But,
  before long I end up with dubious names like <code>red-darker</code>,
  <code>red-lighter</code>, <code>grey-mid</code>. And eventually
  I-give-up-names like <code>purple-but-more-blue</code>,
  <code>not-quite-green</code>. Before this realign, I had a color named
  <code>darkerwhite</code>. That is…less than ideal.
</p>
<p>
  Color names like this aren’t helpful. And it’s not fun coming up with them.
  This time I let go. Instead of trying to come up with some magic, smart
  formula for naming colors, I use word association. I look at the color and
  whatever pops into my head first is the name. I follow a naming pattern
  prefix, but the names are all over the place. <code>toxic</code>,
  <code>boo</code>, <code>boogers</code>.
</p>
<pre><code class="language-css">--color-accent-toxic: #00eb9b;
--color-accent-wine: #c01458;
--color-accent-boo: #9db4ff;
--color-accent-pank: #f2c0ea;
--color-accent-boogers: #c2d838;
--color-accent-mellow: #f1f68e;
--color-accent-orange: #e9b581;
--color-charcoal: #292929;
--color-mud: #3f3d31;
--color-offwhite: #f8f8f8;
--color-white: #fff;
--color-eggshell: #f6f5e4;</code></pre>

<p>
  Some of them are just what they are, but not most. It’s cheeky, but I’m
  finding that I remember what color <code>boogers</code> is better than I would
  something like <code>yellowgreen-light</code>. It’s faster for me to name new
  colors and I get a good chuckle every time I do it. And these days, I’ll take
  the chuckles anywhere I can get ’em.
</p>

<h2>Next</h2>
<p>
  I’ve been working on and writing about this site realign since late February.
  These color updates and post took a long time. I’m OK with that. I want this
  to be fun, exploratory work. Not mad dash to the finish. With that in mind, I
  don’t know when I’ll publish the next post in the series, but it’ll be
  sometime sooner than later and I’ll give myself plenty of time to work on it.
</p>
