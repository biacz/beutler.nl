---
title: "PowerCLI | Gastbetriebssystem-Festplatte einer VM vergrößern und erweitern"
description: "Zwei Skripte, die die Festplatte des Gastbetriebssystems von Windows-XP- und Windows-7-VMs mit PowerCLI vergrößern und erweitern."
pubDate: 2014-10-22T10:35:50+02:00
tags: ["PowerCLI", "PowerShell", "vCenter", "VMware", "vSphere"]
authorship: human
translation: ai
---

Hallo zusammen,

da ich endlich zwei Skripte fertig habe, mit denen sich die Festplatte des Gastbetriebssystems (XP/Win7) vergrößern und erweitern lässt, dachte ich, sie könnten euch nützen.

Bitte beachte: Damit die XP-Version funktioniert, müssen beide VMs (bzw. alle VMs) ausgeschaltet sein. So lassen sich auch Systemfestplatten vergrößern und erweitern.

*hdd-increase-xp.ps1*

```powershell
<#
.SYNOPSIS
Increases Harddisks for Windows machines (including Guest OS extend)
.EXAMPLE
get-content "list-of-machines.csv" | hdd-increase.ps1
.EXAMPLE
hdd-increase.ps1 vm1
.EXAMPLE
hdd-increase.ps1 vm1, vm2, vm3
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
    $admincred = Get-Credential
    $capacityKB = "62914560"
    $helpervm = '<insert helper vm here>'
    }

PROCESS {
    ForEach ($a in $VM) {
        Get-VM $a | Get-Harddisk | where {$_.Name -eq "Hard disk 1" } | Set-HardDisk –CapacityKB $capacityKB -ResizeGuestPartition -helpervm $helpervm -Confirm:$false -GuestCredential $admincred
        #Get-VM $a | Get-View -ViewType VirtualMachine -Filter @{"Name" = $_ } | write-output $_.Guest.Disk.Length
        Write-Output "$a successful!"
        Start-VM $a
        Write-Output "$a started."
        }
    }
END {}
```

*hdd-increase-w7.ps1*

```powershell
<#
.SYNOPSIS
Increases Harddisks for Windows 7 machines (including Guest OS extend)
.EXAMPLE
get-content "list-of-machines.csv" | hdd-increase.ps1
.EXAMPLE
hdd-increase.ps1 vm1
.EXAMPLE
hdd-increase.ps1 vm1, vm2, vm3
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
    $admincred = Get-Credential
    $capacityKB = "62914560"
    $harddisk = "Hard disk 1"
    }

PROCESS {
    try {
        foreach ($a in $VM) {
        Get-VM $a | Get-Harddisk | where { $_.Name -eq $harddisk } | Set-HardDisk –CapacityKB $capacityKB -ResizeGuestPartition -Confirm:$false
        Write-Output "$a successful!"
        }
    }
    catch {
        $ErrorMessage = $_.Exception.Message
        Write-Output $ErrorMessage
        Write-Output "$a failed!"
        }
    finally {
    }
}
END {}
```
