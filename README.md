# Home Log

A maintenance tracker for household equipment, built the same way as its sibling project [garage-log](https://github.com/redfearn-group/garage-log): a static site with version-controlled data instead of a database.

**Live:** [redfearn.group/home-log](https://redfearn.group/home-log/)

## What it does

Twenty tracked systems, from the furnace and water heater down to the gutters, garage door, and emergency kit. Each one carries a maintenance schedule checked against logged service dates and flagged overdue, due soon, or on track.

Schedules are sourced, not invented. Most intervals come from the [Weekly Home Check](https://weeklyhomecheck.com/) newsletter's 52-week cycle, and every schedule item cites the specific week it came from, so the reasoning behind a due date is still readable a year later.

## Architecture

No database. Item data lives as YAML files committed directly to this repo, so git history doubles as a free audit trail: every correction and backfilled record is a diff you can go back and read.

*Data is edited directly (by hand or via Claude) as YAML and committed to git. Everything downstream of the YAML is a read-only build. There is no write path in the deployed site.*

```
data/items.yaml                 # index of all items
data/items/<slug>/
  schedule.yaml                  # cited maintenance intervals
  maintenance-log.yaml           # service history
  tasks.yaml                     # open to-dos per item
  admin-dates.yaml               # warranty/permit/inspection due dates
  documents.yaml                 # manual/receipt metadata
  watch-list.yaml                # things worth watching for
  private.yaml                   # gitignored: account numbers, anything that shouldn't be public
```

The site is pure Astro with no UI framework and no database driver. `src/lib/` reads the YAML at build time and every page is static HTML.

```
src/
  pages/            # dashboard, per-item detail pages, archive
  components/       # shared UI (StatusBadge, etc.)
  layouts/          # page shell
  lib/              # data loading, due-status logic, types
  styles/           # design tokens + shared CSS
scripts/            # publish automation
```

Deployed via GitHub Actions to GitHub Pages on every push to `main`. A private sibling repo (`home-log-private`) can hold uploaded documents the same way garage-log-private does for vehicle documents. This repo's `documents.yaml` only ever stores metadata, never the files themselves.

## Development

```sh
npm install
npm run dev      # local dev server at localhost:4323
npm run build    # static build to ./dist/
```

| Script | What it does |
| :--- | :--- |
| `npm run dev` | Astro dev server |
| `npm run build` | Production build to `./dist/` |
| `npm run publish` | Push data changes to both this repo and the private documents repo |

## Data status

Schedules are real and sourced. The per-item specifics are not: brand, model, serial number, install date, and location are unset across all twenty items, and each carries an open task saying so. Service history is empty until it gets backfilled.
