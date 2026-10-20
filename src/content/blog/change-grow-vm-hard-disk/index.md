---
title: "Change & Grow VM Hard Disk"
description: "We are right now in the need of resizing all of our Hard Disks on the Virtual Desktop VMs from 40GB to 60GB."
pubDate: 2014-07-30T13:22:20+02:00
tags: ["VMware Horizon", "PowerCLI", "PowerShell", "vCenter", "VMware", "vSphere"]
authorship: human
legacyUrl: "/2014/07/30/change-grow-vm-hard-disk/"
---
We are right now in the need of resizing all of our Hard Disks on the Virtual Desktop VMs from 40GB to 60GB.\
I was looking quite some time to find the appropriate command and this is how you do it:

```powershell
Get-HardDisk -vm "VMName" | where {$_.Name -eq "Hard Disk 1"} | Set-HardDisk –CapacityKB 62914560 -ResizeGuestPartition -Confirm:$false
```

A little bit of extra information (we ran into some issues performing this):

The second part of the script (Set-Harddisk) actually calls a library function that is using the “Invoke-VMScript” command.

You need to have following privileges on the vCenter System to execute it.\
**VirtualMachine.GuestOperations.Modify** and **VirtualMachine.GuestOperations.Execute**.

Update:

This script makes it even more comfortable. You provide a list of desktops in the input file and it will do all of them in one run. After that you will see a report of the changes in the output file.

```powershell
Import-Csv -Header Desktop "hdd-increase-input.csv" | foreach-object { Get-HardDisk -vm $_.Desktop | where {$_.Name -eq "Hard disk 1"} | Set-HardDisk –CapacityKB 62914560 -ResizeGuestPartition -Confirm:$false
Write-host "-----------------------------------------------------------------------------------------" -foregroundColor White -backgroundColor DarkGreen
} | export-csv "hdd-increase-output.csv"
```
