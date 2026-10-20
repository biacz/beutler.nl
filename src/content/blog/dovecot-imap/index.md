---
title: "Dovecot & imap"
description: "Just wanted to install dovecot-imapd when i noticed my dovecot-core installation was somehow corrupt. Got error message like these from top to bottom:"
pubDate: 2014-03-24T21:08:17+01:00
tags: ["Mail Server", "Linux", "Webhosting"]
legacyUrl: "/2014/03/24/dovecot-imap/"
---
Just wanted to install dovecot-imapd when i noticed my dovecot-core installation was somehow corrupt. Got error message like these from top to bottom:

```text

dpkg: error processing dovecot-core (--configure): subprocess installed post-installation script returned error exit status 1 dpkg: dependency problems prevent configuration of dovecot-common: dovecot-common depends on dovecot-core; however: Package dovecot-core is not configured yet. dpkg: error processing dovecot-common (--configure): dependency problems - leaving unconfigured Errors were encountered while processing: dovecot-core dovecot-common
```

When checking /var/log/syslog i noticed this error message:

```text

Mar 24 20:50:22 h2077265 dovecot: master: Fatal: service(pop3) access(/usr/lib/dovecot/pop3) failed: No such file or directory
```

And guess what – i just had to make the directory and after that i was able to apt-get purge. Everything has been reinstalled again. Now i was also able to apt-get install dovecot-imapd. After enabling imap in /etc/dovecot/dovecot.conf (protocols = imap pop3) and a restart of dovecot everything was working.

Another one done. Now lets go for webmail 😉
