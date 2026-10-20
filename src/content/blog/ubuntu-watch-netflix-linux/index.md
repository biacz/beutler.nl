---
title: "Ubuntu | Watch Netflix on Linux"
description: "Hi everyone, i recently noticed that it’s possible to watch Netflix on Linux (Ubuntu 13+) and Chrome Beta."
pubDate: 2014-09-24T04:23:24+00:00
tags: ["Linux"]
legacyUrl: "/ubuntu-watch-netflix-linux/"
---
Hi everyone, i recently noticed that it’s possible to watch Netflix on Linux (Ubuntu 13+) and Chrome Beta.

I tried it and i love it. It’s even a lot faster than on my Windows OS or than on my Firefox with User-Agent-Switcher and Pipelight.

Below is everything you’ll need to go for it.

I sadly can’t offer a .deb installation file for libnss3.17 but if you have Ubuntu 14.04 you are fine anyway.

- [https://www.google.com/chrome/browser/beta.html](https://www.google.com/chrome/browser/beta.html "Chrome Beta Download")
- [NSS3 Library (at least 3.17)](http://packages.ubuntu.com/source/lucid/nss "NSS3 Library 3.17")
- [User Agent Switcher for Chrome](https://chrome.google.com/webstore/detail/user-agent-switcher-for-c/djflhoibgkdhkhhcedjiklpkjnoahfmg "User Agent Switcher for Chrome")

As soon as you have everything rightclick on the Agent Switcher in Chrome and click on Options.

Put in the following entry to get a special “Netflix” Agent (basically a Windows Chrome Agent).

Name: Netflix Chrome

String: Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2114.2 Safari/537.36

Group: Filled in automatically

Flag: IE

Now enjoy Netflix on Linux :-)

Let me know if something is not working and i try to help.

If you want to read more – check out the nice article of the omgubuntu team.

[http://www.omgubuntu.co.uk/2014/08/netflix-linux-html5-support-plugins](http://www.omgubuntu.co.uk/2014/08/netflix-linux-html5-support-plugins "OMGUbuntu! on Netflix in Chrome")
