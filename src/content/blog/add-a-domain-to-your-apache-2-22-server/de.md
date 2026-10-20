---
title: "[Apache] Namensbasierte virtuelle Hosts"
description: "Nach einiger Zeit hat mich mein FQDN genervt und ich wollte etwas, das sich leichter lesen und teilen lässt. Also habe ich eine Domain gekauft…"
pubDate: 2014-03-24T11:21:13+01:00
tags: ["Apache", "Linux", "Webhosting"]
authorship: human
translation: ai
---

Nach einiger Zeit hat mich mein FQDN genervt und ich wollte etwas, das sich leichter lesen und teilen lässt. Ich habe eine Domain bei godaddy.com gekauft (kennt jemand etwas Besseres?) und wollte sie auf meinem bestehenden Webhost einbinden. Nachdem ich den A-Record auf die statische IP meines Servers gesetzt hatte, war die Änderung nach nur etwa 10 Minuten live. Da mein Root-Server (Debian v7.x) nur eine IP hat und schon andere Seiten darauf laufen, musste ich namensbasierte virtuelle Hosts von Apache verwenden. Die hatte ich vorher nie wirklich genutzt. Andere Domains, die ich hoste, zeigen einfach auf meinen alten FQDN und den Ordner mit der jeweiligen Seite. ZIEMLICH LAHM!

Virtuelle Hosts sind viel einfacher als gedacht. Ich habe einfach eine neue Datei im Verzeichnis /etc/apache2/sites-enabled angelegt. Die Standard-Webseite taugt dabei gut als Vorlage.

Die meisten Anleitungen raten, mit NameVirtualHost *:80 anzufangen, um namensbasierte virtuelle Hosts zu aktivieren. Das brauchst du nur, wenn es nicht schon vorher eingebunden ist! In meinem Fall hatte mein Apache 2.22 das bereits über die eingebundene ports.conf aktiviert. Danach habe ich direkt diese Konfiguration in meine neue Datei (in sites-enabled) geschrieben:

```apache

<VirtualHost *:80>
ServerAdmin a@bc.de
ServerName www.beutler.nl
ServerAlias beutler.nl *.beutler.nl

DocumentRoot /directory/beutler.nl
<Directory />
Options FollowSymLinks
AllowOverride None
</Directory>
<Directory /directory/beutler.nl>
Options Indexes FollowSymLinks MultiViews
AllowOverride All
Order allow,deny
allow from all
</Directory>
ErrorLog ${APACHE_LOG_DIR}/beutler.nl.error.log
LogLevel warn
CustomLog ${APACHE_LOG_DIR}/beutler.nl.access.log combined
</VirtualHost>
```

Dann Apache neu gestartet, und es lief einfach. So einfach 🙂 Natürlich habe ich auch alle anderen Seiten, die ich hoste, auf virtuelle Hosts umgezogen und die URL-Weiterleitung (beim Domain-Anbieter) auf einen neuen A-Record umgestellt. Sieht jetzt viel professioneller aus.

Na und – ich lerne noch 🙂 Wenn du Fragen hast, sag einfach Bescheid.
