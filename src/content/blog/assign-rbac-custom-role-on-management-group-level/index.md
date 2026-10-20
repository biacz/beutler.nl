---
title: "Assign RBAC Custom Role on Management Group Level"
description: "Recently i had to add custom roles to our management group and since this is not supported through the GUI i had to go through powershell."
pubDate: 2021-05-04T08:17:10+02:00
tags: ["Azure", "PowerShell"]
legacyUrl: "/2021/05/04/assign-rbac-custom-role-on-management-group-level/"
---
Recently i had to add custom roles to our management group and since this is not supported through the GUI i had to go through powershell.

Create the .json file first and set your management group in the assignable scope section.

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

After that, run the following command specifying the json file you setup.

```powershell


New-AzRoleDefinition -InputFile C:\temp\RBAC.json

```

Thats it 🙂
