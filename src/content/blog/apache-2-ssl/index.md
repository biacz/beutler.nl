---
title: "Apache 2 & SSL"
description: "Just activated SSL on my apache2 VirtualHost for this page.\\"
pubDate: 2014-03-25T08:05:45+01:00
tags: ["Apache", "Linux", "Webhosting"]
legacyUrl: "/2014/03/25/apache-2-ssl/"
---
Just activated SSL on my apache2 VirtualHost for this page.\
Pretty straight forward. Just “a2enmod ssl” to get ssl activated.\
After that i’ve chosen to enable SSL specifically in my beutler.nl virtualhost.

Configuration looks like this now:

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

Make sure in your ports.conf is also mentioned: NameVirtualHost *:80

In case of questions – let me know 🙂
