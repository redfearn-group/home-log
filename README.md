# Home Log

A maintenance tracker for household equipment (furnace, water heater, water softener, sprinkler system, etc.), built the same way as its sibling project [garage-log](https://github.com/redfearn-group/garage-log): a static site with version-controlled data instead of a database.

## What it does

Each home item is tracked against a maintenance schedule, checked against logged service dates, and flagged overdue, due soon, or on track. Every schedule item and the full service history are just YAML — readable, diffable, and editable by hand or via Claude.

## Architecture

No database. Item data lives as YAML files committed directly to this repo, so git history doubles as a free audit trail.

*Data is edited directly (by hand or via Claude) as YAML and committed to git. Everything downstream of the YAML is a read-only build — there is no write path in the deployed site.*

```
data/items.yaml                 # index of all items
data/items/<slug>/
  schedule.yaml                  # maintenance intervals
  maintenance-log.yaml           # service history
  tasks.yaml                     # open to-dos per item
  admin-dates.yaml               # warranty/permit/inspection due dates
  documents.yaml                 # manual/receipt metadata
  watch-list.yaml                # things worth watching for
  private.yaml                   # gitignored — account numbers, anything that shouldn't be public
```

The site itself is pure Astro with no UI framework and no database driver — `src/lib/` reads the YAML at build time and every page is static HTML.

```
src/
  pages/            # dashboard, per-item detail pages, archive
  components/       # shared UI (StatusBadge, etc.)
  layouts/          # page shell
  lib/              # data loading, due-status logic, types
  styles/           # design tokens + shared CSS
scripts/            # publish automation
```

Deployed via GitHub Actions to GitHub Pages on every push to `main`. A private sibling repo (`home-log-private`) can hold uploaded documents the same way garage-log-private does for vehicle documents — this repo's `documents.yaml` only ever stores metadata, never the files themselves.

## Development

```sh
npm install
npm run dev      # local dev server at localhost:4321
npm run build    # static build to ./dist/
```

| Script | What it does |
| :--- | :--- |
| `npm run dev` | Astro dev server |
| `npm run build` | Production build to `./dist/` |
| `npm run publish` | Push data changes to both this repo and the private documents repo |

## Current items (placeholder data as of 2026-07-23)

Furnace, water heater, water softener, and sprinkler system are scaffolded with generic schedule categories but no real brand/model/install-date/history yet — those need to be filled in per item.
