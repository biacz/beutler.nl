---
title: ":: PowerCLI | VMs löschen"
description: "Nur ein kurzes Skript von mir, das beim Löschen einer ganzen Reihe von VMs hilft."
pubDate: 2015-05-13T12:34:49+02:00
tags: ["VMware Horizon", "PowerCLI", "PowerShell", "vCenter", "VMware", "vSphere"]
authorship: human
translation: ai
---

Nur ein kurzes Skript von mir, das beim Löschen einer ganzen Reihe von VMs hilft.\
Dafür brauchst du eine Liste mit allen Computernamen in einer .txt- oder .csv-Datei.

Entferne die Kommentarzeichen vor dem get-credential-Teil, wenn du die ISE nicht mit dem Admin-Konto ausführst, das Zugriff auf den vCenter-Server hat.

```powershell


<#

.SYNOPSIS Removes a VM from View and vCenter 

.EXAMPLE get-content "list-of-machines.csv" | remove-vm.ps1 

.EXAMPLE remove-vm.ps1 vm1 

.EXAMPLE remove-vm.ps1 vm1, vm2, vm3 

.PARAMETER VM One or more Virtual Machine names 

#>

[CmdletBinding()]param([Parameter(Mandatory=$True,ValueFromPipeline=$True)][string[]]$VM ) 



BEGIN { 

  $ErrorActionPreference = "Stop" 

} 



PROCESS { 

  ForEach ($a in $VM) { 

    try { 

      remove-vm -vm $a -DeletePermanently -confirm:$false 

      Write-Output "$a successful!" 

      } 



catch { 

  $ErrorMessage = $_.Exception.Message 

  Write-Output $ErrorMessage 

  Write-Output "$a failed!" 

} 



finally {} 

} 

} 

END {}

```
