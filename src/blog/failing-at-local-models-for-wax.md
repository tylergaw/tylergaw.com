---
tags: post
layout: "layouts/article.njk"
title: "Failing at Using a Local LLM for Vinyl Record Color Extraction"
date: "2025-12-29"
highlightSyntax: true
meta:
  description: How I made a process 336 times slower with this one weird trick!
  image: /blog/assets/post-image-failing-at-local-models-for-wax.jpg
---

<p class="entry-intro">
  As the title suggests, I tried to switch a project from the OpenAI API to a local LLM running in Ollama, but wasn’t able to make it work due to slowness. It was a fun exercise though. This is what I tried and what I learned.
</p>

<p class="no-drop-cap">
  Discogs is where I track my record collection. <a href="https://wax.tylergaw.com/">Wax</a> is a nice UI for it that I’ve been noodling on for years. I built a small <a href="https://github.com/tylergaw/wax-tracks">ETL</a> for it. It uses the OpenAI API to extract human and machine-readable color, texture, and pattern data out of raw—user-provided—descriptions of each record. For example: one record has a description of <code>"Clear W/ Red, Black, And Silver Splatter"</code>. The ETL produces structured data from it:
</p>

<pre><code class="language-js">{
  "humanReadableColor": "Clear with Red, Black, and Silver Splatter",
  "cssReadableColors": ["red", "black", "silver"],
  "texture": "clear",
  "pattern": "splatter"
}</code></pre>

That’s an ideal example. Sometimes it just bombs out, but for the most part it does what I need. And I have guardrails in place on the front-end to handle bad data.

Then use that structured data on the front-end to show a record with the correct color via CSS and text with the human readable color. I’m still not doing anything with texture or pattern, but I’ll get there eventually.

## The Setup

Because I’m running these models on my machine, it’s important to know what I’m working with.

- Apple MBP with M2 Max
- 32 GB memory
- macOS Tahoe 26.0
- Ollama

My OpenAI model is GPT-4o. I compared results to it from a few models:

- [llama3.1-70b](https://ollama.com/library/llama3.1:70b): This was lol, story below
- [llama3.1-8b](https://ollama.com/library/llama3.1:8b): This was the best quality
- [mistral:7b](https://ollama.com/library/mistral:7b)
- [gemma2:9b](https://ollama.com/library/gemma2:9b)
- [qwen2.5:7b](https://ollama.com/library/qwen2.5)

### Test Process

First I ran the [enrichment script](https://github.com/tylergaw/wax-tracks/blob/main/src/enrichCollection.js) with GPT-4o to get baseline data. I didn’t want to test all the data every time. There are almost 700 records. So I grabbed a small batch of them I knew would cover most situations.

I used Claude to write a test script that runs the test records against a given model using the standard local Ollama API chat endpoint. It then generates a report to compare results to the results of GPT-4o.

The [script](https://github.com/tylergaw/wax-tracks/blob/main/src/testOllama.js) and the [report files](https://github.com/tylergaw/wax-tracks/tree/main/model_test_reports) of each test are in the repo if you’re interested.

## Doing the Comparison

To know if extraction was correct requires a human eye. It’s easy for a human to read “Transparent Purple Vinyl” and know the vinyl color is purple and kinda see through, but not always so easy for a computer.

The reports have a <code>comparison</code> section so I can quickly scan what GPT-4o did vs what each model did. An example from llama3.1-8b:

<pre><code class="language-js">{
  "id": "577250",
  "description": "Red Translucent",
  "gpt4o": {
    "humanReadableColor": "Red Translucent",
    "cssReadableColors": ["red"],
    "pattern": null,
    "texture": "translucent"
  },
  "ollama": {
    "humanReadableColor": "Translucent Red",
    "cssReadableColors": ["transparent", "red"],
    "pattern": "Translucent",
    "texture": "Clear"
  }
}</code></pre>

It’s pretty quick to see that the local model did well. For some reason it flipped the order of “translucent” and “red”, but that’s OK. And it added both a pattern and texture value, so it did slightly better there.

And here’s one from gemma2:9b that didn’t do well:

<pre><code class="language-js">{
  "id": "1684889",
  "description": "Grey Marbled",
  "gpt4o": {
    "humanReadableColor": "Grey Marbled",
    "cssReadableColors": ["grey"]
  },
  "ollama": {
    "humanReadableColor": "Grey Marbled",
    "cssReadableColors": null,
    "pattern": "Marbled",
    "texture": null
  }
}</code></pre>

Gemma didn’t come up with grey as a css color. It did identify the pattern, but for my purposes the colors are more important.

That’s the type of thing that requires my eye. I know which things are most important and which things correct. Because I can actually see things, unlike the computer.

## Llama 3.1 70B

I was 100% vibe coding this. So when Claude suggested I try the 70B parameter Llama 3.1 model—even though I was clear my machine only had 32GB of RAM—I just went with it. I didn’t bother to read that the model needed anywhere from 40 to 80GB of RAM.

This kills the computer.

I started the script and it ran OK for a minute. While waiting, I was tinkering around with other things. Then the beach ball started showing up. First for apps. Then for the Finder when I tried to force quit apps. The beach ball finally bounced and everything was locked. After a couple more minutes the screen glitched to a nice pink, then the computer turned itself off.

I didn’t have anything running to monitor memory usage, so I don’t know exactly what happened. But I imagine an app trying to use twice the available RAM on a machine is less than ideal.

From here on out I did less vibing and more babysitting.

## Model Result Quality

Once I ran all the model tests, it was fast to scan the reports and understand how it stacked up to GPT-4o.

### llama3.1-8b

This was the best one. The quality was just as good and in some cases better than GPT-4o. I would have switched to this if it wasn’t for the slowness. Details on that below.

An interesting detail is that it tended to use hex values for css colors instead of named colors like GPT-4o. Example:

<pre><code class="language-js">{
  "id": "1790723",
  "description": "Blue Translucent",
  "gpt4o": {
    "humanReadableColor": "Blue Translucent",
    "cssReadableColors": ["blue"],
    "texture": "translucent"
  },
  "ollama": {
    "humanReadableColor": "blue translucent",
    "cssReadableColors": ["#0000ff"],
    "pattern": null,
    "texture": "translucent"
  }
}</code></pre>

### mistral:7b and gemma2:9b

These did pretty good. Just OK though. They both had minor hallucinations. Both missed easy things. Like one description was “Grey Marbled” and both returned a `null` value for `cssReadableColors`. They would also plop things like “Winchester Pressing” in the `texture` and `pattern` fields.

Both were too far away from the quality of GPT-4o to consider.

### qwen2.5:7b

This one just kinda bombed. Would find css colors, but then not be able to set a human readable color. And those tended to be on descriptions like “Grey Marbled”, which seems pretty clear.

Quality not there to consider using.

## Too Slow to Use

Once I saw how good the quality of llama3.1-8b was I thought that was going to work. So I switched the enrichment script to use it with Ollama instead of OpenAI. Then I ran it against the entire collection. I waited about 5 minutes before I stopped it because I thought something must have hung up.

I figured it was some mistake I’d made in the code, so I asked Claude to fix things up. It made a few changes to do parallel processing. That shaved some time off, but it was still hilariously slow.

“Hilariously” is not so precise a measurement, I have numbers.

- OpenAI with GPT-4o: ~10 seconds
- Ollama with llama3.1-8b: ~56 minutes

Lol, yes. **56 minutes**. That’s about 336 times slower.

Again, I thought I had to just be doing something wrong. Something in the batching? Is it because I’m using node instead of Python or something? Do I need to turn it off and back on?

Doesn’t seem like it though. This is just how fast the hardware is that OpenAI models run on. At least that’s what Claude told me.

If you do see something I missed or did wrong, please reach out and let me know.

## Not Broke / Don’t Fix

I’ll be sticking with the same setup for this I’ve had for years. I am using a local vision model for a different project and it’s been working well. So not all is lost for local models by any means.

### Other OpenAI Models

I also tested GPT-5 Nano and GPT-5 Mini. They both did well, but no better than GPT-4o and in some cases worse, so a couple more reasons to stick with GPT-4o. That surprised me. I thought for sure new would equal better, but not in this case.

## Why Though?

Claude’s first question was why I wanted to do this. After I called it a clanker and told it to never question me I explained that local LLMs are something I’m very interested in. Having everything contained to your system, with no calls to outside systems just feels cool. Feels almost subversive. Any day I can build something that is not beholden to the whims of an Evil Corp is a good day. Today just wasn’t that day.
