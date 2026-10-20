---
title: "Festplattengrößen der Gastsysteme auslesen | PowerCLI"
description: "In meinem vorigen Beitrag habe ich schon erklärt, wie man Festplatten von Gastsystemen mit PowerCLI vergrößert."
pubDate: 2014-07-31T08:29:06+02:00
tags: ["PowerCLI", "PowerShell", "vCenter", "VMware", "vSphere"]
authorship: human
translation: ai
---

In meinem [vorigen Beitrag](/de/blog/change-grow-vm-hard-disk/) habe ich schon erklärt, wie man Festplatten von Gastsystemen mit PowerCLI vergrößert und erweitert.

Bevor wir Festplatten vergrößern können, müssen wir sie aber erst einmal finden. Dafür habe ich dieses Skript geschrieben.

```powershell

$MyCollection = @()
$AllVMs = Import-Csv -Header Desktop "hdd-check-input.csv" | foreach-object { Get-View -ViewType VirtualMachine -Filter @{"Name" = $_.Desktop}}
$SortedVMs = $AllVMs | Select *, @{N="NumDisks";E={@($_.Guest.Disk.Length)}} | Sort-Object -Descending NumDisks
ForEach ($VM in $SortedVMs){
 $Details = New-object PSObject
 $Details | Add-Member -Name Name -Value $VM.name -Membertype NoteProperty
 $DiskNum = 0
 Foreach ($disk in $VM.Guest.Disk){
 $Details | Add-Member -Name "Disk$($DiskNum)path" -MemberType NoteProperty -Value $Disk.DiskPath
 $Details | Add-Member -Name "Disk$($DiskNum)Capacity(MB)" -MemberType NoteProperty -Value ([math]::Round($disk.Capacity/ 1MB))
 $Details | Add-Member -Name "Disk$($DiskNum)FreeSpace(MB)" -MemberType NoteProperty -Value ([math]::Round($disk.FreeSpace / 1MB))
 $DiskNum++
 }
 $MyCollection += $Details
}
$MyCollection | export-csv hdd-check-output.csv
#Out-GridView
# Export-Csv, ConvertTo-Html or ConvertTo-Xml can be used above instead of Out-Gridview
```

Der Vorteil von get-view ist die gute Performance beim Ausführen des Skripts.

Probier es aus. Kaputtmachen kannst du damit nichts 🙂 Als Ergebnis bekommst du eine schöne .csv-Datei.
