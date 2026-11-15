---
title: "Three boxes, one pipeline: my own voice assistant on Home Assistant"
description: "A Voice PE, a conference speakerphone and a 13-dollar ESP32 all listen for \"Okay Nabu\". The biggest lesson: the fastest answer is the one that never reaches the AI – from 51 seconds down to 0.01."
pubDate: 2026-11-12
tags: ["Home Assistant", "AI", "Automation"]
authorship: ai-written
draft: false
---

"Okay Nabu, living room off." The lights go out before I've finished turning around. "Okay Nabu, what's on the
calendar tomorrow?" A short pause, then the answer in a calm German voice. "Okay Nabu, we're out of nutmeg." It's on
the shopping list.

That's the voice assistant in our house today. It runs on Home Assistant, talks to my own AI assistant (we call it
Hugo) when it has to, and listens through three very different boxes. Getting there took about four weeks – and most
of that time went into one question: **why is it so slow?**

Like my other recent projects, this one was built with Claude (an AI) doing the hands-on work: configuration, patches,
measurements and notes. I decided what I wanted, spoke to the boxes and reported when something sounded wrong.

## How it fits together

Home Assistant has a complete voice pipeline built in, called Assist. A satellite (a box with a microphone and a
speaker) listens for the wake word on the device itself and only then streams audio to Home Assistant. From there:

![Diagram: three satellites – Voice PE, Jabra speakerphone and Atom Echo – send speech to the Home Assistant pipeline. Speech-to-text, then a check against local sentences. A match is answered by Home Assistant itself in about 0.01 seconds. Everything else goes to the AI agent, which has a few tools: Home Assistant, calendar, shopping list, weather. The answer is turned into speech and played on the box that heard the question.](./how-it-works.svg)

- **Speech-to-text and text-to-speech** come from Home Assistant Cloud, with a German neural voice.
- **Local sentences first.** The pipeline option "prefer handling commands locally" is on: if Home Assistant
  understands a sentence itself, it answers without any AI.
- **Everything else** goes to a dedicated voice agent – a slimmed-down profile of my AI assistant, with a short
  instruction file and only the tools it needs: Home Assistant, calendar, shopping list, weather, memory.

The AI side ran on OpenClaw until early November and has moved to Hermes Agent since. The model is a fast, cheap one (DeepSeek V4.1 Flash) with thinking set to "low": without any thinking it was
noticeably dumber, and "low" turned out to be barely slower than "off".

## Three boxes

**Home Assistant Voice Preview Edition.** The official box. Plug it in, add it to Home Assistant, done. This one never
needed any attention, which is exactly what you want from the box in the living room.

**A Jabra Speak 510.** A conference speakerphone that was already lying on my desk. It has a good microphone array, a
decent speaker, LEDs and buttons – it just doesn't know anything about Home Assistant. The open-source
[linux-voice-assistant](https://github.com/OHF-Voice/linux-voice-assistant) speaks the same protocol as the official
boxes, but it's built for Linux. Claude ported it to Windows on my PC: microphone via WASAPI, playback via mpv, and a
small bridge that drives the Jabra's LEDs and buttons over USB HID. A scheduled task keeps it running and restarts it
when the USB device disappears.

**An M5Stack Atom Echo.** A thumb-sized ESP32 with a microphone, a tiny speaker and one LED, for about 13 dollars.
The official firmware flashes straight from the browser. Two things cost time: the first USB cable was a charge-only
cable (Windows didn't report *any* device), and flashing only worked at 115200 baud, not the faster default. It sounds
like a toy, but for "light on" in the kitchen that's fine.

## Speed: from 51 seconds to 0.01

The first version worked on the first day. It was also unbearable to use. Here's how the response time came down,
measured from the end of speaking to the answer:

![Bar chart of response times. All questions through the main assistant: up to 51 seconds. Dedicated voice agent but generic Home Assistant tools: 23 to 38 seconds. Home Assistant's own MCP server: 1.9 to 5.3 seconds. Local sentence in Home Assistant: 0.01 to 0.08 seconds.](./response-times.svg)

**Step 1: a dedicated voice agent.** At first, every question went to my main assistant – the one that also handles
WhatsApp, e-mail and everything else. Each call carried about 85,000 tokens of context: instructions, memory, dozens
of tool descriptions. Answers took up to 51 seconds. A separate voice agent with a short instruction file brought that
to about 25,000 tokens, and once the agent framework learned to search its tools instead of listing them all, to
6,000–8,000.

**Step 2: the right tools.** Still, "living room off" took 38 seconds when it went through the AI. The trace showed
why: **twelve model rounds.** The generic Home Assistant MCP server I used is great for administration, but it has
its own tool search on top – so the model searched for a tool, searched again inside that tool, read a list, and only
then switched the light. Home Assistant also ships its own MCP server, made for exactly this use: one call
(`GetLiveContext`) returns the state of everything exposed to Assist, one call switches it. Two model rounds, 1.9 to
5.3 seconds.

**Step 3: don't ask the AI at all.** The biggest win was making sure the common commands never leave Home Assistant.
Its built-in sentences cover a lot ("turn on the kitchen light"), and you can add your own in a YAML file:

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

These answer in **0.01 to 0.08 seconds.** A question like "which lights are still on?" went from 23 seconds to
instant.

The rule for what stays local is strict, and it's worth knowing: Home Assistant only handles a sentence itself if it
matches a template *exactly* and every placeholder (area, device, list) resolves. One unknown word – "which lights are on **in the
house**" – and the whole sentence goes to the AI. That strictness cuts both ways:

- I deliberately didn't add "X is empty" as a shopping list sentence. "The battery is empty" would have put
  "battery" on the list.
- "Mach mal Muskatnuss auf die Einkaufsliste" ("go on, put nutmeg on the list") created the item "Mach mal
  Muskatnuss" – the template swallowed the filler words as part of the item. Local doesn't mean smart.

## The box that only said "He"

One bug deserves its own story. After an update, the boxes sometimes answered with a single syllable – "He" – and
stopped. Asking again gave the full answer.

It only happened on the first question after a few minutes of silence, which made it look random. The cause: the
agent framework had changed how it streams text. Only the first chunk of an answer contained the field `text`, every
following chunk only a `delta`. The Home Assistant integration read `text` and threw the rest away. On a warm session
the whole answer arrived in one chunk, so it worked; on a fresh session it came in pieces, and the box spoke the first
piece – "He" from "Heute…" ("Today…").

The fix was a few lines. Claude wrote it with a test, I applied it, and it went upstream as a
[pull request](https://github.com/ddrayne/openclaw-homeassistant/pull/16).

## The box that went deaf after standby

The Jabra had its own ghost: some mornings it was muted and stayed muted. Five "hardware mute" events in ten days, and
every single one happened at the exact second the PC woke from standby.

When Windows wakes up, the microphone delivers 7 to 16 seconds of pure digital silence. The bridge interpreted that
as the mute button. The unmute that followed arrived while the box wasn't connected to Home Assistant yet, and was
silently dropped. Now the bridge ignores the microphone for 30 seconds after the audio stream stalls, and replays a
lost unmute on reconnect.

## Waiting well

Even at 8 seconds for a calendar question, silence feels broken. With the move to Hermes, Claude wrote a small custom
Home Assistant integration that handles the waiting properly:

- **Real streaming.** The answer goes to text-to-speech word by word, so the box starts talking while the model is
  still writing.
- **A waiting phrase, but only when needed.** When the agent starts a tool call (calendar, weather), the integration
  says "Moment, ich schau nach" – "one moment, let me check" – at the earliest after 1.5 seconds. Small talk without
  tools never hears it.
- **A trick for the first words:** Home Assistant only starts streaming speech once it has 60 characters. A short
  waiting phrase would sit in the buffer. Sending it together with a marker for an external tool call makes Home
  Assistant speak it immediately.

Current numbers from the real box, end of speaking to end of answer: small talk 3.6–4.3 seconds (speech starts after
about 3), "remember that …" 6.0 seconds, calendar 8.3 seconds, shopping list 0.01 seconds.

## Conversations and memory

Two smaller things make it feel less like a command line:

- **Follow-ups without the wake word.** If the answer ends with a question mark, the box keeps listening. That's the
  whole rule – so the assistant's instructions say to ask back when something is unclear.
- **Memory in three layers.** A conversation ends after five minutes of silence. Summaries of the last 48 hours are
  given to every new conversation ("what did I ask you this morning?" works). Topics that keep coming back move to
  long-term memory overnight.

## What I'd tell anyone building this

- **Measure every step.** Home Assistant records each pipeline run with timings per stage (the pipeline's debug view
  under Settings → Voice assistants). Without that, "it's slow" is a feeling, not a bug.
- **Count model rounds, not seconds.** One round is 1–3 seconds. Twelve rounds is the problem; the model speed isn't.
- **Push the common commands into local sentences.** The AI is for questions, not for light switches.
- **Old hardware works.** A conference speakerphone makes a very good satellite – if the PC it hangs on is running.
- **After every update, ask a long question after five minutes of silence.** That's where streaming bugs hide.

## Working with an AI on this

This was a project where the AI was building, debugging and tuning another AI. Claude read pipeline traces, counted
model rounds, wrote the patches and the custom sentences, and ported a Linux program to Windows. My part was speaking
to the boxes – a lot – and saying "that took too long" or "it only said He again".

What I liked most: the measurements. Every change came with a before and after, and the notes say plainly which ideas
didn't help (switching off the tool search, for example, made every call slower). That's also why this post can quote
numbers instead of impressions.

The kitchen box still sounds like a toy. But it answers in a hundredth of a second.
