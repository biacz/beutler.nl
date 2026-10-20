---
title: ":: Debian 7 – Server abgestürzt und neu aufgebaut"
description: "Notiz an mich: Mein Debian-Server ist beim Upgrade von Wheezy auf Jessie kaputtgegangen. Das sind die Schritte, mit denen ich ihn neu aufgebaut habe."
pubDate: 2015-05-12T12:30:15+00:00
tags: ["Linux", "nginx", "Webhosting"]
authorship: human
translation: ai
---

![debian_logo](./debian-logo-555x242.png)

Notiz an mich selbst. Serverabstürze nerven.\
Gestern war ich in der unschönen Lage, dass meine alte Serverkonfiguration versucht hat, von Wheezy auf Jessie zu aktualisieren.\
Irgendwo dazwischen ist die ganze Konfiguration kaputtgegangen, weil mehrere kritische Dienste neue .conf-Dateien bekommen haben.\
Ich habe ein Backup von meinem Hoster (Strato) zurückgespielt, aber schnell gemerkt, dass Strato nicht wirklich Snapshots macht, sondern eher eine Art inkrementelle Dateisicherung.

Zum Glück nutze ich für alle meine CMS Backup-Add-ons. Jetzt will ich die Schritte dokumentieren, mit denen ich den Server neu aufgebaut habe – falls das noch einmal passiert (mir oder jemand anderem).

1. Host über das Konfigurationspanel von Strato neu installiert
2. Pakete installiert (Liste unten)
3. nginx konfiguriert
4. Dev-Benutzer für die Webumgebung angelegt
5. vsftpd konfiguriert
6. Backup der alten www-data wiederhergestellt
7. Backup der alten SQL-Datenbanken wiederhergestellt
8. iptables konfiguriert

Ich erkläre das ausführlicher, während ich an meinem Server arbeite.\
Wenn du Fragen hast, sag Bescheid.

Installierte Pakete:

```text
$ cat /var/log/dpkg.log | grep 'install '
2015-05-11 22:39:38 install geoip-database:all <keine> 20130213-1
2015-05-11 22:39:38 install libjpeg8:i386 <keine> 8d-1+deb7u1
2015-05-11 22:39:38 install libgd2-noxpm:i386 <keine> 2.0.36~rc1~dfsg-6.1+deb7u1
2015-05-11 22:39:39 install libxslt1.1:i386 <keine> 1.1.26-14.1
2015-05-11 22:39:39 install libgeoip1:i386 <keine> 1.4.8+dfsg-3
2015-05-11 22:39:39 install nginx-common:all <keine> 1.2.1-2.2+wheezy3
2015-05-11 22:39:39 install nginx-full:i386 <keine> 1.2.1-2.2+wheezy3
2015-05-11 22:39:39 install nginx:all <keine> 1.2.1-2.2+wheezy3
2015-05-11 23:07:12 install libxau6:i386 <keine> 1:1.0.7-1
2015-05-11 23:07:12 install libxdmcp6:i386 <keine> 1:1.1.1-1
2015-05-11 23:07:12 install libxcb1:i386 <keine> 1.8.1-2+deb7u1
2015-05-11 23:07:12 install libx11-data:all <keine> 2:1.5.0-1+deb7u2
2015-05-11 23:07:12 install libx11-6:i386 <keine> 2:1.5.0-1+deb7u2
2015-05-11 23:07:12 install libxpm4:i386 <keine> 1:3.5.10-1
2015-05-11 23:07:14 install libgd2-xpm:i386 <keine> 2.0.36~rc1~dfsg-6.1+deb7u1
2015-05-11 23:07:15 install libaio1:i386 <keine> 0.3.109-3
2015-05-11 23:07:15 install librtmp0:i386 <keine> 2.4+20111222.git4e06e21-1
2015-05-11 23:07:15 install libssh2-1:i386 <keine> 1.4.2-1.1+deb7u1
2015-05-11 23:07:15 install libcurl3:i386 <keine> 7.26.0-1+wheezy13
2015-05-11 23:07:15 install mysql-common:all <keine> 5.5.43-0+deb7u1
2015-05-11 23:07:15 install libmysqlclient18:i386 <keine> 5.5.43-0+deb7u1
2015-05-11 23:07:15 install libdbi-perl:i386 <keine> 1.622-1+deb7u1
2015-05-11 23:07:16 install libdbd-mysql-perl:i386 <keine> 4.021-1+b1
2015-05-11 23:07:16 install mysql-client-5.5:i386 <keine> 5.5.43-0+deb7u1
2015-05-11 23:07:17 install mysql-server-core-5.5:i386 <keine> 5.5.43-0+deb7u1
2015-05-11 23:07:20 install mysql-server-5.5:i386 <keine> 5.5.43-0+deb7u1
2015-05-11 23:07:21 install php5-common:i386 <keine> 5.4.39-0+deb7u2
2015-05-11 23:07:21 install libonig2:i386 <keine> 5.9.1-1
2015-05-11 23:07:21 install libqdbm14:i386 <keine> 1.8.78-2
2015-05-11 23:07:21 install php5-fpm:i386 <keine> 5.4.39-0+deb7u2
2015-05-11 23:07:21 install php5-cli:i386 <keine> 5.4.39-0+deb7u2
2015-05-11 23:07:21 install php5-curl:i386 <keine> 5.4.39-0+deb7u2
2015-05-11 23:07:22 install php5-gd:i386 <keine> 5.4.39-0+deb7u2
2015-05-11 23:07:22 install libmcrypt4:i386 <keine> 2.5.8-3.1
2015-05-11 23:07:22 install php5-mcrypt:i386 <keine> 5.4.39-0+deb7u2
2015-05-11 23:07:22 install php5-mysql:i386 <keine> 5.4.39-0+deb7u2
2015-05-11 23:07:22 install libhtml-template-perl:all <keine> 2.91-1
2015-05-11 23:07:22 install mysql-server:all <keine> 5.5.43-0+deb7u1
2015-05-11 23:07:22 install php-apc:i386 <keine> 3.1.13-1
2015-05-11 23:38:17 install dbconfig-common:all <keine> 1.8.47+nmu1
2015-05-11 23:38:17 install phpmyadmin:all <keine> 4:3.4.11.1-2+deb7u1
2015-05-12 01:22:18 install libcap2:i386 <keine> 1:2.22-1.2
2015-05-12 01:22:18 install vsftpd:i386 <keine> 2.3.5-3
2015-05-12 01:22:50 install python-support:all <keine> 1.0.15
2015-05-12 01:22:50 install python-central:all <keine> 0.6.17
2015-05-12 01:22:50 install fail2ban:all <keine> 0.8.6-3wheezy3
2015-05-12 01:22:51 install libgamin0:i386 <keine> 0.1.10-4.1
2015-05-12 01:22:51 install gamin:i386 <keine> 0.1.10-4.1
2015-05-12 01:22:51 install python-gamin:i386 <keine> 0.1.10-4.1
2015-05-12 07:18:13 install zsh:i386 <keine> 4.3.17-1
2015-05-12 07:20:25 install libcurl3-gnutls:i386 <keine> 7.26.0-1+wheezy13
2015-05-12 07:20:25 install patch:i386 <keine> 2.6.1-3
2015-05-12 07:20:25 install liberror-perl:all <keine> 0.17-1
2015-05-12 07:20:25 install git-man:all <keine> 1:1.7.10.4-1+wheezy1
2015-05-12 07:20:25 install git:i386 <keine> 1:1.7.10.4-1+wheezy1
2015-05-12 07:28:21 install curl:i386 <keine> 7.26.0-1+wheezy13
2015-05-12 10:11:45 install p7zip:i386 <keine> 9.20.1~dfsg.1-4
```
