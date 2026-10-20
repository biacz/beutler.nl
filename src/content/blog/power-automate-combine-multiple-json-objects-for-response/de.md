---
title: "Power Automate – Mehrere JSON-Objekte für die Antwort kombinieren"
description: "Heute wollte ich in Power Automate mehrere HTTP-Requests ausführen und alle Daten zu einem JSON-Objekt zusammenfassen, um sie an meine PowerApp zurückzugeben."
pubDate: 2022-06-07T09:05:39+02:00
tags: ["Automation", "Azure", "Power Automate", "Power Apps"]
authorship: human
translation: ai
---

Heute wollte ich in Power Automate mehrere HTTP-Requests ausführen und alle Daten zu einem JSON-Objekt zusammenfassen, um damit meiner PowerApp zu antworten.

![Power Automate – Combine multiple JSON objects for Response](./image.png)

Ich habe mich durch verschiedene Blogs und Artikel gelesen, aber keine effiziente Lösung gefunden, die ohne viele Schritte oder komplizierte Datenmanipulation auskommt. Ich wollte das Objekt einfach aus „Response“ zurückgeben, ohne „Apply to each“ oder sonstige Zauberei dazwischen.

Mein Problem war allerdings, dass einige der HTTP-Rückgabeobjekte das gleiche Schema hatten. Anfangs hatte ich mit der Funktion `union(outputs('HTTP')['body'], outputs('HTTP_2')['body']` einigermaßen Erfolg. Das half aber nur bei JSON-Objekten mit unterschiedlichem Schema, denn union überschreibt einfach Eigenschaften mit gleichem Namen.

Nach einigem Hin und Her dachte ich mir: Warum nicht einfach ein eigenes Schema bauen und darin auf die Ausgaben der HTTP-Abfragen verweisen? Und es hat funktioniert! Power Automate kann so einfach sein. Überrascht mich immer wieder 🙂

![Power Automate – Combine multiple JSON objects for Response](./image-1.png)

So konnte ich alle JSON-Objekte aus meinen HTTP-Aufrufen zu einer Antwort zusammenfügen und sie dann sauber in der aufrufenden PowerApp verarbeiten. Coole Sache!
