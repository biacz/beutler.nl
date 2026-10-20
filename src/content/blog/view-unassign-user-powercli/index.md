---
title: "View | Unassign User PowerCLI"
description: "If you dont want to unassign all users by hand simply provide this script a .csv file with desktop names and it will do it for you."
pubDate: 2014-07-30T18:06:06+02:00
tags: ["VMware Horizon", "PowerCLI", "PowerShell", "VMware"]
authorship: human
legacyUrl: "/2014/07/30/view-unassign-user-powercli/"
---
If you dont want to unassign all users by hand simply provide this script a .csv file with desktop names and it will do it for you.

```powershell

$filepath = "desktops.csv"
import-csv $filepath -Header Desktop | Foreach-object {
remove-userownership -machine_id (Get-DesktopVM -name $_.Desktop).machine_id
}
```
