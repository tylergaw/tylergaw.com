---
tags: post
layout: "layouts/article.njk"
title: "Re-encode AVIF images for iOS 16"
date: "2023-01-29"
meta:
  description: To fix a bug where AVIF images don't display on iOS 16, you might need to re-encode your images.
  card: summary
---

In late 2022, Apple [announced support](https://webkit.org/blog/13152/webkit-features-in-safari-16-0/) for AVIF images on iOS 16+. That was welcome news, but did lead to issues. I don't know how wide spread this issue is, but for this site, most AVIF images I had in place stopped working. If you're searching for some version of; **"iOS 16 AVIF images broken"**, this might help you out.

**TL;DR**: Re-encode any AVIF images that aren't working. There have been AVIF spec changes and there were bugs in popular encoders that caused AVIF not to work in iOS.

## The problem

I've been using AVIF images throughout this site since about 2020. I use the `source` element with `srcset` to provide AVIF, WEBP, and JPG or PNG formats for most images. This worked until iOS shipped support for AVIF. Before then, iOS would just not recognize the AVIF format and use WEBP instead.

With AVIF support, iOS started recognizing and loading AVIF images. I could confirm that was the cause using the devtools network panel. But, on the page, there would be a missing image. Either blank, in Chrome iOS, or the little blue question mark in Safari iOS.

## The fix

Re-encode any AVIF images. For me, this meant; tracking down original images and graphics in Figma, exporting has PNG or JPG, then converting those to AVIF using [Squoosh](https://squoosh.app/). Once I did that, AVIF images loaded and displayed as expected.

I had trouble finding details on this. What led me to even try re-encoding was [Jen Simmons' comment](https://github.com/Fyrd/caniuse/issues/6505#issuecomment-1289471190) on a related issue:

> Please do create new images for your tests. The specs for AVIF changed since the early days. Image encoders have been updated — including in Sept 2022, when AVIF bugs in several of the common encoders were found.

## Local trouble

Something to watch out for. I have not been able to get any AVIF images to work on the iOS 16 Simulator on macOS Monterey 12.6.1. This may just be because I'm not on the latest macOS. If you're using a simulator and re-encoding does not seem to be working, make sure you try a real device. That's the only place I'm seeing AVIF images work.
