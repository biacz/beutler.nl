---
title: "VM-Festplatte ändern und vergrößern"
description: "Wir müssen gerade alle Festplatten der Virtual-Desktop-VMs von 40 GB auf 60 GB vergrößern."
pubDate: 2014-07-30T13:22:20+02:00
tags: ["VMware Horizon", "PowerCLI", "PowerShell", "vCenter", "VMware", "vSphere"]
authorship: human
translation: ai
---

Wir müssen gerade alle Festplatten der Virtual-Desktop-VMs von 40 GB auf 60 GB vergrößern.\
Ich habe eine ganze Weile nach dem passenden Befehl gesucht, und so geht es:

```powershell
Get-HardDisk -vm "VMName" | where {$_.Name -eq "Hard Disk 1"} | Set-HardDisk –CapacityKB 62914560 -ResizeGuestPartition -Confirm:$false
```

Ein paar zusätzliche Infos (wir sind dabei auf einige Probleme gestoßen):

Der zweite Teil des Skripts (Set-Harddisk) ruft eigentlich eine Bibliotheksfunktion auf, die den Befehl „Invoke-VMScript“ verwendet.

Dafür brauchst du folgende Berechtigungen auf dem vCenter-System:\
**VirtualMachine.GuestOperations.Modify** und **VirtualMachine.GuestOperations.Execute**.

Update:

Dieses Skript macht es noch bequemer. Du gibst eine Liste von Desktops in der Eingabedatei an, und es arbeitet alle in einem Durchlauf ab. Danach siehst du einen Bericht der Änderungen in der Ausgabedatei.

```powershell
Import-Csv -Header Desktop "hdd-increase-input.csv" | foreach-object { Get-HardDisk -vm $_.Desktop | where {$_.Name -eq "Hard disk 1"} | Set-HardDisk –CapacityKB 62914560 -ResizeGuestPartition -Confirm:$false
Write-host "-----------------------------------------------------------------------------------------" -foregroundColor White -backgroundColor DarkGreen
} | export-csv "hdd-increase-output.csv"
```
