---
title: "Report Guest Disk Sizes | PowerCLI"
description: "I already explained in my previous post how to grow/extend Guest OS disks with PowerCLI."
pubDate: 2014-07-31T08:29:06+02:00
tags: ["PowerCLI", "PowerShell", "vCenter", "VMware", "vSphere"]
legacyUrl: "/2014/07/31/report-guest-disk-sizes-powercli/"
---
I already explained in my [previous post](http://beutler.nl/?p=80) how to grow/extend Guest OS disks with PowerCLI.

Now before we can increase harddrives we also need to identify them. I therefor created this script.

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

The advantage using get-view is the nice performance if you run this script.

Try it out. You cant break things 🙂 It will give you a nice .csv as output.
