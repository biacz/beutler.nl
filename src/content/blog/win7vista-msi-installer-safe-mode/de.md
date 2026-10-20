---
title: "Win7/Vista – Windows Installer im abgesicherten Modus"
description: "Der Windows Installer funktioniert im abgesicherten Modus nicht – außer du legst einen Registry-Eintrag dafür an. So geht's."
pubDate: 2014-09-03T11:13:10+02:00
tags: ["Windows"]
authorship: human
translation: ai
---

Quelle: <http://www.symantec.com/connect/blogs/windows-installer-safe-mode>

Der Windows Installer funktioniert im abgesicherten Modus nicht. Programme lassen sich dort also nur mit einem bestimmten msiexec-Befehl in der Eingabeaufforderung installieren oder deinstallieren.

Damit der Windows Installer im abgesicherten Modus läuft, musst du für jede Art von abgesichertem Modus, in dem du angemeldet bist, einen Registry-Eintrag anlegen.

### Abgesicherter Modus

Gib in der Eingabeaufforderung ein:

```text
REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\SafeBoot\Minimal\MSIServer" /VE /T REG_SZ /F /D "Service"
```

und danach

```text
net start msiserver
```

Damit startet der Windows-Installer-Dienst.

### Abgesicherter Modus mit Netzwerktreibern

```text
REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\SafeBoot\Network\MSIServer" /VE /T REG_SZ /F /D "Service"
```

und anschließend

```text
net start msiserver
```

Damit startet der Windows-Installer-Dienst.
