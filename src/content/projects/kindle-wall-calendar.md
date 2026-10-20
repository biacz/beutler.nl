---
title: "Kindle wall calendar"
summary: "A jailbroken Kindle Paperwhite 2 that pulls our calendars and the weather from Home Assistant, draws them itself on e-ink, wakes twice a day and lasts weeks per charge."
started: 2026-08-31
status: live
stack: ["Claude Code", "Home Assistant", "Kindle (jailbroken)", "FBInk", "busybox sh", "jq"]
post: "kindle-home-assistant-wall-calendar"
order: 2
---

The hard part wasn't the calendar but the battery: three percent per hour with the usual sleep approach. After two
wrong theories, measurement showed the device's own sleep was shallow. The fix: let the Kindle's power daemon sleep and
request the wake-up at the one moment it accepts it.
