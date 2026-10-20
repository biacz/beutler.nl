---
title: ":: PowerCLI | Remove VMs"
description: "Just a quick script from me that will help delete a bunch of VMs."
pubDate: 2015-05-13T12:34:49+02:00
tags: ["VMware Horizon", "PowerCLI", "PowerShell", "vCenter", "VMware", "vSphere"]
authorship: human
legacyUrl: "/2015/05/13/powercli-remove-vms/"
---

Just a quick script from me that will help delete a bunch of VMs.\
You need to have a list with all computer names in a .txt or .csv file for that.

Uncomment the get-credential part if you are not running the ISE with your admin that has access to the vCenter server.

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
