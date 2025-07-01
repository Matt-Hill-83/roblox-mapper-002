import { GridColDef } from "@mui/x-data-grid";

const detectColumnType = ({ values }: { values: unknown[] }) => {
  const nonNullValues = values.filter((v) => v != null);
  if (nonNullValues.length === 0) return "string";

  const sample = nonNullValues[0];
  if (typeof sample === "number") return "number";
  if (typeof sample === "boolean") return "boolean";
  if (sample instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(String(sample)))
    return "date";
  return "string";
};

export const buildColumns = ({ rows }: { rows: Record<string, unknown>[] }): GridColDef[] => {
  const keys = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));

  return keys.map<GridColDef>((key) => {
    const values = rows.map((r) => r[key]);
    const type = detectColumnType({ values });

    const column: GridColDef = {
      field: key,
      headerName: key.replace(/_/g, " ").toUpperCase(),
      flex: 1,
      sortable: true,
      filterable: true,
      type,
    };

    // Handle date columns specially
    if (type === "date") {
      column.valueGetter = (value, row) => {
        const rawValue = row[key];
        if (!rawValue) return null;
        return new Date(rawValue);
      };
    } else {
      column.valueGetter = (value, row) => row[key] ?? "—";
    }

    return column;
  });
}; 