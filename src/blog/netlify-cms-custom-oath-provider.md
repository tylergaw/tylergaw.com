---
layout: "layouts/article.njk"
title: "Using a Custom OAuth Provider with NetlifyCMS"
highlightSyntax: true
date: "2019-08-18"
meta:
  description: An example of using a custom GitHub OAuth provider with NetlifyCMS.
  image: /articles/assets/post-image-netlifycms-oauth.png
---

<p class="entry-intro">
  At <a href="https://www.streetcred.co">work</a>, we’re in the middle of a site
  realign and rebuild. As part of that effort, we’re moving to
  <a href="https://www.netlifycms.org/">NetlifyCMS</a>. Implementing NetlifyCMS
  was eerily easy for me. But, I did hit one snag when it came to OAuthing
  with GitHub. In this post I explain the problem and what I did to get things
  working.
</p>

<p>
  First, the problem. I didn’t do anything fancy with
  the NetlifyCMS installation. I used the standard approach described
  in <a href="https://www.netlifycms.org/docs/add-to-your-site/">their docs</a>. One
  requirement we had was to not use Netlify. We wanted to keep things on our
  AWS infrastructure, because that’s where all our stuff is. We didn’t want
  another thing to manage.
</p>

<p>
  Before diving in, here are links to examples described in this post. These
  might be all you need to get going if you’re building a similar thing:
</p>
<ul>
  <li><a href="https://tylergaw.github.io/netlify-cms-github-oauth-provider-client-example">Live client example</a></li>
  <li><a href="https://github.com/tylergaw/netlify-cms-github-oauth-provider-client-example">Client example repo</a></li>
  <li><a href="https://glitch.com/edit/#!/netlify-cms-github-oauth-provider-example">Server example on Glitch</a></li>
  <li><a href="https://github.com/tylergaw/netlify-cms-github-oauth-provider-server-example">Server example repo</a></li>
</ul>

<p>
  For NetlifyCMS authenticaton I went with <a href="https://www.netlifycms.org/docs/authentication-backends/#github-backend">GitHub backend</a>.
  I got lost there. The docs say:
</p>

<blockquote>
  <p>To enable basic GitHub authentication:</p>

  <ol>
    <li>Follow the authentication provider setup steps in the Netlify docs.</li>
    <li>Add the following lines to your Netlify CMS config.yml file:</li>
  </ol>
  <cite>
    <a href="https://www.netlifycms.org/docs/authentication-backends/#github-backend">NetlifyCMS docs, "Authentication & Backends - GitHub Backend”</a>
  </cite>
</blockquote>

<p>
  I didn’t want to use Netlify. But I also went ahead and followed the docs they
  referenced in step one. Even with that, I couldn’t quite figure out what
  needed to happen. Step two above was fine. But, I could tell something was
  missing.
</p>

<h2>The Problem</h2>
<p>
  When I tried to log in to the NetlifyCMS on our
  deployed site, I would hit a 404. So I knew I was missing some piece, but
  was unclear what that was. I’d spent a while banging my head against it so
  I asked <a href="https://gitter.im/netlify/NetlifyCMS?at=5d4da39b9507182477ac29cf">a question</a>
  in the NetlifyCMS Gitter room, but didn’t find help there.
</p>

<h2>The Solution</h2>
<p>
  <strong>To use a GitHub backend with NetlifyCMS, you have to have your own server
    to handle OAuth</strong>. This is a requirement of GitHub’s authentication
    flow. The good news about that, is that it’s a standard OAuth flow. The
    bad news about that, is that it’s a standard OAuth flow.
</p>

<h3>Prior Art</h3>

<p>
  <a href="https://github.com/vencax/netlify-cms-github-oauth-provider">vencax/netlify-cms-github-oauth-provider</a>
  is an example of what’s needed. It’s mostly an example of a standard OAuth flow with
  a couple—very—helpful NetlifyCMS-specific bits. That got me almost there, but I still
  couldn’t get everything working. I was still having trouble understanding
  how all the pieces fit together.
</p>

<p>
  What I needed to do was build my own server to handle the OAuth flow.
  This is a thing I’ve done and <a href="https://tylergaw.com/articles/jribbble-three-and-oauth/">written about before</a>.
  OAuth is like that for me. I set it up. Deploy it. Forget it. Then have to
  give myself a refresher to do again. That’s what the server example in this
  post is.
</p>

<h3>The Server</h3>

<p>
  I went with <a href="https://glitch.com">Glitch</a> for this example. For me
  it’s quickest way to get a server spun up. And the easiest way for me to share
  it with you.
</p>

<p>
  I put steps in the <a href="https://github.com/tylergaw/netlify-cms-github-oauth-provider-server-example#what-you-need-to-do">README</a>
  to explain what you need to do to get this up and running for your own use.
</p>

<p>
  The user-facing part of the <a href="https://glitch.com/edit/#!/netlify-cms-github-oauth-provider-example">server example</a>
  exists, but it’s not meant for direct use. If you try to use it directly it’ll
  look like it’s not doing anything. The idea is for you to copy the
  example—either on Glitch or your own server—and point your NetlifyCMS client
  at it using the <code>base_url</code> key described below and in the client
  example.
</p>

<p>
  The code is 99% standard OAuth handshake handling.
  A <code>GET</code> followed by a <code>POST</code> to GitHub’s OAuth resources
  to retrieve the OAuth access token. I left comments in the code to point out what’s
  happening and what’s NetlifyCMS-specific. The biggest chunk of code that
  NetlifyCMS needs is this;
</p>

<pre><code class="language-javascript">const postMsgContent = {
  token: body.access_token,
  provider: "github"
};

const script = `
  &ltscript&gt;
    (function() {
      function recieveMessage(e) {
        console.log("recieveMessage %o", e);

        // send message to main window with the app
        window.opener.postMessage(
          'authorization:github:success:${JSON.stringify(postMsgContent)}',
          e.origin
        );
      }

      window.addEventListener("message", recieveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
  })()
&lt;/script&gt;`;</code></pre>

<p>
  A couple bits of formatting aside, I took this from <a href="https://github.com/vencax/netlify-cms-github-oauth-provider/blob/master/index.js#L74">vencax/netlify-cms-github-oauth-provider</a>.
  This chunk of code is a little tough to follow. The gist of it is that your
  NetlifyCMS client JavaScript is gonna get your GitHub access token via
  <code>postMessage</code>. I tried to find the postMessage handling code in
  the NetlifyCMS code, but haven’t been able to track it down yet. If anyone
  knows where that is, <a href="mailto:me@tylergaw.com">I’d love to know</a>.
</p>
<p>
  We put this <code>script</code> in a string because we have the
  server respond with it. You could also put this in HTML and return the
  access token a different way, but this a way to make short work of it.
</p>

<h3>The Client</h3>

<p>
  There’s a single customization needed to make this work with the standard
  GitHub backend NetlifyCMS configuration. The <code>base_url</code> key.
</p>

<code><pre class="language-yml">backend:
name: github
branch: master
repo: tylergaw/netlify-cms-github-oauth-provider-client-example # change this to your repo
base_url: https://netlify-cms-github-oauth-provider-example.glitch.me # change this to your OAuth server

</pre></code>

<p>
  The other items in <code>config.yml</code> are standard NetlifyCMS config
  items. <code>base_url</code> needs to be a public URL to the server that
  handles OAuth for your GitHub application. Like
  the example in this post.
</p>

<p>
  You can see in the <a href="https://github.com/tylergaw/netlify-cms-github-oauth-provider-client-example">client code</a>
  that this is a no frills NetlifyCMS setup.
</p>

<h2>That’s All</h2>

<p>
  We’re a similar setup at <a href="https://streetcred.co">StreetCred</a> on
  our soon-to-launch new site and so far, so good. NetlifyCMS is an excellent
  project. One that I’ve been wanting for years. It checks all the boxes that
  other CMSs don’t and I look forward to using it more.
</p>
<p>
  If this post and/or the examples helped you, or if you try to use it and get
  stuck, send me an email at <a href="mailto:me@tylergaw.com">me@tylergaw.com</a>
  and let me know.
</p>
