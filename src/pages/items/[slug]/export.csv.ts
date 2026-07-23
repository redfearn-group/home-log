import type { APIRoute } from "astro";
import { getItemSummaries, getItem } from "../../../lib/data";

export function getStaticPaths() {
  return getItemSummaries().map((i) => ({ params: { slug: i.slug } }));
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export const GET: APIRoute = ({ params }) => {
  const item = getItem(params.slug!);
  const rows = [["Date", "Service", "Notes"]];
  const sorted = [...item.maintenanceLog].sort((a, b) => (a.date < b.date ? -1 : 1));
  for (const m of sorted) {
    rows.push([m.date, m.description, m.notes ?? ""]);
  }
  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${item.slug}-maintenance-history.csv"`,
    },
  });
};
