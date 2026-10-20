---
title: "AVD – Gesamtzahl der Sitzungen über alle Pools und Subscriptions"
description: "Die AVD-Workbooks von Microsoft und anderen Quellen wie ITProCloud sind gut, beziehen sich aber auf einzelne Hostpools. Was, wenn du die Gesamtzahl brauchst…"
pubDate: 2022-08-21T19:48:23+02:00
tags: ["Azure Virtual Desktop", "Azure"]
authorship: human
translation: ai
---

Die AVD-Workbooks von Microsoft und anderen Quellen wie ITProCloud sind gut, beziehen sich aber jeweils auf einzelne Hostpools. Was aber, wenn du wissen willst, wie viele Benutzersitzungen du insgesamt über die Zeit hast? Die folgende Abfrage macht genau das. Führe sie in Azure Monitor gegen die Log-Analytics-Workspaces aus, in denen die Diagnosedaten deiner Hostpools landen.

```text
let StartWin = startofday(ago(30d));

let EndWin = endofday(ago(1d));

let lookbackWindow = 1d;

let StartCountDay = StartWin - lookbackWindow;

WVDConnections

| project CorrelationId, State, TimeGenerated, UserName

| as Connections

| where State == "Started"

| extend StartTime = TimeGenerated

| join kind=fullouter

(

    Connections

    | where State == "Completed"

    | extend EndTime = TimeGenerated

)

on CorrelationId

| extend EndTime = coalesce(EndTime, EndWin) // if connection not ended yet use lastday

| where EndTime >= StartCountDay  // chop out connections the ended before our window started

| extend StartTime = coalesce(StartTime, StartCountDay)  // if start aged off set at start of lookbackwindow

| where StartTime <= EndWin

| extend CorrelationId = coalesce(CorrelationId, CorrelationId1)  // fix fields that only came from a completed record

| extend UserName = coalesce(UserName, UserName1)

| project StartTime, EndTime, CorrelationId, UserName  // chop down colms to just what we need

| extend StartTime=max_of(StartTime, StartCountDay), EndTime=min_of(EndTime, EndWin)  // chop connections to window

| extend _bin = bin_at(StartTime, 1d, StartCountDay)  // #1 start of first day connection appears

| extend _endRange = iff(EndTime + lookbackWindow > EndWin, EndWin,

                             iff(EndTime + lookbackWindow - 1d < StartTime, StartTime,

                                    iff(EndTime + lookbackWindow - 1d < _bin, _bin, _bin + lookbackWindow - 1d))) // #2 last day connection will appear

| extend _range = range(_bin, _endRange, 1d) // #3 create a start of day timestamp for every day connection existed and/or day it will be counted

| mv-expand _range to typeof(datetime) // #4 

| summarize Users = dcount(UserName) by Days=bin_at(_range, 1d, StartCountDay) // #5 sum startofday timestamps

| where Days>= StartWin // #6 chop off days we dont want to display

| sort by Days asc
```
