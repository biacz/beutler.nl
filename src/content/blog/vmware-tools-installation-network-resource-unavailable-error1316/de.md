---
title: "VMware-Tools-Installation | Netzwerkressource nicht verfügbar (Error 1316)"
description: "Falls du mal das Problem hast, dass sich die VMware Tools wegen fehlender Quelle nicht aktualisieren oder installieren lassen (Deinstallation ist auch betroffen):"
pubDate: 2014-09-04T09:48:50+02:00
tags: ["VMware", "Windows"]
authorship: human
translation: ai
---

Falls du mal das Problem hast, dass sich die VMware Tools wegen fehlender Quelle nicht aktualisieren oder installieren lassen (die Deinstallation ist auch betroffen):\
Probier diesen KB-Artikel von VMware.

## VMware Tools lassen sich nach einem Upgrade auf eine neuere ESX/ESXi-Version eventuell nicht auf einem Windows-Gastsystem installieren (1012693)

#### Symptome

- VMware Tools lassen sich nach einem Upgrade auf eine neuere ESX/ESXi-Version nicht auf einem Windows-2008/2003-Gastsystem installieren.
- Die automatische Installation der VMware Tools schlägt fehl.
- Die interaktive Installation versucht, die Vorversion zu deinstallieren, scheitert aber, weil sie die MSI der vorherigen VMware Tools nicht findet.
- Du bekommst eventuell Fehler wie diese:

> Error1316 A network error occurred while attempting to read from the file C:\Windows\Installer\VMware Tools.msi.
>
> Error 1706. Setup cannot find the required files.The installation source for this resource is not available. Verify that the source exists and that you can access it.

#### Ursache

Das ist ein Problem des Microsoft Windows Installer und betrifft nicht alle Windows-2008/2003-Systeme. Es kann auftreten, wenn der ursprüngliche Installationspfad der älteren VMware Tools ungültig ist, zum Beispiel wenn sie von E:\ installiert wurden und dieser Pfad nicht mehr existiert. Mehr dazu im Microsoft-Knowledge-Base-Artikel [555175](http://support.microsoft.com/kb/555175).

***Hinweis**: Der Link war am 21. Juni 2013 korrekt. Falls er nicht mehr funktioniert, gib Feedback, dann aktualisiert ihn ein VMware-Mitarbeiter.*

#### Lösung

Um das Problem zu beheben, musst du die VMware Tools zwangsweise deinstallieren und neu installieren.

So deinstallierst und installierst du die VMware Tools neu:

1. Rechtsklick auf die virtuelle Maschine und **Guest** > **Install/Upgrade VMware Tools** wählen.
2. Eine Konsole zur virtuellen Maschine öffnen und am Gastsystem anmelden.
3. **Start** > **Ausführen** klicken, cmd eingeben und **OK** klicken. Ein Eingabeaufforderungsfenster öffnet sich.
4. Auf das CD-ROM-Laufwerk wechseln (zum Beispiel D:\).
5. setup /c eingeben und Enter drücken, um alle Registry-Einträge zwangsweise zu entfernen und die alte Version der VMware Tools zu löschen. Hinweis: Bei 64-Bit-Gastsystemen setup64 /c eingeben
6. Arbeitsplatz öffnen und doppelt auf das CD-ROM-Laufwerk mit den VMware Tools klicken.
7. Wenn Auto-Run startet, den Anweisungen zur Installation folgen. **Hinweis**: Das muss über die grafische Oberfläche passieren. Starte die Installation nicht, indem du Setup über die Eingabeaufforderung ausführst. Stelle außerdem sicher, dass das CD-ROM-Laufwerk aktiviert ist: Wähle in den Eigenschaften der virtuellen Maschine unter „Device Status“ das CD-ROM-Laufwerk und achte darauf, dass „Connected“ (wenn die VM läuft) und „Connect at power on“ ausgewählt sind.
8. Nach Abschluss der Installation das Gastsystem neu starten.
