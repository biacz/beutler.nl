---
title: "PowerApps + GitLab + Terraform + Azure Virtual Desktop"
description: "Willkommen zu Teil 1 (Frontend) meiner mehrteiligen Serie über die Automatisierung von Projektanfragen. Dieser Artikel beschreibt, wie AVD-Hostpools automatisch…"
pubDate: 2022-05-28T22:31:29+02:00
tags: ["Automation", "Azure Virtual Desktop", "Azure", "PowerShell"]
authorship: human
translation: ai
---

## AVD-Projektanfragen vereinfachen

Willkommen zu Teil 1 (Frontend) meiner mehrteiligen Serie über die Automatisierung eures Prozesses für Projektanfragen. Dieser Artikel beschreibt, wie AVD-Hostpools anhand von Benutzereingaben (M365) automatisch ausgerollt werden. Ich versuche, dir ein ausreichend gutes Bild zu geben, damit du das nachbauen kannst – aber bedenke: Es gibt so viele Besonderheiten in der Art, wie wir all diese Technologien einsetzen, dass das ganz sicher keine Anleitung zum einfachen Abschreiben wird! Sieh es als Blaupause und tausch Technologien oder Schritte aus, wo nötig. Ich sehe viele Leute, die ADO als CI/CD-Tool oder vielleicht sogar Bicep als IaC-Tool nutzen. Vermutlich funktioniert das alles auch. Das ist keineswegs die perfekte Lösung, aber sie hat uns geholfen, einen großen Teil unserer Arbeit zu automatisieren.

Inhalt

- [Mein Problem](#mein-problem "Mein Problem")
- [Das Design](#das-design "Das Design")
- [Unsere Anforderungen](#unsere-anforderungen "Unsere Anforderungen")
- [Meine Lösung](#meine-lösung "Meine Lösung")
- [Frontend](#frontend "Frontend")
  - [SharePoint](#sharepoint "SharePoint")
  - [PowerApps](#powerapps "PowerApps")
  - [Flow](#flow "Flow")

### Mein Problem

Ich arbeite für ein ziemlich großes Unternehmen, das mit zahlreichen Dienstleistern zusammenarbeitet, die eine Vielzahl von Aufgaben für uns erledigen. Die Dienstleister bekommen von uns (A)AD-Konten, aber keine Hardware. Die meisten brauchen Zugriff auf unsere internen Systeme. Dafür nutzen wir seit fast einem Jahrzehnt Horizon View, aber inzwischen ist Azure Virtual Desktop unser neuer Standard. Beim Onboarding neuer Dienstleister wollen wir sie in eigene Resource Groups, AVD-Hostpools, Storage Accounts usw. trennen. Jeder Dienstleister hat andere Anforderungen, deshalb müssen wir sie voneinander trennen können.

### Das Design

Das ist ein grobes Diagramm unseres Aufbaus. Wir konzentrieren uns auf den roten Kreis. Alles andere wurde bereits von unserer Enterprise-Architecture-Gruppe aufgebaut, und wir docken daran an.

![Powerapps + Gitlab + Terraform + AzureVirtualDesktop](./image-13-1024x426.png)

*Grundarchitektur*

Der rote Kreis umfasst:

- Resource Group
- Hostpool
- Virtuelle Maschine(n)
- DSC-Erweiterungen für Domain Join und Hostpool Join

### Unsere Anforderungen

- Benutzer sollen ihre eigenen AVD-Pools anfordern können (für neue Projekte, neu beauftragte Dienstleister oder einfach zum Testen von AVD)
- Diese Anfragen müssen einen Genehmigungsprozess durchlaufen (Kostenstellenverantwortliche)
- Die Bereitstellung muss unserer Azure-Landing-Zone-Policy entsprechen (Tags, Namensgebung usw.)
- State-Dateien müssen aufbewahrt werden, falls die anfragende Person die Anzahl der Maschinen ändern will oder mein Team den Pool wieder aufräumen möchte

### Meine Lösung

Wir wollen IaC-Automatisierung einsetzen. Noch besser: eine Lösung, die Benutzer selbst bedienen können. Und im besten Fall (ja, es geht noch weiter) soll der ganze Prozess qualitätsgesichert ablaufen, sodass Änderungen gemacht und getestet werden können, ohne die Produktion zu beeinträchtigen. Unsere Hostpools hängen zwar alle an derselben Infrastruktur, aber mit dem folgenden Konzept kannst du auch separate VNets und Subnetze anlegen und NSGs darauf setzen. Alles möglich! Als Tool haben wir GitLab.com als unser DevOps-Werkzeug für so ziemlich alle Automatisierungsprojekte festgelegt. Und da wir ohnehin ein Microsoft-Haus sind, habe ich einfach die Apps genutzt, die in diesem Werkzeugkasten mitkommen. Dafür habe ich mich entschieden, und das sind die Voraussetzungen für diesen Beitrag.

**Frontend**: SharePoint, PowerApp und Flow

![Powerapps + Gitlab + Terraform + AzureVirtualDesktop](./image-1.png)

*Frontend-Logos*

**Codebasis & CI/CD**: GitLab

![Powerapps + Gitlab + Terraform + AzureVirtualDesktop](./image-4.png)

*GitLab-Logo*

**IaC**: Terraform

![Powerapps + Gitlab + Terraform + AzureVirtualDesktop](./image-5-1024x383.png)

*Terraform-Logo*

### Frontend

#### SharePoint

Das Wichtigste zuerst. Wir brauchen etwas, in das Benutzer ihre Daten eingeben können und das einen Verlauf der Einträge speichert. PowerApps ist zwar ein sehr umfangreiches Tool, aber für den Anfang müssen wir nur eine SharePoint-Liste anlegen. Richte diese Liste mit den Spalten ein, die dein Projekt braucht. Eine gute Auswahl für den Start:

- ProjectTitle (einzelne Textzeile)
- Owner (Person oder Gruppe)
- Justification (mehrere Textzeilen)
- Region (Auswahl)
- Number of Machines (Zahl)
- CostCenter (einzelne Textzeile)

Zusätzlich fügt SharePoint automatisch weitere Spalten hinzu, die wir später nutzen (z. B. CreatedBy oder ID). Wir könnten auch weitere Funktionen ergänzen, etwa Spot-Instanzen für Validierungsumgebungen, Multi- oder Single-Session-Bereitstellungen oder sogar eine Spalte zur Auswahl der VM-Größe. Das kommt aber in einen Fortgeschrittenen-Teil 🙂

#### PowerApps

Sobald die SharePoint-Liste steht, kannst du ein PowerApps-Formular als Frontend hinzufügen. Klicke dazu auf „**Integrieren > Power Apps > Formulare anpassen**“. Füge alles hinzu, was du später als Information für die Bereitstellung deines Projekts brauchst. Für den Anfang reichen Projekttitel, Owner, Kostenstelle und Region.

Unten ein Beispiel meines produktiven Formulars.

![Powerapps + Gitlab + Terraform + AzureVirtualDesktop](./image-9.png)

*PowerApps-Beispiel*

#### Flow

Flow ist das Gehirn des Frontends. Wenn ein Benutzer das obige Formular absendet, wird ein neues SharePoint-Listenelement angelegt. Sobald es existiert, startet Microsoft Flow und übernimmt die Arbeit. Wir nutzen Flow für die benutzerseitige Interaktion über O365 und für die Übergabe an GitLab über die Pipeline-Trigger-API. Unten ein Beispiel des Flows, den wir verwenden, damit du schnell loslegen kannst.

**Achtung:** Für API-Aufrufe braucht der Besitzer des Flows eine Flow-Premium-Lizenz. Die gute Nachricht: Du brauchst nur eine, egal wie viele Leute die PowerApp nutzen, die den Flow füttert.

![Powerapps + Gitlab + Terraform + AzureVirtualDesktop](./image-10.png)

*Flow-Beispiel*

Wenn die Führungskraft des Owners zustimmt, startet der nächste Flow, der die eigentliche Arbeit erledigt.

![Powerapps + Gitlab + Terraform + AzureVirtualDesktop](./image-11.png)

*bei Genehmigung*

Wie du siehst, erledigen wir unterwegs ein paar Wartungsaufgaben, etwa den Status in der Statusspalte aktualisieren oder E-Mails verschicken, um die Benutzer auf dem Laufenden zu halten. Die eigentliche Magie passiert aber im Schritt PipelineTrigger. Dort rufen wir die GitLab-API auf, um unsere Nutzdaten (die Benutzereingaben) an Terraform zu übergeben. Danach fragt der Flow wiederholt die GitLab-API nach dem Status der Pipeline ab. Läuft sie erfolgreich durch, ist alles gut; wenn nicht, schicken wir dem AVD-Team eine Nachricht, damit es nachsieht, was los ist.

> Der Pipeline-Trigger als Beispiel unten. Die <>-Werte kommen aus dynamischen Feldern im Flow.
>
> [https://www.gitlab.com/api/v4/projects/1234/trigger/pipeline?token=xxxxxxxx&ref=<branch-name>&[variables]projectTitle=<projectTitle>&[variables]owner=<Owner>&[variables]CostCenter=<CostCenter>&[variables]Region=<Region>](https://www.gitlab.com/api/v4/projects/1234/trigger/pipeline?token=xxxxxxxx&ref=%3Cbranch-name%3E&[variables]projectTitle=%3CprojectTitle%3E&[variables]owner=%3COwner%3E&[variables]CostCenter=%3CCostCenter%3E&[variables]Region=%3CRegion%3E)

Damit sollte der Frontend-Teil fürs Erste abgedeckt sein. Im nächsten Artikel erkläre ich mehr zum Aufsetzen der GitLab-Pipeline.
