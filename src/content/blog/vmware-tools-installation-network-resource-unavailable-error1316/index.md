---
title: "VMWare Tools Installation | Network resource unavailable (error1316)"
description: "If you ever encounter the problem that you can’t update or install vmware tools (uninstall is also affected) due to missing soure.\\"
pubDate: 2014-09-04T09:48:50+02:00
tags: ["VMware", "Windows"]
authorship: human
legacyUrl: "/2014/09/04/vmware-tools-installation-network-resource-unavailable-error1316/"
---
If you ever encounter the problem that you can’t update or install vmware tools (uninstall is also affected) due to missing soure.\
Try this KB from VMWare.

## VMware Tools may not install on a Windows guest operating system after upgrading to a newer version of ESX/ESXi (1012693)

#### Symptoms

- VMware Tools does not install on a Windows 2008/2003 guest operating system after upgrading to a newer version of ESX/ESXi.
- Automatic installation of VMware Tools fails.
- Interactive installation of the VMware Tools tries to uninstall the previous version, but it fails because it cannot reference the previous VMware Tools MSI.
- You may receive errors similar to:

> Error1316 A network error occurred while attempting to read from the file C:\Windows\Installer\VMware Tools.msi.
>
> Error 1706. Setup cannot find the required files.The installation source for this resource is not available. Verify that the source exists and that you can access it.

#### Cause

This is an issue with Microsoft Windows Installer and does not affect all Windows 2008/2003 systems. The problem can occur when the original install path from the older version of VMware Tools is invalid, such as if the install path was E:\ and that path is no longer present. For more information, see the Microsoft Knowledge Base article [555175](http://support.microsoft.com/kb/555175).

***Note**: The preceding link was correct as of June 21, 2013. If you find the link is broken, provide feedback and a VMware employee will update the link.*

#### Resolution

To resolve this issue, you must perform a forced uninstall and reinstall of VMware Tools.

To uninstall and reinstall VMware Tools:

1. Right-click the virtual machine and click **Guest** > **Install/Upgrade VMware Tools**.
2. Open a Console to the virtual machine and log into the guest operating system.
3. Click **Start** > **Run**, type cmd, and click **OK**. A Command Prompt window opens.
4. Change the drive to your CD-ROM drive (For example, D:\).
5. Type setup /c and press Enter to force removal of all registry entries and delete the old version of VMware Tools.Note: For 64-bit guest operating systems, type setup64 /c
6. Open My Computer and double-click the CD-ROM that contains VMware Tools.
7. After Auto-Run starts, follow the prompts to install.**Note**: This must be done from the GUI interface. Do not launch the install by running Setup from the Command Prompt. Also ensure that the CD-ROM is enabled. In the virtual machine properties select CD-ROM under Device Status, and ensure that Connected (if the virtual machine is powered on) and Connect at power on are selected.
8. When the installation completes, reboot the guest operating system.
