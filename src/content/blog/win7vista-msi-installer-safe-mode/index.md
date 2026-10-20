---
title: "Win7/Vista – MSI Installer Safe Mode"
description: "Referenced from: <http://www.symantec.com/connect/blogs/windows-installer-safe-mode>"
pubDate: 2014-09-03T11:13:10+02:00
tags: ["Windows"]
legacyUrl: "/2014/09/03/win7vista-msi-installer-safe-mode/"
---
Referenced from: <http://www.symantec.com/connect/blogs/windows-installer-safe-mode>

Windows Installer will not work under Safe Mode, this means that programs cannot be installed or uninstalled in safe mode without giving a specific command using msiexec in command prompt.

To make Windows Installer work under safe mode, you need to create a registry entry for every type of safe mode you are logged in to.

1. Safe Mode.\
   Type this in a command prompt:

```text
REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\SafeBoot\Minimal\MSIServer" /VE /T REG_SZ /F /D "Service"
```

and then

```text
net start msiserver
```

This will start the Windows Installer Service.- Safe Mode with Network
  ```text
REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\SafeBoot\Network\MSIServer" /VE /T REG_SZ /F /D "Service"
```

  and followed by

  ```text
net start msiserver
```

  This will start the Windows Installer Service.
