---
title: "Ubuntu | Netflix unter Linux schauen"
description: "Hallo zusammen, mir ist kürzlich aufgefallen, dass man Netflix unter Linux (Ubuntu 13+) mit Chrome Beta schauen kann."
pubDate: 2014-09-24T04:23:24+00:00
tags: ["Linux"]
authorship: human
translation: ai
---

Hallo zusammen, mir ist kürzlich aufgefallen, dass man Netflix unter Linux (Ubuntu 13+) mit Chrome Beta schauen kann.

Ich habe es ausprobiert und finde es großartig. Es ist sogar deutlich schneller als unter meinem Windows oder in Firefox mit User-Agent-Switcher und Pipelight.

Unten findest du alles, was du dafür brauchst.

Eine .deb-Installationsdatei für libnss3.17 kann ich leider nicht anbieten, aber mit Ubuntu 14.04 bist du ohnehin auf der sicheren Seite.

- [https://www.google.com/chrome/browser/beta.html](https://www.google.com/chrome/browser/beta.html "Chrome Beta Download")
- [NSS3-Bibliothek (mindestens 3.17)](http://packages.ubuntu.com/source/lucid/nss "NSS3 Library 3.17")
- [User Agent Switcher für Chrome](https://chrome.google.com/webstore/detail/user-agent-switcher-for-c/djflhoibgkdhkhhcedjiklpkjnoahfmg "User Agent Switcher for Chrome")

Sobald du alles hast, klick in Chrome mit der rechten Maustaste auf den Agent Switcher und wähle „Optionen“.

Trag folgenden Eintrag ein, um einen speziellen „Netflix“-Agent zu bekommen (im Grunde ein Chrome-Agent unter Windows).

Name: Netflix Chrome

String: Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2114.2 Safari/537.36

Group: wird automatisch ausgefüllt

Flag: IE

Jetzt viel Spaß mit Netflix unter Linux :-)

Sag Bescheid, wenn etwas nicht funktioniert, dann versuche ich zu helfen.

Wenn du mehr lesen willst – schau dir den guten Artikel vom omgubuntu-Team an.

[http://www.omgubuntu.co.uk/2014/08/netflix-linux-html5-support-plugins](http://www.omgubuntu.co.uk/2014/08/netflix-linux-html5-support-plugins "OMGUbuntu! on Netflix in Chrome")
