---
title: "Users Last Logon Time to Computer | WMI > Win32_UserProfile"
description: "If you want to see a specific users last logon time to a machine use:"
pubDate: 2014-07-30T13:50:39+02:00
tags: ["PowerShell", "Windows"]
authorship: human
legacyUrl: "/2014/07/30/users-last-logon-time-to-computer-wmi-win32_userprofile/"
---
If you want to see a specific users last logon time to a machine use:

```powershell

gwmi Win32_UserProfile -ComputerName ComputerName | where { $_.LocalPath -eq "c:\users\username" } | select LastUseTime
```

Please note that this only works if the users profile is really in the default Windows7 Directory.
