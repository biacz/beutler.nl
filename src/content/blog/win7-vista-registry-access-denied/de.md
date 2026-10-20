---
title: "Win7 / Vista – Zugriff auf die Registry verweigert"
description: "Falls du mal in derselben Lage bist wie ich und dich die Registry keine Schlüssel oder Werte ändern lässt: Dieser Artikel hat mein Problem gelöst."
pubDate: 2014-09-03T09:50:57+02:00
tags: ["Windows"]
authorship: human
translation: ai
---

Falls du mal in derselben Lage bist wie ich und dich die Registry keine Schlüssel oder Werte ändern lässt: Dieser Artikel hat mein Problem gelöst.

[http://www.smartestcomputing.us.com/topic/51422-vistaseven-the-registry-editor-could-not-set-security-in-the-key-currently-selected-or-some-of-its-subkeys-error-fix/](http://www.smartestcomputing.us.com/topic/51422-vistaseven-the-registry-editor-could-not-set-security-in-the-key-currently-selected-or-some-of-its-subkeys-error-fix/ "Fix Registry Win7/Vista")

—-

Lade [PsExec.exe](http://live.sysinternals.com/psexec.exe "External link") auf deinen Desktop herunter (WICHTIG!)\
Öffne Start und tippe in „Suche starten“ ein:\
**cmd**\
Halte STRG und UMSCHALT gedrückt und drück Enter.\
Ein Eingabeaufforderungsfenster öffnet sich.\
Kopier folgenden Befehl hinein:\
\
**“%userprofile%\desktop\psexec” -i -d -s c:\windows\regedit.exe**\
\
Drück Enter.\
Der Registrierungs-Editor öffnet sich.\
\
Jetzt kannst du die Berechtigungen jedes Schlüssels ändern.

—-
