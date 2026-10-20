---
title: "Dovecot & IMAP"
description: "Ich wollte gerade dovecot-imapd installieren, als ich merkte, dass meine dovecot-core-Installation irgendwie kaputt war. Fehlermeldungen wie diese, von oben bis unten:"
pubDate: 2014-03-24T21:08:17+01:00
tags: ["Mail Server", "Linux", "Webhosting"]
authorship: human
translation: ai
---

Ich wollte gerade dovecot-imapd installieren, als ich merkte, dass meine dovecot-core-Installation irgendwie kaputt war. Ich bekam von oben bis unten Fehlermeldungen wie diese:

```text

dpkg: error processing dovecot-core (--configure): subprocess installed post-installation script returned error exit status 1 dpkg: dependency problems prevent configuration of dovecot-common: dovecot-common depends on dovecot-core; however: Package dovecot-core is not configured yet. dpkg: error processing dovecot-common (--configure): dependency problems - leaving unconfigured Errors were encountered while processing: dovecot-core dovecot-common
```

Beim Blick in /var/log/syslog fiel mir diese Fehlermeldung auf:

```text

Mar 24 20:50:22 h2077265 dovecot: master: Fatal: service(pop3) access(/usr/lib/dovecot/pop3) failed: No such file or directory
```

Und was soll ich sagen – ich musste nur das Verzeichnis anlegen, danach klappte apt-get purge. Alles wurde neu installiert. Jetzt konnte ich auch dovecot-imapd per apt-get install installieren. Nachdem ich IMAP in /etc/dovecot/dovecot.conf aktiviert hatte (protocols = imap pop3) und Dovecot neu gestartet war, lief alles.

Wieder eins erledigt. Jetzt geht's an Webmail 😉
