# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This repo is one of several siblings under `C:\Claude Code`. **The workspace-level `C:\Claude Code\CLAUDE.md` covers the shared brand system, the public/private split, and the voice rules, which all apply here too.** Read it as well. This file covers what is specific to home-log.

## What this is

A maintenance tracker for household systems (furnace, water heater, gutters, garage door, and so on), deployed as a static site at `https://redfearn.group/home-log/`. Public repo.

Built 2026-07-24 as a sibling of garage-log and deliberately mirrors its architecture. **The two share a shape but not a codebase**, so a fix that applies to both has to be made twice. When changing shared-looking code, check whether garage-log needs the same change.

## Commands

```sh
npm run build      # static build to ./dist/, and the only validity check (no test suite)
npm run publish    # interactive: shows the diff, confirms, commits, pushes
```

For a dev server use `preview_start` with the `home-log` entry in `.claude/launch.json` (port 4323), not `npm run dev`. The site is served under its base path, so browse `http://localhost:4323/home-log/`, not the bare origin.

## Architecture

Item data is YAML committed to the repo. There is no database and no write path in the deployed site. `src/lib/data.ts` reads the YAML at build time and every page is static HTML.

```
data/items.yaml                 # index; slug must match the folder name
data/items/<slug>/
  schedule.yaml                 # intervals, each name carrying its sourcing citation
  maintenance-log.yaml  tasks.yaml  admin-dates.yaml
  documents.yaml  watch-list.yaml
  private.yaml                  # gitignored
```

### Date-only intervals, unlike garage-log

`src/lib/status.ts` has `intervalMonths` and `DUE_SOON_DAYS` only. There is no mileage concept anywhere in this repo, so do not copy garage-log's mileage handling across.

### Status is a join on `itemType`

Due status matches each `schedule.yaml` item's `itemType` against `maintenance-log.yaml` entries carrying the **same** `itemType`. An entry with an accurate `description` but a missing or wrong `itemType` is invisible to the schedule table, and the item keeps showing as never done. When recording that something was done, add a properly tagged entry rather than appending prose to an existing one.

Schedule `name` fields carry their citation after `" — "`, and `splitScheduleItemName()` splits on that exact separator. **That em-dash is structural.** Prose em-dashes elsewhere are prohibited by the voice rules.

### Items are grouped by system, not by newsletter week

Schedules are sourced from the Weekly Home Check newsletter (`Home@weeklyhomecheck.com`), whose 52-week cycle was extracted from Brady's Gmail on 2026-07-23. Each schedule entry cites the specific week or weeks it came from, so any interval can be traced back.

Several newsletter weeks are facets of the same physical system: quarterly dishwasher and disposal cleaning recurs in weeks 4, 20, 32, and 48. Items are therefore grouped by system or room, each carrying several schedule entries, rather than one item per week. Keep that grouping when adding to it.

Some weeks intentionally produced nothing. Weeks 47, 51, and 52 are holiday and greeting content with no task, and week 50 changed topic between years, which is noted inline in the affected file. Those are recorded gaps, not missing research.

### Everything on the type renders publicly

`data.ts` loads YAML straight through with no field-level filtering, so every field on the interfaces in `src/lib/types.ts` reaches the public site. Serial numbers, account numbers, and contract details belong in the gitignored `private.yaml`, not on the type.

## Current data state

Schedules are real and cited. The per-item specifics are not: brand, model, serial number, install date, and location are unset across every item, and each carries an open task saying so. Service history is empty. Do not invent any of it; ask.
