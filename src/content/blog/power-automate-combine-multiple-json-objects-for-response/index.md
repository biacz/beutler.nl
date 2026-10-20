---
title: "Power Automate – Combine multiple JSON objects for Response"
description: "Today I was looking at running multiple HTTP requests and combine all of the data into one JSON object in Power Automate to respond back to my PowerApp."
pubDate: 2022-06-07T09:05:39+02:00
tags: ["Automation", "Azure", "Power Automate", "Power Apps"]
authorship: human
legacyUrl: "/2022/06/07/power-automate-combine-multiple-json-objects-for-response/"
---
Today I was looking at running multiple HTTP requests and combine all of the data into one JSON object in Power Automate to respond back to my PowerApp.

![Power Automate – Combine multiple JSON objects for Response](./image.png)

I was browsing through various blogs and articles but didn’t find an efficient solution that didn’t require a lot of steps or complicated data manipulation. I wanted to simply return the object from Response, without doing any kind of apply for each or any other sorcery in between.

My problem was though, that some of HTTP return objects had the same schema. In the beginning I was kind of successful using the `union(outputs('HTTP')['body'], outputs('HTTP_2')['body']` function. But this only helped for JSON objects that had a different schema as union would simply overwrite properties if they would have the same name.

After some struggle I thought why not simply building my own schema and referring to the output of the HTTP queries. And it worked! Power Automate can be so simple. Keeps amazing me 🙂

![Power Automate – Combine multiple JSON objects for Response](./image-1.png)

That way I was able to append or combine all JSON objects from my HTTP calls into one response and then properly process it from the calling PowerApp. Cool stuff!
