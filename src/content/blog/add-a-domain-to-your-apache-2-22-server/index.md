---
title: "[Apache] Name based virtual host"
description: "So after quite some time now i became annoyed of my FQDN and wanted something easier to read/share. I’ve bought a domain from godaddy.com (anyone knows…"
pubDate: 2014-03-24T11:21:13+01:00
tags: ["Apache", "Linux", "Webhosting"]
authorship: human
legacyUrl: "/2014/03/24/add-a-domain-to-your-apache-2-22-server/"
---
So after quite some time now i became annoyed of my FQDN and wanted something easier to read/share. I’ve bought a domain from godaddy.com (anyone knows something better?) and wanted to add it to my existing webhost. After setting the A-record to my static server IP it took only about 10 minutes to get the change live. Now as my root server (debian v7.x) only got one IP and already some other sites on it i had to use Apache name based virtual hosts. I never really used it in the past. Other domains i am hosting are just pointed to my old FQDN and the folder where the sites are stored in. PRETTY LAME!

Now virtual hosts are a lot easier to use then i expected. I just added a new file into the directory /etc/apache2/sites-enabled. You can use the default web page as pretty good example.

Notice that most pages advice you to start with NameVirtualHost *:80 to enable name based virtual hosts. You only need this if it’s not included before already! In my example my apache2.22 already had this activated when including the ports.conf configuration file. After that i went straight forward and added this configuration into my newly created file (in sites-enabled):

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

Now i restarted apache and it just worked. That easy 🙂 Of course i also moved all other pages i host to virtual hosts and changed URL forwarding (from the domain provider) to a new A-record. Looks a lot more professional now.

So what – i am still learning 🙂 If you got any questions just let me know.
