// Every field on these interfaces renders on the public site by default,
// since src/lib/data.ts loads YAML straight through with no field-level
// filtering. If a new field is meant to carry account numbers, contract
// details, or anything else that shouldn't be public, it belongs in an
// item's gitignored private.yaml instead — not as a new field here.

export interface ItemSummary {
  slug: string;
  name: string;
  category: string;
  location?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  installDate?: string;
  status: "active" | "archived";
  photo?: string | null;
}

export interface MaintenanceEntry {
  date: string;
  itemType: string;
  description: string;
  notes?: string;
  documents?: string[];
}

export interface ScheduleItem {
  itemType: string;
  name: string;
  intervalMonths?: number | null;
}

export interface TaskItem {
  id: number;
  title: string;
  notes?: string;
  status: "open" | "done";
  priority?: "critical";
  createdDate: string;
  completedDate?: string | null;
}

export interface AdminDate {
  type: string;
  label: string;
  dueDate: string;
  notes?: string;
}

export interface DocumentEntry {
  filename: string;
  category: string;
  dateAdded: string;
  description?: string;
}

export interface WatchListItem {
  issue: string;
  description: string;
  sources?: string[];
  status: "due-for-inspection" | "inspected-ok" | "addressed";
}

export interface Item extends ItemSummary {
  maintenanceLog: MaintenanceEntry[];
  schedule: ScheduleItem[];
  tasks: TaskItem[];
  adminDates: AdminDate[];
  documents: DocumentEntry[];
  watchList: WatchListItem[];
}

export type DueStatus = "overdue" | "due-soon" | "ok" | "never-done";

export interface ScheduleItemStatus {
  item: ScheduleItem;
  status: DueStatus;
  lastDone: MaintenanceEntry | null;
  dueDate: string | null;
}
