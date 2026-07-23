import type {
  Item,
  MaintenanceEntry,
  ScheduleItemStatus,
  DueStatus,
} from "./types";

const DUE_SOON_DAYS = 30;

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / msPerDay);
}

/** today as YYYY-MM-DD, injectable for testing */
export function scheduleStatusesFor(
  item: Item,
  today: string = new Date().toISOString().slice(0, 10)
): ScheduleItemStatus[] {
  return item.schedule.map((scheduleItem) => {
    const matching = item.maintenanceLog
      .filter((e) => e.itemType === scheduleItem.itemType)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    const lastDone: MaintenanceEntry | null = matching[0] ?? null;

    if (!lastDone) {
      return {
        item: scheduleItem,
        status: "never-done" as DueStatus,
        lastDone: null,
        dueDate: null,
      };
    }

    const dueDate =
      scheduleItem.intervalMonths != null ? addMonths(lastDone.date, scheduleItem.intervalMonths) : null;

    let overdue = false;
    let dueSoon = false;

    if (dueDate != null && today >= dueDate) overdue = true;
    if (!overdue && dueDate != null && daysBetween(today, dueDate) <= DUE_SOON_DAYS) dueSoon = true;

    const status: DueStatus = overdue ? "overdue" : dueSoon ? "due-soon" : "ok";

    return { item: scheduleItem, status, lastDone, dueDate };
  });
}

export function worstStatus(statuses: ScheduleItemStatus[]): DueStatus {
  if (statuses.some((s) => s.status === "overdue")) return "overdue";
  if (statuses.some((s) => s.status === "due-soon")) return "due-soon";
  if (statuses.some((s) => s.status === "never-done")) return "never-done";
  return "ok";
}

export function upcomingAdminDates(item: Item, today: string = new Date().toISOString().slice(0, 10)) {
  return item.adminDates
    .map((d) => ({ ...d, daysUntil: daysBetween(today, d.dueDate) }))
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

// schedule.yaml item names carry a long sourcing citation after " — " (manual
// references, manufacturer spec sheets) that's valuable on the full item
// page but too long for a dashboard tag or table row on a phone. Split it
// off so callers can show the short lead and, where there's room, the full
// citation behind a tap.
export function splitScheduleItemName(name: string): { short: string; citation: string | null } {
  const idx = name.indexOf(" — ");
  if (idx === -1) return { short: name, citation: null };
  return { short: name.slice(0, idx), citation: name.slice(idx + 3) };
}
