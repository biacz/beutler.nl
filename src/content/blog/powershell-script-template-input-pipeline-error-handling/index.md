---
title: "Powershell Script | Template (input from pipeline / error handling)"
description: "If you want to have a template that delivers some basic functionality just use this as and modify it to your needs."
pubDate: 2014-09-22T10:17:00+02:00
tags: ["PowerCLI", "PowerShell", "VMware"]
authorship: human
legacyUrl: "/2014/09/22/powershell-script-template-input-pipeline-error-handling/"
---
If you want to have a template that delivers some basic functionality just use this as and modify it to your needs.

It needs to have an input but also accepts input from a pipeline (like get-content input.txt | script.ps1).

It offers basic error handling for terminating errors. The variable $ErrorActionPreference = stop makes them all terminating though 🙂

Have fun and let me know if you need any advice.

*Basic Powershell Template*

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
