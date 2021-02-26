---
tags: post
layout: "layouts/article.njk"
highlightSyntax: true
title: "How I Manage Nginx Config"
date: "2014-07-24"
meta:
  description:
    NGINX site configuration is fairly straightforward, but managing the files
    for it can be a bit cumbersome. I use git and Github to make the process
    quicker and more comfortable.
---

<p class="entry-intro">
    I host my personal sites–this one, <a href="http://lab.tylergaw.com/">my lab</a>, <a href="http://againwiththis.com/">my quips</a>,
    <a href="http://listentoslayer.com/">nonsense</a>, and others–on a
    Rackspace <a href="http://en.wikipedia.org/wiki/Virtual_private_server">VPS</a>.
    <a href="http://nginx.com">NGINX</a> is my web server of choice. Each site
    has its own configuration file. I’m definitely not Mr. Sys Admin,
    but I have an easy way of organizing those config files to help me make quick
    updates and additions.
</p>

<p>
    I’m assuming some knowledge with this post. Folks who have middle ground knowledge
    of NGINX will get the most out of this. It’s not a how-to NGINX post, so beginners may not find it useful.
    It also may not be helpful if you have advanced NGINX knowledge as you likely
    have a better way to handle these things.
</p>

<h2>What I Do</h2>
<p>
    I keep my config files in a private Github repo called “server-conf”. In it
    I have two directories; “local” and “prod”. Local for the NGINX install
    on my developement machine and prod for my VPS. I have different sites
    locally than I do production. Each site whether local or prod has its
    own config file.
</p>
<figure>
    <img src="https://tylergaw.com/articles/assets/post-image-nginx-conf-editor.jpg" alt="The server-conf repo opened in a text editor">
    <figcaption>
        server-conf in my current preferred text editor, Atom. Being able to use it instead of something
        like Vim is much more comfortable for me
    </figcation>
</figure>
<p>
    Both locally and in production, I clone the server-conf repo to my home directory.
    To tell NGINX where the config files are, I use <code>include</code>
    in the <code>http</code> block of the main NGINX config file, <code>nginx.conf</code>.
    The location of this file is different for each install. Locally, mine is at
    <code>/usr/local/etc/nginx</code>. I can never remeber where it is
    on my VPS, I just have to peck around until I find it. Here are
    the relevant snippets from my local and prod <code>nginx.conf</code>.
</p>
<pre><code class="language-clike"># local

http {
...
include /path/to/home/server-conf/local/\*;
}
</code></pre>

<pre><code class="language-clike"># production
http {
...
include /path/to/home/server-conf/prod/\*;
}</code></pre>

<h2>Why the Home Directory?</h2>
<p>
Mainly because I can never remember the default location of NGINX config
files. This is especially true on my VPS since I access it infrequently. Having it in the home
directory allows me to stumble on it since it’s the first directory
I see when I SSH into the VPS.
</p>
<h2>How is this helpful?</h2>
<p>
This helps me in a number of ways. First, like I mentioned above, it
makes locating the config files much easier.
</p>
<h4>Comfort</h4>
<p>
Doing this allows me
to use a text editor I’m most comfortable with to make updates to
production configs.
</p>
<p>
When I need to make an addition or change to production config I can make the changes
on my machine. I then commit and push the changes to Github. Then SSH into
my VPS, and navigate to the <code>server-conf</code> directory. There
I <code>git pull</code> and after an <code>nginx -s reload</code> my
changes are live.
</p>
<p>
Before this, to make production changes I would have to SSH into the VPS,
navigate to the default NGINX config location
and use Vim to make changes. This was a slow and error-prone
process for me because I’m not comfortable with Vim and I get a bit
lost sometimes navigating with the command line. Also, my server
isn’t the fastest so editing there is much slower than it is on my
laptop.
</p>
<h4>Git</h4>
<p>
The ability to quickly roll back breaking changes is huge.
If I pull down changes that cause the prod server to stop working, I
can use git to check out the previous version of the offending file(s) while I fix the problem.
If I’m making larger changes I can create a different branch to make it even
easier.
</p>
<p>
Config backup via Github. If I get a new computer or if mine is damaged,
I won’t have to recreate my configs for local development. I can just clone the repo and
make the quick update the <code>nginx.conf</code> to get back up and running.
</p>
<p>
Another cool thing is having a config revision history. Since everything
is in git and on Github, I can see when and what changes I’ve made.
This isn’t that helpful for me since I’m the only one making changes
and they tend to be small, but it could be a huge plus if you have
multiple people making updates.
</p>
<figure>
<img src="https://tylergaw.com/articles/assets/post-image-nginx-conf-log.jpg" alt="Github commit log for the server-conf repo">
<figcaption>
The server-conf git log provides a history of config changes
</figcation>
</figure>
<p>
NGINX is relativily easy to configure, but I used to dread making
changes in production because I’m not as handy with the command-line
and Vim as I am a graphical text editor. Having this setup in place
makes it as easy as updating any other files associated with my sites.
</p>

<p>
    <i>Thanks for reading</i>
</p>
