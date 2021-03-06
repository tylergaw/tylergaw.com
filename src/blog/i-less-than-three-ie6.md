---
tags: post
layout: "layouts/article.njk"
title: "I Less Than Three IE6"
date: "2009-07-27"
meta:
  description:
    Web design is hard, that's why it's fun and why not everyone does it. With
    this I'll explain why I take some joy in dealing with the sticky
    situations that "that" browser gets me in.
---

<p class="entry-intro">
  I am not a fan of the Die IE6 Campaigns, can't get behind them. You will not see me sporting some goofy <a href='http://twibbon.com/join/IE6-Must-Die' rel='external'>IE6 Must Die Twibbon</a> any time soon. I take a pretty unpopular position on IE6; I do not mind developing for IE6, working with it over the past few years has made me a better, smarter developer and I am going to miss it a bit when It's completely out of the picture. Whoa, look out, you're probably thinking I'm bat-shit crazy by now, but hear me out. I have reasons.
</p>

<strong>1. It pushes you to write proper, lightweight HTML markup: </strong>
IE6 has well-known issues with the box model, strange padding and margin issue, etc. One very good way to stop these potential CSS issues is to write good markup. Easy things like making sure you are writing semantic, valid markup and using <code>&lt;div&gt;</code> tags sparingly can knock out probably 95% of these issues that seem to be such a problem for so many. In my experience, most folks' CSS issues aren't CSS issues at all, they are HTML issues.

<strong>2. It gives you yet another chance to get creative: </strong>
So what if IE6 doesn't support transparent pngs. Find a way to make that image a transparent gif or a jpg. Doesn't look as crisp as the png? So what, this is where progressive enhancement steps in, this is why we have conditional comments. Set up an IE6 stylesheet and dump all of the not so desirable CSS in there. Chances are most of your users are not on IE6 anyway, and if they are this can be a friendly little jab at them for using it. I took this route when building my site. I wanted to let anyone viewing my site with The 6 know that they are missing out so I created a completely stripped down version just for IE6, plus a nice reminder of why. It still works, you can access all the same content, it's just not pretty.

        <figure>
          <img src='https://tylergaw.com/articles/assets/post_image_tgawie6_thumb.jpg' alt='tylergaw.com IE6 Screenshot'>
          <figcaption>Users of IE6 receive a version of tylergaw.com that contains all the same content, but has a very pared-down aesthetic.</figcaption>
        </figure>
        <p>
          <strong>3. It forces you to clean up sloppy code that other browsers ignore: </strong>
          I've seen this a number of times when writing Javascript. Take a look at this bit of JS:
        </p>
    		    	<pre><code class="language-javascript">var someCrud = ['item01', 'item02', 'item03',];

alert(someCrud.length);</code></pre>

<p>
What's the length of the array? Firefox and Safari say 3. IE6 says 4. I'm siding with The 6 on this one, the comma at the end of the array is erroneous, it should not be there. IE6 sends the message that you should clean up your code by recognizing the extra item while the more advanced browsers ignore it and let you go on your sloppy way. This is just one example, I've come across a number of similar examples over the years, I'm sure others have too.
</p>
<p>
<strong>4. It keeps you on your toes: </strong>
If you're building websites you need to be flexible. Not all environments are going to be picture perfect, and knowing how to find solutions to problems that arise when working with a browser like The 6 is key. It's easy to just say that a browser is the sole reason for not getting something to function well. Another look at it may reveal that the first approach taken was maybe not the best. You just have to put on that thinking cap a bit.
</p>
<p>
<strong>5. It's good to have a nemesis: </strong>
What good is Batman without the Joker? You have to have someone or something that challenges you and makes your job harder, and sometimes downright frustrating. Web development is hard, that's why it's fun. How good a feeling is it to confront a problem in development and find some interesting way around it? I got a whole crappy article out of doing just that.
</p>
<p>
This viewpoint is 100% from that of a developer. As a user, I agree using IE6 would just be a nightmare. The security issues, the lack of features that modern browsers have, etc., etc. That is one merit that the Die IE6 campaigns have. But every time I see some Johnny Developer complaining about how hard it is to build websites for IE6 and how much they hate it, I can't help but think that that person is missing out on opportunities to use their noggin. And that they are a bit of a wimp. :)
</p>
<p>
After IE6 is gone some other browser will take it's place as the whipping boy. IE7? So, instead of just joining a campaign of wishing death on an inanimate object, I say learn to take away as much knowledge as you can from a less-than-ideal situation. Like Kuato said, "<a href='http://www.youtube.com/watch?v=xO1kKemcwYk' rel='external'>Open your miiinddddd.</a>"
</p>
<p>
<i>Thanks for reading</i>
</p>
