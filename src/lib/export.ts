/**
 * Client-side table export. CSV opens natively in Excel/Sheets; the "Excel"
 * variant writes a UTF-16 tab-separated .xls, which Excel opens with typed
 * columns and no import wizard. No dependency needed for either.
 */

export type ExportColumn<T> = {
  header: string;
  value: (row: T) => string | number | boolean | null | undefined;
};

function escapeCsv(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function stamp(): string {
  return new Date().toISOString().slice(0, 10);
}

export function exportToCsv<T>(filenameBase: string, rows: T[], columns: ExportColumn<T>[]): void {
  const header = columns.map((c) => escapeCsv(c.header)).join(",");
  const body = rows.map((row) => columns.map((c) => escapeCsv(c.value(row))).join(","));
  // BOM keeps Excel happy with accented characters.
  const blob = new Blob(["\uFEFF", [header, ...body].join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  download(blob, `${filenameBase}-${stamp()}.csv`);
}

export function exportToExcel<T>(
  filenameBase: string,
  rows: T[],
  columns: ExportColumn<T>[],
): void {
  const clean = (v: unknown) =>
    v === null || v === undefined ? "" : String(v).replace(/[\t\r\n]+/g, " ");
  const lines = [
    columns.map((c) => clean(c.header)).join("\t"),
    ...rows.map((row) => columns.map((c) => clean(c.value(row))).join("\t")),
  ];
  const blob = new Blob(["\uFEFF", lines.join("\r\n")], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  download(blob, `${filenameBase}-${stamp()}.xls`);
}
