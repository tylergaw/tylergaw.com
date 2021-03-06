---
tags: post
layout: "layouts/article.njk"
highlightSyntax: true
title: "Jribbble Three and Helping People OAuth"
date: "2018-04-15"
meta:
  description: Jribbble 3.0 is a rewrite for Dribbble API v2 and I'm doing what I can to help people with the new required OAuth process.
  image: /articles/assets/post-image-jribbble-three.png
---

<p class="entry-intro">
  In December 2017, Dribbble <a href="http://developer.dribbble.com/changes/2017-12-05-api-v2/">announced</a> version two of their API. In the same post, they set March 26, 2018 as the deprecation date of version one. I’ve maintained Jribbble for almost <a href="https://github.com/tylergaw/jribbble/commit/0895bed9b12d25dbf9ec04073acf64823a512267">8 years now</a>. It’s a JavaScript library to help fetch data from the Dribbble API. In that time it’s gone through plenty of iteration to keep up with Dribbble API changes. Jribbble 3.0 continues that trend.
</p>

<p>
  To date, Dribbble API changes have been additive. API features have given users more access to more of data via the API. As Dribbble explained in <a href="http://developer.dribbble.com/changes/2017-12-05-api-v2/">their post</a>, version two goes the other way, it removes a lot of functionality.
</p>

<p>
  The reduced functionality seems fine though. In my time working on Jribbble, most conversations I’ve had with designers are about using it to get their own shots. That’s still available, and the focus of API version two. My guess is most users of Jribbble won’t lose out. They will need to make code changes to continue using Jribbble though.
</p>

<p>
  I’ve had a few conversations with folks on <a href="https://github.com/tylergaw/jribbble/issues/18">GitHub</a> and email about updating to Jribbble 3.0. The biggest change is that Jribbble is no longer a jQuery plugin. It’s now a standalone library. I write more about the decision to remove jQuery later in this post.
</p>

<p>
  The other big change is the shape of Jribbble’s public API methods. Here’s a 2.x vs 3.x example of a user getting their own shots with Jribbble:
</p>

<pre><code class="language-javascript">// Jribbble 2.x
$.jribbble.setToken("&lt;access_token&gt;");
$.jribbble.users("tylergaw").shots().then(function(shots) { /* Work with shots JSON */ });</code></pre>

<pre><code class="language-javascript">// Jribbble 3.x
jribbble.setToken("&lt;access_token&gt;");
jribbble.shots(function(shots) { /* Work with shots JSON */ });</code></pre>

<p>
  The Jribbble API is no longer chainable or promise-based. Again, I detail more of the code decisions later in this post. We can still do the same thing, but now in a more concise way.
</p>

<h2 id="a-new-barrier-to-entry">A New Barrier to Entry</h2>
<p>
  With Dribbble API version one, we could make requests using read-only client access tokens. When creating an application via the Dribbble UI, they would generate the client access token. We could then use that token to make requests to the API.
</p>
<p>
  In version two, those easy-to-use, auto-generated client access tokens are gone. Now, all requests must use a <a href="https://stackoverflow.com/questions/25838183/what-is-the-oauth-2-0-bearer-token-exactly">bearer token</a>. To get a bearer token, you have to go through the <a href="http://developer.dribbble.com/v2/oauth/#web-application-flow">OAuth2 flow</a>.
</p>
<p>
  Depending on your experience with OAuth, you might read that and think; “Sure, no problem. OAuth is easy” or “uhhhh, what’s an OAuth?” or somewhere in between. At any experience level, if you only want to make a single API request to display your Dribbble shots on your personal site, it’s a rigmarole.
</p>
<p>
  When I first read about the new auth I thought, “welp, Jribbble is dead. As is all client-side JS access to the Dribbble API.” I thought this beause in most cases, you shouldn’t put OAuth-generated bearer access tokens in public code. Doing so makes them available for anyone to find and act on behalf of token owners in any–malicious–way they want.
</p>
<p>
  <a href="https://twitter.com/tylergaw/status/951532274482368512">I asked the Dribbble folks</a> about this and they let me know that in this case, putting access tokens in public code would be OK because they’re read-only. A bad actor could still snag your access token and use it to abuse the API on your behalf. I’d guess by making a ton of nonsense requests. The Dribbble API has rate-limiting in place to help mitigate this. At the worst, Dribbble could revoke your access token or disable your app. You’d then need to go back though the process to get a new token and/or create a new app.
</p>

<p>
  This change still didn’t sit well with me though. What are less code-savvy folks supposed to do? The main users of Dribbble and Jribbble are Designers. There’s a good chance many of them don’t have experience creating and deploying OAuth flows. That’s exactly who I’ve had conversations with over the years. And that’s who has reached out to me since the API version two announcment. Folks that know enough code to copy, paste, and tweak a snippet of JS, but not enough code to build and deploy a custom OAuth setup.
</p>
<p>
  With that, I set out to come up with a way to help them. Because that’s what we do here.
</p>

<h3 id="options">Options</h3>
<p>
  My first idea was to create a site where people would authenticate with
  a Dribbble application that I owned. They’d show up, tap “connect”, confirm
  with Dribbble, then get directed back to my site where they’d get an access token.
</p>
<p>
  That would get the job done, but felt wrong. Having people authenticate through my app would mean their access tokens would be in my hands. If I deleted the
  app—or my Dribbble account—their tokens would stop working. If a bad actor generated a token then used it to abuse the API, my app could get suspended. Again, taking every user’s access token with it.
</p>
<p>
  I needed a way for every Jribbble user to be able to generate access tokens using an application they owned.
</p>
<h3 id="glitch">Glitch</h3>
<p>
  If you haven’t used it yet, <a href="https://glitch.com/">Glitch</a> is an excellent tool for sharing and learning code. What sets Glitch apart from similar code-sharing tools is that it gives you the ability to create and share web servers.
</p>
<p>
  That’s exactly what I needed for this OAuth problem. I could write the server
  necessary for the OAuth flow, then make it available for anyone to–in the parlance of Glitch–“remix” the code to get full access to it. And they can do so without even creating a Glitch account.
</p>
<p>
  So that’s what I did. <a href="https://jribbble.glitch.me">jribbble.glitch.me</a>
  is template that anyone can remix to get their own OAuth flow for generating bearer tokens to use with Dribbble API version two.
</p>
<p>
  I won’t say that writing a server for this is “easy” because it’s only easy if
  you already know how to do it. But, I hope that this will help folks
  see that it’s attainable. To demonstrate, I’m going to plop the entire server here. The code is under 100 lines. The rest is comments to help people understand what’s happening at each step along the way:
</p>

```js
const express = require("express");
const tiny = require("tiny-json-http");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");

// We store the relavant Dribbble URLs here for convenience.
// authUrl is passed along to our template in the `/` handler below.
const authUrl = "https://dribbble.com/oauth/authorize";
const tokenUrl = "https://dribbble.com/oauth/token";

// The path of the Callback URL we set when creating our application on Dribbble.
// We reference this URL below in an app.get
const callbackUrl = "/oauth_callback";

// This isn't oauth or dribbble specific, but storing the value of the original
// Glitch project to check if we're seeing the original or a remix.
const ogGlitchUrl = "https://jribbble.glitch.me";

// These environment variables need to be set in the `.env` file. Look to your left 👈
// client id is safe as public value, if those are seen, it's OK.
// client_secret is not safe for public. You need to keep that private at all times.
const client_id = process.env.DRIBBBLE_APP_ID;
const client_secret = process.env.DRIBBBLE_APP_SECRET;

// When we receive an access_token from the api.dribbble.com server, we'll store it
// in this variable.
// Q: Why do we use `let` here instead of `const`?
// A: We use `let` so we can reassign `access_token` to a new value. Here, we set
// an initial value of `null`. Below in the `/oauth_callback` handler we set
// it to a new value of the access_token from the server.
let access_token = null;

// Standard express setup code.
const app = express();
app.use([express.static("public"), cookieParser()]);

// Set up our template library.
// I–Tyler–didn't look too deep into this, this block of code came from the nunjucks
// docs and got me up and running, so good enough for me at this time.
nunjucks.configure(["views", "public"], {
  autoescape: true,
  express: app,
});

// This is our homepage and the page that does most of the work.
app.get("/", (req, res) => {
  const pageUrl = `https://${req.get("host")}`;

  // Here, we'll try to set the access_token from a cookie.
  // In the callback handler below, we set the access_token cookie on successful auth.
  // This isn't something you need to do in your Jribbble uses.
  access_token = req.cookies.access_token;

  // We use render so we can pass along variables to our template.
  // In index.html any time you see {{thing}} or {% %}, we're referencing
  // a variable we set here.
  res.render("index.html", {
    authUrl,
    accessToken: access_token,
    clientId: client_id,
    // Just in case we've hit an authentication error we'll use this to display a message in the template
    error: req.query.error,
    // We create new boolean value here so we don't send the actual secret to the template.
    // Note: I–Tyler–am not sure this is 100% necessary, but it felt best to be overly
    // cautious when our app secret. You don't want anyone to have that.
    hasClientSecret: client_secret.length,

    pageUrl,
    isRemix: pageUrl !== ogGlitchUrl,
    callbackUrl,
  });
});

// This is where our Dribbble applications will come back to after a GET to authUrl
app.get(callbackUrl, async (req, res) => {
  const data = {
    code: req.query.code,
    client_id,
    client_secret,
  };

  try {
    // We required `tiny` above in tiny-json-http
    // That's a small http library I preferred to use https://github.com/brianleroux/tiny-json-http
    // It's not the only way to make requests, there are many different was to accomplish
    // this http post request to Dribbble
    // Note we are using async/await here. If you're unfamiliar, that's OK. The number one thing
    // to know is `await` makes this code act like it's pausing here and waiting for the http
    // request to complete before moving on to the following lines of code.
    const { body } = await tiny.post({ url: tokenUrl, data });

    // As mentioned above, here we're assigning access_token a new value that is your
    // shiny oauth access token that gives you public read access to your Dribbble account
    access_token = body.access_token;

    // NOTE: Setting a cookie want be required in your uses of Jribbble, because you will
    // include the access_token in your JavaScript.
    res.cookie("access_token", access_token);

    // We don't want to stay on the /oauth_callback page, so redirect back home.
    res.redirect("/");
  } catch (err) {
    // If we hit an error we'll handle that here
    console.log(err);
    res.redirect("/?error=😡");
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.redirect("/");
});

app.listen(process.env.PORT);
```

<p>
  Again, you can remix this at <a href="https://jribbble.glitch.me">jribbble.glitch.me</a>
  to get full access to the code.
</p>
<p>
  Another cool thing. This example is intended for the Dribbble API, but with a
  few minor changes, it will work for any standard OAuth flow.
</p>

<p>
  If you use that and run into trouble–or think it’s great–let me know on <a href="https://twitter.com/tylergaw">Twitter</a>.
</p>

<h2 id="the-jribbble-rewrite">The Jribbble Rewrite</h2>
<p>
  The main part of this project was writing Jribbble 3.0.
  <a href="https://github.com/tylergaw/jribbble/blob/v2.0.4/src/jribbble.js">Jribbble 2.x</a> has six public methods to access resources from Dribbble
  API version one. Many of those methods have subresources like comments, likes, et al. It also has a chainable, promise-based interface. All these things add a non-trivial amount of plumbing code to make them possible.
</p>
<p>
  Dribbble API version two reduces functionality to getting the current
  user’s profile, shots, and projects. For Dribbble-approved applications you can get a user’s likes and a list of popular shots.
</p>
<p>
  The reduced functionality meant I could cut most of Jribbble’s code. The first
  thing I did was audit the usage of jQuery. The only jQuery methods in use were; <code>$.ajax</code>, <code>$.Deferred</code>, and <code>$.extend</code>.
  Because of the limited usage, I decided Jribbble 3.0 would not use jQuery.
</p>
<p>
  It also didn’t feel necessary to use any type of transpiling process. So no Babel or
  TypeScript or the like. I would only write good-ole browser JavaScript. Also, I wanted 3.0 to work in as many browsers as possible, so I only used old-timey
  JS. No arrow functions, no <code>let</code> or <code>const</code>, etc. It wasn’t that bad. This is a small library so
  restraining myself to older JS wasn’t a problem. And writing it directly instead of relying on Babel keeps the file size smaller.
</p>
<p>
  I could have used newer features and still probably ended up with wide-enough support, but it was a fun challenge. And it reminded me of writing JS in years past.
</p>

<p>
  This was enough of a rewrite that I opened a new, blank file and started
  writing instead of reusing 2.0 code.
</p>

<h3 id="30-details">3.0 Details</h3>
<p>
  Like 2.0, this version also has six public methods;
  <code>setToken</code>, <code>shots</code>, <code>user</code>, <code>projects</code>, <code>likes</code>, and <code>popular</code>. Each method is available on the window-scoped <code>jribbble</code> object.
</p>
<p>
  <code>setToken</code> is the same as in 2.0. It’s how users give Jribbble
  their access tokens.
</p>
<pre><code class="language-javascript">jribbble.setToken("12345");</code></pre>
<p>
  For 3.0 I decided to also allow users to provide their token as an option when calling any of the other methods. For example:
</p>

<pre><code class="language-javascript">jribbble.shots({token: "12345"}, callback);</code></pre>

<p>
  That accomplishes the same thing as <code>setToken</code> in a more concise way.
</p>
<p>
  From here, I’ll detail three internal functions that handle the lion’s share of what Jribbble can do.
</p>
<h3 id="function-one-get">Function one: <code>get</code></h3>
<p>
  I took it back in time for this one. For day-to-day work I use <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">fetch</a> or a wrapper like <a href="https://github.com/axios/axios">Axios</a> to make network requests. For Jribbble I didn’t want to use a third-party library or polyfills for requests. So instead of fetch, I went back to <code>XMLHttpRequest</code>.
</p>
<p>
  All Jribbble requests have the same requirements so I was able to abstract the functionality to a common function. I use the internal <code>get</code> function for all requests to the Dribbble API:
</p>
<pre><code class="language-javascript">var get = function(path, callback) {
  var url = "https://api.dribbble.com/v2/" + path;
  var req = new XMLHttpRequest();
  req.addEventListener("load", function() {
    if (callback) {
      if (typeof callback === "function") {
        var ret = {};

        if (this.status < 400) {
          try {
            ret = JSON.parse(this.responseText);
          } catch (err) {
            ret = {
              error: "There was an error parsing the server response as JSON"
            };
          }
        } else {
          ret = {
            error:
              "There was an error making the request to api.dribble.com.",
            status: this.status
          };
        }

        callback(ret);
      }
    }

});
req.open("GET", url);
req.setRequestHeader("Authorization", "Bearer " + accessToken);
req.send();
};</code></pre>

<p>
  Not bad. It’s a standard <code>XMLHttpRequest</code> GET request with an Authorization header. The bulk of the function is guard code to protect against type errors, JSON parsing problems, and network errors. It does what it can to fail with grace if there is a problem.
</p>
<p>
  I use the Authorization header to send along the user’s Dribbble access token with every request.
</p>

<p>
  The <code>get</code> function will work back to IE7. I figured It’d be safe to not include the old fork to check for <code>ActiveXObject</code>. It’s been years since I’ve typed that, it’s giving me a good chuckle to see it here.
</p>

<h3 id="function-two-createApiMethod">Function two: <code>createApiMethod</code></h3>
<p>
  The <code>user</code>, <code>projects</code>, <code>likes</code>, and <code>popular</code> methods all do the same thing. They process N-number of arguments, make a request to the Dribbble API, and call a user-provided callback. The callback receives a single argument, the JSON response from the request.
</p>
<p>
  Because they’re all similar, I didn’t want to have to repeat the same code when defining each method. Instead, I abstracted the functionality to <code>createApiMethod</code>.
</p>
<pre><code class="language-javascript">var createApiMethod = function(path) {
  return function() {
    var args = processArguments.apply(null, arguments);
    get(path + args.query, args.callback);
  };
};</code></pre>
<p>
  The <code>path</code> parameter is passed along to <code>get</code> to build the URL to the Dribbble API.
</p>
<p>
  I then define each public method as a member of the <code>api</code> object. Each is a function with a unique path based on its needs.
</p>
<pre><code class="language-javascript">var api = {
  ...
  user: createApiMethod("user"),
  projects: createApiMethod("user/projects"),
  likes: createApiMethod("user/likes"),
  popular: createApiMethod("popular_shots")
};</code></pre>
<p>
  This doesn’t provide any extra functionality. It only makes it so I don’t
  have to repeat as much code when defining methods. <code>createApiMethod</code> returns a function. Let’s look at what’s happening in the body of that function.
</p>
<pre><code class="language-javascript">var args = processArguments.apply(null, arguments);
get(path + args.query, args.callback);</code></pre>
<p>
  The first line is the heavy lifting. It’s function number three that I’ll write about next. For now, it’s important to know that it returns an object with <code>query</code>, <code>callback</code>, and <code>resourceId</code> keys.
</p>
<p>
  Those values, plus the <code>path</code> argument, let us build the arguments needed to make the request to Dribbble with <code>get</code>.
</p>

<h3 id="function-three-processArguments">Function three: <code>processArguments</code></h3>
<p>
  For me, this is the most interesting bit of code in Jribbble. Every public Jribbble method except <code>setToken</code> uses <code>processArguments</code>. Its purpose is to inspect all arguments passed to Jribbble methods.
</p>
<p>
  To show its usefulness, consider the following usage examples:
</p>

<!-- prettier-ignore-start -->
<pre><code class="language-javascript">jribbble.shots(
  "456789",
  { token: "12345" },
  function(shotObject) { /* Work with JSON */ }
);

jribbble.shots({
    token: "12345",
    page: 3,
    perPage: 5
  },
  function(shotsArray) { /* Work with JSON */ }
);

jribbble.projects(
  function(projectsArray) { /* Work with JSON */ },
  { token: "12345" }
);

jribbble.user(
  function(userObject) { /* Work with JSON */ }
);</code></pre>

<!-- prettier-ignore-end -->

<p>
  Notice in each I’m providing a different number of arguments of different types. And in the case of <code>projects</code> I’m providing the arguments in a different order. This type of flexibility isn’t possible with a typical method signature. One where I define each parameter when I create the method.
</p>
<p>
  For example, imagine a method signature for <code>jribbble.shots</code> like this:
</p>
<pre><code class="language-javascript">var shots = function(shotId, options, callback) { /* Do the work */ };</code></pre>

<p>
  That would work for the first usage example, but what about the second? What if I don’t need a single shot and I don’t need to provide an <code>options</code> argument?
</p>
<p>
  This is where <code>processArguments</code> comes into play.
</p>

<p>
  First, notice when I call the function in <code>createApiMethod</code> I use <code>apply</code>:
</p>
<pre><code class="language-javascript">var args = processArguments.apply(null, arguments);</code></pre>

<p>
  This took me a few minutes to get my head around. It’s also hard to write about, but here goes. I need the function that <code>createApiMethod</code> returns to take zero to
  three arguments. The Jribbble user, provides those. Using <code>apply</code> let me pass along the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments"><code>arguments</code></a> object received from calls to public API methods. Then, within
  <code>processArguments</code> I have access to that original <code>arguments</code> object. Once I have it, I convert it to an array for manipulation:
</p>
<pre><code class="language-javascript">var args = [].slice.call(arguments);</code></pre>

<p>
  An important thing to note is <code>processArguments</code> doesn’t define parameters:
</p>
<pre><code class="language-javascript">var processArguments = function() {...};</code></pre>

<p>
  Again, that’s not something I can define ahead of time. This whole dance lets
  the public methods be flexible in number and order of parameters. It
  lets them say “yeah, whatever you got, I’ll take it.”
</p>

<p>
  I mentioned earlier, <code>processArguments</code> returns an object with <code>query</code>, <code>callback</code>, and <code>resourceId</code> keys. The work of the function focuses on creating that object.
</p>

<p>
  While I can’t define parameters, I do know a few things about potential arguments. I know any callback should be a function and any options should be an object. I also know <code>resourceId</code> is the identifier for a Dribbble shot. A shot id can be a string or a number.
</p>

<p>
  I use that knowledge to inspect each item in the <code>args</code> array I created from the <code>arguments</code> object. Depending on the type I assign the item’s value to a local variable.
</p>
<pre><code class="language-javascript">...
var resourceId = null;
var opts = {};
var callback = function() {};
...
for (var i = 0; i < args.length; i += 1) {
  switch (typeof args[i]) {
    case "string":
    case "number":
      resourceId = args[i];
      break;
    case "object":
      opts = args[i];
      break;
    case "function":
      callback = args[i];
  }
}</code></pre>
<p>
  That snippet sets two out of three variables this function needs to return. <code>resourceId</code> and <code>callback</code> are ready to to go. I only use <code>resourceId</code> in <code>jribbble.shots</code>. The Dribbble API has different paths if you’re requesting a single shot or a list of shots. I use the value–or lack of a value–of <code>resourceId</code> to <a href="https://github.com/tylergaw/jribbble/blob/3.0.0/src/jribbble.js#L104">determine the path</a>.
</p>
<p>
  What about the third item, <code>query</code>? Also what is this <code>opts</code> object in favor of?
</p>
<p>
  In earlier examples, I showed providing an object with token, page, and per_page keys to public methods. Token is the most important one. If a user doesn’t provide an access token, they can’t make requests. After the for loop I check for a token key on the <code>opts</code> object:
</p>
<pre><code class="language-javascript">if (opts.token) {
  accessToken = opts.token;
}</code></pre>
<p>
  I define <code>accessToken</code> at the root level of the main Jribbble function. This is how I provide the flexibility of setting token with the <code>setToken</code> method or via an options object.
</p>
<p>
  At this point in <code>processArguments</code>, if there’s no value for <code>accessToken</code> there’s no reason to continue. I throw an error and let the user know they need to update their code.
</p>
<pre><code class="language-javascript">if (!accessToken) {
  throw new Error(
    "jribbble needs a valid access token. You can either include this as an option: jribbble.shots({token: '1234'}) or with jribbble.setToken('1234')"
  );
}</code></pre>
<p>
  If the user provided <code>page</code> or <code>per_page</code>, those keys will also be on the <code>opts</code> object. <code>query</code> needs to be a string that I can append to the URL of any request. So, I need to create that string if necessary. I know that “page” and “per_page” are the only query parameters allowed because they’re <a href="http://developer.dribbble.com/v2/#pagination">documented</a>. I can use that knowledge to build the string based on the user-provided values.
</p>
<pre><code class="language-javascript">var params = ["page", "per_page"]
  .map(function(p) {
    return opts[p] ? p + "=" + opts[p] : null;
  })
  .filter(function(i) {
    return i;
  })
  .join("&");</code></pre>
<p>
  For each item in the array check to see if that key exists in <code>opts</code>. If it does, return a string beginning with the item plus an equals sign plus the value in <code>opts</code>. If the key isn’t in <code>opts</code> return <code>null</code>.
</p>
<p>
  At this point, we could have an array that looks like:
</p>
<pre><code class="language-javascript">["page=4", null]</code></pre>
<p>
  That’s if the user set a <code>page</code>, but not a <code>per_page</code> value.
</p>
<p>
  Next, I use <code>filter</code> to remove any <code>null</code> values. And finally join the items of the array with an ampersand between each. In the above example we’d end up with “page=4”.
</p>
<p>
  <code>processArguments</code> is ready to return an object with the three keys needed. I also need to do one last thing for <code>query</code>. If the user doesn’t need a query, return an empty string. If they do, prefix the <code>params</code> string with a “?” so it’s ready to append to a URL.
</p>

<pre><code class="language-javascript">return {
  resourceId: resourceId,
  callback: callback,
  query: params ? "?" + params : ""
};</code></pre>

<p>
  And that’s <code>processArguments</code>. Syntax and even code-wise it’s not fancy, but it does a job and does it in what I think is a clear way.
</p>

<h2>One more iteration complete</h2>
<p>
  This was another iteration on a little library I keep going. It has a small userbase, but I know it provides value for them when it’s needed. As the Dribbble API changes, I’ll keep Jribbble in sync as best I can.
</p>
<p>
  Again, the OAuth flow project is at <a href="https://jribbble.glitch.me">jribbble.glitch.me</a> or just <a href="https://jribbble.com">jribbble.com</a>. The Jribbble source is <a href="https://github.com/tylergaw/jribbble">available on GitHub</a>. If you run into trouble, please open an issue or submit a pull request.
</p>
