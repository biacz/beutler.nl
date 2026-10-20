---
title: "Kindle-Wandkalender"
summary: "Ein gejailbreakter Kindle Paperwhite 2, der unsere Kalender und das Wetter aus Home Assistant holt, selbst auf E-Ink zeichnet, zweimal am Tag aufwacht und wochenlang mit einer Ladung auskommt."
started: 2026-08-31
status: live
stack: ["Claude Code", "Home Assistant", "Kindle (jailbroken)", "FBInk", "busybox sh", "jq"]
post: "kindle-home-assistant-wall-calendar"
order: 2
---

Das Schwierige war nicht der Kalender, sondern der Akku: drei Prozent pro Stunde mit dem üblichen Schlafansatz. Nach zwei falschen Theorien zeigte eine Messung, dass der eigene Schlaf des Geräts zu flach war. Die Lösung: den Energie-Daemon des Kindle schlafen lassen und den Weckzeitpunkt genau in dem einen Moment anfragen, in dem er ihn annimmt.
