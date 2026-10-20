---
title: "Script/Commands | Find your local AD server"
description: "Pretty neat script/commands if you need to find your attached AD/DC server(s)."
pubDate: 2014-09-23T13:43:32+00:00
tags: ["Windows"]
authorship: human
legacyUrl: "/scriptcommands-find-local-ad-server/"
---
Pretty neat script/commands if you need to find your attached AD/DC server(s).

```text
C:\> nslookup
> set types=all
> _ldap._tcp.<<your.AD.domain>>
_ldap._tcp.<<your.AD.domain>>  SRV service location:
  priority       = 0
  weight         = 100
  port           = 389
  svr hostname   = <<ldap.hostname>>.<<your.AD.domain>>
```
