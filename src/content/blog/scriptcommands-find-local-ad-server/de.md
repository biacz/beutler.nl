---
title: "Skript/Befehle | Den lokalen AD-Server finden"
description: "Ziemlich praktische Befehle, wenn du deine(n) zuständigen AD-/DC-Server finden musst."
pubDate: 2014-09-23T13:43:32+00:00
tags: ["Windows"]
authorship: human
translation: ai
---

Ziemlich praktische Befehle, wenn du deine(n) zuständigen AD-/DC-Server finden musst.

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
