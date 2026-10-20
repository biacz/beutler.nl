---
title: "Letzte Anmeldung eines Benutzers am Computer | WMI > Win32_UserProfile"
description: "Wenn du die letzte Anmeldezeit eines bestimmten Benutzers an einem Rechner sehen willst, nimm:"
pubDate: 2014-07-30T13:50:39+02:00
tags: ["PowerShell", "Windows"]
authorship: human
translation: ai
---

Wenn du die letzte Anmeldezeit eines bestimmten Benutzers an einem Rechner sehen willst, nimm:

```powershell

gwmi Win32_UserProfile -ComputerName ComputerName | where { $_.LocalPath -eq "c:\users\username" } | select LastUseTime
```

Bitte beachte, dass das nur funktioniert, wenn das Benutzerprofil wirklich im Standardverzeichnis von Windows 7 liegt.
