---
title: "View Agent | The JVM has aborted"
description: "When HP QuickTest Professional software is installed on a View desktop, View Agent stops running and cannot communicate with View Connection Server. As a…"
pubDate: 2014-09-03T11:45:31+02:00
tags: ["VMware Horizon", "VMware"]
authorship: human
legacyUrl: "/2014/09/03/view-agent-the-jvm-has-aborted/"
---
## On View desktops that have HP QuickTest Professional installed, View Agent fails (2036437)

#### Details

When HP QuickTest Professional software is installed on a View desktop, View Agent stops running and cannot communicate with View Connection Server. As a result, users cannot access the View desktop.

In the view agent logs, you see entries similar to:

T09:50:47.588-05:00 WARN (0870-0874) <Main Thread> [] Error occurred during initialization of VM\
T09:50:47.588-05:00 WARN (0870-0874) <Main Thread> [] Could not find agent library jvmhook on the library path, with error: Can’t load IA 32-bit .dll on a AMD 64-bit platform\
T09:50:47.588-05:00 WARN (0870-0874) <Main Thread> []\
T09:50:47.588-05:00 FATAL (0870-0874) <Main Thread> [] The JVM has aborted.\
T09:50:47.744-05:00 INFO (03E0-0838) <JavaBridge> [wsnm_jmsbridge] wsnm_jms died, restarting in a minute

**Note**: For more information on View Agent log locations, see [Location of VMware View log files (1027744)](http://kb.vmware.com/selfservice/search.do?cmd=displayKC&docType=kc&docTypeID=DT_KB_1_1&externalId=1027744).

This issue occurs because HP QuickTest Professional sets the following environment variables on the desktop virtual machine:

‘_JAVA_OPTIONS’\
‘JAVA_TOOL_OPTIONS’

When View Agent loads the jvm.dll, it attempts to load the libraries specified by these environment variables. When View Agent cannot load the specified libraries, it fails.

#### Solution

After installing HP QuickTest Professional, remove the following environment variables from the virtual machine that you will use to create desktop pools:

‘_JAVA_OPTIONS’\
‘JAVA_TOOL_OPTIONS’

After removing these environment variables, install View Agent.
