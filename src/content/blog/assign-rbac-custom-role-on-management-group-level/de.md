---
title: "Benutzerdefinierte RBAC-Rolle auf Management-Group-Ebene zuweisen"
description: "Vor Kurzem musste ich unserer Management Group benutzerdefinierte Rollen hinzufügen. Da das in der GUI nicht geht, blieb nur PowerShell."
pubDate: 2021-05-04T08:17:10+02:00
tags: ["Azure", "PowerShell"]
authorship: human
translation: ai
---

Vor Kurzem musste ich unserer Management Group benutzerdefinierte Rollen hinzufügen. Da das in der GUI nicht unterstützt wird, musste ich über PowerShell gehen.

Lege zuerst die .json-Datei an und trage deine Management Group im Abschnitt „AssignableScopes“ ein.

```json


{

  "Name": "Start VM on Connect",

  "Id": null,

  "IsCustom": true,

  "Description": "Allowed starting up VMs",

  "Actions": [

    "Microsoft.Compute/virtualMachines/start/action",

    "Microsoft.Compute/virtualMachines/read"

  ],

  "NotActions": [],

  "AssignableScopes": [

    "/providers/Microsoft.Management/managementGroups/mgmt-wvd"

  ]

}

```

Danach führst du folgenden Befehl mit der vorbereiteten JSON-Datei aus.

```powershell


New-AzRoleDefinition -InputFile C:\temp\RBAC.json

```

Das war's 🙂
