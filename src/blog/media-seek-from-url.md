---
tags: post
layout: "layouts/article.njk"
highlightSyntax: true
title: "Media Seek from URL"
date: "2014-09-20"
meta:
  description:
    This is a quick bit of JavaScript to control the time position of audio
    and video elements via a URL query string.
---

<p class="entry-intro">
  I recently had a need to be able to control the time of <code>audio</code>
  elements via a URL query string. I whipped up a bit of JavaScript to handle it.
  There’s a demo <a href="http://lab.tylergaw.com/media-seek-from-url/">here</a> and
  the source is <a href="https://github.com/tylergaw/media-seek-from-url">on GitHub</a>.
  I had fun figuring it out and thought maybe you’d enjoy reading about it.
  The following are details about why I needed it and the code I wrote.
</p>
<p>
  As with most projects, this one started with a problem that needed fixin’ The
  site this was for had a listing of audio tracks. Each list item included; the <code>audio</code>
  element, a title/link to the page for that track, and a short description.
  Some of list items had extra links to the track’s page in the description.
</p>
<p>
  With this setup, the links to the track pages were causing the problem. Here’s
  what was happening; Users were pressing play on one of the tracks in the list.
  They would then click on one of the track’s links. That would take them away
  from the listing to that track’s page. The navigation would cause them to
  lose their place in the track they were listening to. The tracks were podcasts that
  ran from 45 to 90 minutes in length so losing your spot at 33 minutes and 45 seconds was annoying.
</p>
<p>
  This is where controlling the time of the <code>audio</code> element came into play.
  Clicking on a link should take the user to the track’s page and
  the track should resume playing where they left off.
</p>
<h2>Writing The Thing</h2>
<p>
  YouTube does this style of jumping around in videos via the URL. I think
  the query string style they use works well, so I took my cues from them. I decided
  I’d use URLs like:<br> <code>http://site.com/tracks/track-name?t=1h22m35s</code>.
</p>
<p>
  Two quick things about the code examples and descriptions:
</p>
<ol>
  <li>
    I wrote the original code for a specific project. The code I’ll be showing
    here is a modified version of that project’s code. The main difference
    is that there are no links to separate pages. I left that out because I
    felt like the interesting thing is not the navigation between pages.
  </li>
  <li>
    The examples only show <code>audio</code> elements, but you can use the same code
    with <code>video</code> elements.
  </li>
</ol>
<p>
  On page load, we run a function called <code>seekIfNeeded</code>. This
  function checks the <code class="language-javascript">window.location.search</code> for the presence of
  the string “t=”. This determines if we need to bother trying to parse
  a time from the URL. This check is by no means fool-proof, but it gets the job done.
</p>
<pre><code class="language-javascript">function seekIfNeeded () {
  var q = window.location.search;

if (q.indexOf('t=') > -1) {
// Do parsing stuff
}
}
</code></pre>

<p>
  Once it’s determined there’s a time to parse the fun code starts.
  We declare a couple convenience variables for later use.
  We bind a <code>canplay</code> event to the <code>audio</code>.
  We convert the query string to seconds and then update <code>currentTime</code>
  property of the <code>audio</code> element.
</p>
<pre><code class="language-javascript">function seekIfNeeded () {
  var q = window.location.search;

if (q.indexOf('t=') > -1) {
// Store the "1h34m27s" part of the query string
var timeString = q.split('=')[1],

      // Store a reference to the audio element with an id of "media"
      media = document.getElementById('media'),

      // Have we updated the time of the media element from the URL before?
      seekedFromURL = false;

    // We can only interact with audio elements when they are ready.
    // Listen for the "canplay" event to know when that is.
    media.addEventListener('canplay', function () {

      // The "canplay" event is triggered every time the audio element
      // is able to play. We only want to change the currentTime of
      // the audio the first time this event fires.
      if (!seekedFromURL) {

        // The currentTime property seeks to a value of seconds in
        // the media element.
        media.currentTime = secondsFromTimeParts(partsFromTimeString(timeString));

        // We've done the seeking, don't do this again.
        seekedFromURL = true;
      }
    });

    media.play();

}
}
</code></pre>

<h2>Converting a String to Time</h2>
<p>
  Things get interesting with the line that sets
  <code>media.currentTime</code>. It’s being set to the return value of the
  <code>secondsFromTimeParts</code> function. That function is given the
  return value of another function, <code>partsFromTimeString</code>.
</p>
<p>
  I’ll break down that line of code from the inside out. <code>timeString</code>
  is a string like; “1h32m23s” or “15m10s” or “12s”. Any combination of hours,
  minutes, and seconds. Even though humans can figure out the string
  represents time, the <code>audio</code>
  element isn’t going to understand it. We pass the string to <code>partsFromTimeString</code>.
  That function converts the string into an object of key/value pairs. In the object, the
  keys represent a part of the time and the values the amount of time for each part.
</p>
<pre><code class="language-javascript">function partsFromTimeString (str) {
  var parts = {h: 0, m: 0, s: 0};

// Wrapping in a try to avoid an error in case someone gives the 't='
// query string with no time. It'll just default to zero without it.
try {

    // The regex match breaks the string into an array
    // like ["1h", "32m", "6s"]
    str.match(/[0-9]+[hms]+/g).forEach(function (val) {

      // Creates an array with two elements, the time and part
      // key like ["32", "m"]
      var part = val.match(/[hms]+|[0-9]+/g);
      parts[part[1]] = parseInt(part[0], 10);
    });

}
catch (e) {}

return parts;
}

</pre></code>
<p>
  My first idea wasn’t to use a regular expression. I tend to avoid them because
  I only have a cursory knowledge of them. But the query string posed a problem
  I couldn’t solve without a regex. When trying
  to break up a string into specific parts, I look for patterns. A common letter or
  symbol or certain number or anything that repeats. A string like “1h32m23s”
  doesn’t have that, so I needed a more complex pattern.
</p>
<p>
  The pattern that sticks out is; a number, followed by one of three letters.
  That letter could be “h”, “m”, or “s”. There’s no certainty
  that all the letters will be there. And they may not appear in the same order. Ambiguity lead
  me down the regular expression path. I suppose that’s what they’re for?
</p>
<p>
  The <code>string.match</code> method returns an array of all matches found
  by a given regex. The regex <code class="language-javascript">/[0-9]+[hms]+/g</code> reads the string from left to right
  and says, “I want an integer with a value of 0 through 9, followed by the letter ‘h’, ‘m’, or ‘s’.”
  If the regex finds that alphanumeric combination, it puts it in the array.
</p>
<p>
  We’re getting closing to being able to separate the letters from the numbers.
  That’s what we’re after. Even though we want to separate them, we don’t want
  to disassociate them. Each letter gives us valuable information about the
  number. It tells us what part of the time it represents.
</p>
<p>
  The next step is to iterate over the array of number/letter pairs one by one.
</p>
<p>
  Again, we use the <code>match</code> method with a regex. The <code class="language-javascript">/[hms]+|[0-9]+/g</code>
  regex says, “I want either the letter ‘h’, ‘m’, ‘s’ or a number, 0 through 9.”
  When either of those are found they’re placed in the array we named “part”.
</p>
<p>
  The last bit of work is to add each of the time parts to the parts object we
  created at the start of the function. Since we get the time value from a
  string we need to use <code>parseInt</code> to convert it to a integer.
</p>
<p>
  Now we have an object of time parts. The object looks like <code class="language-javascript">{h: 1, m: 22, s: 37}</code>.
  The next step in <code>seekIfNeeded</code> is to get seconds from those parts.
  For that, we use the <code>secondsFromTimeParts</code> function.
</p>
<pre><code class="language-javascript">function secondsFromTimeParts (parts) {
  var seconds = 0;

seconds += parts.s;
seconds += parts.m _ 60;
seconds += parts.h _ 3600;

return seconds;
}

</pre></code>
<p>
  <code>secondsFromTimeParts</code> adds up the values of the time parts object to
  get a total number of seconds. To get the number of seconds from
  minutes we multiply by 60. To get the number of seconds from
  hours we multiply by 3600. 3600 equals 60 minutes per hour times 60 seconds per minute.
</p>
<p>
  At this point, we’ve converted a string that represents a time to an actual
  time value the media element can understand. We use that value–the number
  of seconds into the media we want to go–to set the <code>currentTime</code>
  property and then tell it to play.
</p>
<h2>Converting a Time to String</h2>
<p>
  So now we can update the time of a media element with a query string, but what
  if we want to go the other way? What if we have the seconds and we want
  to convert that to our time string?
</p>
<p>
  For that we’ll follow the previous process in reverse. We’ll get an object of
  time parts from the seconds and then a time string from the parts.
</p>
<pre><code class="language-javascript">var timeStr = timeStringFromParts(timePartsFromSeconds(media.currentTime));
</pre></code>
<p>
  Again, from the inside out, let’s look at the <code>timePartsFromSeconds</code>
  function.
</p>
<pre><code class="language-javascript">function timePartsFromSeconds (seconds) {
  var parts = {},
    secondsInt = Math.floor(seconds);

parts.h = Math.floor((secondsInt / 3600) % 24);
parts.m = Math.floor(secondsInt / 60);
parts.s = secondsInt % 60;

return parts;
}

</pre></code>
<p>
  We start by creating the empty parts object where we’ll store the key/value pairs.
  <code>media.currentTime</code> gives the number of seconds and milliseconds
  as a float. In this script I decided that I didn’t need milliseconds.
  <code>Math.floor(seconds)</code> removes the decimal point and everything after it.
</p>
<p>
  The next few lines use the total number of seconds to determine the number of
  hours and minutes. Those values are set to the appropriate members of the parts
  object. These calculations are the reverse of what we used in <code>secondsFromTimeParts</code>.
  We know there are 3600 seconds in an hour so we divide the total seconds by it.
  We use the modulus–<code>% 24</code>–because anything over 24 hours would be a new
  time part: days. This script doesn’t handle days, but with a handful of additions
  it would be able to. We determine the number of minutes by dividing the total
  seconds by the number of seconds in a minute: 60.
</p>
<p>
  That gives us an object of parts–<code class="language-javascript">{h: 1, m: 32, s: 27}</code>–that we need
  to convert into a time string. We’ll do that with the <code>timeStringFromParts</code>
  function.
</p>
<pre><code class="language-javascript">function timeStringFromParts (parts) {
  var str = '';

for (key in parts) {
if (parts[key] > 0) {
str += parts[key] + key;
}
}

return str;
}

</pre></code>
<p>
  This small function iterates over the keys in the parts object. For each key,
  if the value is greater than zero we add the value followed by the key to the
  <code>str</code> variable that we’ll return. The string returned will look something
  like “1h32m28s”.
</p>
<p>
  <code>secondsFromTimeParts</code> and <code>timeStringFromParts</code> could have
  been combine into a single function like <code>timeStringFromSeconds</code>. I
  chose to separate them because I like to make functions that are as small and
  as specific as possible. Doing so provides clarity and allows for reuse. This
  approach is a tenet of functional programming.
</p>
<p>
  And with that, we have our script soup to nuts. If you take a look at the source
  code you’ll see a function named <code>displayTimeURL</code>. That function
  converts a time to a time string for display. It also contains a couple other
  tidbits that may be useful if you need to build something like this yourself.
</p>

<h2>Bonus: Soundcloud</h2>
<p>
  Soundcloud allows for embedding of most of their tracks. The embedded player
  also has a <a href="https://developers.soundcloud.com/docs/api/html5-widget">pretty cool API</a>.
  I whipped up a version of this script to work with Soundcloud players. I’d say
  it’s about 98% the same. All the little functions I wrote aren’t concerned
  with the whole story. They just want numbers, strings, arrays, etc. Because of
  that I was able to use them with the Soundcloud version. <a href="http://lab.tylergaw.com/media-seek-from-url/soundcloud.html">Have a look</a> at the
  demo. Like the HTML demo, you can add "?t=1m35s" to the URL to jump to that
  point in the track.
</p>
<p>
  The only differences are how you interact with the media element
  and that Soundcloud takes milliseconds instead of seconds
  to set the current time. Soundcloud provides events and
  methods that you can use to control the player. They aren’t the same as their HTML
  counterparts, but the ideas are the same. The Soundcloud example code is in
  the <a href="https://github.com/tylergaw/media-seek-from-url">same repo</a> as the HTML
  version.
</p>
<p>
  This was a fun problem to solve. Both from the UX view and from the code. I’m
  sure there are quite a few similar implementations, but I’m sure there are
  none just like this one.
</p>

<p>
  <i>Thanks for reading</i>
</p>
