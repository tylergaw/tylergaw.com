---
tags: post
layout: "layouts/article.njk"
highlightSyntax: true
title: "Building My First PWA"
date: "2017-11-20"
meta:
  description: A probably-too-long post about the process beyond building my first Progressive Web App. Including a yarn about caching dynamic, fingerprinted filenames.
  image: /articles/assets/post-image-first-pwa-social.png
---

<p class="entry-intro">
  I’ve been looking for time and a sandbox to sit down and learn how to build offline-capable/first web sites or “Progressive Web Apps” (PWA) for a while. I learn best with a hands-on approach. <a href="https://colorme.io/" target="_blank" rel="noopener">ColorMe</a> is a site I maintain and a perfect candidate for offline experimentation. This post details the steps I took, the issues I ran into, and things I learned building my first PWA.
</p>

<p>
  Quick note. This isn’t a general “How to make a PWA” post. It may not even be a good intro. There are plenty of articles and tutorials to get the basics. This post is specific to the work involved in making ColorMe a PWA.
</p>

<p>
  In a lot of what I’ve read about PWAs, there’ve been common steps for building them. A simple-on-the-surface looking process. Here’s one list from Jeremy:
</p>

<blockquote>
  <ol>
    <li>switch over to HTTPS,</li>
    <li>add a JSON manifest file with your metacrap, and</li>
    <li>add a service worker.</li>
  </ol>
  <cite>
    <a href="https://adactio.com/journal/12461">Jeremy Keith, “Progressing the Web.”</a>
  </cite>
</blockquote>

<p>
  OK, that seems easy enough. Except that last step. That seems like it could be a lot to unpack. He does offer a disclaimer:
</p>

<blockquote>
  <p>
    That last step can be tricky if you’re new to service workers, but it’s not unsurmountable.
  </p>
</blockquote>
<p>
  I’ll ignore the service worker part of the process for now and focus on the first two items.
</p>
<h2>Using HTTPS</h2>
<p>
  ColorMe already has HTTPS in place. I host it on S3 and serve it through CloudFront. I used <a href="https://aws.amazon.com/certificate-manager/">Amazon’s Certificate Manager</a> to add an SSL certificate. HTTPS is in place and has been since launch.
</p>

<h2>Adding a Manifest</h2>
<p>
  This is where things got more interesting. I built ColorMe with <a href="https://github.com/facebookincubator/create-react-app">Create React App</a> (CRA) so I made a <code>manifest.json</code> file in the <code>public</code> directory. The same directory as the favicon and <code>index.html</code>. Anything in the <code>public</code> directory gets copied to the <code>build</code> directory as is. That’s what we need for <code>manifest.json</code>.
</p>

<h3>Doesn’t CRA do PWA stuff out of the box?</h3>
<p>
  Yes. CRA added built-in support for PWAs in version <code>1.0.0</code>. ColorMe is still on version <code>0.8.4</code>. That was the latest version when I created the project and haven’t had a reason to update.
</p>
<p>
  I could have updated CRA to use the built-in PWA, but I didn’t want to miss the opportunity to learn step-by-step. Doing this myself, taking the long, “dumb” way, helped internalize the why and the how of each step. On future CRA-built projects, I’ll use the latest version with built-in PWA support. With that out of the way, here’s all my “metacrap.”
</p>

<p>
  I knew there was “stuff” that went in the manifest, but I wasn’t sure about specifics. What keys can I use? What are example values for each key? And what key-values am I supposed to have? The best resource I found for questions number one and two is the MDN <a href="https://developer.mozilla.org/en-US/docs/Web/Manifest">Web App Manifest documentation</a>. It lists available keys and example values.
</p>

<h3>Lighthouse</h3>
<p>
  For the third question, I turned to <a href="https://developers.google.com/web/tools/lighthouse/">Lighthouse audits</a> in Chrome dev tools. Before adding anything to the manifest, I ran a PWA audit. It reported items needed to meet the minimum requirements for a PWA (according to the audit).
</p>

<figure>
  <img src="https://tylergaw.com/articles/assets/post-image-pwa-audit-before.png" alt="">
  <figcaption>
    A pre-pwa audit of colorme.io
  </figcation>
</figure>

<p>
  With the audit report as a starting point, I hit each item on the list. Most important, I referenced the manifest in the <code>head</code> of <code>index.html</code>. This uses the CRA-specific <code>%PUBLIC_URL%</code>.
</p>

<pre><code class="language-javascript">&lt;link rel="manifest" href="%PUBLIC_URL%/manifest.json"&gt;</code></pre>

<p>
  Most items in the manifest are straightforward enough so I won’t go line-by-line. But I will call out a couple items that took a bit more work. You can see the complete file <a href="https://github.com/tylergaw/colorme/blob/develop/public/manifest.json">on GitHub</a> and below:
</p>

<pre><code class="language-javascript">{
  "background_color": "#ffffff",
  "theme_color": "#B50003",
  "display": "standalone",
  "short_name": "ColorMe",
  "name": "ColorMe",
  "start_url": "/",
  "icons": [
    {
      "src": "launcher-icon-48x48.png",
      "type": "image/png",
      "sizes": "48x48"
    },
    {
      "src": "launcher-icon-96x96.png",
      "type": "image/png",
      "sizes": "96x96"
    },
    {
      "src": "launcher-icon-192x192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "launcher-icon-256x256.png",
      "type": "image/png",
      "sizes": "256x256"
    },
    {
      "src": "launcher-icon-384x384.png",
      "type": "image/png",
      "sizes": "384x384"
    },
    {
      "src": "launcher-icon-512x512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}</code></pre>

<h3>Icon sizes</h3>
<p>
  As you can see in the manifiest, I included six different icon sizes. The audit requires two sizes; 192x192 and 512x512. The former for the homescreen icon on Android, the latter as an icon for a splash screen on Android.
</p>
<p>
  I’m not sure if the other four sizes are necessary, but I saw those in examples so I figured it wouldn’t hurt to include them.
</p>

<h3>Theme color</h3>
<p>
  A requirement–per the audit–was to add a <code>theme-color</code> meta tag to <code>index.html</code>:
</p>

<pre><code class="language-javascript">&lt;meta name="theme-color" content="#B50003"&gt;</code></pre>

<blockquote>
  <p>
    The theme-color meta tag ensures that the address bar is branded when a user visits your site as a normal webpage.
  </p>
</blockquote>

<h3>noscript</h3>
<p>
  Another failing audit was “Contains Some Content When JavaScript Is Not Available.” For that, I added <code>noscript</code> content. It doesn’t do anything except apologize for not working without JavaScript. It would be better to have some type of useful experience without JS, but I’ll save that for another time. It’s interesting to think how to make a site like this provide value without JavaScript.
</p>

<h3>“According to the audit”</h3>
<p>
  I’m using specific language like; “per the audit” and “according to the audit” on purpose here. Some of these aren’t universal. For example, the <code>theme_color</code> property and the <code>theme-color</code> meta tag have no effect on Mobile Safari or Mobile Chrome on iOS as far as I can tell. For the purposes of this exercise, I’m working towards 100% on the audit. I’m sure not every project needs every item. As usual, it depends.
</p>

<h3>The Chrome Dev Tools Manifest Tab</h3>
<p>
  Every time I’d make a change to the manifest I’d re-run the PWA audit to check the results. This was slow. I didn’t realize there was a tab in Chrome dev tools for inspecting the <code>manifest.json</code> results. I found it early enough in the process that it helped speed things along. It also has an “Add to homescreen” button to test that mechanism. That’s much appreciated because I don’t have access to an Android device for proper testing. I wrote this in case someone else also doesn’t know about the manifest tab in Google Chrome Dev Tools.
</p>

<p>
  At this point I still don’t have a PWA. The audit turns up one last failure:
</p>

<blockquote>
  <p>
    Failures: Site does not register a Service Worker, Manifest start_url is not cached by a Service Worker.
  </p>
</blockquote>

<p>
  With the basics of the manifest in place, I turned my attention to the service worker.
</p>

<h2>The Service Worker</h2>

<p>
  Like I mentioned above, this was the biggest mystery for me. I understood the general concept of service workers, but I didn’t understand what the goals of a service worker for a PWA were. Sure, it’s JS, it runs in the background, but what’s that JS supposed to <em>do</em>? After spending time with tutorials, examples, and fiddling, I got a clearer picture.
</p>
<h3>The goals of ColorMe’s service worker:</h3>
<ul>
  <li>
    Store the site’s static files–HTML, CSS, JavaScript, and images–in the <code>window.caches</code> object
  </li>
  <li>
    Intercept all network requests. If the name of the requested file is in <code>window.caches</code>, respond with the cached file instead of making a request to the server
  </li>
  <li>
    Delete stale caches when the cache key changes
  </li>
</ul>

<p>
  One thing that stuck out early was the <code>caches</code> member on the global <code>window</code> scope. When I first saw <code>caches</code> in use in example service workers, I thought it was a global only in the service worker context. That’s not the case. <code>window.caches</code> is available from any JS.
</p>

<p>
  Here’s a quick example of <code>caches</code>. Go to <a href="https://colorme.io">colorme.io</a>. Open the developer console and run this snippet:
</p>
<pre><code class="language-javascript">caches.keys().then(names => {console.log(names)});</code></pre>

<p>
  That should output <code>["colorme-v7"]</code> (the version number might be different). Not much to look at, but you can see that <code>window.caches</code> is a thing in this context. That means you can access caches from any client side JavaScript, not only service workers. That’s pretty cool.
</p>

<h3>Goal 1: Cache Static Files</h3>
<p>
  For ColorMe to work offline it needs to cache all critical static files. It’s a single page site so there are only a few; <code>index.html</code>, <code>main.css</code>, <code>main.js</code>, <code>manifest.json</code>, an svg image, and a Google Fonts stylesheet.
</p>
<p>
  The CRA build process creates or renames the CSS, JS, and image files. That made things difficult and I’ll describe my process for fixing it later. For now, I’ll pretend the file names are what they are and walk through the code.
</p>
<p>
  I created <code>service-worker.js</code> in the <code>public</code> directory. The full file is available <a href="https://github.com/tylergaw/colorme/blob/03946e9540a031075f3f691356d7aa3f4e457a2d/public/service-worker.js">on GitHub</a>.
</p>

<pre><code class="language-javascript">const STATIC_CACHE_NAME = "colorme-v1";
const STATIC_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/static/css/main.css",
  "/static/js/main.js",
  "/static/media/bgTransparent.svg",
  "https://fonts.googleapis.com/css?family=Cousine:400|Karla:400,700"
];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_URLS);
    }).then(() => self.skipWaiting())
  );
});</code></pre>

<p>
  <code>STATIC_CACHE_NAME</code> is a unique key for this cache. <code>STATIC_URLS</code> is the list of files to cache. I’ll explain how I update this list later to account for dynamic file names.
</p>

<p>
  In broad strokes, the next lines say:
</p>
<ol>
  <li>when the service worker finishes the install process,</li>
  <li>find or create a cache with our name,</li>
  <li>and put the files we specified in that cache.</li>
</ol>
<p>
  There are full descriptions of the install event and <code>waitUntil</code> available. <a href="https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent">MDN</a> is a great one.
</p>

<h4>Skip Waiting?</h4>
<p>
  I’ve read docs about <code>skipWaiting</code>, but I’m still a bit hazy on what it does or if I even need it in this context. Enough examples I saw recommended it, so I went with it for now. I’ll learn more about it as I work with it.
</p>

<p>
  With those lines, ColorMe’s static assets are snug in a cache. There’s still work to be done though.
</p>

<h3>Goal 2: Serve Cached Files</h3>
<p>
  Putting static files in <code>caches</code> isn’t enough on its own. For ColorMe to work offline, we need to tell the browser to look in the cache for those files.
</p>

<pre><code class="language-javascript">self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});</code></pre>

<p>
  This snippet listens for all HTTP requests from the user’s browser. <code>event.respondWith</code> prevents the browser’s default <code>fetch</code> handling. That allows us to check if the requested URL–<code>event.request</code>–is in the cache. If it is, respond with the cached file. If it’s not cached, continue with the request to the server using <code>fetch()</code>.
</p>

<p>
  ColorMe now works with or without an Internet connection.
</p>

<figure>
  <img src="https://tylergaw.com/articles/assets/post-image-pwa-audit-100-percent.png" alt="">
  <figcaption>
    A post-pwa audit of colorme.io
  </figcation>
</figure>

<h3>Goal 3: Delete Stale Caches</h3>
<p>
  If I stopped here ColorMe works offline, but I’d have no way to release updates to users. Cached items have to be deleted, they never expire. The service worker should remove stale caches.
</p>
<pre><code class="language-javascript">self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.includes("colorme") && name !== STATIC_CACHE_NAME)
          .map(name => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  );
});
</code></pre>
<p>
  This is the most involved-looking code in the service worker, but it doesn’t do much.
</p>
<ol>
  <li>get an array of all cache keys with <code>caches.keys()</code>,</li>
  <li>remove any keys that don’t contain our name and remove a cache with the exact <code>STATIC_CACHE_NAME</code>,</li>
  <li>for each of the remaining keys, delete that cache.</li>
</ol>
<p>
  When the service worker activates–every time the page loads–check to see if there are stale caches. If there are, delete them. I determine if a cache is stale with #2 above.
</p>
<p>
  In the first code snippet I defined the cache key; <code>const STATIC_CACHE_NAME = "colorme-v1"</code>. When I make changes to any of the cached files and deploy the site, I also change that version number. If a user visited the site when <code>colorme-v1</code> was latest, then visits again when <code>colorme-v7</code> is the latest, the service worker deletes v1 and caches v7.
</p>

<h2>Caching Dynamic Filenames</h2>

<p>
  At this point, I’ve met all the goals for ColorMe’s service worker and have a functioning PWA. If you visit ColorMe then turn off your network connection, you should be able to refresh the page and use it as normal.
</p>
<p>
  There is one issue I mentioned above. The filenames for the CSS, JS, and image are incorrect. In the earlier snippet, I cached files named;
</p>

<ul>
  <li>
    <code>"/static/css/main.css"</code>
  </li>
  <li>
    <code>"/static/js/main.js"</code>
  </li>
  <li>
    <code>"/static/media/bgTransparent.svg"</code>
  </li>
</ul>

<p>
  The CRA build process fingerprints those filenames to something like;
</p>

<ul>
  <li>
    <code>"/static/css/main.2ebebc14.css"</code>
  </li>
  <li>
    <code>"/static/js/main.7e7a1a8f.js"</code>
  </li>
  <li>
    <code>"/static/media/bgTransparent.e6317315.svg"</code>
  </li>
</ul>

<p>
  This is common for cachebusting and not only for CRAs. I’ve used and built tons of different asset pipelines over the years that use fingerprinting.
</p>

<p>
  I got hung up on this big time. How am I going to tell the service worker to cache files when I have no control over their names? I didn’t find much info on the topic. <a href="https://github.com/w3c/ServiceWorker/issues/657">This issue</a> raises the question and the discussion helped me figure out an approach. I’d need to somehow generate the list of filenames during the build process. I had a few options, a couple of them not good ones;
</p>
<ol>
  <li>Run the CRA eject script and change the default webpack build process to generate the service worker</li>
  <li>Update to latest CRA and use their built-in PWA support</li>
  <li>Walk away from computer, sleep on it, think about a better solution the next morning while walking my <a href="http://leela.dog" target="_blank" rel="noopener">dog</a></li>
</ol>

<p>
  I didn’t want to eject from CRA, because it didn’t seem worth it. I mentioned above, updating to the latest CRA would take away the opportunity to learn. Option #3 sounded best. After getting away from the computer, I realized I had more options than I realized and a solution that <em>should</em> work. It was’t going to be elegant or scalable, but it’d do the job.
</p>

<h3>Piggybacking on the CRA build script</h3>

<p>
  The default CRA build script builds the project according to the baked in webpack config. I can’t change the config–without ejecting–but I can add to the build script in <code>package.json</code>. I’d already modified the script to include <code>NODE_PATH=src</code>. That makes it easier to import modules without referencing the full path. ColorMe’s starting build script looked like:
</p>

<pre><code class="language-javascript">NODE_PATH=src react-scripts build</code></pre>

<p>
  I knew a couple things. I knew the build process creates a file named <code>asset-manifest.json</code>. The contents of that file include the full fingerprinted names of all static assets used in the site. Example contents of the manifest file:
</p>

<pre><code class="language-javascript">{
  "main.css": "static/css/main.2ebebc14.css",
  "main.css.map": "static/css/main.2ebebc14.css.map",
  "main.js": "static/js/main.7e7a1a8f.js",
  "main.js.map": "static/js/main.7e7a1a8f.js.map",
  "static/media/bgTransparent.svg": "static/media/bgTransparent.e6317315.svg"
}</code></pre>

<p>
  Those are the full filenames I need to cache with my service worker. I need to get those filenames into the service worker file.
</p>
<p>
  The first thing I did was add to the build script. Back in <code>package.json</code> I updated the script to look like:
</p>

<pre><code class="language-javascript">NODE_PATH=src react-scripts build && npm run generate-sw</code></pre>

<p>
  This says; “run the normal build process, when you’re done with that run this other npm script”. That script looks like:
</p>

<pre><code class="language-javascript">"generate-sw": "node scripts/generate-sw.js"</code></pre>

<p>
  To make sure that worked, I created <code>/scripts/generate-sw.js</code> and added a single line; <code>console.log('hello')</code>. Then I ran the build script <code>npm run build</code> to make sure the project built and I saw “hello” in my terminal output. So far so good.
</p>

<h4>The generate script</h4>

<p>
  I need to get the filenames out of <code>asset-manifest.json</code> and into the array of filenames to cache in <code>service-worker.js</code>. My plan was to not get fancy with this. I only need to take strings from one file and write them into another file. The fact that the target file is JavaScript is immaterial to this process.
</p>

<p>
  The full file is available <a href="https://github.com/tylergaw/colorme/blob/03946e9540a031075f3f691356d7aa3f4e457a2d/scripts/generate-sw.js">on GitHub</a> and I’ll go through the code in detail here.
</p>

<pre><code class="language-javascript">const manifest = require("../build/asset-manifest.json");
const fs = require("fs");
const swPath = "build/service-worker.js";</code></pre>

<p>
  First is setup. <code>asset-manifest</code> is JSON so I <code>require</code> it here for use as an object. I’ll use the <code>fs</code> package for reading and writing files. I store the path of the service worker for convenience.
</p>

<pre><code class="code-muted">const manifest = require("../build/asset-manifest.json");
const fs = require("fs");
const swPath = "build/service-worker.js";</code>
<code class="language-javascript">const urlsCSV = Object.keys(manifest)
  .filter(k => !k.includes(".map"))
  .map(k => manifest[k]);</code></pre>

<p>
  Getting more interesting, but still not fancy. The goal of this chunk of code is to build an array of filenames. First, use <code>Object.keys</code> to get the keys from the manifest JSON to loop over an array.
</p>
<p>
  Next, use <code>filter</code> to remove keys that include the string “.map.” If you look at <code>asset-manifest.json</code> you’ll see source maps. We don’t want to cache those. I’m not sure if there’s a best practice for or against that, but I decided it didn’t seem right for this project.
</p>
<p>
  Now that we only have keys for the files we want to cache, use <code>map</code> to create the array of filenames stored as <code>urlsCSV</code>;
</p>

<pre><code class="language-javascript">[
  "static/css/main.2ebebc14.css",
  "static/js/main.7e7a1a8f.js",
  "static/media/bgTransparent.e6317315.svg"
]</code></pre>

<p>
  <strong>A short tangent.</strong> Given the code above, you might be asking; <em>“why didn’t you just use <code>Object.values</code> instead of <code>Object.keys</code> plus <code>map</code>?”</em> That’s a great question with a quick answer. As of this writing, I’m running Node.js version 6.9.1. <code>Object.values</code> is not supported without the <code>--harmony</code> flag until version <code>7.0.0</code>. I didn’t want to upgrade Node.js for this. I’ll do that another time. That’s all.
</p>

<p>
  I need to get that array of filenames into the service worker file. Again, this isn’t meant to be fancy or scalable. It’s meant to do the work.
</p>

<pre><code class="code-muted">const manifest = require('../build/asset-manifest.json');
const fs = require('fs');
const swPath = 'build/service-worker.js';
const urlsCSV = Object.keys(manifest)
  .filter(k => !k.includes('.map'))
  .map(k => manifest[k]);</code>

<code class="language-javascript">fs.readFile(swPath, "utf8", (err, data) => {
  if (err) { return console.log("Error trying to read SW file", err); }

  const result = data.replace("%MANIFESTURLS%", JSON.stringify(urlsCSV));

  fs.writeFile(swPath, result, "utf8", err => {
    if (err) { return console.log("Error trying to write SW file", err); }
  });
});</code></pre>

<p>
  Let’s break this down. First, open the service worker file (<code>swPath</code>) for reading. The error condition isn’t important. I included it to be nice to myself in case something odd happens during a build.
</p>

<p>
  The next line is the point of this script. It searches the contents of the service worker file (<code>data</code>) for the unique string <code>“%MANIFESTURLS%”</code>. When found, it’s replaced with a JSON stringified version of our filenames array, <code>urlsCSV</code>. Then, the updated contents are written back to the service worker file.
</p>

<h3>Updates to service-worker.js</h3>
<p>
  As mentioned above the generate script needs to find <code>“%MANIFESTURLS%”</code> in <code>service-worker.js</code>. I went back and updated the script to account for that.
</p>
<pre><code class="language-javascript">const STATIC_CACHE_NAME = "colorme-v1";
const BASE_STATIC_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "https://fonts.googleapis.com/css?family=Cousine:400|Karla:400,700"
];
const STATIC_URLS = BASE_STATIC_URLS.concat(JSON.parse('%MANIFESTURLS%'));

// The install handler is the same as when we started.
self.addEventListener("install", event => {
event.waitUntil(
caches.open(STATIC_CACHE_NAME).then(cache => {
return cache.addAll(STATIC_URLS);
}).then(() => self.skipWaiting())
);
});</code></pre>

<p>
  Here’s what I've done. I moved the filenames I know about to <code>BASE_STATIC_URLS</code>. I don’t fingerprint those file names, so they’re safe to hard-code. The important change is next. <code>STATIC_URLS</code> still ends up being an array of filenames, but now it’s a combination of two arrays. The filenames we know about and the generated array of filenames written to this file.
</p>
<p>
  <code>STATIC_URLS</code> ends up looking something like this;
</p>
<pre><code class="language-javascript">[
  "/",
  "/index.html",
  "/manifest.json",
  "https://fonts.googleapis.com/css?family=Cousine:400|Karla:400,700",
  "static/css/main.2ebebc14.css",
  "static/js/main.7e7a1a8f.js",
  "static/media/bgTransparent.e6317315.svg"
]</code></pre>
<p>
  When the project builds the fingerprinted filenames and <code>asset-manifest</code> changes. Then the service worker gets updated with the new filenames.
</p>
<p>
 That all adds up to a build process that handles caching of fingerprinted files and one offline-capable PWA.
</p>
<h2>A New Normal</h2>
<p>
  I’ve seen folks talking at length about how transformative PWAs are, but I couldn’t grasp it until I went through this process. This felt like building a responsive design for the first time. It’s the realization that this isn’t going to be a gimmick or extra or nice-to-have. It’ll take time for habit to kick in and browsers to catch up, but this will become my default when building sites.
</p>
