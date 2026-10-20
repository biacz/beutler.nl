---
title: "View | Benutzerzuweisung per PowerCLI aufheben"
description: "Wenn du nicht alle Benutzerzuweisungen von Hand aufheben willst, gib diesem Skript einfach eine .csv-Datei mit Desktop-Namen, und es erledigt das für dich."
pubDate: 2014-07-30T18:06:06+02:00
tags: ["VMware Horizon", "PowerCLI", "PowerShell", "VMware"]
authorship: human
translation: ai
---

Wenn du nicht alle Benutzerzuweisungen von Hand aufheben willst, gib diesem Skript einfach eine .csv-Datei mit Desktop-Namen, und es erledigt das für dich.

```powershell

$filepath = "desktops.csv"
import-csv $filepath -Header Desktop | Foreach-object {
remove-userownership -machine_id (Get-DesktopVM -name $_.Desktop).machine_id
}
```
