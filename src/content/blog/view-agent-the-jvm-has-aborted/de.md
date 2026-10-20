---
title: "View Agent | The JVM has aborted"
description: "Wenn HP QuickTest Professional auf einem View-Desktop installiert ist, hört der View Agent auf zu laufen und kann nicht mehr mit dem View Connection Server kommunizieren…"
pubDate: 2014-09-03T11:45:31+02:00
tags: ["VMware Horizon", "VMware"]
authorship: human
translation: ai
---

## Auf View-Desktops mit installiertem HP QuickTest Professional schlägt der View Agent fehl (2036437)

#### Details

Wenn HP QuickTest Professional auf einem View-Desktop installiert ist, hört der View Agent auf zu laufen und kann nicht mehr mit dem View Connection Server kommunizieren. Dadurch können Benutzer nicht auf den View-Desktop zugreifen.

In den Logs des View Agent siehst du Einträge ähnlich wie diese:

T09:50:47.588-05:00 WARN (0870-0874) <Main Thread> [] Error occurred during initialization of VM\
T09:50:47.588-05:00 WARN (0870-0874) <Main Thread> [] Could not find agent library jvmhook on the library path, with error: Can’t load IA 32-bit .dll on a AMD 64-bit platform\
T09:50:47.588-05:00 WARN (0870-0874) <Main Thread> []\
T09:50:47.588-05:00 FATAL (0870-0874) <Main Thread> [] The JVM has aborted.\
T09:50:47.744-05:00 INFO (03E0-0838) <JavaBridge> [wsnm_jmsbridge] wsnm_jms died, restarting in a minute

**Hinweis**: Mehr dazu, wo die Logs des View Agent liegen, steht in [Location of VMware View log files (1027744)](http://kb.vmware.com/selfservice/search.do?cmd=displayKC&docType=kc&docTypeID=DT_KB_1_1&externalId=1027744).

Das Problem tritt auf, weil HP QuickTest Professional auf der virtuellen Desktop-Maschine folgende Umgebungsvariablen setzt:

‘_JAVA_OPTIONS’\
‘JAVA_TOOL_OPTIONS’

Wenn der View Agent die jvm.dll lädt, versucht er, die in diesen Umgebungsvariablen angegebenen Bibliotheken zu laden. Kann er sie nicht laden, schlägt er fehl.

#### Lösung

Entferne nach der Installation von HP QuickTest Professional folgende Umgebungsvariablen von der virtuellen Maschine, aus der du Desktop-Pools erstellst:

‘_JAVA_OPTIONS’\
‘JAVA_TOOL_OPTIONS’

Installiere danach den View Agent.
