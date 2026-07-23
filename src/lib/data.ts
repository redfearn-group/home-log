import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import type {
  ItemSummary,
  Item,
  MaintenanceEntry,
  ScheduleItem,
  TaskItem,
  AdminDate,
  DocumentEntry,
  WatchListItem,
} from "./types";

const DATA_DIR = path.resolve(process.cwd(), "data");

function readYaml<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = yaml.load(raw);
  return (parsed as T) ?? fallback;
}

export function getItemSummaries(): ItemSummary[] {
  const indexPath = path.join(DATA_DIR, "items.yaml");
  const parsed = readYaml<{ items: ItemSummary[] }>(indexPath, { items: [] });
  return parsed.items ?? [];
}

export function getItem(slug: string): Item {
  const summaries = getItemSummaries();
  const summary = summaries.find((i) => i.slug === slug);
  if (!summary) throw new Error(`Unknown item slug: ${slug}`);

  const dir = path.join(DATA_DIR, "items", slug);
  const maintenanceLog = readYaml<{ entries: MaintenanceEntry[] }>(
    path.join(dir, "maintenance-log.yaml"),
    { entries: [] }
  ).entries;
  const schedule = readYaml<{ items: ScheduleItem[] }>(
    path.join(dir, "schedule.yaml"),
    { items: [] }
  ).items;
  const tasks = readYaml<{ tasks: TaskItem[] }>(path.join(dir, "tasks.yaml"), {
    tasks: [],
  }).tasks;
  const adminDates = readYaml<{ dates: AdminDate[] }>(
    path.join(dir, "admin-dates.yaml"),
    { dates: [] }
  ).dates;
  const documents = readYaml<{ documents: DocumentEntry[] }>(
    path.join(dir, "documents.yaml"),
    { documents: [] }
  ).documents;
  const watchList = readYaml<{ items: WatchListItem[] }>(
    path.join(dir, "watch-list.yaml"),
    { items: [] }
  ).items;

  return {
    ...summary,
    maintenanceLog,
    schedule,
    tasks,
    adminDates,
    documents,
    watchList,
  };
}

export function getAllItems(): Item[] {
  return getItemSummaries().map((i) => getItem(i.slug));
}

export function getActiveItems(): Item[] {
  return getAllItems().filter((i) => i.status === "active");
}

export function getArchivedItems(): Item[] {
  return getAllItems().filter((i) => i.status === "archived");
}

export function itemLabel(item: ItemSummary): string {
  const brandModel = [item.brand, item.model].filter(Boolean).join(" ");
  return brandModel ? `${item.name} (${brandModel})` : item.name;
}
