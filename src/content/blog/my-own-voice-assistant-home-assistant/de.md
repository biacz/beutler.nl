---
title: "Drei Boxen, eine Pipeline: mein eigener Sprachassistent mit Home Assistant"
description: "Eine Voice PE, eine Konferenz-Freisprecheinrichtung und ein ESP32 für 13 Dollar hören auf „Okay Nabu“. Die wichtigste Lehre: Die schnellste Antwort ist die, die nie bei der KI ankommt – von 51 Sekunden auf 0,01."
pubDate: 2026-11-12
tags: ["Home Assistant", "AI", "Automation"]
authorship: ai-written
draft: false
translation: ai
---

„Okay Nabu, Wohnzimmer aus.“ Das Licht geht aus, bevor ich mich umgedreht habe. „Okay Nabu, was steht morgen im
Kalender?“ Eine kurze Pause, dann die Antwort mit ruhiger Stimme. „Okay Nabu, wir haben keine Muskatnuss mehr.“ Steht
auf der Einkaufsliste.

So sieht der Sprachassistent bei uns heute aus. Er läuft auf Home Assistant, fragt bei Bedarf meinen eigenen
KI-Assistenten (wir nennen ihn Hugo) und hört über drei sehr unterschiedliche Boxen zu. Bis dahin hat es etwa vier
Wochen gedauert – und die meiste Zeit ging in eine einzige Frage: **Warum ist das so langsam?**

Wie meine anderen Projekte der letzten Zeit ist auch dieses mit Claude (einer KI) entstanden, die die eigentliche
Arbeit gemacht hat: Konfiguration, Patches, Messungen und Notizen. Ich habe entschieden, was ich will, mit den Boxen
gesprochen und gemeldet, wenn etwas falsch klang.

## Wie alles zusammenhängt

Home Assistant bringt eine komplette Sprach-Pipeline mit, sie heißt Assist. Ein Satellit (eine Box mit Mikrofon und
Lautsprecher) hört auf dem Gerät selbst auf das Aktivierungswort und schickt erst dann Audio an Home Assistant. Von
dort aus geht es so weiter:

![Diagramm: Drei Satelliten – Voice PE, Jabra-Freisprecheinrichtung und Atom Echo – schicken Sprache an die Home-Assistant-Pipeline. Sprache wird zu Text, dann wird mit lokalen Sätzen verglichen. Ein Treffer wird von Home Assistant selbst in etwa 0,01 Sekunden beantwortet. Alles andere geht an den KI-Agenten mit wenigen Werkzeugen: Home Assistant, Kalender, Einkaufsliste, Wetter. Die Antwort wird zu Sprache und auf der Box abgespielt, die die Frage gehört hat.](./how-it-works.svg)

- **Spracherkennung und Sprachausgabe** kommen aus Home Assistant Cloud, mit einer deutschen Neural-Stimme.
- **Lokale Sätze zuerst.** Die Pipeline-Option „Befehle bevorzugt lokal verarbeiten“ ist an: Versteht Home Assistant
  einen Satz selbst, antwortet es ohne KI.
- **Alles andere** geht an einen eigenen Sprach-Agenten – ein abgespecktes Profil meines KI-Assistenten, mit kurzer
  Anweisungsdatei und nur den Werkzeugen, die er braucht: Home Assistant, Kalender, Einkaufsliste, Wetter, Gedächtnis.

Die KI-Seite lief bis Anfang November auf OpenClaw und ist seitdem zu Hermes Agent umgezogen. Das Modell ist ein
schnelles, günstiges (DeepSeek V4.1 Flash) mit Denken auf „low“: Ganz ohne Denken war es spürbar dümmer, und „low“
ist kaum langsamer als „off“.

## Drei Boxen

**Home Assistant Voice Preview Edition.** Die offizielle Box. Einstecken, in Home Assistant hinzufügen, fertig. Diese
Box hat nie Aufmerksamkeit gebraucht – genau das will man von der Box im Wohnzimmer.

**Eine Jabra Speak 510.** Eine Konferenz-Freisprecheinrichtung, die sowieso auf meinem Schreibtisch lag. Gutes
Mikrofon-Array, ordentlicher Lautsprecher, LEDs und Tasten – nur von Home Assistant weiß sie nichts. Das
Open-Source-Projekt [linux-voice-assistant](https://github.com/OHF-Voice/linux-voice-assistant) spricht dasselbe
Protokoll wie die offiziellen Boxen, ist aber für Linux gebaut. Claude hat es auf meinem PC nach Windows portiert:
Mikrofon über WASAPI, Wiedergabe über mpv und eine kleine Brücke, die LEDs und Tasten der Jabra per USB-HID steuert.
Eine geplante Aufgabe hält das Ganze am Laufen und startet es neu, wenn das USB-Gerät verschwindet.

**Ein M5Stack Atom Echo.** Ein daumengroßer ESP32 mit Mikrofon, winzigem Lautsprecher und einer LED, für etwa
13 Dollar. Die offizielle Firmware lässt sich direkt aus dem Browser flashen. Zwei Dinge haben Zeit gekostet: Das
erste USB-Kabel war ein reines Ladekabel (Windows hat *gar kein* Gerät gemeldet), und das Flashen klappte nur mit
115200 Baud, nicht mit der schnelleren Voreinstellung. Er klingt wie ein Spielzeug, aber für „Licht an“ in der Küche
reicht das.

## Tempo: von 51 Sekunden auf 0,01

Die erste Version lief am ersten Tag. Sie war aber kaum zu ertragen. So ist die Antwortzeit gesunken, gemessen vom
Ende des Sprechens bis zur Antwort:

![Balkendiagramm der Antwortzeiten. Alles über den Haupt-Assistenten: bis zu 51 Sekunden. Eigener Sprach-Agent, aber allgemeine Home-Assistant-Werkzeuge: 23 bis 38 Sekunden. Home Assistants eigener MCP-Server: 1,9 bis 5,3 Sekunden. Lokaler Satz in Home Assistant: 0,01 bis 0,08 Sekunden.](./response-times.svg)

**Schritt 1: ein eigener Sprach-Agent.** Anfangs ging jede Frage an meinen Haupt-Assistenten – denselben, der auch
WhatsApp, Mails und alles andere erledigt. Jeder Aufruf schleppte etwa 85.000 Token Kontext mit: Anweisungen,
Gedächtnis, Dutzende Werkzeugbeschreibungen. Antworten dauerten bis zu 51 Sekunden. Ein eigener Sprach-Agent mit
kurzer Anweisungsdatei brachte das auf etwa 25.000 Token, und seit das Agent-Framework seine Werkzeuge sucht, statt
alle aufzulisten, auf 6.000–8.000.

**Schritt 2: die richtigen Werkzeuge.** Trotzdem dauerte „Wohnzimmer aus“ 38 Sekunden, wenn es über die KI lief. Der
Trace zeigte, warum: **zwölf Modellrunden.** Der allgemeine Home-Assistant-MCP-Server, den ich benutzt habe, ist toll
für die Verwaltung, hat aber obendrauf eine eigene Werkzeugsuche – also suchte das Modell ein Werkzeug, suchte darin
noch einmal, las eine Liste und schaltete erst dann das Licht. Home Assistant bringt aber auch einen eigenen
MCP-Server mit, genau für diesen Zweck: Ein Aufruf (`GetLiveContext`) liefert den Zustand von allem, was für Assist
freigegeben ist, ein Aufruf schaltet es. Zwei Modellrunden, 1,9 bis 5,3 Sekunden.

**Schritt 3: die KI gar nicht erst fragen.** Der größte Gewinn war, dafür zu sorgen, dass die häufigen Befehle Home
Assistant nie verlassen. Die eingebauten Sätze decken schon viel ab („Schalte das Küchenlicht ein“), und eigene lassen
sich in einer YAML-Datei ergänzen:

```yaml
# /config/custom_sentences/de/<name>.yaml (simplified)
language: "de"
intents:
  HassTurnOff:
    data:
      - sentences:
          - "{area} aus"            # "Wohnzimmer aus" = living room off
        slots:
          domain: "light"
  HassListAddItem:
    data:
      - sentences:
          - "wir brauchen {item}"   # "we need ..."
          - "{item} ist alle"       # "... is all gone"
        slots:
          name: "Einkaufsliste"
```

Die antworten in **0,01 bis 0,08 Sekunden.** Eine Frage wie „Welche Lichter brennen noch?“ ging von 23 Sekunden auf
sofort.

Die Regel, was lokal bleibt, ist streng, und man sollte sie kennen: Home Assistant beantwortet einen Satz nur selbst,
wenn er *genau* auf eine Vorlage passt und jeder Platzhalter (Bereich, Gerät, Liste) aufgelöst wird. Ein einziges
unbekanntes Wort – „Welche Lampen sind **im Haus** an?“ – und der ganze Satz geht an die KI. Diese Strenge wirkt in
beide Richtungen:

- „X ist leer“ habe ich bewusst nicht als Einkaufslisten-Satz eingetragen. „Der Akku ist leer“ hätte sonst „Akku“
  auf die Liste gesetzt.
- „Mach mal Muskatnuss auf die Einkaufsliste“ hat den Eintrag „Mach mal Muskatnuss“ angelegt – die Vorlage hat die
  Füllwörter als Teil des Eintrags geschluckt. Lokal heißt nicht schlau.

## Die Box, die nur „He“ sagte

Ein Fehler verdient eine eigene Geschichte. Nach einem Update antworteten die Boxen manchmal mit einer einzigen Silbe –
„He“ – und verstummten. Nochmal fragen brachte die ganze Antwort.

Es passierte nur bei der ersten Frage nach ein paar Minuten Stille, deshalb wirkte es zufällig. Die Ursache: Das
Agent-Framework hatte geändert, wie es Text streamt. Nur das erste Stück einer Antwort enthielt das Feld `text`, alle
weiteren nur ein `delta`. Die Home-Assistant-Integration las `text` und warf den Rest weg. In einer warmen Sitzung kam
die ganze Antwort in einem Stück, also klappte es; in einer frischen Sitzung kam sie in Teilen, und die Box sprach das
erste Teil – „He“ von „Heute…“.

Der Fix waren ein paar Zeilen. Claude hat ihn samt Test geschrieben, ich habe ihn eingespielt, und er ging als
[Pull Request](https://github.com/ddrayne/openclaw-homeassistant/pull/16) ans Originalprojekt.

## Die Box, die nach dem Standby taub war

Die Jabra hatte ihren eigenen Spuk: Manche Morgen war sie stummgeschaltet und blieb es. Fünf „Hardware-Stumm“-Ereignisse
in zehn Tagen, und jedes einzelne fiel auf die Sekunde mit dem Aufwachen des PCs aus dem Standby zusammen.

Wenn Windows aufwacht, liefert das Mikrofon 7 bis 16 Sekunden reine digitale Stille. Die Brücke hielt das für die
Stumm-Taste. Das anschließende Entstummen kam, während die Box noch nicht wieder mit Home Assistant verbunden war, und
wurde kommentarlos verworfen. Jetzt ignoriert die Brücke das Mikrofon 30 Sekunden lang, wenn der Audiostrom stockt,
und holt ein verlorenes Entstummen beim Neuverbinden nach.

## Gut warten

Selbst 8 Sekunden für eine Kalenderfrage fühlen sich in Stille kaputt an. Mit dem Umzug zu Hermes hat Claude eine
kleine eigene Home-Assistant-Integration geschrieben, die das Warten richtig macht:

- **Echtes Streaming.** Die Antwort geht Wort für Wort an die Sprachausgabe, die Box spricht also schon, während das
  Modell noch schreibt.
- **Ein Wartesatz, aber nur wenn nötig.** Startet der Agent einen Werkzeugaufruf (Kalender, Wetter), sagt die
  Integration „Moment, ich schau nach“ – frühestens nach 1,5 Sekunden. Beim Plaudern ohne Werkzeug hört man ihn nie.
- **Ein Trick für die ersten Worte:** Home Assistant beginnt die Sprachausgabe erst ab 60 Zeichen. Ein kurzer Wartesatz
  würde im Puffer hängen. Schickt man ihn zusammen mit einer Markierung für einen externen Werkzeugaufruf, spricht
  Home Assistant ihn sofort.

Aktuelle Werte von der echten Box, vom Ende des Sprechens bis zum Ende der Antwort: Plaudern 3,6–4,3 Sekunden (die
Sprache beginnt nach etwa 3), „Merk dir …“ 6,0 Sekunden, Kalender 8,3 Sekunden, Einkaufsliste 0,01 Sekunden.

## Gespräche und Gedächtnis

Zwei kleinere Dinge sorgen dafür, dass es sich weniger wie eine Kommandozeile anfühlt:

- **Nachfragen ohne Aktivierungswort.** Endet die Antwort mit einem Fragezeichen, hört die Box weiter zu. Das ist die
  ganze Regel – deshalb steht in den Anweisungen des Assistenten, dass er bei Unklarheiten zurückfragen soll.
- **Gedächtnis in drei Stufen.** Ein Gespräch endet nach fünf Minuten Stille. Zusammenfassungen der letzten 48 Stunden
  bekommt jedes neue Gespräch mit („Was hab ich dich heute Morgen gefragt?“ klappt). Themen, die immer wiederkommen,
  wandern nachts ins Langzeitgedächtnis.

## Was ich jedem rate, der so etwas baut

- **Jeden Schritt messen.** Home Assistant zeichnet jeden Pipeline-Lauf mit Zeiten pro Stufe auf (Debug-Ansicht der
  Pipeline unter Einstellungen → Sprachassistenten). Ohne das ist „es ist langsam“ ein Gefühl, kein Fehler.
- **Modellrunden zählen, nicht Sekunden.** Eine Runde sind 1–3 Sekunden. Zwölf Runden sind das Problem, nicht die
  Geschwindigkeit des Modells.
- **Häufige Befehle in lokale Sätze verlagern.** Die KI ist für Fragen da, nicht für Lichtschalter.
- **Alte Hardware geht.** Eine Konferenz-Freisprecheinrichtung ist ein sehr guter Satellit – solange der PC läuft, an
  dem sie hängt.
- **Nach jedem Update eine lange Frage nach fünf Minuten Stille stellen.** Genau dort verstecken sich Streaming-Fehler.

## Mit einer KI daran arbeiten

Bei diesem Projekt hat eine KI eine andere KI gebaut, debuggt und optimiert. Claude hat Pipeline-Traces gelesen,
Modellrunden gezählt, die Patches und eigenen Sätze geschrieben und ein Linux-Programm nach Windows portiert. Mein Teil
war, mit den Boxen zu sprechen – sehr viel – und zu sagen „das hat zu lange gedauert“ oder „sie hat wieder nur He
gesagt“.

Was mir am besten gefallen hat: die Messungen. Jede Änderung kam mit einem Vorher und Nachher, und die Notizen sagen
klar, welche Ideen nicht geholfen haben (die Werkzeugsuche abzuschalten zum Beispiel hat jeden Aufruf langsamer
gemacht). Deshalb kann dieser Beitrag Zahlen nennen statt Eindrücke.

Die Küchenbox klingt immer noch wie ein Spielzeug. Aber sie antwortet in einer Hundertstelsekunde.
