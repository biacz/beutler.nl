---
title: "Win7 / Vista – Registry access denied"
description: "If you ever happen to be in the same position as me and your registry doesn’t let you change keys/values, check this article as it resolved my issue."
pubDate: 2014-09-03T09:50:57+02:00
tags: ["Windows"]
authorship: human
legacyUrl: "/2014/09/03/win7-vista-registry-access-denied/"
---
If you ever happen to be in the same position as me and your registry doesn’t let you change keys/values, check this article as it resolved my issue.

[http://www.smartestcomputing.us.com/topic/51422-vistaseven-the-registry-editor-could-not-set-security-in-the-key-currently-selected-or-some-of-its-subkeys-error-fix/](http://www.smartestcomputing.us.com/topic/51422-vistaseven-the-registry-editor-could-not-set-security-in-the-key-currently-selected-or-some-of-its-subkeys-error-fix/ "Fix Registry Win7/Vista")

—-

Download [PsExec.exe](http://live.sysinternals.com/psexec.exe "External link") to your desktop (IMPORTANT!)\
Go Start and in “Start search” type in:\
**cmd**\
Hold CTRL and SHIFT keys, press Enter.\
Command prompt window will open.\
Copy and paste following command:\
\
**“%userprofile%\desktop\psexec” -i -d -s c:\windows\regedit.exe**\
\
Press Enter.\
Registry Editor will open.\
\
Now you’ll be able to change permissions for any key.

—-
