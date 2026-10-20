---
title: "ViewCLI | Benutzer und zugewiesene VMs finden, die sich seit über 90 Tagen nicht angemeldet haben"
description: "Ich habe so etwas nirgends gefunden, also habe ich mein eigenes ViewCLI-Skript geschrieben."
pubDate: 2014-09-24T10:55:10+02:00
tags: ["VMware Horizon", "PowerCLI", "PowerShell", "VMware"]
authorship: human
translation: ai
---

Ich habe so etwas nirgends gefunden, also habe ich mein eigenes ViewCLI-Skript geschrieben.

Führe es einfach gegen eine View-Event-Datenbank aus, und du bekommst alle Informationen, die du brauchst.

Bitte beachte:

Wenn einem Benutzer mehr als eine Maschine zugewiesen ist, steht statt eines Maschinennamens „System.Object[]“ da.

In dem Fall kannst du trotzdem mit „get-desktopVM | where { $_.user_displayname -eq “domain\username” }“ alle Maschinen auflisten.

Das Ergebnis sind Benutzer, die sich am Broker angemeldet haben. Das reicht mir, denn den agent_login selbst brauche ich nicht.

Pass einfach die SQL-Abfrage an, wenn du Agent-Verbindungen sehen willst.

Sag Bescheid, wenn du Fragen oder Probleme hast:

```powershell
<#
.SYNOPSIS
Check environment for users login times and get machines with no login since more than 90days.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$False)]
    [string]$choice
)

#generate a timestamp that can be used in filename
Function logstamp {
$now=get-Date
$yr=$now.Year.ToString()
$mo=$now.Month.ToString()
$dy=$now.Day.ToString()
$hr=$now.Hour.ToString()
$mi=$now.Minute.ToString()
if ($mo.length -lt 2) {
$mo="0"+$mo #pad single digit months with leading zero
}
if ($dy.length -lt 2) {
$dy="0"+$dy #pad single digit day with leading zero
}
if ($hr.length -lt 2) {
$hr="0"+$hr #pad single digit hour with leading zero
}
if ($mi.length -lt 2) {
$mi="0"+$mi #pad single digit minute with leading zero
}
Write-Output $yr$mo$dy$hr$mi
}

#variables - modify accordingly
$dbserver = ""
$user = ""
$pwd = read-host 'View Event DB Password' -AsSecureString
$database = "VIEWEVENTS"
$connectionString = "Server=$dbserver;uid=$user; pwd=$pwd;Database=$database;Integrated Security=False;"
$domain = ""
#this query actually gets all users that did not login between today and -90 days but before -90 days until -180 days.
#you could choose to increase or decrease the -180 as you want.
$query =
"
SELECT ModuleAndEventText
FROM VE_event_historical
WHERE (EventType = 'BROKER_USERLOGGEDIN') AND (Time BETWEEN dateadd(day,-180,getdate()) AND dateadd(day,-90,getdate()))
EXCEPT
SELECT ModuleAndEventText
FROM VE_event_historical
WHERE (EventType = 'BROKER_USERLOGGEDIN') AND (Time BETWEEN dateadd(day,-90,getdate()) AND dateadd(day,0,getdate()))
"

$connection = New-Object System.Data.SqlClient.SqlConnection
$connection.ConnectionString = $connectionString
$connection.Open()
$command = $connection.CreateCommand()
$command.CommandText  = $query
$result = $command.ExecuteReader()
$table = new-object “System.Data.DataTable”
$table.Load($result)
$connection.Close()

$properties = @{UserID = ''; VM=''}
$object = New-Object -TypeName PSObject -Property $properties

$collection=@()

$table | foreach-object {
    $objloop = $object.PSObject.Copy()
    #make sure to edit the 2nd -replace to match your domain
    $objloop.UserID = $_.ModuleAndEventText -replace " has logged in", "" -replace "User domain\\", ""
    $objloop.VM = get-desktopvm | where { $_.user_displayname -eq "$domain\$($objloop.UserID)" } | Select-Object -exp Name
    $collection += $objloop
    }

write-output "Logging output to InactiveDesktops_$timestamp.csv"

$timestamp = logstamp
$filename = "InactiveDesktops_$timestamp.csv"
$collection | Export-Csv $filename -NoTypeInformation
```
