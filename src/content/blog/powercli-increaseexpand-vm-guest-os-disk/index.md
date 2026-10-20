---
title: "PowerCLI | Increase and Expand VM Guest OS Disk"
description: ":: Increase and Expand VM Guest OS Disk ::"
pubDate: 2014-10-22T10:35:50+02:00
tags: ["PowerCLI", "PowerShell", "vCenter", "VMware", "vSphere"]
authorship: human
legacyUrl: "/2014/10/22/powercli-increaseexpand-vm-guest-os-disk/"
---
:: Increase and Expand VM Guest OS Disk ::

Hi all,

as i finally have worked out two scripts that are able to increase and extend the Guest OS Disk (XP/Win7) i thought you might find it useful.

Please note that for the XP version to work both VMs (or all VMs) need to be powered off. Like that you can also increase/extend system disks.

hdd-increase-xp.ps1

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

hdd-increase-w7.ps1

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
