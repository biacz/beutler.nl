---
title: "PowerShell-Skript | Vorlage (Eingabe aus der Pipeline / Fehlerbehandlung)"
description: "Wenn du eine Vorlage mit etwas Grundfunktionalität suchst, nimm einfach diese und pass sie an deine Bedürfnisse an."
pubDate: 2014-09-22T10:17:00+02:00
tags: ["PowerCLI", "PowerShell", "VMware"]
authorship: human
translation: ai
---

Wenn du eine Vorlage mit etwas Grundfunktionalität suchst, nimm einfach diese und pass sie an deine Bedürfnisse an.

Sie braucht eine Eingabe, nimmt aber auch Eingaben aus einer Pipeline an (etwa get-content input.txt | script.ps1).

Sie bietet eine einfache Fehlerbehandlung für abbrechende Fehler. Die Variable $ErrorActionPreference = stop macht allerdings alle Fehler zu abbrechenden 🙂

Viel Spaß, und sag Bescheid, wenn du Rat brauchst.

*Einfache PowerShell-Vorlage*

```powershell
<#
.SYNOPSIS
Check if VM(s) still exist
.EXAMPLE
get-content "list-of-machines.txt" | check if vm exists.ps1
.EXAMPLE
check if vm exists.ps1 vm1
.EXAMPLE
check if vm exists.ps1 vm1, vm2, vm3
.PARAMETER VM
One or more Virtual Machine names
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$True,ValueFromPipeline=$True)]
    [string[]]$VM
)

BEGIN {
    $ErrorActionPreference = "Stop"
    $collection = @()
}

PROCESS {
    try {
        $collection += get-vm $desktop
        write-output "$desktop does exist!"
        }
    catch {
        $collection += "$desktop does not exist!"
        }
    finally {}
}

END {
    $collection | out-gridview
}
```
