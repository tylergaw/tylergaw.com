---
tags: post
layout: "layouts/article.njk"
highlightSyntax: true
title: "Papersaver"
date: "2014-02-03"
meta:
  description:
    I love drawing goofy things with Paper. I wanted a quick way to put all
    those goofy drawings on the Web.
---

        <figure>
            <a href="http://lab.tylergaw.com/papers">
                <img src="https://tylergaw.com/articles/assets/post-image-papersaver-intro.png"
                    alt="Papersaver text on a crappy Photoshopped background">
            </a>
        </figure>
        <p class="entry-intro">
            <a href="http://www.fiftythree.com/paper">Paper</a> is an excellent
            product. Like all great products, it not only does a thing well, it
            also makes you want to do that thing more. Paper makes me want to
            draw more. After drawing with Paper for a few weeks, I wanted a
            quick way to share my drawings from Paper to the Web. I built
            <a href="https://github.com/tylergaw/papersaver">Papersaver</a> so I
            could get that done.
        </p>

        <h2>In Dependence</h2>
        <p>
            <a href="http://madewithpaper.fiftythree.com/">Made with Paper</a>
            is a showcase of what people are drawing with Paper. I went to
            submit one of my silly sketches to it and saw that they ask for an
            attribution link. They suggest–and most submissions are hosted
            on–Tumblr. Twitter and Facebook are also mentioned as hosting choices.
            I don’t care for that. I want the canonical location of my brain
            dumps to be on a server that I control. This is my natural tendency,
            but I was also inspired by <a href="http://adactio.com/journal/6620/">Jeremy</a>
            and <a href="http://frankchimero.com/blog/2013/12/homesteading-2014/">Frank’s</a>
            articles on the topic of pushing ourselves to take more control over
            our digital artifacts by self-hosting.
        </p>
        <figure>
            <img src="https://tylergaw.com/articles/assets/post-image-papersaver-attribution.jpg" alt="A portion of the Made with Paper submission form">
            <figcaption>
                Host my masterpieces on a Tumblr? Nope.
            </figcaption>
        </figure>
        <p>
            At this point it was clear that I had a fun side project in front of
            me. With a few days off work for the holidays, I started letting my
            brain run wild with possibilities. The plan was to build some type
            of site where I could publish my drawings while digging into a
            technology or two that was new to me.
        </p>

        <h2>Planning</h2>
        <p>
            I generally start a new project with a few bullet points for
            what I want, what I don’t, technologies I’ll use, etc. These points
            don’t always make it into the final project and some are just
            questions to think about during the process. Here’s a few I jotted
            down for Papersaver:
        </p>

        <h3>Project goals</h3>
        <ul>
            <li>Publish images from Paper to my personal Web site</li>
            <li>Do not rely on third-party platforms for storage</li>
            <li>“In Dependence”</li>
        </ul>
        <figure>
            <img src="https://tylergaw.com/articles/assets/post-image-papersaver-notes01.jpg" alt="Papersaver notes taken in the Paper App">
            <figcaption>
                I used Paper to take notes.
            </figcaption>
        </figure>
        <h3>What does it do?</h3>
        <ul>
            <li>Static HTML site</li>
            <li>Displays a list of images (maybe thumbnails + click to enlarge)</li>
            <li>Git repo backed up to Github</li>
            <li>Different input methods: email, Twitter, direct to repo</li>
            <li>generate(): image creation, HTML generation, Git commit, publish</li>
            <li>How can others use this?</li>
            <li>Permalinks to each item</li>
        </ul>
        <p>
            At this point I’ll also jot down some pseudo-code to start thinking
            about core functions of what I’ll be building. In this case I wanted
            to visualize what the main method of saving a Paper would look like:
        </p>
        <pre><code class="language-clike">newPaper() // takes img

// contents/papers/Date.getTime()
// &quot; &quot;/index.md
// date: D.getTime()
// template: paper.html
// image_path: tylergaw-paper-{date}.jpg
// save img: image_path.jpg</code></pre>

<h2>Getting rolling</h2>
<p>
After a few hours of writing down goals and researching similar
projects I had a good idea of what I would build and the tools I
would use to build it. I needed a way to get my drawings out of Paper.
The App allows drawings to be shared to Tumblr, Facebook, Twitter,
Camera Roll, and Email. The first three were out
since they’re third-parties. I entertained the idea of using a
combination of export to cameral roll and Dropbox to publish, but
went away from it because it didn’t feel flexible enough.
I’d be going the route of publishing via email.
</p>

        <h2>How I use Papersaver</h2>
        <ul>
            <li>
                Draw in Paper
            </li>
            <li>
                Email each drawing I want published to a dedicated email address
            </li>
            <li>
                A Node.js <a href="https://github.com/tylergaw/papersaver/blob/master/papersaver-mail-listener.js">script</a>
                listens for new email at the dedicated email address
            </li>
            <li>
                When a new email arrives, the script grabs the attached
                image and hands it off to
                <a href="https://github.com/tylergaw/papersaver/blob/master/papersaver.js">Papersaver.js</a>
            </li>
            <li>
                Papersaver.js creates the necessary directories and files
                for Node.js static site generator, <a href="https://github.com/jnordberg/wintersmith">Wintersmith</a>
            </li>
            <li>
                Wintersmith regenerates the site with the new drawings
            </li>
            <li>
                The newly added and created files are commited to the Git
                repo and those commits are pushed to the remote repo at Github
            </li>
            <li>
                The drawings live at <a href="http://lab.tylergaw.com/papers">http://lab.tylergaw.com/papers</a>
            </li>
        </ul>
        <h2>The pieces</h2>
        <p>
            Papersaver is a fairly simple hack, but there are a few interesting
            parts worth talking about in more detail.
        </p>
        <h3>Good enough email security</h3>
        <p>
            I'm using a <a href="https://github.com/chirag04/mail-listener2">node package</a>
            to access Papersaver emails over IMAP. I don't want to leave the
            security of my primary email address in the hands of my programming
            skills so I use a dedicated email address–tylergaw.papersaver@gmail.com–for
            Papersaver.
        </p>
        <p>
            I just gave you the email address. So what's to keep you from
            flooding my Papersaver with all the images you please? (aside from your trustworthy nature)
            I use a settings file with to and from whitelists to only allow emails
            to/from certain addresses. Nothing good would come from me adding
            my actual settings to the public Github repo, but I do include a
            <a href="https://github.com/tylergaw/papersaver/blob/master/mail-settings.sample.json">sample settings file</a>.
            The from address is really easy to fake, but the to address is a pretty
            decent way to lock things down.
        </p>
        <p>
            I use a "+slug" on the email address that I don't publish anywhere.
            Fake example; tylergaw.papersaver+71ksk27817@gmail.com. I put that address
            in my <code>toWhitelist</code> settings. The <a href="https://github.com/tylergaw/papersaver/blob/master/papersaver-mail-listener.js#L69">mail listener script</a>
            checks to make sure any emails received are to an address in the whitelist,
            if not, it bails. Fort Knox an email slug don't make, but for this
            little project it gets the job done.
        </p>
        <h3>Papersaver Command-line interface</h3>
        <p>
            While I was working on Papersaver, I didn't want to have to send an
            email each time I needed to test that the saving code was working.
            To make things faster I wrote a <a href="https://github.com/tylergaw/papersaver/blob/master/papersaver-cli.js">simple CLI</a>
            that allows me to create new Papers from images on my machine. I used
            the super-cool node package <a href="https://github.com/substack/node-optimist">Optimist</a>
            to handle the arguments I wanted to provide. The Papersaver CLI isn't
            any type of technological achievement, but it was the first time I've
            written something like it, so it gets a mention here.
        </p>
        <h3>Static site generator</h3>
        <p>
            Since I decided to go the Node.js route for this project, I wanted
            all the pieces to be written in Node.js. <a href="http://wintersmith.io/">Wintersmith</a>
            is a static site generator written in Node.js. These types of static generators
            have been <a href="http://davidtucker.net/articles/introduction-to-wintersmith/">written about at length</a>
            so I don't have anything more to add.
            I'll just say that Wintersmith gets the job done and if I need a
            generator written in Node.js, it will be my go-to.
        </p>
        <h2>Steal this project!</h2>
        <p>
            I didn't build this project just for me. My hope is that other folks
            that use Paper will find it interesting and start self-hosting the
            notes, drawings, and sketches they create. Papersaver isn't yet a
            turnkey project. I had that in mind from the start, but it will require
            more work to get it there. In the meantime, I'd love to see forks of
            it that remedy some of the issues that are currently making it not
            ready for quick re-use. I'm also 100% open to pull requests, so
            <a href="https://github.com/tylergaw/papersaver">fork it!</a>
        </p>
        <p>
            <i>Thanks for reading</i>
        </p>
