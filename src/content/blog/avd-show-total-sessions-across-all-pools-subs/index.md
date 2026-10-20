---
title: "AVD – Show total sessions across all pools / subs"
description: "The AVD workbooks coming from Microsoft and other sources like the ITProCloud are nice but are based on individual hostpools. But what if you need to know…"
pubDate: 2022-08-21T19:48:23+02:00
tags: ["Azure Virtual Desktop", "Azure"]
authorship: human
legacyUrl: "/2022/08/21/avd-show-total-sessions-across-all-pools-subs/"
---
The AVD workbooks coming from Microsoft and other sources like the ITProCloud are nice but are based on individual hostpools. But what if you need to know your total session user count over time? Below query will do exactly that. Run it in Azure Monitor against your log analytic workspaces that capture your hostpool diagnostic data.

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
