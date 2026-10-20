---
title: "Apache 2 & SSL"
description: "Gerade SSL auf meinem Apache2-VirtualHost für diese Seite aktiviert."
pubDate: 2014-03-25T08:05:45+01:00
tags: ["Apache", "Linux", "Webhosting"]
authorship: human
translation: ai
---

Gerade SSL auf meinem Apache2-VirtualHost für diese Seite aktiviert.\
Ziemlich unkompliziert. Einfach „a2enmod ssl“, um SSL zu aktivieren.\
Danach habe ich SSL gezielt in meinem VirtualHost für beutler.nl eingeschaltet.

Die Konfiguration sieht jetzt so aus:

```apache

<VirtualHost *>
....
SSLEngine on
SSLCertificateFile /dir/to/.cert
SSLCertificateKeyFile /dir/to/privatekey
NameVirtualHost *:443
Listen 80
Listen 443
```

Achte darauf, dass in deiner ports.conf auch NameVirtualHost *:80 steht.

Bei Fragen – sag Bescheid 🙂
