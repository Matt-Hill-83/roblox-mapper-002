"use client";

import { dataGridContainer, pageHeader } from "./styles";

import { DataGrid } from "@mui/x-data-grid";
import { buildColumns } from "./columns";
import { dataGridConfig } from "./config";
import { useDataStore } from "@/stores/dataStore";

export default function Table002() {
  const teams = useDataStore((state) => state.teams);
  const isLoading = useDataStore((state) => state.isLoading);
  const error = useDataStore((state) => state.error);

  console.log("Table002 - teams from zustand:", teams);
  console.log("Table002 - isLoading:", isLoading);
  console.log("Table002 - error:", error);

  const data = teams;
  const columns = buildColumns({
    rows: data as unknown as Record<string, unknown>[],
  });

  console.log("Current teams data being displayed:", data);
  console.log(
    "Generated team columns:",
    columns.map((c) => c.field)
  );

  const table2Wrapper = {
    padding: "24px",
    backgroundColor: "#f9fafb",
  };

  return (
    <div style={table2Wrapper}>
      <h1 style={pageHeader}>Teams</h1>
      <div style={dataGridContainer}>
        <DataGrid rows={data} columns={columns} {...dataGridConfig} />
      </div>
    </div>
  );
}
