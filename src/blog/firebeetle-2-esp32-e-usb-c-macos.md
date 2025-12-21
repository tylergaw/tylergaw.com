---
tags: post
layout: "layouts/article.njk"
title: "Connecting a FireBeetle 2 ESP32-E via USB-C to macOS Sequoia"
date: "2025-01-12"
meta:
  description: An extremely specific post about connecting a FireBeetle 2 ESP32-E via USB-C to macOS Sequoia.
  card: summary
  image: /images/social-summary.png
---

This is an extremely specific post, the title, description, and the words I’m choosing are all meant to help anyone else running into this same problem find this post later. That’s because I spent the last couple weeks pulling what’s left of my hair out trying to connect my FireBeetle board to my MacBook running macOS Sequoia, 15 via USB-C.

This is the post I needed then. Hopefully it’ll help somebody else in the future. Or just as likely, future me.

## Hardware/Software Details

- [FireBeetle 2 ESP-E](https://wiki.dfrobot.com/FireBeetle_Board_ESP32_E_SKU_DFR0654) board
- MacBook Pro 16-inch, 2023
- macOS Sequoia, 15.2
- A USB-C to USB-C cable that supports data transfer

## Steps

Follow these steps, story time after.

- Download the Macintosh CH340 Driver V1.8 from [https://sparks.gogo.co.nz/ch340.html](https://sparks.gogo.co.nz/ch340.html)
- It’s in large bold type so pay close attention to **“You must read the PDF in the zip file, how you install it differs depending on macOS Version.”**
- Unzip the file, open the PDF and read the instructions. I’ll repeat key points here but, **actually read the instructions, they are important!**
- Open the `dmg` version of the driver installer. **The `pkg` version will not work**
- Drag the driver installer to your Applications folder
- Find the installer in your Applications folder and double click to run it
- In the window that pops up, click Install
- **Don’t stop, keep reading!**
